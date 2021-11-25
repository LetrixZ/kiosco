import dotenv from 'dotenv'
dotenv.config()

// const { MYSQL_URI } = process.env
const MYSQL_URI = "mysql://root:admin@localhost:3306/kiosco"

import knex from 'knex'

export default knex({
  client: 'mysql',
  connection: MYSQL_URI
})