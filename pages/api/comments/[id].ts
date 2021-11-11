import prisma from "../../../lib/prisma";
import { Comment, CommentData, CommentDto, CommentEditable } from "../../../views/comment";

import { CRUDListHandler } from "../../../lib/crudlisthandler";

function stripValues(data: any): CommentEditable {
    return {
        content: data.content
    };
}

const handler = CRUDListHandler.idReqGenerator("Comment", Comment, 
    prisma.comment, stripValues, { author: true });

export default handler;