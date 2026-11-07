import type { ArticleBlock, Thumbnail } from "@/lib/articles/schema";
import type { ArticleStatus } from "@/lib/supabase/database.types";

export type EditableArticle = {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	thumbnail: Thumbnail | null;
	content: unknown;
	tags: string[];
	status: ArticleStatus;
};

export type EditorBlock = {
	key: string;
	block: ArticleBlock;
};
