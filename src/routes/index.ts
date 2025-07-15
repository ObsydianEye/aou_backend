import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({ msg: 'Hello from Express route (modularized)! and env varibalew', envVar: process.env.TESTVAR });
});

export default router;
