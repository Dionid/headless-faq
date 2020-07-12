import { setup } from "apps/question-lambda/cmd/app"
import { UseCaseReqMeta } from "@dddl/core/dist/usecase"
import { SecretManagerServiceClient } from "@google-cloud/secret-manager"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"

interface RequestBody {
  content: string
  creator: string
  additional?: Record<string, any>
  meta?: Record<string, any>
}

interface Request {
  body: RequestBody
  method: string
}

const client = new SecretManagerServiceClient()

async function getDBConnectionString(): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: process.env.DB_STRING_SECRET_KEY_NAME,
  })

  if (!version || !version.payload || !version.payload.data) {
    throw new Error("No env to connect to DB!")
  }

  // Extract the payload as a string.
  const payload = version.payload.data.toString()

  // WARNING: Do not print the secret in a production environment - this
  // snippet is showing how to access the secret material.
  console.info(`Payload: ${payload}`)
  return payload
}

export async function createFaqSless(request: Request, response: any, ...rest: any) {
  response.set("Access-Control-Allow-Origin", "*")
  console.log("ENVS: ")
  console.log(process.env)
  console.log("Rest: ")
  console.log(rest)
  console.log("Request: ")
  console.log(request)
  if (request.method === "OPTIONS") {
    // Send responseponse to OPTIONS requests
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    response.set("Access-Control-Allow-Headers", "Content-Type")
    response.set("Access-Control-Max-Age", "3600")
    response.status(204).send("")
    return
  }
  const connectionString = await getDBConnectionString()
  const cqBus = await setup(connectionString)
  const result = await cqBus.handle(
    new QuestionByWidgetCommand(
      request.body.content,
      request.body.creator,
      request.body.additional,
      request.body.meta,
    ),
    new UseCaseReqMeta({ callerId: "" }),
  )
  console.log("Result: ")
  console.log(result)
  if (result.isError()) {
    response.status(400).send(result.error)
    return
  }
  response.status(200).send(result.value)
}

export async function event(event: any, callback: any) {
  callback()
}
