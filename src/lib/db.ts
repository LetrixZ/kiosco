import dotenv from 'dotenv'
dotenv.config()

const { MYSQL_URI, POSTGRES_URI, POSTGRES_URI_ELEPHANT } = process.env

import { Sequelize } from 'sequelize';
export default new Sequelize(POSTGRES_URI)