const favRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// add To favRouter
favRouter.post('/', authorization, async(req, res) => {

  try {
    const {  user_id, product_id} = req.body;
    const newFav = await pool.query('INSERT INTO favorites ( user_id, product_id) VALUES ($1, $2)', [ user_id, product_id]);
    res.status(201).json(newFav.rows[0]);
    
  } catch (err) {
 
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all favRouter
favRouter.get('/', authorization, async(req, res) => {
  try {
    const {user_id} = req.query;
    const {rows} = await pool.query('SELECT * FROM products JOIN favorites ON products.id = favorites.product_id and favorites.user_id = $1;', [user_id]);
    res.status(200).json(rows);
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