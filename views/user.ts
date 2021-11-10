import '../lib/prisma';

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

export interface User extends UserDto {
    hashed_password: string;
    salt: string;
}