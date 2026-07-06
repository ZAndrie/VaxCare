import { Request, Response } from "express";
import { pool } from "../legacy/postgresql/pool";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

/** GET /api/schedules */
export const listSchedules = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT s.*, r.name AS resident_name
     FROM schedules s
     JOIN residents r ON r.id = s.resident_id
     ORDER BY s.scheduled_date`
  );
  res.json(rows);
});

/** POST /api/schedules */
export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { id, residentId, vaccine, dose, scheduledDate, worker, purok } = req.body;
  if (!id || !residentId || !vaccine || !scheduledDate) {
    throw new ApiError(400, "id, residentId, vaccine, and scheduledDate are required");
  }

  const { rows } = await pool.query(
    `INSERT INTO schedules (id, resident_id, vaccine, dose, scheduled_date, worker, purok)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id, residentId, vaccine, dose, scheduledDate, worker, purok]
  );
  res.status(201).json(rows[0]);
});

/** PUT /api/schedules/:id — update status (Upcoming/Completed/Missed/Rescheduled) */
export const updateScheduleStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ["Upcoming", "Completed", "Missed", "Rescheduled"];
  if (!valid.includes(status)) throw new ApiError(400, `status must be one of: ${valid.join(", ")}`);

  const { rows } = await pool.query(
    `UPDATE schedules SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (!rows[0]) throw new ApiError(404, "Schedule not found");
  res.json(rows[0]);
});
