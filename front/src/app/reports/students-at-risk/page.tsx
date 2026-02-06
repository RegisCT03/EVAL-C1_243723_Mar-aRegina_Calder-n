import { query } from '../../../../lib/db';
import Link from 'next/link';

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
    <main>
      <h1>Alumnos en Riesgo Académico</h1>
      <p> 
        Este reporte identifica estudiantes vulnerables, ya sea por faltas o promedio menor a 80 segmentados por carrera, facilitando 
        la intervención focalizada de los directores de cada programa.
      </p>

      <form method="GET">
        <input type="text" name="search" placeholder="Nombre, carrera o email..." defaultValue={searchTerm} suppressHydrationWarning/>
        <button type="submit" suppressHydrationWarning>Buscar</button>
      </form>

      <table border={1} style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Carrera</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Promedio</th>
            <th>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s, i) => (
              <tr key={i}>
                <td>{s.program}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.avg_score}</td>
              <td>{s.attendance_rate}%</td>
            </tr>
          ))): <tr><td colSpan={5}>No hay estudiantes en riesgo académico.</td></tr>}
        </tbody>
      </table>

      <nav style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {currentPage > 1 && (
          <Link href={`?search=${searchTerm}&page=${currentPage - 1}`}>
            &larr; Anterior
          </Link>
        )}
        <span>Página {currentPage}</span>
        {students.length === pageSize && (
          <Link href={`?search=${searchTerm}&page=${currentPage + 1}`}>
            Siguiente &rarr;
          </Link>
        )}
      </nav>

      <br />
      <Link href="/">Volver al Dashboard</Link>
    </main>
  );
}