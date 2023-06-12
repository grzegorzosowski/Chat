import { MemoryStore, rateLimit } from 'express-rate-limit';

export const standardRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1min
    max: 100,
    standardHeaders: true,
    store: new MemoryStore(),
});

export const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000 * 5, // 5min
    max: 5,
    standardHeaders: true,
    store: new MemoryStore(),
});
