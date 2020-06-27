import "reflect-metadata"
import knex from "knex"
import { Container } from "typedi"
import { v4 } from "uuid"
import dotenv from "dotenv"
import {
  ASYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
  EventBusProvider,
  SYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
} from "@dddl/eda"
import { CQ_BUS_DI_TOKEN } from "@dddl/cqrs"
import { EVENT_BUS_DI_TOKEN } from "@dddl/eda"
import {
  QUESTION_REPOSITORY_DI_TOKEN,
  QuestionRepository as IQuestionRepository,
} from "modules/faq/domain/repository"
import { QuestionRepository } from "apps/common/adapters/dal/question-repository"
import { QuestionByWidgetUserAPI } from "modules/faq/export/userApi"
import { knexSnakeCaseMappers } from "@dddl/dal-knex"
import { NestFactory } from "@nestjs/core"
import { initOrchestratorService } from "modules/orchestrator/export"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"
import { SendNotificationAboutQuestionToAdminUserAPI } from "modules/notification/export/userApi"
import { TgService } from "modules/notification/adapters/tg"
import { Telegraf } from "telegraf"
import {
  CHAT_REPOSITORY_DI_TOKEN,
  ChatRepository as IChatRepository,
} from "modules/notification/application/repositories"
import { ChatRepository } from "apps/common/adapters/dal/chat-repository"
import { SendNotificationAboutQuestionToAdminCommand } from "modules/notification/application/commands/send-notification-about-question-to-admin/command"
import { NOTIFICATION_SENDER_DI_TOKEN } from "modules/notification/application/commands/send-notification-about-question-to-admin"
import {
  KNEX_CONNECTION_DI_TOKEN,
  TX_CONTAINER_DI_TOKEN,
  TxContainer,
} from "@dddl/dal-knex"
import { EventBusInMemoryProvider } from "@dddl/eda-inmemory"
import { ValidationPipe } from "@nestjs/common"
import * as winston from "winston"
import { CQBus } from "@dddl/cqrs-inmemory"
import { InitAppModule } from "apps/main-gql/adapters/api"
import { format } from "winston"
import { LOGGER_DI_TOKEN } from "@dddl/logger"
import { EventBusPublisher } from "@dddl/eda"
import {
  AsyncEventBusProviderSetMetaDecorator,
  AsyncEventBusProviderTransactionDecorator,
  LoggerDecorator,
  SyncEventBusProviderSetMetaDecorator,
  SyncEventBusProviderTransactionDecorator,
  ValidateRequestDecorator,
} from "@dddl/usecase-decorators"
import { KnexTransactionDecorator } from "@dddl/usecase-decorators-knex"

