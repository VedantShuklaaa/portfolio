export type ArticleStatus = "draft" | "published";

export type ArticleRow = {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	thumbnail: unknown;
	content: unknown;
	tags: string[];
	status: ArticleStatus;
	published_at: string | null;
	created_at: string;
	updated_at: string;
};

export type ArticleInsert = {
	id?: string;
	title: string;
	slug: string;
	description?: string | null;
	thumbnail?: unknown;
	content: unknown;
	tags?: string[];
	status?: ArticleStatus;
	published_at?: string | null;
	created_at?: string;
	updated_at?: string;
};

export type ArticleUpdate = Partial<ArticleInsert>;

export type RateLimitResult = {
	allowed: boolean;
	remaining: number;
	retry_after_seconds: number;
};

export type Database = {
	public: {
		Tables: {
			articles: {
				Row: ArticleRow;
				Insert: ArticleInsert;
				Update: ArticleUpdate;
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: {
			consume_rate_limit: {
				Args: {
					p_key: string;
					p_limit: number;
					p_window_seconds: number;
				};
				Returns: RateLimitResult[];
			};
		};
	};
};
