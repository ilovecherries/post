import { parseCookies } from 'nookies';
import { cookieWrapper, findUserByAuthToken } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { Post, PostData, PostDto } from '../../../views/post';
import { UserDto } from '../../../views/user';
import { createPost } from '../../../services/postservice';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        prisma.post.findMany({ include: { author: true }}).then(posts => {
            const postsD = posts.map(post => new Post(post));
            res.status(200).send(postsD.map(post => post.toDto()));
        });
    }

    if (req.method === 'POST') {
        cookieWrapper(req)
        .then(user => {
            const postData = req.body as PostData;

            if (!postData.title || !postData.content) {
                res.status(400).send("The title or content is empty or missing");
                return;
            }

            createPost(user.id, postData.title, postData.content).then(post => {
                res.status(200).send(post.toDto());
            })
        })
        .catch(err => res.status(401).send(err.message));
    }
}
