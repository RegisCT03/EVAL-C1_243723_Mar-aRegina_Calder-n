import { query } from '../lib/db';
import { z } from 'zod';

export const VALID_PROGRAMS = ['Ingeniería en Sistemas', 'Ciencia de Datos', 'Ingeniería Industrial'] as const;
export const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;
export const rankingParamsSchema = z.object({
  program: z.enum(VALID_PROGRAMS).optional().default('Ingeniería en Sistemas'),
  term: z.enum(VALID_TERMS).optional().default('Enero-Abril 2025'),
});

export interface RankingStudent {
  student_name: string;
  program: string;
  term: string;
  final_avg: number;
  rank_position: number;
}

export async function getStudentRanking(program: string, term: string): Promise<RankingStudent[]> {
  const result = await query(
    `SELECT student_name, program, term, final_avg, rank_position 
     FROM vw_rank_students 
     WHERE program = $1 AND term = $2 
     ORDER BY rank_position ASC`,
    [program, term]
  );

  return result.rows as RankingStudent[];
}