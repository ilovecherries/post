import prisma from "../lib/prisma";
import { CommentData, Comment } from "../views/comment";
import { User } from "../views/user";

export async function createComment(userId: number, postId: number, 
    content: string): Promise<Comment> {
    return prisma.comment.create({
        data: {
            content: content,
            authorId: userId,
            postId: postId
        },
        include: {
            author: true
        }
    }).then(comment => {
        const commentD = new Comment(comment);
        return commentD;
    });
}