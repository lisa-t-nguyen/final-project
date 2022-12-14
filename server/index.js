require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const app = express();
const pg = require('pg');

app.use(express.json());

app.use(staticMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Add a student POST method

app.post('/api/students', (req, res, next) => {
  const { firstName, lastName, dateOfBirth, yearStart, yearEnd, gradeLevel } = req.body;
  if (!firstName || !lastName || !dateOfBirth || !yearStart || !yearEnd || !gradeLevel) {
    res.status(400).json({
      error: 'Input fields are required values'
    });
    return;
  }
  const studentYearSql = `
  insert into "studentGradeYears" ("yearStart", "yearEnd", "gradeLevel")
  values ($1, $2, $3)
  returning *
  `;
  const studentYearParams = [yearStart, yearEnd, gradeLevel];
  db.query(studentYearSql, studentYearParams)
    .then(result => {
      const [studentGradeYear] = result.rows;

      const studentSql = `
      insert into "students" ("firstName", "lastName", "dateOfBirth", "studentGradeYearId")
      values ($1, $2, $3, $4)
      returning*
      `;
      const studentParams = [firstName, lastName, dateOfBirth, studentGradeYear.studentGradeYearId];

      db.query(studentSql, studentParams)
        .then(studentResult => {
          const [student] = studentResult.rows;
          res.status(201).json({
            student,
            studentGradeYear
          });
        });
    })
    .catch(err => next(err));
});

// GET students search results query
app.get('/api/students', (req, res, next) => {
  const { name } = req.query;
  const sql = `
  select *
  from "students"
  where "firstName" || ' ' || "lastName" ilike $1
  `;

  const params = [`%${name}%`];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

// Add attendance data POST method
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
