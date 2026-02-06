import { query } from '../../../../lib/db';
import Link from 'next/link';
import { z } from 'zod';

const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;

const searchParamsSchema = z.object({
  term: z.enum(VALID_TERMS).optional().default('Enero-Abril 2025'),
});

interface AttendanceGroup {
  course: string; 
  teacher: string;
  group_id: number;
  term: string;
  total_sessions: string | number;
  attendance_percentage: string | number;
}

export default async function AttendanceGroupPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const parsed = searchParamsSchema.safeParse(sParams);
  const { term } = parsed.success ? parsed.data : { term: 'Enero-Abril 2025' };

  const result = await query(
    `SELECT course, teacher, group_id, term, total_sessions, attendance_percentage 
     FROM vw_attendance_by_group 
     WHERE term = $1 
     ORDER BY attendance_percentage DESC`,
    [term]
  );

  const groups = result.rows as AttendanceGroup[];

  return (
    <main>
      <h1>Asistencia por Grupo</h1>
      <p>
        Este reporte identifica la inasistencia mediante el análisis de materias y docentes. Permite detectar grupos con baja asistencia para implementar estrategias de motivación y mejorar el compromiso estudiantil.
      </p>

      <form method="GET">
        <label>Seleccionar Periodo: </label>
        <select name="term" defaultValue={term} suppressHydrationWarning>
          {VALID_TERMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" suppressHydrationWarning>Filtrar</button>
      </form>

      <table border={1} style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Curso</th>
            <th>Profesor</th>
            <th>Grupo (ID)</th>
            <th>Periodo (Term)</th>
            <th>Total Sesiones</th>
            <th>% Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {groups.length > 0 ? (
            groups.map((g, i) => (
              <tr key={i}>
                <td>{g.course}</td>
                <td>{g.teacher}</td>
                <td>Grupo #{g.group_id}</td>
                <td>{g.term}</td>
                <td>{g.total_sessions}</td>
                <td>{g.attendance_percentage}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>No hay datos para este periodo</td>
            </tr>
          )}
        </tbody>
      </table>

      <br />
      <Link href="/">Volver al Dashboard</Link>
    </main>
  );
}