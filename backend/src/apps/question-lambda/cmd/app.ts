import "reflect-metadata"
import {
  ASYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
  SYNC_EVENT_BUS_PROVIDER_DI_TOKEN,
} from "@dddl/core/dist/eda"
import { CQBus } from "@dddl/core/dist/cqrs-inmemory"
import { Container } from "typedi"
import { CQ_BUS_DI_TOKEN } from "@dddl/core/dist/cqrs"
import { EVENT_BUS_DI_TOKEN } from "@dddl/core/dist/eda"
import {
  QUESTION_REPOSITORY_DI_TOKEN,
  QuestionRepository as IQuestionRepository,
} from "modules/faq/domain/repository"
import { QuestionRepository } from "apps/common/adapters/dal/question-repository"
import { v4 } from "uuid"
import knex from "knex"
import dotenv from "dotenv"
import { QuestionByWidgetUserAPI } from "modules/faq/export/userApi"
import { knexSnakeCaseMappers } from "@dddl/knex/dist/dal"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"
import { TxContainer } from "@dddl/knex/dist/dal"
import { EventBusInMemoryProvider } from "@dddl/core/dist/eda-inmemory"
import * as winston from "winston"
import { LOGGER_DI_TOKEN } from "@dddl/core/dist/logger"
import { EventBusPublisher } from "@dddl/core/dist/eda"

export async function setup(connectionString: string): Promise<CQBus> {
  // ENV
  dotenv.config()

  // Logger
  const logger = winston.createLogger({
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
  Container.set({ id: "knex", value: pg, global: true })

  // EDA
  const syncEventBusProvider = new EventBusInMemoryProvider(true, logger)
  const asyncEventBusProvider = new EventBusInMemoryProvider(false, logger)
  // const eventBus: IEventBus = new EventBus([syncEventBusProvider, asyncEventBusProvider])
  Container.set([
    { id: EVENT_BUS_DI_TOKEN, type: EventBusPublisher },
    { id: SYNC_EVENT_BUS_PROVIDER_DI_TOKEN, factory: syncEventBusProvider.fork },
    { id: ASYNC_EVENT_BUS_PROVIDER_DI_TOKEN, factory: asyncEventBusProvider.fork },
  ])

  // CQRS
  const cqBus = new CQBus(logger)
  Container.set({ id: CQ_BUS_DI_TOKEN, value: cqBus, global: true })

  // Repos
  const txContainer = new TxContainer()
  const aggRepo: IQuestionRepository = new QuestionRepository(v4(), pg, txContainer)
  Container.set({
    type: QuestionRepository,
    id: QUESTION_REPOSITORY_DI_TOKEN,
  })

  cqBus.subscribe(QuestionByWidgetCommand, QuestionByWidgetUserAPI)

  return cqBus
}
