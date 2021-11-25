import dbConnection from "$lib/db"

export async function get(request) {
  try {
    const searchQuery = request.query.get('q')
    if (searchQuery) {
      const results = await dbConnection('producto').where('nombre', 'like', `%${searchQuery}%`)
      console.log(results.length);
      return {
        status: 200,
        body: results
      }
    }
    const products = await dbConnection.select().from('producto')
    return {
      status: 200,
      body: products
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