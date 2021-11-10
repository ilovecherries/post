import { parseCookies } from "nookies";
import { findUserByAuthToken } from "../../lib/auth";
import { UserDto } from "../../views/user";

export default async function handler(req, res)
{
    const parsedCookies = parseCookies({ req });

    if (parsedCookies.authtoken) {
        const user = await findUserByAuthToken(parsedCookies.authtoken);
        const userDto: UserDto = {
            id: user.id,
            username: user.username
        }

        res.status(200).send(userDto);
    } else {
        res.status(401).send("nope")
    }
}