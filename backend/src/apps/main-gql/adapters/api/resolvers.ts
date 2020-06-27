import { Args, Field, Int, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql"
import { UseCaseReqMeta } from "@dddl/usecase"
import { v4 } from "uuid"
import { CQ_BUS_DI_TOKEN, CQBus } from "@dddl/cqrs"
import { Inject } from "@nestjs/common"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"
import { Result } from "@dddl/rop"
import { CriticalErr, InvalidDataErr, PublicErr } from "@dddl/errors"

@ObjectType()
class MutationResult {
  @Field()
  public success: boolean
  @Field({ nullable: true })
  public message?: string

  constructor(success: boolean, message?: string) {
    this.success = success
    this.message = message
  }
}

@Resolver()
export class MainResolver {
  constructor(@Inject(CQ_BUS_DI_TOKEN) private cqBus: CQBus) {}

  @Query((returns) => Int)
  async author() {
    return 0
  }

  @Mutation((returns) => MutationResult)
  async createQuestionByWidget(
    @Args("command") command: QuestionByWidgetCommand,
  ): Promise<MutationResult> {
    const result = await this.cqBus.handle(
      new QuestionByWidgetCommand(
        command.content,
        command.creator,
        command.additional,
        command.meta,
      ),
      new UseCaseReqMeta({
        callerId: v4(),
      }),
    )
    if (result.isError()) {
      const err = result.error as Error | Error[]
      if (Array.isArray(err)) {
        if (err.some((er) => er instanceof CriticalErr)) {
          throw new Error(JSON.stringify({ error: new CriticalErr() }))
        }
        throw new Error(JSON.stringify({ errors: err }))
      } else {
        throw new Error(JSON.stringify({ error: err }))
      }
    }
    return new MutationResult(true)
  }
}
