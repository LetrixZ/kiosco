import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv'
import { ProductTable } from './models/Product';
import { InvoiceTable } from './models/Invoice';
import { LineTable } from './models/Line';
dotenv.config()

const { POSTGRES_URI } = process.env

const sequelize = new Sequelize(POSTGRES_URI, {
  logging: false, dialectOptions: {
    useUTC: false, // for reading from database
  },
  timezone: '-03:00',
})

sequelize.addModels([ProductTable, InvoiceTable, LineTable]);

// LineTable.sync({alter: true})

export default sequelize