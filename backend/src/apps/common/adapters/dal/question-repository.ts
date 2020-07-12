import Knex from "knex"
import { FaqQuestion } from "apps/common/adapters/dal/sch/db-introspection"
import {
  Question,
  QuestionState,
} from "modules/faq/domain/aggregates/question/question.aggregate"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"
import { Inject } from "typedi"
import {
  KNEX_CONNECTION_DI_TOKEN,
  KnexRepositoryBase,
  TX_CONTAINER_DI_TOKEN,
  TxContainer,
} from "@dddl/knex/dist/dal"
import { Specification } from "@dddl/core/dist/dal"
import { v4 } from "uuid"
import { EitherResultP, Result } from "@dddl/core/dist/rop"

class QuestionSpecMapper {
  static map(
    query: Knex.QueryBuilder<FaqQuestion>,
    specs: Specification<Question>[],
  ): Knex.QueryBuilder<FaqQuestion> {
    return query
  }
}

class QuestionAggregateMapper {
  static async to(model: FaqQuestion): EitherResultP<Question> {
    return Result.ok(Question.__createByRepository(new QuestionId(model.id), model))
  }

  static async from(aggregate: Question): EitherResultP<FaqQuestion> {
    return Result.ok({
      ...aggregate.state,
      id: aggregate.id.toValue() + "",
    })
  }
}

export class QuestionRepository extends KnexRepositoryBase<
  Question,
  QuestionState,
  QuestionId,
  FaqQuestion
> {
  constructor(
    id: string,
    @Inject(KNEX_CONNECTION_DI_TOKEN) knex: Knex,
    @Inject(TX_CONTAINER_DI_TOKEN) txContainer: TxContainer,
  ) {
    super(
      id || v4(),
      knex,
      "faq_question",
      "id",
      QuestionSpecMapper,
      QuestionAggregateMapper,
      txContainer,
    )
  }
}
