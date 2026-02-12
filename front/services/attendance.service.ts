import { query } from '../lib/db';
import { z } from 'zod';

export const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;

export const searchParamsSchema = z.object({
  term: z.enum(VALID_TERMS).optional().default('Enero-Abril 2025'),
});

export interface AttendanceGroup {
  course: string; 
  teacher: string;
  group_id: number;
  term: string;
  total_sessions: number;
  attendance_percentage: number;
}

export async function getAttendanceByTerm(term: string): Promise<AttendanceGroup[]> {
  const result = await query(
    `SELECT course, teacher, group_id, term, total_sessions, attendance_percentage 
     FROM vw_attendance_by_group 
     WHERE term = $1 
     ORDER BY attendance_percentage ASC`,
    [term]
  );
  return result.rows as AttendanceGroup[];
}