import { CQBus } from "@dddl/core/dist/cqrs"
import { OnWidgetQuestionCreatedAsync } from "modules/orchestrator/application/on-widget-question"
import { WidgetQuestionCreated } from "modules/faq/application/events"
import { DSEventMeta, EventRequest } from "@dddl/core/dist/eda"
import { Matcher, mock, MockProxy } from "jest-mock-extended"
import { Result } from "@dddl/core/dist/rop"
import { UseCaseReqMeta } from "@dddl/core/dist/usecase"
import { SendNotificationAboutQuestionToAdminCommand } from "modules/notification/application/commands/send-notification-about-question-to-admin/command"
import { v4 } from "uuid"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"

describe("OnWidgetQuestionCreated", function () {
  describe("async", function () {
    let cqBus: MockProxy<CQBus>
    let uc: OnWidgetQuestionCreatedAsync
    let event: WidgetQuestionCreated
    let meta: DSEventMeta
    let questionId: string
    let req: EventRequest<WidgetQuestionCreated>

    beforeEach(async () => {
      cqBus = mock<CQBus>()
      uc = new OnWidgetQuestionCreatedAsync(cqBus)
      questionId = v4()
      event = new WidgetQuestionCreated(new QuestionId(questionId))
      const metaOrF = await DSEventMeta.create({ callerId: v4(), transactionId: v4() })
      if (metaOrF.isError()) {
        throw new Error(metaOrF.error + "")
      }
      meta = metaOrF.value
      req = new EventRequest<WidgetQuestionCreated>(event, meta)
    })

    it("should send command to CQ bus", async () => {
      cqBus.handle
        .calledWith(
          new Matcher((command) => {
            return (
              command instanceof SendNotificationAboutQuestionToAdminCommand &&
              command.questionId === event.questionId
            )
          }),
          new Matcher((meta: UseCaseReqMeta) => {
            return (
              meta.callerId === meta.callerId && meta.transactionId === meta.transactionId
            )
          }),
        )
        .mockResolvedValue(Result.okup())
      const res = await uc.handle(req)
      if (res.isError()) {
        throw new Error(`Error failed with: ${res.error}`)
      }
      expect(cqBus.handle.mock.calls.length).toEqual(1)
    })
  })
})
