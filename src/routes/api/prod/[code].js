import sequelize from '$lib/db'
import { ProductTable } from '$lib/models/Product'

export async function get(request) {
  try {
    const barcode = request.params.code
    const product = await ProductTable.findOne({ where: { barcode } })
    if (product) {
      return {
        status: 200,
        body: product
      }
    } else {
      return {
        status: 404,
        body: { 'message': `Producto con código ${barcode} no encontrado` }
      }
    }
  } catch (e) {
    return {
      status: 500,
      body: {
        error: 'Ha ocurrido un error',
        msg: e
      }
    }
  }
}

export async function post(request) {
  try {
    if (request.body) {
      const { name, description, cost, price, barcode, stock } = JSON.parse(request.body)
      const row = await ProductTable.create({ name, description, cost, price, barcode, stock })
      return {
        status: 200,
        body: { data: row.toJSON() }
      }
    }
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      body: {
        error: 'Ha ocurrido un error',
        msg: e
      }
    }
  }
}

export async function put(request) {
  try {
    if (request.body) {
      const { name, description, cost, price, barcode, stock } = JSON.parse(request.body)
      const row = await ProductTable.findOne({ where: { barcode: request.params.code } })
      if (row) {
        row.name = name
        row.description = description
        row.cost = cost
        row.price = price
        row.stock = stock
        await row.save()
      }
      return {
        status: 200,
        body: { msg: `${row.barcode} updated`, data: row.toJSON() }
      }
    } else {
      return {
        status: 300,
        body: { msg: 'Body missing' }
      }
    }
  } catch (e) {
    return {
      status: 500,
      body: { 'error': e }
    }
  }
}

export async function del(request) {
  try {
    const row = await ProductTable.findOne({ where: { barcode: request.params.code } })
    if (row) {
      row.destroy()
    }
    return {
      status: 200,
      body: { 'msg': `${row.barcode} deleted` }
    }
  } catch (e) {
    return {
      status: 500,
      body: { 'error': e }
    }
  }
}