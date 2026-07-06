import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { listStock, updateStock } from "../controllers/stock.controller";

const router = Router();

router.use(requireAuth, requireRole("admin", "worker"));

router.get("/", listStock);
router.put("/:id", updateStock);

export default router;
