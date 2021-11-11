import { cookieWrapper } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { Post, PostDto } from "../../../views/post";
import { UserDto } from "../../../views/user";

export default async function handler(req, res) {
    let { id } = req.query;
    id = parseInt(id);

    if (req.method === 'GET') {
        prisma.post.findUnique({
            where: { id },
            include: {
                author: true
            }
        }).then(post => {
            if (post === null) {
                res.status(404).send('Post not found');
            }

            const postD: Post = new Post(post);

            res.status(200).send(postD.toDto());
        });
    } else if (req.method === 'PUT') {
        cookieWrapper(req)
        .then(user => {
            prisma.post.findUnique({
                where: { id },
                include: {
                    author: true
                }
            }).then(post => {
                if (post === null) {
                    res.status(404).send('Post not found');
                }

                if (post.author.id !== user.id) {
                    res.status(403).send('You are not the author of this post');
                }

                prisma.post.update({
                    where: {
                        id: post.id
                    },
                    data: {
                        title: req.body.title || post.title,
                        content: req.body.content || post.content,
                    }
                }).then(post => {
                    res.status(200).send(post);
                });
            });
        })
        .catch(err => {res.status(401).send(err)});
    } else if (req.method === 'DELETE') {
        cookieWrapper(req)
        .then(user => {
            prisma.post.findUnique({
                where: { id },
                include: {
                    author: true
                }
            }).then(post => {
                if (post === null) {
                    res.status(404).send('Post not found');
                }

                if (post.author.id !== user.id) {
                    res.status(403).send('You are not the author of this post');
                }

                prisma.post.delete({
                    where: {
                        id: post.id
                    }
                }).then(() => {
                    res.status(204).send();
                });
            });
        })
        .catch(err => res.status(401).send(err));
    }
}