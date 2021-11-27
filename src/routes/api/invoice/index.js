import sequelize from '$lib/db'
import moment from 'moment'
import { InvoiceTable } from '$lib/models/Invoice'
import { LineTable } from '$lib/models/Line'
import { ProductTable } from '$lib/models/Product'
import Sequelize from 'sequelize'

export async function get(request) {
  try {
    const start = request.query.get('start')
    const end = request.query.get('end')
    const invoices = await InvoiceTable.findAll({
      include: [{ model: LineTable, include: [{ model: ProductTable }] }],
      limit: 1000,
      where: {
        date: {
          [Sequelize.Op.gte]: moment(start).toDate(),
          [Sequelize.Op.lte]: moment(end).endOf('day').toDate()
        }
      }
    })
    return {
      status: 200,
      body: JSON.stringify(invoices)
    }
  } catch (e) {
    return {
      status: 500,
      error: e.message
    }
  }
}

export async function post(request) {
  try {
    if (request.body) {
      const { date, lines } = JSON.parse(request.body)
      console.log(date, lines);
      if (date && lines) {
        const transaction = await sequelize.transaction()
        const invoiceRow = await InvoiceTable.create({ date }, { transaction })
        const invoiceId = invoiceRow.id
        if (invoiceId) {
          for (let line of lines) {
            let { productId, price, units, number } = line
            if (!productId) {
              const pRow = await ProductTable.findOne({ where: { barcode: 'DESCONOCIDO' } })
              productId = pRow.id
            }
            const lineRow = await LineTable.create({ invoiceId, productId, price, units, number }, { transaction })
          }
          console.log('Commit');
          await transaction.commit()
          return {
            status: 200
          }
        } else {
          console.log('Rollback');
          await transaction.rollback()
          return {
            status: 500,
            error: 'Error en la creacion de la factura'
          }
        }
      }
    }
  } catch (e) {
    return {
      status: 500,
      error: e.message
    }
  }
}