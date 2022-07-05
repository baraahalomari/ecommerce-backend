const authRouter = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwtGenerator');

// post route for register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    if (!email || !password || !country ||!name) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }
    const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query('INSERT INTO users (name, email, password, country) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, hashedPassword, country]);
    const token = generateToken(newUser.rows[0]);
    res.status(201).json({token});
  }catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// post route for login 

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }
    const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User does not exist' });
    }
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = generateToken(rows[0]);
    res.status(200).json({token});
  }catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
);

module.exports = authRouter;