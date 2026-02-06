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
  total_sessions: number;
  attendance_percentage: number;
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
     ORDER BY attendance_percentage ASC`,
    [term]
  );

  const groups = result.rows as AttendanceGroup[];

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Asistencia por Grupo</h1>
      <p style={{ maxWidth: '800px', color: '#666' }}>
        Este reporte identifica la inasistencia mediante el análisis de materias y docentes. Permite detectar grupos con baja asistencia para implementar estrategias de motivación y mejorar el compromiso estudiantil.
      </p>

      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
        <form method="GET" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label><strong>Periodo Académico:</strong></label>
          <select name="term" defaultValue={term} style={{ padding: '5px' }}>
            {VALID_TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>Filtrar</button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'center' }}>ID_Grupo</th>
            <th style={{ padding: '12px' }}>Curso / Materia</th>
            <th style={{ padding: '12px' }}>Profesor</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Sesiones</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {groups.length > 0 ? (
            groups.map((g, i) => {
              const isLowAttendance = Number(g.attendance_percentage) < 80;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#888' }}>#{g.group_id}</td>
                  <td style={{ padding: '10px', fontWeight: '500' }}>{g.course}</td>
                  <td style={{ padding: '10px' }}>{g.teacher}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{g.total_sessions}</td>
                  <td style={{ padding: '10px',  textAlign: 'right', fontWeight: 'bold' }}>{g.attendance_percentage}%</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                No hay registros de asistencia para el periodo <strong>{term}</strong>.
              </td>
            </tr>
          )}
        </tbody>
      </table>

        <br />
        <Link href="/" >← Volver al Dashboard</Link>
    </main>
  );
}