-- Writings CMS: schema, row level security, storage and rate limiting.
--
-- Apply with:
--   supabase db push
-- or paste into the Supabase SQL editor once. The migration is idempotent and
-- only touches the objects it owns.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- admins: server-side allowlist mirrored in the database so RLS can enforce it.
-- Add an admin after creating the user in Supabase Auth:
--   insert into public.admins (user_id) values ('<auth-user-uuid>');
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  description text,
  thumbnail jsonb,
  content jsonb not null default '{"schemaVersion":1,"blocks":[]}'::jsonb,
  tags text[] not null default '{}'::text[],
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bring an older table up to the expected shape without dropping data.
alter table public.articles add column if not exists id uuid;
alter table public.articles add column if not exists title text;
alter table public.articles add column if not exists slug text;
alter table public.articles add column if not exists description text;
alter table public.articles add column if not exists thumbnail jsonb;
alter table public.articles add column if not exists content jsonb;
alter table public.articles add column if not exists tags text[];
alter table public.articles add column if not exists status text;
alter table public.articles add column if not exists published_at timestamptz;
alter table public.articles add column if not exists created_at timestamptz;
alter table public.articles add column if not exists updated_at timestamptz;

alter table public.articles alter column id set default gen_random_uuid();
alter table public.articles alter column content set default '{"schemaVersion":1,"blocks":[]}'::jsonb;
alter table public.articles alter column tags set default '{}'::text[];
alter table public.articles alter column status set default 'draft';
alter table public.articles alter column created_at set default now();
alter table public.articles alter column updated_at set default now();

update public.articles set content = '{"schemaVersion":1,"blocks":[]}'::jsonb where content is null;
update public.articles set tags = '{}'::text[] where tags is null;
update public.articles set status = 'draft' where status is null;
update public.articles set created_at = now() where created_at is null;
update public.articles set updated_at = now() where updated_at is null;

alter table public.articles alter column content set not null;
alter table public.articles alter column tags set not null;
alter table public.articles alter column status set not null;
alter table public.articles alter column created_at set not null;
alter table public.articles alter column updated_at set not null;

create unique index if not exists articles_slug_key on public.articles (slug);
create index if not exists articles_published_at_idx
  on public.articles (published_at desc)
  where status = 'published';

-- Constraints are added NOT VALID so an existing table with legacy rows is not
-- blocked; new and updated rows are still checked.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.articles'::regclass and conname = 'articles_status_check'
  ) then
    alter table public.articles
      add constraint articles_status_check
      check (status in ('draft', 'published')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.articles'::regclass and conname = 'articles_slug_format_check'
  ) then
    alter table public.articles
      add constraint articles_slug_format_check
      check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') not valid;
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

-- Replace any pre-existing policies on this table with the CMS set.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'articles'
  loop
    execute format('drop policy if exists %I on public.articles', policy_record.policyname);
  end loop;
end
$$;

create policy articles_public_read_published
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

create policy articles_admin_read
  on public.articles
  for select
  to authenticated
  using ((select public.is_admin()));

create policy articles_admin_insert
  on public.articles
  for insert
  to authenticated
  with check ((select public.is_admin()));

create policy articles_admin_update
  on public.articles
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy articles_admin_delete
  on public.articles
  for delete
  to authenticated
  using ((select public.is_admin()));

grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public read for published media, writes only for admins.
-- Paths are generated server-side (year/month/uuid.ext), so no client-supplied
-- path traversal is possible through the API.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-media',
  'article-media',
  true,
  52428800,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists article_media_public_read on storage.objects;
create policy article_media_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'article-media');

drop policy if exists article_media_admin_insert on storage.objects;
create policy article_media_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-media' and (select public.is_admin()));

drop policy if exists article_media_admin_update on storage.objects;
create policy article_media_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-media' and (select public.is_admin()))
  with check (bucket_id = 'article-media' and (select public.is_admin()));

drop policy if exists article_media_admin_delete on storage.objects;
create policy article_media_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-media' and (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Durable rate limiting. In-memory counters do not survive serverless
-- invocations, so counters live in Postgres and are incremented atomically.
-- ---------------------------------------------------------------------------

create table if not exists public.api_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  count integer not null default 0
);

create index if not exists api_rate_limits_window_start_idx
  on public.api_rate_limits (window_start);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_window_start timestamptz;
  v_count integer;
begin
  if p_limit <= 0 or p_window_seconds <= 0 then
    raise exception 'invalid rate limit arguments';
  end if;

  if p_key is null or length(p_key) = 0 or length(p_key) > 200 then
    raise exception 'invalid rate limit key';
  end if;

  v_window_start :=
    to_timestamp(floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds);

  insert into public.api_rate_limits as limits (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key) do update
  set count = case
        when limits.window_start = excluded.window_start then limits.count + 1
        else 1
      end,
      window_start = excluded.window_start
  returning limits.count into v_count;

  delete from public.api_rate_limits
  where window_start < v_now - interval '1 day';

  allowed := v_count <= p_limit;
  remaining := greatest(p_limit - v_count, 0);
  retry_after_seconds :=
    greatest(ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - v_now)))::integer, 1);

  return next;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon;
grant execute on function public.consume_rate_limit(text, integer, integer) to authenticated;

commit;
