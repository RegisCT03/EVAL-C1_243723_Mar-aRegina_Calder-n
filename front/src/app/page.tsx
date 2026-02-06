import Link from 'next/link';
import styles from './dashboard.module.css';

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
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Dashboard Escolar</h1>
          <p>Gestión académica centralizada</p>
        </header>

        <section className={styles.grid}>
          {reports.map((report) => (
            <div key={report.id} className={styles.card}>
              <h3>{report.title}</h3>
              <p>{report.description}</p>
              <Link href={report.path} className={styles.link}>
                Abrir Reporte
              </Link>
            </div>
          ))}
        </section>

        <footer className={styles.footer}>
          Acceso restringido: <span>User App</span>
        </footer>
      </main>
    </div>
  );
}