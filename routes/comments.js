const commentsRouter = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/acl');

// post a comment
commentsRouter.post('/', authorization, async(req, res) => {
  try {
    const {product_id, user_name, comment} = req.body;
    console.log(req.body);
    const {rows} = await pool.query('INSERT INTO comments (product_id, user_name, comment) VALUES ($1, $2, $3) RETURNING *', [product_id, user_name, comment]);
    res.status(201).json(rows[0]);
  }catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
});

// get comments
commentsRouter.get('/', authorization, async(req, res) => {
  try {
    const {product_id} = req.query;
    const {rows} = await pool.query('SELECT * FROM comments WHERE product_id = $1', [product_id]);
    res.status(200).json(rows);
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
});


module.exports = commentsRouter;