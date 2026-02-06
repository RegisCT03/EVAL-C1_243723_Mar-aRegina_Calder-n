import { query } from '../../../../lib/db';
import Link from 'next/link';

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
    <main style={{ padding: '20px' }}>
      <h1>Carga Académica por Docente</h1>
      <p style={{ color: '#666' }}>
        <strong>Insight:</strong> Este reporte permite equilibrar la distribución de alumnos y grupos, asegurando la calidad educativa mediante el monitoreo del promedio general por docente.
      </p>

      <form method="GET" style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          name="search" 
          placeholder="Buscar docente..." 
          defaultValue={search}
          style={{ padding: '8px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>Buscar</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#222', color: '#fff' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Docente</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Periodo</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Grupos</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Total Alumnos</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{t.teacher_name}</td>
                <td style={{ padding: '10px' }}>{t.term}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{t.total_groups}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{t.total_students}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                  {t.avg_grade}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No se encontraron registros.</td></tr>
          )}
        </tbody>
      </table>

      <nav style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        {page > 1 && (
          <Link href={`?search=${search}&page=${page - 1}`} style={{ color: '#FFFF' }}>
            &larr; Anterior
          </Link>
        )}
        <span>Página <strong>{page}</strong></span>
        {teachers.length === pageSize && (
          <Link href={`?search=${search}&page=${page + 1}`} style={{ color: '#FFFF' }}>
            Siguiente &rarr;
          </Link>
        )}
      </nav>

      <div style={{ marginTop: '30px' }}>
        <Link href="/">Volver al Dashboard</Link>
      </div>
    </main>
  );
}