export async function main() {
  // ENV
  dotenv.config()

  // ENV const
  const connectionString = process.env.MAIN_DB_CONNECTION_STRING
  if (!connectionString) {
    throw new Error("Env variable 'MAIN_DB_CONNECTION_STRING' is required")
  }
  const botId = process.env.BOT_ID
  if (!botId) {
    throw new Error("Env variable 'BOT_ID' is required")
  }
  const tgAuthToken = process.env.TG_AUTH_TOKEN
  if (!tgAuthToken) {
    throw new Error("Env variable 'TG_AUTH_TOKEN' is required")
  }

  // Logger
  const logger = winston.createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata(),
      format.json(),
    ),
    transports: [new winston.transports.Console()],
  })
  Container.set({ id: LOGGER_DI_TOKEN, value: logger, global: true })

  // DB
  const pg = knex({
    client: "pg",
    connection: connectionString,
    searchPath: ["knex", "public"],
    ...knexSnakeCaseMappers(),
  })
  Container.set({ id: KNEX_CONNECTION_DI_TOKEN, value: pg, global: true })

  // EDA
  const syncEventBusProvider = new EventBusInMemoryProvider(true, logger)
  const asyncEventBusProvider = new EventBusInMemoryProvider(false, logger)
  // const eventBus: IEventBus = new EventBus(syncEventBusProvider, asyncEventBusProvider)
  Container.set([
    { id: EVENT_BUS_DI_TOKEN, type: EventBusPublisher },
    {
      id: SYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
      factory: (): EventBusProvider => syncEventBusProvider.fork(),
    },
    {
      id: ASYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
      factory: (): EventBusProvider => asyncEventBusProvider.fork(),
    },
  ])

  // CQRS
  const cqBus = new CQBus(logger)
  Container.set([{ id: CQ_BUS_DI_TOKEN, value: cqBus, global: true }])

  // Repos
  const txContainer = new TxContainer()
  Container.set({
    type: TxContainer,
    id: TX_CONTAINER_DI_TOKEN,
  })

  const questionRepo: IQuestionRepository = new QuestionRepository(v4(), pg, txContainer)
  Container.set({
    type: QuestionRepository,
    id: QUESTION_REPOSITORY_DI_TOKEN,
  })

  const chatRepo: IChatRepository = new ChatRepository(v4(), pg, txContainer)
  Container.set({
    type: ChatRepository,
    id: CHAT_REPOSITORY_DI_TOKEN,
  })

  // UseCases
  // TODO. Turn on
  cqBus.use(LoggerDecorator)
  cqBus.use(
    ValidateRequestDecorator,
    // (cqName: string, req: UseCaseRequest<any, any, any>) =>
    //   req.data.constructor.name === QuestionByWidgetCommand.name ||
    //   cqName === QuestionByWidgetCommand.name,
  )
  cqBus.use(AsyncEventBusProviderSetMetaDecorator)
  cqBus.use(AsyncEventBusProviderTransactionDecorator)
  cqBus.use(KnexTransactionDecorator)
  cqBus.use(SyncEventBusProviderSetMetaDecorator)
  cqBus.use(SyncEventBusProviderTransactionDecorator)

  // End
  // ...

  // Subscribe CQRS commands
  cqBus.subscribe(
    QuestionByWidgetCommand,
    QuestionByWidgetUserAPI,
    ({ use, useAfter, useBefore, replace, deactivate }) => {
      useBefore(AsyncEventBusProviderSetMetaDecorator, ValidateRequestDecorator)
      // Validation -> Validation -> Async -> ... -> SyncEventBusProviderTransactionDecorator
      replace(ValidateRequestDecorator, AsyncEventBusProviderSetMetaDecorator)
      // Async -> Validation -> Async -> ... -> SyncEventBusProviderTransactionDecorator
      deactivate(AsyncEventBusProviderSetMetaDecorator)
      // Validation -> ... -> SyncEventBusProviderTransactionDecorator
      useAfter(ValidateRequestDecorator, AsyncEventBusProviderSetMetaDecorator)
      // Validation -> Async -> ... -> SyncEventBusProviderTransactionDecorator
      deactivate(SyncEventBusProviderTransactionDecorator)
      // Validation -> Async -> ...
      use(SyncEventBusProviderTransactionDecorator)
      // Validation -> Async -> ... -> SyncEventBusProviderTransactionDecorator
    },
  )
  cqBus.subscribe(
    SendNotificationAboutQuestionToAdminCommand,
    SendNotificationAboutQuestionToAdminUserAPI,
  )

  // Init Tg bot and service
  const bot = new Telegraf(botId)
  const tgService = new TgService(bot, chatRepo, tgAuthToken)
  Container.set({
    id: NOTIFICATION_SENDER_DI_TOKEN,
    value: tgService,
    global: true,
  })

  // Orchestration
  initOrchestratorService(syncEventBusProvider, asyncEventBusProvider)

  // Start application
  tgService.launch()
  const app = await NestFactory.create(InitAppModule(cqBus))
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(logger)
  await app.listen(process.env.PORT || 3000)
}

main()
