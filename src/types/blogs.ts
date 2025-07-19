import { BlogModel as Blog } from "../models/blogs_collection";
export interface BlogCreate {
    title: string;
    excerpt: string;
    category: string;
    thumbnail: string;
    content: string;
    author: string;
    readTime?: string;
    slug: string;
}

export interface BlogUpdate {
    title?: string;
    excerpt?: string;
    category?: string;
    thumbnail?: string;
    content?: string;
    author?: string;
    readTime?: string;
    slug?: string;
}

export interface BlogResponse {
    blogs: typeof Blog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
