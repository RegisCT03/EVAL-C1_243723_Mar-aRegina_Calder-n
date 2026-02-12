import { query } from "../lib/db";

export interface StudentAtRisk {
  name: string;
  email: string;
  program: string;
  avg_score: number;
  attendance_rate: number;
}

export async function getStudentsAtRisk(searchTerm: string, page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  const result = await query(
    `SELECT name, email, program, avg_score, attendance_rate 
     FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR program ILIKE $1 OR email ILIKE $1
     ORDER BY program ASC, avg_score ASC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, pageSize, offset]
  );

  return result.rows as StudentAtRisk[];
}