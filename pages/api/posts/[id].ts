import { UserDto } from "../../../views/user";
import prisma from "../../../lib/prisma";
import { Post, PostData, PostDto } from "../../../views/post";

import { CRUDListHandler } from "../../../lib/listhandler";

function stripValues(data: any): PostData {
    return {
        title: data.title,
        content: data.content,
    };
}

const handler = CRUDListHandler.idReqGenerator("Post", Post, 
    prisma.post, stripValues, { author: true, comments: true });

export default handler;