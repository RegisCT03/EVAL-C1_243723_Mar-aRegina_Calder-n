import Link from 'next/link';

const reports = [
  {
    id: 1,
    title: "Rendimiento por Curso",
    description: "Visualiza promedios y alumnos reprobados por periodo.",
    path: "/reports/course-performance"
  },
  {
    id: 2,
    title: "Carga Docente",
    description: "Análisis de grupos y alumnos totales por profesor.",
    path: "/reports/teacher-load"
  },
  {
    id: 3,
    title: "Alumnos en Riesgo",
    description: "Búsqueda de alumnos con bajo promedio o asistencia.",
    path: "/reports/students-at-risk"
  },
  {
    id: 4,
    title: "Asistencia por Grupo",
    description: "Promedios de asistencia filtrados por periodo.",
    path: "/reports/attendance-group"
  },
  {
    id: 5,
    title: "Ranking de Estudiantes",
    description: "Top de alumnos por carrera y periodo.",
    path: "/reports/student-rank"
  }
];

export default function DashboardPage() {
  return (
    <main>
      <header>
        <h1>Dashboard Escolar</h1>
        <p>Panel de control para la gestión académica</p>
      </header>

      <hr />

      <section>
        <h2>Reportes Disponibles</h2>
        <nav>
          {reports.map((report) => (
            <article key={report.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
              <h3>{report.title}</h3>
              <p><strong>Descripción:</strong> {report.description}</p>
              
              <Link href={report.path}>
                Ver Reporte Detallado
              </Link>
            </article>
          ))}
        </nav>
      </section>

      <footer>
        <p>Acceso restringido: Usuario App.</p>
      </footer>
    </main>
  );
}