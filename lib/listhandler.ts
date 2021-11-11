import { FullModel } from "../views/views";
import { cookieWrapper } from "./auth";

export class CRUDListHandler<U, T extends FullModel<U>> {
    delegate: any;
    ctor: new (p: Partial<T>) => T;
    name: string;

    constructor(name: string, ctor: new (p: Partial<T>) => T, delegate: any) {
        this.name = name;
        this.delegate = delegate;
        this.ctor = ctor;
    }

    static idReqGenerator(name: string, ctor: new (p: Partial<T>) => T, delegate: any): (req: any, res: any) => void {
        return async function(req, res) {
            let { id } = req.query;
            id = parseInt(id);

            if (req.method === 'GET') {
                return delegate.findUnique({
                    where: { id },
                    include: {
                        author: true
                    }
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
                        include: {
                            author: true
                        }
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

                        delegate.update({
                            where: {
                                id: id
                            },
                            data: o
                        }).then(o => {
                            res.status(200).send(o);
                        });
                    });
                })
                .catch(err => {res.status(401).send(err)});
            } else if (req.method === 'DELETE') {
                cookieWrapper(req)
                .then(user => {
                    delegate.findUnique({
                        where: { id },
                        include: {
                            author: true
                        }
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