import { query } from '../../../../lib/db';
import Link from 'next/link';
import styles from '../teacher-load/teacher-load.module.css';

interface TeacherLoad {
  teacher_name: string;
  term: string;
  total_groups: number;
  total_students: number;
  avg_grade: number;
}

export default async function TeacherLoadPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const search = typeof sParams.search === 'string' ? sParams.search.trim() : '';
  const page = Number(sParams.page) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const result = await query(
    `SELECT teacher_name, term, total_groups, total_students, avg_grade 
     FROM vw_teacher_load 
     WHERE teacher_name ILIKE $1
     ORDER BY teacher_name ASC 
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, pageSize, offset]
  );

  const teachers = result.rows as TeacherLoad[];

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Carga Académica por Docente</h1>
        <div className={styles.insightBox}>
          <p>
            <strong>Insight:</strong> Este reporte permite equilibrar la distribución de alumnos y grupos, asegurando la calidad educativa.
          </p>
        </div>
        <div className={styles.backContainer}>
        <Link href="/" className={styles.backLink}>Volver al Dashboard</Link>
      </div>
      </header>

      <section className={styles.bentoSection}>
        <form method="GET" className={styles.searchForm}>
          <input 
            type="text" 
            name="search" 
            placeholder="Buscar docente..." 
            defaultValue={search}
            className={styles.input}
          />
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Docente</th>
                <th>Periodo</th>
                <th className={styles.center}>Grupos</th>
                <th className={styles.center}>Total Alumnos</th>
                <th className={styles.right}>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((t, i) => (
                  <tr key={i}>
                    <td className={styles.teacherName}>{t.teacher_name}</td>
                    <td>{t.term}</td>
                    <td className={styles.center}>{t.total_groups}</td>
                    <td className={styles.center}>{t.total_students}</td>
                    <td className={`${styles.right} ${styles.bold}`}>{t.avg_grade}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className={styles.noData}>No se encontraron registros.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className={styles.pagination}>
          {page > 1 && (
            <Link href={`?search=${search}&page=${page - 1}`} className={styles.pageLink}>
              &larr; Anterior
            </Link>
          )}
          <span className={styles.pageIndicator}>Página <strong>{page}</strong></span>
          {teachers.length === pageSize && (
            <Link href={`?search=${search}&page=${page + 1}`} className={styles.pageLink}>
              Siguiente &rarr;
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}