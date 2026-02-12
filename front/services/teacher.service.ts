import {query} from '../lib/db'

export interface TeacherLoad {
  teacher_name: string;
  term: string;
  total_groups: number;
  total_students: number;
  avg_grade: number;
}

export async function getTeacherLoad(search: string, page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  const result = await query(
    `SELECT teacher_name, term, total_groups, total_students, avg_grade 
     FROM vw_teacher_load 
     WHERE teacher_name ILIKE $1
     ORDER BY teacher_name ASC 
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, pageSize, offset]
  );

  return result.rows as TeacherLoad[];
}