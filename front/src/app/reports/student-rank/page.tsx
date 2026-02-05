import { query } from '../../../../lib/db';
import Link from 'next/link';
import { z } from 'zod';

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
    const { program, term } = parsed.success ? parsed.data: { program: 'Ingeniería en Sistemas', term: 'Enero-Abril 2025' };    
    
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
    <main>
      <h1>Ranking de Estudiantes</h1>
      <p>Este reporte permite visualizar el desempeño sobresaliente de los estudiantes mediante Window Functions, comparando promedios dentro de un mismo contexto académico. Facilita la toma de decisiones para la asignación de becas y reconocimientos al segmentarlo por carrera y periodo específico.</p>

      {topStudent && (
        <section>
          <h3>Primer lugar de Exelencia en la carrera de {program}</h3>
          <p>{topStudent.student_name} - Promedio: {topStudent.final_avg}</p>
        </section>
      )}

      <form method="GET">
        <label htmlFor="program">Programa:</label>
        <select name="program" defaultValue={program}>
          {VALID_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <label htmlFor="term">Periodo:</label>
        <select name="term" defaultValue={term}>
          {VALID_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit">Filtrar</button>
      </form>

      <table border={1} style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nombre</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.rank_position}</td>
              <td>{s.student_name}</td>
              <td>{s.final_avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">Ir al Dashboard</Link>
    </main>
  );
}