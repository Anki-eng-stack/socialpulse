// API/connect.js
import mysql from 'mysql2';

export const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'Sarkar@236',               // or your password
  database: 'mydevify_social'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL via mysql2!');
});
