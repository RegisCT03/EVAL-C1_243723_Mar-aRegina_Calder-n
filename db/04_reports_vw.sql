CREATE VIEW vw_course_performance AS
SELECT 
    c.name AS course_name,
    g.term AS term,
    s.program AS student_program,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) AS general_average,
    COUNT(CASE WHEN ((gr.partial1 + gr.partial2 + gr.final) / 3) < 6 THEN 1 END) AS failed_students -- Uso de CASE [cite: 15, 33]
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN enrollments e ON g.id = e.group_id
JOIN grades gr ON e.id = gr.enrollment_id
JOIN students s ON e.student_id = s.id
GROUP BY c.name, g.term, s.program;

CREATE VIEW vw_teacher_load AS
SELECT 
    t.name AS teacher_name,
    g.term AS term,
    COUNT(DISTINCT g.id) AS total_groups,
    COUNT(e.id) AS total_students,
    COALESCE(ROUND(AVG(gr.final), 2), 0) AS avg_grade
FROM teachers t
JOIN groups g ON t.id = g.teacher_id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY t.name, g.term
HAVING COUNT(g.id) > 0;

CREATE VIEW vw_students_at_risk AS
WITH student_metrics AS (
    SELECT 
        s.id,
        s.name,
        s.email,
        AVG((gr.partial1 + gr.partial2 + gr.final) / 3) AS avg_score,
        CAST(COUNT(CASE WHEN a.present THEN 1 END) AS FLOAT) / 
             NULLIF(COUNT(a.id), 0) * 100 AS attendance_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id, s.name, s.email
)
SELECT name, email, ROUND(CAST(avg_score AS NUMERIC), 2) AS avg_score, ROUND(CAST(attendance_rate AS NUMERIC), 2) AS attendance_rate
FROM student_metrics
WHERE avg_score < 7 OR attendance_rate < 80;

CREATE VIEW vw_attendance_by_group AS
SELECT 
    c.name AS course,
    g.id AS group_id,
    g.term,
    COUNT(a.id) AS total_sessions,
    ROUND(AVG(CASE WHEN a.present THEN 100 ELSE 0 END), 2) AS attendance_percentage -- CASE y AVG [cite: 18, 31, 33]
FROM groups g
JOIN courses c ON g.course_id = c.id
JOIN enrollments e ON g.id = e.group_id
JOIN attendance a ON e.id = a.enrollment_id
GROUP BY c.name, g.id, g.term
HAVING COUNT(a.id) > 0;

CREATE VIEW vw_rank_students AS
SELECT 
    s.name AS student_name,
    s.program,
    g.term,
    ROUND(AVG(gr.final), 2) AS final_avg,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG(gr.final) DESC) AS rank_position -- Window Function [cite: 19, 35]
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program, g.term;