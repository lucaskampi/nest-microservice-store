export class Purchase {
  id!: number
  orderId?: number | null
  preparationTime?: number | null
  destinationAddress!: string
  deliveryDate?: Date | null
  voucher?: number | null
  state!: string
  createdAt!: Date
  updatedAt!: Date
}
