import { UserDto } from "../../../views/user";
import prisma from "../../../lib/prisma";
import { Post } from "../../../views/post";

import { CRUDListHandler } from "../../../lib/listhandler";

const handler = CRUDListHandler.idReqGenerator("Post", Post, prisma.post);

export default handler;