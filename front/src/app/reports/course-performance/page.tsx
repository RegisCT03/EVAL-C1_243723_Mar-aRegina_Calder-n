import { query } from '../../../../lib/db';
import Link from 'next/link';
import styles from '../teacher-load/teacher-load.module.css';

const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;
const VALID_PROGRAMS = ['Todas las carreras','Ingeniería en Sistemas', 'Ciencia de Datos', 'Ingeniería Industrial'] as const;

interface CoursePerformance {
  course_name: string;
  term: string;
  student_program: string;
  general_average: number;
  failed_students: number;
}

export default async function CoursePerformancePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;

  const term = typeof sParams.term === 'string' ? sParams.term : 'Enero-Abril 2026';
  const program = typeof sParams.program === 'string' ? sParams.program : '';
  const page = Number(sParams.page) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  let sql = 
    `SELECT course_name, term, student_program, general_average, failed_students 
    FROM vw_course_performance 
    WHERE term = $1`;
  const params: any[] = [term];

  if (program) {
    sql += ` AND student_program = $2`;
    params.push(program);
  }

  sql += ` ORDER BY general_average ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  const result = await query(sql, params);
  const courses = result.rows as CoursePerformance[];

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Desempeño por Curso</h1>
        <div className={styles.insightBox}>
          <p>
            <strong>Insight:</strong> Análisis de promedios generales y detección de índices de reprobación por programa académico para la toma de decisiones preventivas.
          </p>
        </div>
        <div className={styles.backContainer}>
          <Link href="/" className={styles.backLink}>Volver al Dashboard</Link>
        </div>
      </header>

      <section className={styles.bentoSection}>
        <form method="GET" className={styles.searchForm}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#BA71A2', fontWeight: 'bold', textTransform: 'uppercase' }}>Periodo</label>
            <select name="term" defaultValue={term} className={styles.input}>
              {VALID_TERMS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#BA71A2', fontWeight: 'bold', textTransform: 'uppercase' }}>Carrera</label>
            <select name="program" defaultValue={program} className={styles.input}>
              <option value="">Todas las carreras</option>
              {VALID_PROGRAMS.filter(p => p !== 'Todas las carreras').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.searchButton}>Aplicar Filtros</button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Curso</th>
                <th className={styles.center}>Promedio Gral.</th>
                <th className={styles.center}>Alumnos Reprobados</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((c, i) => (
                  <tr key={i}>
                    <td className={styles.bold} style={{ color: '#461D3A' }}>{c.course_name}</td>
                    <td className={`${styles.center} ${styles.bold}`}>{c.general_average}</td>
                    <td className={styles.center} style={{ 
                      color: Number(c.failed_students) > 0 ? '#7E2A53' : 'inherit',
                      fontWeight: Number(c.failed_students) > 0 ? '800' : 'normal'
                    }}>
                      {c.failed_students}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.noData}>
                    No se encontraron registros con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className={styles.pagination}>
          {page > 1 && (
            <Link href={`?term=${term}&program=${program}&page=${page - 1}`} className={styles.pageLink}>
              &larr; Anterior
            </Link>
          )}
          <span className={styles.pageIndicator}>Página <strong>{page}</strong></span>
          {courses.length === pageSize && (
            <Link href={`?term=${term}&program=${program}&page=${page + 1}`} className={styles.pageLink}>
              Siguiente &rarr;
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}