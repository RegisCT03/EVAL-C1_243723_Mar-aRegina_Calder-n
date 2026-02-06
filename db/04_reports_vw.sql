CREATE VIEW vw_course_performance AS
SELECT 
    c.name AS course_name,
    g.term AS term,
    s.program AS student_program,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) AS general_average,
    COUNT(CASE WHEN ((gr.partial1 + gr.partial2 + gr.final) / 3) < 6 THEN 1 END) AS failed_students
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
    COALESCE(ROUND(AVG(gr.final)::numeric, 2), 0) AS avg_grade
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
        s.program,
        AVG((gr.partial1 + gr.partial2 + gr.final) / 3) AS avg_score,
        CAST(COUNT(CASE WHEN a.present THEN 1 END) AS FLOAT) / 
             NULLIF(COUNT(a.id), 0) * 100 AS attendance_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id, s.name, s.email, s.program
)
SELECT 
    name, 
    email, 
    program,
    ROUND(CAST(avg_score AS NUMERIC), 2) AS avg_score, 
    ROUND(CAST(attendance_rate AS NUMERIC), 2) AS attendance_rate
FROM student_metrics
WHERE avg_score < 7 OR attendance_rate < 80;

CREATE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS group_id,
    c.name AS course,
    t.name AS teacher, 
    s.program AS program,
    g.term,
    COUNT(a.id) AS total_sessions,
    COALESCE(
        ROUND(AVG(CASE WHEN a.present THEN 100.0 ELSE 0.0 END)::numeric, 2), 
        0
    ) AS attendance_percentage 
FROM groups g
JOIN courses c ON g.course_id = c.id
JOIN teachers t ON g.teacher_id = t.id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN students s ON e.student_id = s.id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY g.id, c.name, t.name, s.program, g.term;

CREATE VIEW vw_rank_students AS
SELECT 
    s.name AS student_name,
    s.program,
    g.term,
    ROUND(AVG(gr.final), 2) AS final_avg,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG(gr.final) DESC) AS rank_position 
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program, g.term;