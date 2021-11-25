export interface Prod {
  Id: number;
  nombre: string;
  codigoprod: string;
  preciofinal: number;
  descripcion: string;
  unidades: number;
}

import sequelize from "$lib/db"
import Sequelize from "sequelize"

export const ProdTable = sequelize.define("producto", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  nombre: {
    type: Sequelize.STRING
  },
  codigoprod: {
    type: Sequelize.INTEGER,
    unique: true
  },
  preciocosto: {
    type: Sequelize.DOUBLE,
  },
  preciofinal: {
    type: Sequelize.DOUBLE,
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  stock: {
    type: Sequelize.INTEGER
  }
}, {tableName:'producto', createdAt: false, updatedAt: false})

ProdTable.sync()