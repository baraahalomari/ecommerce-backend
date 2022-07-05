'use strict';
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (error) {
    res.status(401).json({ message: "You are not authorized to view this content" });
  }
};