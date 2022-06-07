import { pathResolve } from "@/utils"

require("dotenv").config({ path: pathResolve(process.cwd(), "config", ".env") })

export const isDev = process.env.NODE_ENV === "dev"
export const isProd = !isDev
export const PORT = Number(process.env.PORT) || 54000
export const dbPath = process.env.DB_PATH || "db"
