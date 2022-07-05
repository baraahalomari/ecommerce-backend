const favRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// add To favRouter
favRouter.post('/', authorization, async(req, res) => {

  try {
    const { id, name, user_id,selectedfile,price ,description,status,category} = req.body;
    const {rows} = await pool.query('INSERT INTO favorites (id, name, user_id,selectedfile,price,description,status,category) VALUES ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *', [id, name, user_id,selectedfile,price,description,status,category]);
    res.json(rows[0]);
    
  } catch (err) {
 
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all favRouter
favRouter.get('/', authorization, async(req, res) => {
  try {
    const {user_id} = req.query;
    const {rows} = await pool.query('SELECT * FROM favorites WHERE user_id = $1', [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);

// remove from favorites
favRouter.delete('/:id', authorization, async(req, res) => {
  try {
    const {id} = req.params;
    const {rows} = await pool.query('DELETE FROM favorites WHERE id = $1', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);

module.exports = favRouter;