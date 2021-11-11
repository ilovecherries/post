import prisma from "../../../lib/prisma";
import { Comment } from "../../../views/comment";

import { CRUDListHandler } from "../../../lib/listhandler";

const handler = CRUDListHandler.idReqGenerator("Comment", Comment, prisma.comment);

export default handler;