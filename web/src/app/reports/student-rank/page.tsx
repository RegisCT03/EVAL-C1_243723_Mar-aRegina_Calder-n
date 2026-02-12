import Link from 'next/link';
import styles from '../teacher-load/teacher-load.module.css';
import { getStudentRanking, rankingParamsSchema, VALID_PROGRAMS, VALID_TERMS } from '../../../../services/rank.service'

export default async function RankingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const parsed = rankingParamsSchema.safeParse(sParams);
  const { program, term } = parsed.success ? parsed.data : { program: 'Ingeniería en Sistemas', term: 'Enero-Abril 2025' };    
  const students = await getStudentRanking(program, term);
  const topStudent = students[0];

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Ranking de Estudiantes</h1>
        <div className={styles.insightBox}>
          <p><strong>Insight:</strong> Este reporte visualiza el desempeño sobresaliente para la asignación de becas y reconocimientos.</p>
        </div>
        <div className={styles.backContainer}>
          <Link href="/" className={styles.backLink}>Volver al Dashboard</Link>
        </div>
      </header>

      <section className={styles.bentoSection}>
        {topStudent && (
          <div style={{ backgroundColor: '#461D3A', color: '#fff', padding: '20px', borderRadius: '16px', marginBottom: '30px', textAlign: 'center' }}>
            <h3 style={{ color: '#ECD0EC', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Primer lugar de Excelencia — {program}
            </h3>
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '10px 0 0' }}>
              {topStudent.student_name} <span style={{ opacity: 0.8, fontWeight: 'normal' }}>({topStudent.final_avg})</span>
            </p>
          </div>
        )}

        <form method="GET" className={styles.searchForm} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#BA71A2', fontWeight: 'bold' }}>Programa:</label>
            <select name="program" defaultValue={program} className={styles.input}>
              {VALID_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#BA71A2', fontWeight: 'bold' }}>Periodo:</label>
            <select name="term" defaultValue={term} className={styles.input}>
              {VALID_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button type="submit" className={styles.searchButton}>Filtrar</button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.center}>Posición</th>
                <th>Nombre del Estudiante</th>
                <th className={styles.right}>Promedio Final</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td className={styles.center} style={{ color: '#7E2A53', fontWeight: '800' }}>#{s.rank_position}</td>
                  <td className={styles.bold}>{s.student_name}</td>
                  <td className={`${styles.right} ${styles.bold}`} style={{ color: '#461D3A' }}>
                    {s.final_avg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}