require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const port = process.env.PORT || 8080;
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const favRouter = require('./routes/fav');
const commentsRouter = require('./routes/comments');


// Middleware
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan());


// routes
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/fav', favRouter);
app.use('/api/comments', commentsRouter);

// listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});