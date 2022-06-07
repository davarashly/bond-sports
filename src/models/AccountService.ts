import Service from "@/modules/Service"

export const accountKeys = ["accountId", "personId", "balance", "dailyWithdrawalLimit", "activeFlag", "accountType", "createDate"] as const

export interface IAccount {
  accountId: number
  personId: number
  balance: number
  dailyWithdrawalLimit: number
  activeFlag: boolean
  accountType: number
  createDate: Date
}

class AccountService extends Service<IAccount> {
  constructor() {
    super("accounts.json", "accountId")
  }

  async getAccount(id: number) {
    return this.getItem(id)
  }

  async setAccount(id: number, account: IAccount) {
    return this.setItem(id, account)
  }

  async createAccount(account: IAccount) {
    account.createDate = new Date()

    return this.createItem(account)
  }
}

const accountService = new AccountService()

export default accountService
