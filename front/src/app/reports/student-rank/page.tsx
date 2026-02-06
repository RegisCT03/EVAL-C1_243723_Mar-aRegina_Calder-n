import { query } from '../../../../lib/db';
import Link from 'next/link';
import { z } from 'zod';
import styles from '../teacher-load/teacher-load.module.css';

const VALID_PROGRAMS = ['Ingeniería en Sistemas', 'Ciencia de Datos', 'Ingeniería Industrial'] as const;

const VALID_TERMS = ['Enero-Abril 2025', 'Mayo-Agosto 2025', 'Septiembre-Diciembre 2025', 'Enero-Abril 2026', 'Mayo-Agosto 2026', 'Septiembre-Diciembre 2026'] as const;

const searchParamsSchema = z.object({
  program: z.enum(VALID_PROGRAMS).optional().default('Ingeniería en Sistemas'),
  term: z.enum(VALID_TERMS).optional().default('Enero-Abril 2025'),
});

interface RankingStudent {
  student_name: string;
  program: string;
  term: string;
  final_avg: number;
  rank_position: number;
}

export default async function RankingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await props.searchParams;
  const parsed = searchParamsSchema.safeParse(sParams);
  const { program, term } = parsed.success ? parsed.data : { program: 'Ingeniería en Sistemas', term: 'Enero-Abril 2025' };    
    
  const result = await query(
    `SELECT student_name, program, term, final_avg, rank_position 
     FROM vw_rank_students 
     WHERE program = $1 AND term = $2 
     ORDER BY rank_position ASC`,
    [program, term]
  );

  const students = result.rows as RankingStudent[];
  const topStudent = students[0];

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Ranking de Estudiantes</h1>
        <div className={styles.insightBox}>
          <p>
            <strong>Insight:</strong> Este reporte visualiza el desempeño sobresaliente para la asignación de becas y reconocimientos.
          </p>
        </div>
        <div className={styles.backContainer}>
          <Link href="/" className={styles.backLink}>Volver al Dashboard</Link>
        </div>
      </header>

      <section className={styles.bentoSection}>
        {topStudent && (
          <div style={{ 
            backgroundColor: '#461D3A', 
            color: '#fff', 
            padding: '20px', 
            borderRadius: '16px', 
            marginBottom: '30px',
            textAlign: 'center' 
          }}>
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