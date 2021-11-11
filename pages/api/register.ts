import { User, UserCredentials, UserDto } from "../../views/user";
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
        const user = await register(credentials.username, credentials.password);
        const userD = new User(user);
        res.status(201).send(user.toDto());
    } catch (e) {
        res.status(400).send(e.message);
    }
}