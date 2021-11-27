import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript'
import { Line, LineTable } from '$lib/models/Line'

interface Invoice {
  date: Date
  lines: Line[]
}

@Table({tableName: 'invoices'})
export class InvoiceTable extends Model implements Invoice {
  @Column(DataType.DATE)
  date: Date

  @HasMany(() => LineTable)
  lines: LineTable[]
}