CREATE INDEX idx_groups_term ON groups(term);
CREATE INDEX idx_students_search ON students(name, email);
CREATE INDEX idx_students_program ON students(program);