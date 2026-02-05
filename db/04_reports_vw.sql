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