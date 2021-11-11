import prisma from "../lib/prisma";
import { PostData, Post } from "../views/post";
import { User } from "../views/user";

export async function createPost(userId: number, title: string, 
    content: string): Promise<Post> {
    return prisma.post.create({
        data: {
            title: title,
            content: content,
            authorId: userId
        },
        include: {
            author: true
        }
    }).then(post => {
        const postD = new Post(post);
        return postD;
    });
}