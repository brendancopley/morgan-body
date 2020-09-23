import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import IDriver from "../interfaces/IDriver"
import { MiddlewareFunc } from "../types/MiscTypes"

class FastifyDriver implements IDriver {
  request: FastifyRequest
  reply: FastifyReply

  constructor(request: FastifyRequest, reply: FastifyReply) {
    this.request = request
    this.reply = reply
  }

  requestHeaders = () => this.request.headers
  responseHeaders = () => this.reply.getHeaders()

  requestBody = () => this.request.body
  responseBody = () => null

  userAgent = () => this.request.headers["user-agent"] || "unknown"
  ip = () => this.request.ip
}

const registerMiddleware: MiddlewareFunc = (app: FastifyInstance, trigger) => {
  app.addHook("onSend", (req, reply, payload: string, next) => {
    const driver = new FastifyDriver(req, reply)
    driver.responseBody = () => JSON.parse(payload)
    trigger(driver)

    next()
  })
}

export default registerMiddleware