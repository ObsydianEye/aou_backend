import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { BlogModel as blogsCollection, IBlog as Blog } from '../models/blogs_collection';
import { ActivityModel as activitiesCollection } from '../models/activities_collection';
import { BlogResponse, BlogCreate, BlogUpdate } from '../types/blogs';
import { SimpleUser } from '../types/express';
import { ActivityCreate } from '../types/activities';

export const testRoute = async (_req: Request, res: Response) => {
    res.json({ message: 'Test route reached' });
};

export const getBlogs = async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string));
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;

    const query: any = {};
    if (search) query.$text = { $search: search };
    if (category && category !== 'all') query.category = category;

    const total = await blogsCollection.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const cursor = blogsCollection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const blogs: Blog[] = [];
    for await (const blogDoc of cursor) {
        blogDoc._id = blogDoc.id.toString();
        blogs.push(blogDoc as Blog);
    }

    res.json({ blogs, total, page, limit, totalPages } as unknown as BlogResponse);
};

export const getBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.blogId;
    if (!ObjectId.isValid(blogId)) return res.status(400).json({ detail: 'Invalid blog ID' });

    const blogDoc = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!blogDoc) return res.status(404).json({ detail: 'Blog not found' });

    blogDoc._id = blogDoc.id.toString();
    res.json(blogDoc as Blog);
};

export const getBlogBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const blogDoc = await blogsCollection.findOne({ slug });
    if (!blogDoc) return res.status(404).json({ detail: 'Blog not found' });

    blogDoc._id = blogDoc.id.toString();
    res.json(blogDoc as Blog);
};


export const createBlog = async (req: Request, res: Response) => {
    const blog: BlogCreate = req.body;
    const currentUser: SimpleUser | undefined = req.user;
    if (!currentUser) {
        return res.status(401).json({ detail: 'Unauthorized: User not authenticated' });
    }

    const existingBlog = await blogsCollection.findOne({ slug: blog.slug });
    if (existingBlog) {
        return res.status(400).json({ detail: 'Blog with this slug already exists' });
    }
    const blogDoc = {
        ...blog,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        author: currentUser.username,
    };

    const result = await blogsCollection.insertOne(blogDoc);
    console.log(result)
    const activity: ActivityCreate = {
        action: 'blog_created',
        description: `Created new blog post: "${blog.title}"`,
        performedBy: currentUser.username,
    };
    await activitiesCollection.insertOne({ ...activity, timestamp: new Date() });

    res.status(201).json({ ...blogDoc, _id: result.id.toString() });
};

export const updateBlog = async (req: Request, res: Response) => {

    const blogId = req.params.blogId;
    const blogUpdate: BlogUpdate = req.body;
    const currentUser: SimpleUser = req.user;

    if (!ObjectId.isValid(blogId)) return res.status(400).json({ detail: 'Invalid blog ID' });

    const existingBlog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!existingBlog) return res.status(404).json({ detail: 'Blog not found' });

    const updateData = Object.fromEntries(Object.entries(blogUpdate).filter(([_, v]) => v !== null && v !== undefined));

    if (updateData.slug) {
        const slugCheck = await blogsCollection.findOne({ slug: updateData.slug, _id: { $ne: new ObjectId(blogId) } });
        if (slugCheck) return res.status(400).json({ detail: 'Blog with this slug already exists' });
    }

    if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: updateData });

        const activity = {
            action: 'blog_updated',
            description: `Updated blog post: "${existingBlog.title || 'Unknown'}"`,
            performedBy: currentUser.username
        };
        await activitiesCollection.insertOne({ ...activity, timestamp: new Date() });
    }

    const updatedBlog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    updatedBlog!._id = updatedBlog!.id.toString();
    res.json(updatedBlog as Blog);
};

export const deleteBlog = async (req: Request, res: Response) => {
    const blogId = req.params.blogId;
    const currentUser: SimpleUser = req.user;

    if (!ObjectId.isValid(blogId)) return res.status(400).json({ detail: 'Invalid blog ID' });

    const existingBlog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!existingBlog) return res.status(404).json({ detail: 'Blog not found' });

    await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });

    const activity = {
        action: 'blog_deleted',
        description: `Deleted blog post: "${existingBlog.title || 'Unknown'}"`,
        performedBy: currentUser.username
    };
    await activitiesCollection.insertOne({ ...activity, timestamp: new Date() });

    res.json({ message: 'Blog deleted successfully' });
};

export const getCategories = async (_req: Request, res: Response) => {
    const categories = await blogsCollection.distinct('category');
    res.json({ categories });
};
