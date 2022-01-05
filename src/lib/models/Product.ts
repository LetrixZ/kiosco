import { Table, Column, Model, HasMany, DataType, BelongsTo, ForeignKey, HasOne, Unique, AllowNull } from 'sequelize-typescript'

interface _Product {
  id?: number
  barcode: string
  name: string
  description?: string
  price: number
  cost?: number
  stock?: number
}

@Table({ tableName: 'products' })
export class ProductTable extends Model implements _Product {
  @Column(DataType.STRING)
  name: string

  @AllowNull
  @Column(DataType.STRING)
  description: string

  @Unique
  @Column(DataType.STRING)
  barcode: string

  @Column(DataType.DOUBLE)
  price: number

  @Column(DataType.DOUBLE)
  cost: number

  @Column(DataType.INTEGER)
  stock: number
}

export interface Product extends _Product {
  units?: number
}