import { CommandHandler, CommandRequest } from "@dddl/core/dist/cqrs"
import {
  QUESTION_REPOSITORY_DI_TOKEN,
  QuestionRepository,
} from "modules/faq/domain/repository"
import { EitherResultP, Result } from "@dddl/core/dist/rop"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"
import { Question } from "modules/faq/domain/aggregates/question/question.aggregate"
import { Inject } from "typedi"
import { EVENT_BUS_DI_TOKEN, EventBus } from "@dddl/core/dist/eda"
import { WidgetQuestionCreated } from "modules/faq/application/events"
import { v4 } from "uuid"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"

export class QuestionByWidget implements CommandHandler<QuestionByWidgetCommand> {
  constructor(
    @Inject(QUESTION_REPOSITORY_DI_TOKEN) private questionRepository: QuestionRepository,
    @Inject(EVENT_BUS_DI_TOKEN) private eventBus: EventBus,
  ) {}

  async handle(req: CommandRequest<QuestionByWidgetCommand>): EitherResultP {
    const { data } = req

    // . Create
    const { additional, meta, creator, ...rest } = data
    const questionId = v4()
    const questionOrFail = await Question.create(new QuestionId(questionId), {
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date(),
      additional: additional || null,
      meta: meta || null,
      creator: creator || null,
    })
    if (questionOrFail.isError()) {
      return Result.error(questionOrFail.error)
    }

    // . Save
    const saveErr = await this.questionRepository.save(questionOrFail.value)
    if (saveErr.isError()) {
      return Result.error(saveErr.error)
    }

    // . Send Events
    const err = await this.eventBus.publish([
      new WidgetQuestionCreated(questionOrFail.value.id),
      ...questionOrFail.value.domainEvents,
    ])
    if (err.isError()) {
      return Result.error(err.error)
    }

    return Result.oku()
  }
}
