import { ErrorRequestHandler, NextFunction } from "express"
import { ClientRequest, ServerResponse } from "@/types"

export const notFoundHandler = (_req: ClientRequest, _res: ServerResponse, next: NextFunction) => {
  next({ status: 404 })
}

const errorHandler: ErrorRequestHandler = (err, _req, res: ServerResponse, _next: NextFunction) => {
  console.error(err)

  return res.status(err.status || 500).send({
    status: "error",
    errors: [err],
    msg: err.status === 404 ? "Resource wasn't found" : "Internal server error"
  })
}

export default errorHandler
