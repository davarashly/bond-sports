import Service from "@/modules/Service"

export const transactionKeys = ["accountId", "transactionId", "value", "transactionDate"] as const

export interface ITransaction {
  accountId: number
  transactionId: number
  value: number
  transactionDate: Date
}

class TransactionService extends Service<ITransaction> {
  constructor() {
    super("transactions.json", "transactionId")
  }

  async getTransaction(id: number) {
    return this.getItem(id)
  }

  async setTransaction(id: number, transaction: ITransaction) {
    return this.setItem(id, transaction)
  }

  async createTransaction(transaction: ITransaction) {
    return this.createItem(transaction)
  }
}

const transactionService = new TransactionService()

export default transactionService
