CREATE TABLE courses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

CREATE TABLE students (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    enrollment_year INTEGER NOT NULL
);

CREATE TABLE teachers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE groups (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    term VARCHAR(50) NOT NULL, 
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE grades (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    enrollment_id BIGINT NOT NULL,
    partial1 DECIMAL(5,2),
    partial2 DECIMAL(5,2),
    final DECIMAL(5,2),
    CONSTRAINT fk_enrollment_grades FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE TABLE attendance (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    enrollment_id BIGINT NOT NULL,
    date DATE NOT NULL,
    present BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_enrollment_attendance FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);