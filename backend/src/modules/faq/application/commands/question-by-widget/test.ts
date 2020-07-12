import { CommandRequest } from "@dddl/core/dist/cqrs"
import { QuestionRepository } from "modules/faq/domain/repository"
import { EventBus } from "@dddl/core/dist/eda"
import mock, { MockProxy } from "jest-mock-extended/lib/Mock"
import { UseCaseReqMeta } from "@dddl/core/dist/usecase"
import { v4 } from "uuid"
import { Result } from "@dddl/core/dist/rop"
import { Matcher } from "jest-mock-extended"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"
import { DSEvent } from "@dddl/core/dist/eda"
import { WidgetQuestionCreated } from "modules/faq/application/events"
import { QuestionCreated } from "modules/faq/domain/aggregates/question/events"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"
import { QuestionByWidget } from "modules/faq/application/commands/question-by-widget/index"

describe("QuestionByWidget", function () {
  let eventBus: MockProxy<EventBus>
  let questionRepository: MockProxy<QuestionRepository>
  let uc: QuestionByWidget
  let req: CommandRequest<QuestionByWidgetCommand>
  let qID: QuestionId

  beforeEach(() => {
    eventBus = mock<EventBus>()
    questionRepository = mock<QuestionRepository>()
    uc = new QuestionByWidget(questionRepository, eventBus)
    req = new CommandRequest(
      new QuestionByWidgetCommand(
        "Content",
        "Creator",
        { canPublish: true },
        { meta: true },
      ),
      new UseCaseReqMeta({
        callerId: v4(),
      }),
      {},
    )
  })

  it("should create new question if data is correct", async () => {
    eventBus.publish
      .calledWith(
        new Matcher((events: DSEvent[]) => {
          return events.every(
            (e) => e instanceof WidgetQuestionCreated || e instanceof QuestionCreated,
          )
        }),
      )
      .mockResolvedValue(Result.oku())
    questionRepository.save
      .calledWith(new Matcher((q) => q.state.additional === req.data.additional))
      .mockResolvedValue(Result.oku())
    const res = await uc.handle(req)
    if (res.isError()) {
      throw new Error("")
    }
    expect(questionRepository.save.mock.calls.length).toEqual(1)
    expect(eventBus.publish.mock.calls.length).toEqual(1)
  })
})
