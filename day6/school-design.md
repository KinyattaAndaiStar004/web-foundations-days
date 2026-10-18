# School Database Design

## 1. Table Explanations

### Students Table
The students table stores information about students, including their ID, name, and email address. The ID is the primary key used to identify each student uniquely. The name and email are required fields, and the email has a UNIQUE constraint to prevent two students from registering with the same email address.

### Courses Table
The courses table stores the courses offered by the school. It contains a course ID and course name. The ID is the primary key, and the course name is required and unique to prevent duplicate course names.

### Enrolments Table
The enrolments table records which students are taking which courses and the grades they receive. It contains its own primary key, student_id, course_id, and grade. The student_id and course_id columns are foreign keys referencing the students and courses tables. The grade may be NULL if it has not yet been assigned. A UNIQUE constraint on student_id and course_id prevents the same student from enrolling in the same course more than once.

## 2. Relationships

The students and enrolments tables have a one-to-many relationship because one student can have several enrolments, but each enrolment belongs to one student. The courses and enrolments tables also have a one-to-many relationship because one course can have many enrolments, but each enrolment refers to one course.

Students and courses have a many-to-many relationship because one student can take several courses, and each course can have several students. The enrolments table acts as a join table connecting students and courses. It is needed to represent these relationships correctly and to store the grade for each student's enrolment in a particular course.

## 3. Recommended Index

The database includes an index named `idx_enrolments_course_id` on the `course_id` column in the enrolments table. This index can improve the performance of queries that find all students taking a particular course. It helps the database locate matching enrolment records more efficiently, especially as the number of records increases.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system. The data has a clear structure, and students, courses, and enrolments are connected through well-defined relationships. SQL supports foreign keys, constraints, JOIN operations, and aggregate functions, which help maintain data integrity and generate reports such as the number of students enrolled in each course. A NoSQL database can be useful for flexible or frequently changing data structures, but a relational database such as SQLite is more suitable for this structured school system.