import accountService, { accountKeys, IAccount } from "@/models/AccountService"
import personService, { IPerson, personKeys } from "@/models/PersonService"
import { ClientRequest, ServerResponse } from "@/types"
import { NextFunction } from "express"
import transactionService, { ITransaction } from "@/models/TransactionService"
import { cleanArray } from "@/utils"

class ControllerService {
  asyncHandler<T extends ClientRequest, U extends ServerResponse>(callback: (req: T, res: U, next: NextFunction) => Promise<any>) {
    return function (req: T, res: U, next: NextFunction) {
      return callback(req, res, next).catch(next)
    }
  }

  isLoggedIn(_req: ClientRequest, _res: ServerResponse, next: NextFunction) {
    // if (!req.token.valid()) throw new Error("Not logged in") // Status 403

    next()
  }

  async createAccount(req: ClientRequest<{ newAccount: Omit<IAccount, "accountId" | "personId"> & { personId?: IAccount["personId"] }; newPerson: Omit<IPerson, "personId"> }>, res: ServerResponse<IAccount>, next: NextFunction) {
    return this.asyncHandler<typeof req, typeof res>(async (req, res, _next) => {
      const { newAccount, newPerson } = req.body

      const localAccountKeys = cleanArray<Exclude<typeof accountKeys[number], "accountId" | "personId" | "balance" | "createDate">[]>(accountKeys, ["accountId", "personId", "balance", "createDate"])
      const localPersonKeys = cleanArray<Exclude<typeof personKeys[number], "personId">[]>(personKeys, ["personId"])

      for (const accountKey of localAccountKeys)
        if (!newAccount || newAccount[accountKey].toString().trim() === "")
          return res.status(400).send({
            status: "fail",
            msg: "Account is missing details"
          })

      for (const personKey of localPersonKeys)
        if (!newPerson || newPerson[personKey].toString().trim() === "")
          return res.status(400).send({
            status: "fail",
            msg: "Person is missing details"
          })

      newPerson.birthDate = new Date(newPerson.birthDate)

      const createdPerson = await personService.createPerson(<IPerson>newPerson)

      newAccount.personId = createdPerson.personId
      newAccount.balance = newAccount.balance || 0

      const newSavedAccount = await accountService.createAccount(<IAccount>newAccount)

      return res.send({ msg: "Successfully created an account", data: newSavedAccount, status: "success" })
    })(req, res, next)
  }

  transaction(req: ClientRequest<{ depositAmount?: number; withdrawAmount?: number }>, res: ServerResponse<{ balance: IAccount["balance"] }>, next: NextFunction) {
    return this.asyncHandler<typeof req, typeof res>(async (req, res, _next) => {
      const accountId = Number(req.params.id) || -1

      const url = req.route.path

      const action: "withdraw" | "deposit" = url.includes("withdraw") ? "withdraw" : "deposit"
      const key: "withdrawAmount" | "depositAmount" = action === "withdraw" ? "withdrawAmount" : "depositAmount"

      const moneyAmount = Number(req.body[key]) || 0

      if (moneyAmount <= 0)
        return res.status(400).send({
          status: "fail",
          msg: "You should enter the amount of money to " + action
        })

      const account = await accountService.getAccount(accountId)

      if (!account)
        return res.status(404).send({
          status: "fail",
          msg: `Account with id \`${accountId}\` wasn't found`
        })

      account.balance = key === "withdrawAmount" ? account.balance - moneyAmount : account.balance + moneyAmount

      await accountService.setAccount(accountId, account)

      await transactionService.createTransaction(<ITransaction>{
        accountId,
        value: moneyAmount * (action === "withdraw" ? -1 : 1),
        transactionDate: new Date()
      })

      return res.send({
        status: "success",
        msg: action.slice(0, 1).toUpperCase() + action.slice(1, action.length).toLowerCase() + " was successful",
        data: { balance: account.balance }
      })
    })(req, res, next)
  }

  changeAvailability(req: ClientRequest<{ depositAmount?: number; withdrawAmount?: number }>, res: ServerResponse, next: NextFunction) {
    return this.asyncHandler<typeof req, typeof res>(async (req, res, _next) => {
      const accountId = Number(req.params.id) || -1

      const url = req.route.path

      const action: "block" | "activate" = url.includes("block") ? "block" : "activate"
      const activeFlag = action === "activate"

      const account = await accountService.getAccount(accountId)

      if (!account)
        return res.status(404).send({
          status: "fail",
          msg: `Account with id \`${accountId}\` wasn't found`
        })

      if (activeFlag === account.activeFlag)
        return res.status(400).send({
          status: "fail",
          msg: `Account with id \`${accountId}\` was already ${activeFlag ? "active" : "inactive"}`
        })

      account.activeFlag = activeFlag

      await accountService.setAccount(accountId, account)

      return res.send({
        status: "success",
        msg: `Account with id \`${accountId}\` was successfully ${activeFlag ? "activated" : "deactivated"}`
      })
    })(req, res, next)
  }

  checkBalance(req: ClientRequest<{ depositAmount?: number; withdrawAmount?: number }>, res: ServerResponse<{ balance: number }>, next: NextFunction) {
    return this.asyncHandler<typeof req, typeof res>(async (req, res, _next) => {
      const accountId = Number(req.params.id) || -1

      const account = await accountService.getAccount(accountId)

      if (!account)
        return res.status(404).send({
          status: "fail",
          msg: `Account with id \`${accountId}\` wasn't found`
        })

      return res.send({
        status: "success",
        msg: `Balance for account with id \`${accountId}\``,
        data: { balance: account.balance }
      })
    })(req, res, next)
  }

  getTransactions(req: ClientRequest, res: ServerResponse<ITransaction[]>, next: NextFunction) {
    return this.asyncHandler<typeof req, typeof res>(async (req, res, _next) => {
      const accountId = Number(req.params.accountId) || -1

      const account = await accountService.getAccount(accountId)

      if (!account)
        return res.status(404).send({
          status: "fail",
          msg: `Account with id \`${accountId}\` wasn't found`
        })

      const transactions = await transactionService.getData()
      const accountTransactions: ITransaction[] = []

      for (const transaction of Object.values(transactions)) if (transaction.accountId === accountId) accountTransactions.push(transaction)

      return res.send({
        status: "success",
        data: accountTransactions.length ? accountTransactions.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()) : undefined,
        msg: accountTransactions.length ? `Transaction List for account with id \`${accountId}\`` : `Account with id \`${accountId}\` didn't perform any transaction`
      })
    })(req, res, next)
  }
}

const Controller = new ControllerService()

export default Controller
