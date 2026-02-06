import { query } from '../../../../lib/db';
import Link from 'next/link';

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

  let sql = `
    SELECT course_name, term, student_program, general_average, failed_students 
    FROM vw_course_performance 
    WHERE term = $1
  `;
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
    <main style={{ padding: '20px' }}>
      <h1>Desempeño por Curso</h1>
      <p style={{ color: '#666' }}>Análisis de promedios generales y detección de índices de reprobación por programa académico.</p>

      <form method="GET" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <label>Periodo: </label>
          <select name="term" defaultValue={term}>
            {VALID_TERMS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Carrera: </label>
          <select name="program" defaultValue={program}>
            <option value="">Todas las carreras</option>
            {VALID_PROGRAMS.filter(p => p !== 'Todas las carreras').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button type="submit">Aplicar Filtros</button>
      </form>

      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#222', color: 'white' }}>
            <th style={{ padding: '10px' }}>Curso</th>
            <th style={{ padding: '10px' }}>Promedio Gral.</th>
            <th style={{ padding: '10px' }}>Alumnos Reprobados</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((c, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td style={{ textAlign: 'left', padding: '10px' }}>{c.course_name}</td>
                <td style={{ fontWeight: 'bold' }}>{c.general_average}</td>
                <td style={{ color: Number(c.failed_students) > 0 ? 'red' : 'inherit' }}>
                  {c.failed_students}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={3} style={{ padding: '20px' }}>No se encontraron registros con estos filtros.</td></tr>
          )}
        </tbody>
      </table>

      <nav style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        {page > 1 && (
          <Link href={`?term=${term}&program=${program}&page=${page - 1}`}>&larr; Anterior</Link>
        )}
        <span>Página <strong>{page}</strong></span>
        {courses.length === pageSize && (
          <Link href={`?term=${term}&program=${program}&page=${page + 1}`}>Siguiente &rarr;</Link>
        )}
      </nav>

      <div style={{ marginTop: '30px' }}>
        <Link href="/">Volver al Dashboard</Link>
      </div>
    </main>
  );
}