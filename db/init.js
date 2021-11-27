import dotenv from 'dotenv'
import fs from 'fs/promises'
import pkg from 'sequelize';
const { Model, DataTypes, Sequelize } = pkg;
dotenv.config()

const { POSTGRES_URI } = process.env

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres',
  logging: false
})

class ProductTable extends Model { }

ProductTable.init({
  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  cost: {
    type: DataTypes.DOUBLE
  },
  stock: {
    type: DataTypes.INTEGER
  }
}, { sequelize, tableName: 'products' })

const InvoiceTable = sequelize.define('invoice', {
  date: {
    type: DataTypes.DATE
  }
}, { tableName: 'invoices' })

class LineTable extends Model { }

LineTable.init({
  price: {
    type: DataTypes.DOUBLE,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'invoices',
      key: 'id'
    }
  },
  units: {
    type: DataTypes.INTEGER
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  number: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'line',
  tableName: 'lines'
})

// LineTable.belongsTo(InvoiceTable, { foreignKey: 'invocdeId' })
LineTable.belongsTo(ProductTable, { onDelete: 'CASCADE', foreignKey: 'productId' })
InvoiceTable.hasMany(LineTable)

async function insertProducts() {
  console.log('PRODUCTS INSERT STARTED');
  // await ProductTable.sync({ force: true })
  const items = JSON.parse((await fs.readFile('db/producto.json')).toString())
  const mapped = items.producto.map(it => {
    return {
      barcode: it.codigoprod,
      name: it.nombre,
      description: it.descripcion,
      cost: it.preciocosto,
      price: it.preciofinal,
      stock: it.stock
    }
  })
  const filtered = mapped.filter(it => it.barcode != "07794600004317" && it.barcode != " 7790290001179")
  // let invalidItems = mapped.filter(x => !filtered.includes(x));
  // fs.writeFile('db/invalid.json', JSON.stringify(invalidItems))
  const lookup = filtered.reduce((a, e) => {
    a[Number(e.barcode)] = ++a[Number(e.barcode)] || 0;
    return a;
  }, {});
  console.log(filtered.filter(e => lookup[e.barcode]));
  await ProductTable.sync({ force: true })
  await ProductTable.bulkCreate(filtered);
  console.log('PRODUCTS INSERT FINISHED');
}

async function insertInvoicesLines() {
  console.log('INVOICES INSERT STARTED');
  await InvoiceTable.sync({ force: true })
  await LineTable.sync({ force: true })
  const invoices = JSON.parse((await fs.readFile('db/factura.json')).toString()).factura
  const lines = JSON.parse((await fs.readFile('db/linea.json')).toString()).linea
  const products = JSON.parse((await fs.readFile('db/producto.json')).toString()).producto
  for (let invoice of invoices) {
    const invoiceRow = await InvoiceTable.create({ date: invoice.fecha })
    const invoiceLines = lines.filter(it => it.factura === invoice.Id)
    for (let line of invoiceLines) {
      let newProductId;
      const lineProducts = products.filter(it => it.Id === line.producto)
      for (let product of lineProducts) {
        if (product.codigoprod === "07794600004317") product.codigoprod = "7794600004317"
        if (product.codigoprod === " 7790290001179") product.codigoprod = "7790290001179"
        const productDB = await ProductTable.findOne({ where: { barcode: product.codigoprod } })
        if (productDB) {
          newProductId = productDB.id
        }
      }
      line.producto = newProductId
      await LineTable.create({ price: line.preciolinea, invoiceId: invoiceRow.id, units: line.unidad, productId: line.producto, number: line.nrolinea })
    }
  }
  console.log('INVOICES INSERT FINISHED');
}

async function init() {
  await insertProducts()
  await insertInvoicesLines()
}

init()