import express from "express"
import routes from "@/router"
import errorHandler, { notFoundHandler } from "@/utils/errorHandler"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
