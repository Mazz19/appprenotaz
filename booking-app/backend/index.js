const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'your-username',
  host: 'localhost',
  database: 'bookingdb',
  password: 'your-password',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/bookings', async (req, res) => {
  const { name, date, time } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (name, date, time) VALUES ($1, $2, $3) RETURNING *',
      [name, date, time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
