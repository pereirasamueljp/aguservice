import { Redis } from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT || 6379,
});

const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT || 6379,
});

const prefixKey = process.env.KEY_CACHE || 'cache:appangularagu';

function getKey(key) {
    return `${prefixKey}${key}`;
}

export const Cache = {
    set: (key: string, obj: any, options: any = { expire: 3600 }) => {
        return redis.set(getKey(key), JSON.stringify(obj), 'EX', options.expire || 3600);
    },
    mset: async (obj: any, options: any = { expire: 3600 }): Promise<void> => {
        const clone = {};
        for (const key in obj) {
            clone[key] = JSON.stringify(obj[key]);
        }
        await redis.mset(clone);
        for (const key in obj) {
            redis.expire(key, options.expire || 3600);
        }
        return;
    },
    getStartsWidth: async (keyPrefix: string) => {
        const keys = await redis.keys(getKey(keyPrefix));
        const result = [];
        for (const key of keys) {
            result.push(JSON.parse(await redis.get(key)));
        }
        return result.filter(Boolean);
    },
    get: async (key: string) => {
        const val = await redis.get(getKey(key));
        return JSON.parse(val);
    },
    mget: async <T>(keys: string[]): Promise<{ [key: string]: T }> => {
        const map = {};
        if (keys.length === 0) {
            return map;
        }
        keys = keys.map((k) => getKey(k));
        const result = await redis.mget(...keys);
        for (let i = 0; i < keys.length; i++) {
            if (result[i]) {
                map[keys[i]] = JSON.parse(result[i]);
            }
        }
        return map;
    },
    del: async (key: string) => {
        return redis.del(getKey(key));
    },
    incr: async (key: string) => {
        return await redis.incr(getKey(key));
    },
    flushdb: async () => {
        return redis.flushall();
    }
};

export const Communication = {
    subscribe: (...args) => sub.subscribe(...args),
    publish: (...args) => (redis as any).publish(...args),
    on: (...args) => (sub as any).on(...args)
};
