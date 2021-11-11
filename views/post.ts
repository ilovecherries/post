import { Comment, CommentDto } from "./comment";
import { User, UserDto } from "./user";
import { FullModel } from "./views";

export interface PostData {
    title: string;
    content: string;
}

export interface PostDto extends PostData {
    id: number;
    author: UserDto;
    comments: CommentDto[];
}

export class Post implements PostData, FullModel<PostDto> {
    title: string;
    content: string;
    author: User;
    id: number;
    comments: Comment[];

    /**
     *  
     * @param payload The payload to create the post from
     */
    constructor(payload: Partial<Post>) {
        // we should also initialize the author before we use the payload
        payload.author = new User(payload.author);
        payload.comments = payload.comments.map(c => new Comment(c));
        
        Object.assign(this, payload);

    }

    public toDto(): PostDto {
        return {
            title: this.title,
            content: this.content,
            id: this.id,
            author: this.author.toDto(),
            comments: this.comments.map(comment => comment.toDto())
        };
    }
}
