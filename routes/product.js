const productRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// get all products
productRouter.get('/', authorization, (req, res) => {
  try {
    pool.query('SELECT * FROM products', (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).json(results.rows);
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// add a new product
productRouter.post('/', authorization, async (req, res) => {
  try {
    const { name, price, description, selectedFile, category, user_id } = req.body;
    console.log(category)
    const { rows } = await pool.query('INSERT INTO products (name, price, description, selectedfile,category,user_id) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *', [name, price, description, selectedFile, category, user_id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product
productRouter.delete('/:id', authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
  
    if (user_id == req.user.id) {
      await pool.query('DELETE FROM products WHERE id = $1 ', [id]);
      res.status(200).end();
    }else {
      res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// update a product
productRouter.put('/:id', authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, selectedfile, category, user_id } = req.body;

    if (user_id == req.user.id) {

    const { rows } = await pool.query('UPDATE products SET name = $1, price = $2, description = $3, selectedfile = $4,category = $5,user_id = $6 WHERE id = $7 RETURNING *', [name, price, description, selectedfile, category, user_id, id]);
    res.status(200).json(rows[0]);
    }else {
      res.status(403).json({ message: 'You are not authorized to update this product' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });


  }

})

module.exports = productRouter;