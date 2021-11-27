import fs from 'fs/promises'
import sequelize from '$lib/db'
import { LineTable } from '$lib/models/Line'
import { InvoiceTable } from '$lib/models/Invoice'
import { ProductTable } from '$lib/models/Product'

async function insertProducts() {
  console.log('PRODUCTS INSERT STARTED');
  await ProductTable.sync({ force: true })
  const items = JSON.parse((await fs.readFile('db/producto_202111261255.json')).toString())
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
  const invoices = JSON.parse((await fs.readFile('db/factura_202111261255.json')).toString()).factura
  const lines = JSON.parse((await fs.readFile('db/linea_202111261255.json')).toString()).linea
  const products = JSON.parse((await fs.readFile('db/producto_202111261255.json')).toString()).producto
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
        newProductId = productDB.id
      }
      line.producto = newProductId
      await LineTable.create({ price: line.preciolinea, invoiceId: invoiceRow.id, units: line.unidad, productId: line.producto, number: line.nrolinea })
    }
  }
  console.log('INVOICES INSERT FINISHED');
}

export async function get(request) {
  // await insertProducts()
  // await insertInvoicesLines()
  try {
    return {
      status: 200,
      body: 'OK'
    }
  } catch (e) {
    return {
      status: 500,
      body: { 'msg': e }
    }
  }
}
