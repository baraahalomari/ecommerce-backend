const cartRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// add to cartRouter
cartRouter.post('/', authorization, async(req, res) => {
  try {
    const { product_id,quantity, user_id,total_price} = req.body;
    console.log({product_id,quantity, user_id});
    // check if the product in the cart is already
    const {rows} = await pool.query('SELECT * FROM cart WHERE product_id = $1 and user_id = $2', [product_id,user_id]);
    if(rows.length > 0){
      // if it is, update the quantity
      const {rows} = await pool.query('UPDATE cart SET quantity = $1, total_price = $2 WHERE product_id = $3 and user_id = $4 RETURNING *', [quantity,total_price,product_id,user_id]);
      res.status(200).json(rows[0]);
    }
    else{
      // if it is not, add it to the cart
      const {rows} = await pool.query('INSERT INTO cart ( product_id, quantity, user_id, total_price) VALUES ($1, $2, $3, $4)', [product_id,quantity,user_id,total_price]);
      res.status(201).json(rows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
    
}
);

// get items from the cartRouter
cartRouter.get('/', authorization, async(req, res) => {

  try {
    const {user_id} = req.query;
    const {rows} = await pool.query('SELECT id,name as item_name,price as item_price,quantity,total_price,selectedfile,cart.user_id FROM products JOIN cart ON products.id = cart.product_id and cart.user_id=$1;', [user_id]);
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
    const {rows} = await pool.query('DELETE FROM cart WHERE product_id = $1', [id]);
    res.status(200).json({message: 'Item deleted'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
});


module.exports = cartRouter;