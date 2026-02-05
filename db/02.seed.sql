-- Cursos (5 registros)
INSERT INTO courses (code, name, credits) VALUES
('MAT101', 'Matemáticas Avanzadas', 8),
('PROG202', 'Programación Orientada a Objetos', 10),
('HIS303', 'Historia Universal', 4),
('EST404', 'Estadística Descriptiva', 6),
('DB505', 'Bases de Datos Relacionales', 8);

-- Profesores (5 registros)
INSERT INTO teachers (name, email) VALUES
('Dr. Roberto García', 'roberto.garcia@univ.edu'),
('Dra. Elena Martínez', 'elena.mtz@univ.edu'),
('Ing. Carlos Ruiz', 'carlos.ruiz@univ.edu'),
('Mtra. Sofía López', 'sofia.lopez@univ.edu'),
('Lic. Alberto Herrera', 'alberto.h@univ.edu');

-- Estudiantes (15 registros)
INSERT INTO students (name, email, program, enrollment_year) VALUES
('Juan Pérez', 'juan.p@correo.com', 'Ingeniería en Sistemas', 2023),
('María Rodríguez', 'm.rod@correo.com', 'Ingeniería en Sistemas', 2023),
('Pedro Gómez', 'p.gomez@correo.com', 'Ciencia de Datos', 2024),
('Ana Sánchez', 'ana.sanz@correo.com', 'Ciencia de Datos', 2024),
('Luis Torres', 'l.torres@correo.com', 'Ingeniería Industrial', 2023),
('Lucía Méndez', 'l.mendez@correo.com', 'Ingeniería Industrial', 2024),
('Jorge Castro', 'j.castro@correo.com', 'Ingeniería en Sistemas', 2023),
('Fernanda Ruiz', 'f.ruiz@correo.com', 'Ciencia de Datos', 2023),
('Gabriel Soto', 'g.soto@correo.com', 'Ingeniería Industrial', 2024),
('Valeria Ortiz', 'v.ortiz@correo.com', 'Ingeniería en Sistemas', 2023),
('Diego Luna', 'd.luna@correo.com', 'Ingeniería Industrial', 2023),
('Sara Villa', 's.villa@correo.com', 'Ciencia de Datos', 2024),
('Miguel Jara', 'm.jara@correo.com', 'Ingeniería en Sistemas', 2024),
('Isabel Díaz', 'i.diaz@correo.com', 'Ingeniería Industrial', 2023),
('Raúl Lima', 'r.lima@correo.com', 'Ciencia de Datos', 2024);

-- Grupos (10 registros - Distribuidos entre cursos y profes)
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, 'Enero-Abril 2025'), (1, 2, 'Septiembre-Diciembre 2025'), 
(2, 3, 'Enero-Abril 2025'), (2, 4, 'Enero-Abril 2026'),
(3, 5, 'Mayo-Agosto 2025'), (4, 1, 'Enero-Abril 2026'),
(4, 2, 'Mayo-Agosto 2025'), (5, 3, 'Mayo-Agosto 2026'),
(5, 4, 'Septiembre-Diciembre 2025'), (2, 5, 'Septiembre-Diciembre 2026');

-- Inscripciones (20 registros - Relacionando alumnos con grupos)
INSERT INTO enrollments (student_id, group_id) VALUES
(1, 1), (1, 3), (2, 1), (2, 4), (3, 2),
(4, 3), (5, 5), (6, 5), (7, 1), (8, 6),
(9, 7), (10, 8), (11, 9), (12, 10), (13, 2),
(14, 4), (15, 6), (3, 8), (5, 10), (7, 3);

-- Calificaciones (20 registros - Una por cada inscripción)
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
(1, 8.5, 9.0, 8.8), (2, 6.0, 5.5, 5.8), (3, 9.5, 10.0, 9.8), (4, 4.0, 5.0, 4.5),
(5, 7.0, 7.5, 7.3), (6, 8.0, 8.2, 8.1), (7, 6.5, 6.0, 6.2), (8, 9.0, 9.0, 9.0),
(9, 3.5, 4.0, 3.8), (10, 10.0, 9.5, 9.7), (11, 7.5, 7.0, 7.2), (12, 5.5, 6.0, 5.7),
(13, 8.8, 9.2, 9.0), (14, 7.2, 6.8, 7.0), (15, 4.5, 5.0, 4.8), (16, 9.1, 8.9, 9.0),
(17, 6.8, 7.4, 7.1), (18, 5.0, 4.0, 4.5), (19, 8.0, 8.0, 8.0), (20, 9.5, 9.5, 9.5);

-- Asistencia (25 registros - Muestreo de fechas)
INSERT INTO attendance (enrollment_id, date, present) VALUES
(1, '2026-02-01', TRUE), (1, '2026-02-02', TRUE), (1, '2026-02-03', FALSE),
(2, '2026-02-01', FALSE), (2, '2026-02-02', FALSE), (2, '2026-02-03', FALSE),
(3, '2026-02-01', TRUE), (3, '2026-02-02', TRUE), (3, '2026-02-03', TRUE),
(4, '2026-02-01', TRUE), (4, '2026-02-02', FALSE), (4, '2026-02-03', TRUE),
(5, '2026-02-01', TRUE), (6, '2026-02-01', TRUE), (7, '2026-02-01', TRUE),
(8, '2026-02-01', TRUE), (9, '2026-02-01', FALSE), (10, '2026-02-01', TRUE),
(11, '2026-02-01', TRUE), (12, '2026-02-01', TRUE), (13, '2026-02-01', TRUE),
(14, '2026-02-01', FALSE), (15, '2026-02-01', TRUE), (16, '2026-02-01', TRUE),
(17, '2026-02-01', TRUE);