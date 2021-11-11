import bcrypt from 'bcrypt';
import prisma from './prisma';

import { User, UserCredentials, UserDto } from '../views/user';
import { parseCookies } from 'nookies';

const saltRounds = 10;

/**
 * Generates an auth token for a user to make authorized requests
 * @param user The user to generate the authtoken for
 * @returns A newly generated authtoken
 */
async function generateAuthToken(user: User): Promise<string>
{
    // This is probably not the the smartest solution, but just generating
    // the token by combining two random salts for now.
    return bcrypt.genSalt(saltRounds).then(salt =>
        bcrypt.genSalt(saltRounds).then(salt2 =>
            prisma.session.create({
                data: {
                    userId: user.id,
                    token: salt + salt2
                }
            }).then(session => session.token)));
}

/**
 * Find a user using an authtoken in order to validate the user. 
 * @param authtoken The authtoken that will be used to find the user
 * @returns The user, if found
 */
export async function findUserByAuthToken(authtoken: string): Promise<User> {
    return prisma.session.findUnique({
        where: {
            token: authtoken
        },
        include: {
            user: true
        }
    }).then(session => {
        if (session == null)
        {
            throw new Error('Invalid authtoken');
        }

        return new User(session.user);
    });
}

export async function cookieWrapper(req: any): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        const parsedCookies = parseCookies({ req });

        if (parsedCookies.authtoken === null) {
            reject('No authtoken found');
        }

        findUserByAuthToken(parsedCookies.authtoken).then(user => {
            resolve(user);
        }).catch(err => {
            reject('A valid session with this authtoken does not exist.');
        });
    });
}

/**
 * Authenticates the user and returns a newly generated auth token.
 * @param credentials The credentials that are used to login
 * @returns The authtoken that is used to authenticate the user
 */
export async function login(username: string, password: string): Promise<string>
{
    return prisma.user.findUnique({
        where: {
            username: username,
        }
    }).then(user => {
        if (user === null) {
            throw new Error('User not found');
        }

        const userD = new User(user);

        // check with bcrypt against the user's password
        return bcrypt.hash(password, userD.salt)
            .then(hash => {
                    if (hash === user.hashed_password) {
                        return generateAuthToken(userD);
                    } else {
                        throw new Error('Invalid password');
                    }
                });
    });
}

/**
 * Registers a new user into the database.
 * @param credentials The credentials that are used to register a new user
 * @returns The newly created user
 */
export async function register(username: string, password: string): Promise<User>
{
    // check if a user with the username already exists
    return prisma.user.findUnique({
        where: {
            username: username,
        }
    }).then(checkDuplicate => {
        if (checkDuplicate !== null) {
            throw new Error('User with this username already exists');
        }

        // hash the password
        return bcrypt.genSalt(saltRounds)
            .then(salt => bcrypt.hash(password, salt)
                .then(hashedPassword => prisma.user.create({
                    data: {
                        username: username,
                        hashed_password: hashedPassword,
                        salt: salt
                    }}).then(user => new User(user))));
    });
}
