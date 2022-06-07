import express from "express"
import Controller from "@/modules/Controller"

const router = express.Router()

router.post("/accounts", Controller.createAccount.bind(Controller))

// In a real situation :id shouldn't exist, isLoggedIn middleware should provide something like req.accountId

router.patch("/accounts/:id/deposit", Controller.isLoggedIn, Controller.transaction.bind(Controller))
router.patch("/accounts/:id/withdraw", Controller.isLoggedIn, Controller.transaction.bind(Controller))

// Only deposit or withdraw are creating a transaction, but in real life,
// everything including blocking of an account or a balance checking should be encountered as a transaction

router.get("/accounts/:id/balance", Controller.isLoggedIn, Controller.checkBalance.bind(Controller))

router.patch("/accounts/:id/block", Controller.isLoggedIn, Controller.changeAvailability.bind(Controller))
router.patch("/accounts/:id/activate", Controller.isLoggedIn, Controller.changeAvailability.bind(Controller))

router.get("/transactions/:accountId", Controller.isLoggedIn, Controller.getTransactions.bind(Controller))

export default router
