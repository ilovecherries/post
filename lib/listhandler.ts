import { FullModel } from "../views/views";
import { cookieWrapper } from "./auth";

export class CRUDListHandler<U, T extends FullModel<U>> {
    static idReqGenerator<V, U, T extends FullModel<U>>(name: string, 
        ctor: new (p: Partial<T>) => T, 
        delegate: any, 
        stripValues: (p: any) => V,
        include: any = {}): (req: any, res: any) => void {
        return async function(req, res) {
            let { id } = req.query;
            id = parseInt(id);

            if (req.method === 'GET') {
                return delegate.findUnique({
                    where: { id },
                    include
                }).then(o => {
                    if (o === null) {
                        res.status(404).send(`${name} not found`);
                        return;
                    }

                    const i = new ctor(o);

                    res.status(200).send(i.toDto());
                })
            }
            else if (req.method === 'PUT') {
                cookieWrapper(req)
                .then(user => {
                    delegate.findUnique({
                        where: { id },
                        include
                    }).then(o => {
                        if (o === null) {
                            res.status(404).send(`${name} not found`);
                            return;
                        }

                        if (o.author.id !== user.id) {
                            res.status(403).send(`You are not the author of this ${name.toLowerCase()}`);
                            return;
                        }

                        Object.assign(o, req.body);
                        const stripped = stripValues(o);

                        delegate.update({
                            where: {
                                id: id
                            },
                            data: stripped,
                            include
                        }).then(o => {
                            let i = new ctor(o);
                            res.status(200).send(i.toDto());
                        });
                    });
                })
                .catch(err => {res.status(401).send(err)});
            } else if (req.method === 'DELETE') {
                cookieWrapper(req)
                .then(user => {
                    delegate.findUnique({
                        where: { id },
                        include
                    }).then(o => {
                        if (o === null) {
                            res.status(404).send(`${name} not found`);
                            return;
                        }

                        if (o.author.id !== user.id) {
                            res.status(403).send(`You are not the author of this ${name.toLowerCase()}`);
                            return;
                        }

                        delegate.delete({
                            where: {
                                id: o.id
                            }
                        }).then(() => {
                            res.status(204).send();
                        });
                    });
                })
                .catch(err => res.status(401).send(err));
            }
        }
    }
}