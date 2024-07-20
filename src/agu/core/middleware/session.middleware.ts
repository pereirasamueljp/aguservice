import * as cls from 'cls-hooked';

const sessionKey = 'AguApp';

export class Session {

    protected static namespace;

    static get<T>(key: string): T {
        const ns = cls.getNamespace(sessionKey);
        return ns.get(key);
    }

    static set(key: string, val: any) {
        const ns = cls.getNamespace(sessionKey);
        return ns.set(key, val);
    }

    static createDefault() {
        return cls.createNamespace(sessionKey);
    }

    static getNamespace() {
        return cls.getNamespace(sessionKey);
    }

}

const session = Session.createDefault();

export function sessionMiddleware(req, res, next) {
    session.bindEmitter(req);
    session.bindEmitter(res);
    return session.run(async () => {
        Session.set('request', req);
        next();
    });
}
