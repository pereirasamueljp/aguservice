import { logger } from '../../../utils/logger';

const excludedUrls = [
    'GET'
];

export function logMiddleware(req, res, next) {
    if (excludedUrls.indexOf(`${req.method}`) === -1) {
        logger.info(`Req: ${req.method} - ${req.url}`);
    }
    next();
}
