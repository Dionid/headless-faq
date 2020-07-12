import { AggregateRoot, AggregateRootWithState } from "@dddl/core/dist/domain"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"
import { Maybe, Modify, OmitAndModify } from "@dddl/core/dist/common"
import { EitherResultP, Result } from "@dddl/core/dist/rop"
import { FaqQuestion } from "apps/common/adapters/dal/sch/db-introspection"
import { QuestionCreated } from "./events"
import { InvalidDataErr } from "@dddl/core/dist/errors"

export type QuestionState = OmitAndModify<FaqQuestion, { id: any }, {}>

export class Question extends AggregateRootWithState<QuestionId, QuestionState> {
  public static __createByRepository(id: QuestionId, state: QuestionState) {
    return new Question(id, state)
  }

  public static async create(
    id: QuestionId,
    state: QuestionState,
  ): EitherResultP<Question> {
    if (!state.content) {
      return Result.error(new InvalidDataErr("Content required"))
    }
    const question = new Question(id, state)
    question.addDomainEvent(new QuestionCreated(question.id))
    return Result.ok(question)
  }
}
