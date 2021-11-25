import { ProdTable } from "$lib/models"

export async function get(request) {
  try {
    const barcode = request.params.code
    const product = await ProdTable.findOne({ where: { codigoprod: barcode } })
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

}

export async function put(request) {

}

export async function del(request) {

}