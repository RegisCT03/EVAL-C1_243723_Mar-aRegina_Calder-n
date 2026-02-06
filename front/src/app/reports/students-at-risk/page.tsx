import { query } from '../../../../lib/db';
import Link from 'next/link';
import styles from '../teacher-load/teacher-load.module.css';

interface StudentAtRisk {
  name: string;
  email: string;
  program: string;
  avg_score: number;
  attendance_rate: number;
}

export default async function StudentsAtRiskPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const searchTerm = typeof sParams.search === 'string' ? sParams.search : '';
  const currentPage = Number(sParams.page) || 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const result = await query(
    `SELECT name, email, program, avg_score, attendance_rate 
     FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR program ILIKE $1 OR email ILIKE $1
     ORDER BY program ASC, avg_score ASC
    LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, pageSize, offset]
  );

  const students = result.rows as StudentAtRisk[];

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Alumnos en Riesgo Académico</h1>
        <div className={styles.insightBox}>
          <p> 
            <strong>Insight:</strong> Este reporte identifica estudiantes vulnerables por faltas o promedio menor a 80, facilitando la intervención de los docentes.
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
            placeholder="Nombre, carrera o email..." 
            defaultValue={searchTerm} 
            className={styles.input}
            suppressHydrationWarning
          />
          <button type="submit" className={styles.searchButton} suppressHydrationWarning>Buscar</button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Carrera</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th className={styles.center}>Promedio</th>
                <th className={styles.center}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s, i) => (
                  <tr key={i}>
                    <td className={styles.programLabel}>{s.program}</td>
                    <td className={styles.boldText}>{s.name}</td>
                    <td className={styles.fadedText}>{s.email}</td>
                    <td className={`${styles.center} ${styles.boldText}`}>{s.avg_score}</td>
                    <td className={styles.center}>{s.attendance_rate}%</td>
                  </tr>
                ))) : (
                <tr><td colSpan={5} className={styles.noData}>No hay estudiantes en riesgo.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className={styles.pagination}>
          {currentPage > 1 && (
            <Link href={`?search=${searchTerm}&page=${currentPage - 1}`} className={styles.pageLink}>
              &larr; Anterior
            </Link>
          )}
          <span className={styles.pageInfo}>Página <strong>{currentPage}</strong></span>
          {students.length === pageSize && (
            <Link href={`?search=${searchTerm}&page=${currentPage + 1}`} className={styles.pageLink}>
              Siguiente &rarr;
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}