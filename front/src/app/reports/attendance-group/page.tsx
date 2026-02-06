import { query } from '../../../../lib/db';
import Link from 'next/link';
import { z } from 'zod';
import styles from '../teacher-load/teacher-load.module.css';

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
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Asistencia por Grupo</h1>
        <div className={styles.insightBox}>
          <p>
            <strong>Insight:</strong> Este reporte detecta grupos con baja asistencia para implementar estrategias de motivación y mejorar el compromiso estudiantil.
          </p>
        </div>
        <div className={styles.backContainer}>
          <Link href="/" className={styles.backLink}>← Volver al Dashboard</Link>
        </div>
      </header>

      <section className={styles.bentoSection}>
        <form method="GET" className={styles.searchForm}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#BA71A2', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Periodo Académico
            </label>
            <select name="term" defaultValue={term} className={styles.input}>
              {VALID_TERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.searchButton}>Filtrar</button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.center}>ID</th>
                <th>Curso / Materia</th>
                <th>Profesor</th>
                <th className={styles.center}>Sesiones</th>
                <th className={styles.right}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((g, i) => {
                  const isLowAttendance = Number(g.attendance_percentage) < 80;
                  return (
                    <tr key={i}>
                      <td className={styles.center} style={{ color: '#BA71A2', fontSize: '0.85rem' }}>#{g.group_id}</td>
                      <td className={styles.bold}>{g.course}</td>
                      <td>{g.teacher}</td>
                      <td className={styles.center}>{g.total_sessions}</td>
                      <td className={styles.right} style={{ 
                        fontWeight: '800', 
                        color: isLowAttendance ? '#7E2A53' : '#461D3A' 
                      }}>
                        {g.attendance_percentage}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    No hay registros de asistencia para el periodo <strong>{term}</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}