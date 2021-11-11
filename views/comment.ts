
import { User, UserDto } from "./user";
import { FullModel } from "./views";

export interface CommentEditable {
    content: string;
}

export interface CommentData extends CommentEditable{
    postId: number;
}

export interface CommentDto extends CommentData {
    id: number;
    author: UserDto;
}

export class Comment implements CommentData, FullModel<CommentDto> {
    content: string;
    author: User;
    id: number;
    postId: number;

    /**
     *  
     * @param payload The payload to create the post from
     */
    constructor(payload: Partial<Comment>) {
        // we should also initialize the author before we use the payload
        if (payload.author !== undefined)
            payload.author = new User(payload.author);
        
        Object.assign(this, payload);

    }

    public toDto(): CommentDto {
        return {
            content: this.content,
            id: this.id,
            author: this.author.toDto(),
            postId: this.postId
        };
    }
}
