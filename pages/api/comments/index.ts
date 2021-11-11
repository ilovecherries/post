import { cookieWrapper } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { Comment, CommentData } from '../../../views/comment';
import { createComment } from '../../../services/commentservice';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        prisma.post.findMany({ include: { author: true }}).then(comments => {
            const commentsD = comments.map(comment => new Comment(comment));
            res.status(200).send(commentsD.map(comment => comment.toDto()));
        });
    }

    if (req.method === 'POST') {
        cookieWrapper(req)
        .then(user => {
            const commentData: CommentData = {
                postId: parseInt(req.body.postId),
                content: req.body.content,
            };

            if (!commentData.content) {
                res.status(400).send("The content is empty or missing");
                return;
            }

            createComment(user.id, commentData.postId, 
                commentData.content).then(comment => {
                res.status(200).send(comment.toDto());
            })
        })
        .catch(err => res.status(401).send(err.message));
    }
}