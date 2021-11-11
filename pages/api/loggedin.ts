import { parseCookies } from "nookies";
import { cookieWrapper, findUserByAuthToken } from "../../lib/auth";
import { User, UserDto } from "../../views/user";

export default async function handler(req, res){
    cookieWrapper(req)
    .then(user => {
        res.status(200).send(user);
    })
    .catch(err => res.status(401).send(err.message));
}