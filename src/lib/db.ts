import dotenv from 'dotenv'
dotenv.config()

const { MYSQL_URI, POSTGRES_URI } = process.env

import knex from 'knex'

export default knex({
  client: 'postgres',
  connection: POSTGRES_URI
})