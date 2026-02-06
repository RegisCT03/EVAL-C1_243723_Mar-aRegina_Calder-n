CREATE ROLE view_user WITH 
    LOGIN 
    PASSWORD 'Password123'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;
GRANT CONNECT ON DATABASE db_awos TO view_user;
GRANT USAGE ON SCHEMA public TO view_user;
--Permisos 
GRANT SELECT ON 
    vw_course_performance,
    vw_teacher_load,
    vw_students_at_risk,
    vw_attendance_by_group,
    vw_rank_students
TO view_user;
--- Revocar permisos innecesarios
REVOKE CREATE ON SCHEMA public FROM public;
REVOKE ALL ON DATABASE db_awos FROM public;