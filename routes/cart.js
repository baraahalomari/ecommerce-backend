const cartRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// add to cartRouter
cartRouter.post('/', authorization, async(req, res) => {
  try {
    const { product_id, name,quantity, user_id,selectedfile,price ,total_price} = req.body;
    console.log({product_id, name,quantity, user_id,price});
    const {rows} = await pool.query('SELECT * FROM cart WHERE id = $1 AND user_id = $2', [product_id, user_id]);
    if(rows.length > 0){
     
      // update quantity and price with new quantity and price
      const {rows} = await pool.query('UPDATE cart SET quantity = $1, total_price = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [quantity, total_price, product_id, user_id]);
      res.status(200).json(rows[0]);
    }
    else{
      const {rows} = await pool.query('INSERT INTO cart (id, item_name, quantity, user_id,selectedfile,item_price,total_price) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING *', [product_id, name, quantity, user_id,selectedfile,price,price]);
      res.status(201).json(rows[0]);
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
}
);

// get items from the cartRouter
cartRouter.get('/', authorization, async(req, res) => {
  try {
    const {user_id} = req.query;
    const {rows} = await pool.query('SELECT * FROM cart WHERE user_id = $1', [user_id]);
    res.status(200).json(rows);
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
}
);

// remove item from the card
cartRouter.delete('/:id', authorization, async(req, res) => {
  try {
    const {id} = req.params;
    const {rows} = await pool.query('DELETE FROM cart WHERE id = $1', [id]);
    res.status(200).json({message: 'Item deleted'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
});


module.exports = cartRouter;