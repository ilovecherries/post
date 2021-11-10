import { UserCredentials } from "../../views/user";
import { register } from "../../lib/auth";

export default async function handler(req, res)
{
    const credentials = req.body as UserCredentials;

    if (!credentials.username || !credentials.password)
    {
        res.status(400).send('Missing username or password');
        return;
    }

    try {
        const user = await register(credentials);
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
}