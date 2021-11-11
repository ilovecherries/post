import { Post, PostDto } from './post';
import { FullModel } from './views';

export interface UserData {
    username: string;
}

export interface UserCredentials extends UserData {
    password: string;
}

export interface UserDto extends UserData {
    id: number;
    // posts: PostDto[];
    // comments: CommentDto[];
}

export class User implements UserDto, FullModel<UserDto> {
    id: number;
    username: string;
    // posts: Post[];
    hashed_password: string;
    salt: string;
    // comments: CommentDto[];

    constructor(payload: Partial<User>) {
        Object.assign(this, payload);
    }

    public toDto(): UserDto {
        return {
            id: this.id,
            username: this.username
            // posts: this.posts.map(post => post.toDto())
        };
    }
}