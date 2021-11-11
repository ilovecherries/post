import prisma from "../../../lib/prisma";
import { Comment, CommentData, CommentDto } from "../../../views/comment";

import { CRUDListHandler } from "../../../lib/listhandler";

function stripValues(data: any): CommentData {
    return {
        content: data.content
    };
}

const handler = CRUDListHandler.idReqGenerator("Comment", Comment, 
    prisma.comment, stripValues, { author: true });

export default handler;