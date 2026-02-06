-- 1. CURSOS
INSERT INTO courses (code, name, credits) VALUES
('MAT101', 'Matemáticas Avanzadas', 8),
('PROG202', 'Programación Orientada a Objetos', 10),
('HIS303', 'Historia Universal', 4),
('EST404', 'Estadística Descriptiva', 6),
('DB505', 'Bases de Datos Relacionales', 8);

-- 2. PROFESORES (20 registros)
INSERT INTO teachers (name, email) VALUES
('Dr. Roberto García', 'roberto.garcia@univ.edu'), ('Dra. Elena Martínez', 'elena.mtz@univ.edu'),
('Ing. Carlos Ruiz', 'carlos.ruiz@univ.edu'), ('Mtra. Sofía López', 'sofia.lopez@univ.edu'),
('Lic. Alberto Herrera', 'alberto.h@univ.edu'), ('Dra. Beatriz Alfaro', 'beatriz.alfaro@univ.edu'),
('Dr. Gerardo Nuñez', 'gerardo.nunez@univ.edu'), ('Mtro. Ricardo Téllez', 'ricardo.tellez@univ.edu'),
('Ing. Marcela Vaca', 'marcela.vaca@univ.edu'), ('Dra. Sandra Cuevas', 'sandra.cuevas@univ.edu'),
('Dr. Iván Paredes', 'ivan.paredes@univ.edu'), ('Mtra. Lorena Iturbide', 'lorena.iturbide@univ.edu'),
('Ing. Samuel García', 'samuel.garcia@univ.edu'), ('Lic. Tania Orozco', 'tania.orozco@univ.edu'),
('Dr. Ulises Granados', 'ulises.granados@univ.edu'), ('Dra. Victoria Kent', 'victoria.kent@univ.edu'),
('Mtro. Walter White', 'walter.white@univ.edu'), ('Ing. Ximena Ximénez', 'ximena.x@univ.edu'),
('Dr. Yair Zenón', 'yair.zenon@univ.edu'), ('Mtra. Zoé Robledo', 'zoe.robledo@univ.edu');

-- 3. ESTUDIANTES (40 registros)
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
('Raúl Lima', 'r.lima@correo.com', 'Ciencia de Datos', 2024),
('Ricardo Tapia', 'r.tapia@correo.com', 'Ingeniería en Sistemas', 2024),
('Elena Ponce', 'e.ponce@correo.com', 'Ciencia de Datos', 2024),
('Mauricio Cano', 'm.cano@correo.com', 'Ingeniería Industrial', 2023),
('Claudia Rivas', 'c.rivas@correo.com', 'Ingeniería en Sistemas', 2023),
('Roberto Sanz', 'r.sanz@correo.com', 'Ciencia de Datos', 2024),
('Lorena Paz', 'l.paz@correo.com', 'Ingeniería Industrial', 2024),
('Hugo Rocha', 'h.rocha@correo.com', 'Ingeniería en Sistemas', 2023),
('Beatriz Luna', 'b.luna@correo.com', 'Ciencia de Datos', 2023),
('Andrés Vera', 'a.vera@correo.com', 'Ingeniería Industrial', 2024),
('Silvia Soler', 's.soler@correo.com', 'Ingeniería en Sistemas', 2023),
('Oscar Mora', 'o.mora@correo.com', 'Ingeniería Industrial', 2023),
('Patricia Gil', 'p.gil@correo.com', 'Ciencia de Datos', 2024),
('Felipe Soto', 'f.soto@correo.com', 'Ingeniería en Sistemas', 2024),
('Gloria Ríos', 'g.rios@correo.com', 'Ingeniería Industrial', 2023),
('Ximena Lara', 'x.lara@correo.com', 'Ciencia de Datos', 2024),
('Samuel Peña', 's.pena@correo.com', 'Ingeniería en Sistemas', 2024),
('Karla Montes', 'k.montes@correo.com', 'Ciencia de Datos', 2024),
('Victor Hugo', 'v.hugo@correo.com', 'Ingeniería Industrial', 2023),
('Daniela Mar', 'd.mar@correo.com', 'Ingeniería en Sistemas', 2023),
('Esteban Quito', 'e.quito@correo.com', 'Ciencia de Datos', 2024),
('Monica Galindo', 'm.galindo@correo.com', 'Ingeniería Industrial', 2024),
('Julian Alva', 'j.alva@correo.com', 'Ingeniería en Sistemas', 2023),
('Rosa Meza', 'r.meza@correo.com', 'Ciencia de Datos', 2023),
('Tomas Turbado', 't.turbado@correo.com', 'Ingeniería Industrial', 2024),
('Yolanda Reys', 'y.reys@correo.com', 'Ingeniería en Sistemas', 2023);

-- 4. GRUPOS (25 registros)
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, 'Enero-Abril 2025'), (1, 2, 'Septiembre-Diciembre 2025'), 
(2, 3, 'Enero-Abril 2025'), (2, 4, 'Enero-Abril 2026'),
(3, 5, 'Mayo-Agosto 2025'), (4, 1, 'Enero-Abril 2026'),
(4, 2, 'Mayo-Agosto 2025'), (5, 3, 'Mayo-Agosto 2026'),
(5, 4, 'Septiembre-Diciembre 2025'), (2, 5, 'Septiembre-Diciembre 2026'),
(1, 6, 'Enero-Abril 2026'), (2, 7, 'Enero-Abril 2026'),
(3, 8, 'Enero-Abril 2026'), (4, 9, 'Enero-Abril 2026'),
(5, 10, 'Enero-Abril 2026'), (1, 11, 'Enero-Abril 2026'),
(2, 12, 'Enero-Abril 2026'), (3, 13, 'Enero-Abril 2026'),
(4, 14, 'Enero-Abril 2026'), (5, 15, 'Enero-Abril 2026'),
(1, 16, 'Enero-Abril 2026'), (2, 17, 'Enero-Abril 2026'),
(3, 18, 'Enero-Abril 2026'), (4, 19, 'Enero-Abril 2026'),
(5, 20, 'Enero-Abril 2026');

-- 5. INSCRIPCIONES
INSERT INTO enrollments (student_id, group_id)
SELECT s.id, g.id FROM students s CROSS JOIN groups g 
WHERE (s.id + g.id) % 7 = 0 LIMIT 100;

-- 6. CALIFICACIONES VARIADAS (PARA EVITAR EMPATES DE 5.0)
-- Genera notas aleatorias entre 4.0 y 10.0
INSERT INTO grades (enrollment_id, partial1, partial2, final)
SELECT 
    id, 
    ROUND((RANDOM() * 6 + 4)::numeric, 1), 
    ROUND((RANDOM() * 6 + 4)::numeric, 1), 
    ROUND((RANDOM() * 6 + 4)::numeric, 1)
FROM enrollments;

-- 7. ASISTENCIA VARIADA
INSERT INTO attendance (enrollment_id, date, present)
SELECT id, '2026-02-05', (RANDOM() > 0.2) FROM enrollments;