import { ProdTable } from "$lib/models"
import Sequelize from "sequelize"

export async function get(request) {
  try {
    const searchQuery = request.query.get('q')
    if (searchQuery) {
      const results = await ProdTable.findAll({
        where: {
          nombre: {
            [Sequelize.Op.iLike]: `%${searchQuery}%`
          }
        }
      })
      return {
        status: 200,
        body: results
      }
    }
    const products = await ProdTable.findAll()
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