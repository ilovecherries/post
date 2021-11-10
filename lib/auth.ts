import bcrypt from 'bcrypt';
import prisma from './prisma';

import { User, UserCredentials, UserDto } from '../views/user';

const saltRounds = 10;

async function generateAuthToken(user: User): Promise<string>
{
    return bcrypt.genSalt(saltRounds).then(salt =>
        bcrypt.genSalt(saltRounds).then(salt2 =>
            prisma.session.create({
                data: {
                    userId: user.id,
                    token: salt + salt2
                }
            }).then(session => {
                console.log(session);
                return session.token;
            })));
}

export async function findUserByAuthToken(authtoken: string): Promise<User>
{
    return prisma.session.findUnique({
        where: {
            token: authtoken
        }
    }).then(session => {
        if (session == null)
        {
            throw new Error('Invalid authtoken');
        }

        return prisma.user.findUnique({
            where: {
                id: session.userId
            }
        });
    });
}

/**
 * Authenticates the user and returns a newly generated auth token.
 * @param credentials The credentials that are used to login
 * @returns The authtoken that is used to authenticate the user
 */
export async function login(credentials: UserCredentials): Promise<string>
{
    return prisma.user.findUnique({
        where: {
            username: credentials.username,
        }
    }).then(user => {
        if (user === null) {
            throw new Error('User not found');
        }

        // check with bcrypt against the user's password
        return bcrypt.hash(credentials.password, user.salt)
            .then(hash => {
                    if (hash === user.hashed_password) {
                        return generateAuthToken(user);
                    } else {
                        throw new Error('Invalid password');
                    }
                });
    });
}

export async function register(credentials: UserCredentials): Promise<UserDto>
{
    // check if a user with the username already exists
    return prisma.user.findUnique({
        where: {
            username: credentials.username,
        }
    }).then(checkDuplicate => {
        if (checkDuplicate !== null) {
            throw new Error('User with this username already exists');
        }

        // hash the password
        return bcrypt.genSalt(saltRounds)
            .then(salt => bcrypt.hash(credentials.password, salt)
                .then(hashedPassword => {
                    // create the user
                    return prisma.user.create({
                        data: {
                            username: credentials.username,
                            hashed_password: hashedPassword,
                            salt: salt
                        }
                    }).then(user => {
                        let dto: UserDto = {
                            id: user.id,
                            username: user.username,
                        };

                        return dto;
                    });
                }));
    });
}
