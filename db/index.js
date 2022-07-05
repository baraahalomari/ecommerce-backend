const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '123456',
  port: 5433,
})
module.exports = {
  query: (text, params) => pool.query(text, params),
}