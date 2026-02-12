import { query } from '../lib/db';

export const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;
export const VALID_PROGRAMS = ['Todas las carreras','Ingeniería en Sistemas', 'Ciencia de Datos', 'Ingeniería Industrial'] as const;

export interface CoursePerformance {
  course_name: string;
  term: string;
  student_program: string;
  general_average: number;
  failed_students: number;
}

export async function getCoursePerformance(filters: {
  term: string;
  program?: string;
  page: number;
  pageSize: number;
}) {
  const { term, program, page, pageSize } = filters;
  const offset = (page - 1) * pageSize;

  let sql = `
    SELECT course_name, term, student_program, general_average, failed_students 
    FROM vw_course_performance 
    WHERE term = $1`;
  
  const params: any[] = [term];

  if (program && program !== '') {
    sql += ` AND student_program = $2`;
    params.push(program);
  }
  sql += ` ORDER BY general_average ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  const result = await query(sql, params);
  return result.rows as CoursePerformance[];
}