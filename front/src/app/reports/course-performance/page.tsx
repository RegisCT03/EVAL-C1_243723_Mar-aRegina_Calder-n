import Link from 'next/link';
import styles from '../teacher-load/teacher-load.module.css';
import { getCoursePerformance, VALID_TERMS, VALID_PROGRAMS } from '../../../../services/course.service';

export default async function CoursePerformancePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const term = typeof sParams.term === 'string' ? sParams.term : 'Enero-Abril 2026';
  const program = typeof sParams.program === 'string' ? sParams.program : '';
  const page = Number(sParams.page) || 1;
  const pageSize = 10;
  const courses = await getCoursePerformance({ term, program, page, pageSize });

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Desempeño por Curso</h1>
        <div className={styles.insightBox}>
          <p><strong>Insight:</strong> Análisis de promedios generales y detección de índices de reprobación.</p>
        </div>
        <div className={styles.backContainer}>
          <Link href="/" className={styles.backLink}>Volver al Dashboard</Link>
        </div>
      </header>

      <section className={styles.bentoSection}>
        <form method="GET" className={styles.searchForm}>
          <div className={styles.filterGroup}>
            <label>Periodo</label>
            <select name="term" defaultValue={term} className={styles.input}>
              {VALID_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Carrera</label>
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
                    <td className={styles.bold}>{c.course_name}</td>
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
                <tr><td colSpan={3} className={styles.noData}>No hay registros.</td></tr>
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