import { InvoiceTable } from '$lib/models/Invoice'
import { Product, ProductTable } from '$lib/models/Product'
import { Table, Column, Model, HasMany, DataType, BelongsTo, ForeignKey, HasOne } from 'sequelize-typescript'

export interface Line {
  price: number
  units: number
  number: number
  product: Product
}

@Table({ tableName: 'lines' })
export class LineTable extends Model implements Line {
  @Column(DataType.DOUBLE)
  price: number

  @ForeignKey(() => InvoiceTable)
  @Column(DataType.INTEGER)
  invoiceId: number

  @BelongsTo(() => InvoiceTable)
  invoice: InvoiceTable

  @Column(DataType.INTEGER)
  units: number

  @ForeignKey(() => ProductTable)
  @Column(DataType.INTEGER)
  productId: number

  @BelongsTo(() => ProductTable, { onDelete: 'CASCADE' })
  product: ProductTable

  @Column(DataType.INTEGER)
  number: number
}