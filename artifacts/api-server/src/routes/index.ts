import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casesRouter from "./cases";
import resultsRouter from "./results";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casesRouter);
router.use(resultsRouter);

export default router;
