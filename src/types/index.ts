import { Request, Response } from "express"

export type ServerResponse<ResponseData = any> = Response<{
  status: "success" | "fail" | "error"
  msg: string
  errors?: any[]
  data?: ResponseData
}>

export type ClientRequest<RequestBody = any> = Omit<Request, "body"> & { body: RequestBody }
