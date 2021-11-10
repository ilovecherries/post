import { UserCredentials } from "../../views/user";
import { login } from "../../lib/auth";
import { setCookie } from "nookies";

export default async function handler(req, res)
{
    const credentials = req.body as UserCredentials;

    if (!credentials.username || !credentials.password)
    {
        res.status(400).send('Missing username or password');
        return;
    }

    try {
        const authtoken = await login(credentials);
        setCookie({ res }, 'authtoken', authtoken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
        })
        res.status(201).send(authtoken);
    } catch (e) {
        res.status(400).send(e.message);
    }
}