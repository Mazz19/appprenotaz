const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = 'your-secret-key'; // Usa un segreto più sicuro

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const usersFile = './data/users.json';
const bookingsFile = './data/bookings.json';
const adminsFile = './data/admins.json';

// Inizializza i file se non esistono
fs.ensureFileSync(usersFile);
fs.ensureFileSync(bookingsFile);
fs.ensureFileSync(adminsFile);

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const users = await fs.readJson(usersFile, { throws: false }) || [];
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    await fs.writeJson(usersFile, users);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio dei dati' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admins = await fs.readJson(adminsFile, { throws: false }) || [];
    const admin = admins.find(admin => admin.username === username);

    if (!admin) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const token = jwt.sign({ username: admin.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel login' });
  }
});

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/bookings', async (req, res) => {
  const { name, date, time } = req.body;
  try {
    const bookings = await fs.readJson(bookingsFile, { throws: false }) || [];
    const booking = { id: bookings.length + 1, name, date, time };
    bookings.push(booking);
    await fs.writeJson(bookingsFile, bookings);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio dei dati' });
  }
});

app.get('/api/admin/bookings', authenticateAdmin, async (req, res) => {
  try {
    const bookings = await fs.readJson(bookingsFile, { throws: false }) || [];
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

app.delete('/api/admin/bookings/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    let bookings = await fs.readJson(bookingsFile, { throws: false }) || [];
    bookings = bookings.filter(booking => booking.id !== parseInt(id));
    await fs.writeJson(bookingsFile, bookings);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione dei dati' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
