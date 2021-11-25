import dbConnection from "$lib/db"

export async function get(request) {
  try {
    const barcode = request.params.code
    const product = await dbConnection.where('codigoprod', barcode).select().from('producto').first()
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
        error: 'Ha ocurrido un error'
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