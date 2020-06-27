import { Command } from "@dddl/cqrs"
import { IsNotEmpty, IsString, IsUUID } from "class-validator"
import { Field, InputType } from "@nestjs/graphql"
import { JSONObject } from "apps/common/utils/scalars"

@InputType()
export class QuestionByWidgetCommandAdditional {
  @Field()
  public canPublish: boolean

  constructor(canPublish: boolean) {
    this.canPublish = canPublish
  }
}

@InputType()
export class QuestionByWidgetCommand extends Command {
  @IsString()
  @IsNotEmpty()
  @Field()
  public content: string
  @IsString()
  @Field({ nullable: true })
  public creator?: string
  @Field(() => QuestionByWidgetCommandAdditional, { nullable: true })
  public additional?: Record<string, any>
  @Field(() => JSONObject, { nullable: true })
  public meta?: Record<string, any>
  constructor(
    content: string,
    creator?: string,
    additional?: Record<string, any>,
    meta?: Record<string, any>,
  ) {
    super()
    this.content = content
    this.creator = creator
    this.additional = additional
    this.meta = meta
  }
}
