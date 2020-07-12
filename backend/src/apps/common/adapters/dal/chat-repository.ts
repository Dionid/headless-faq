import Knex from "knex"
import { Specification } from "@dddl/core/dist/dal"
import { NotificationsChat } from "apps/common/adapters/dal/sch/db-introspection"
import {
  Chat,
  ChatState,
} from "modules/notification/domain/aggregates/chat/chat.aggregate"
import { ChatId } from "modules/notification/domain/aggregates/chat/chat.id"
import { Inject } from "typedi"
import { AllAdminChats, ByChatId } from "modules/notification/application/repositories"
import {
  KNEX_CONNECTION_DI_TOKEN,
  KnexRepositoryBase,
  TX_CONTAINER_DI_TOKEN,
  TxContainer,
} from "@dddl/knex/dist/dal"
import { v4 } from "uuid"
import { EitherResultP, Result } from "@dddl/core/dist/rop"

class ChatSpecMapper {
  static map(
    query: Knex.QueryBuilder<NotificationsChat>,
    specs: Specification<Chat>[],
  ): Knex.QueryBuilder<NotificationsChat> {
    specs.forEach((spec) => {
      if (spec instanceof ByChatId) {
        query.where({
          chatId: spec.chatId,
        })
      }
      if (spec instanceof AllAdminChats) {
        query.where({
          isAdmin: true,
        })
      }
    })
    return query
  }
}

class ChatAggregateMapper {
  static async to(model: NotificationsChat): EitherResultP<Chat> {
    return Result.ok(Chat.__createByRepository(new ChatId(model.id), model))
  }

  static async from(aggregate: Chat): EitherResultP<NotificationsChat> {
    return Result.ok({
      ...aggregate.state,
      id: aggregate.id.toValue() + "",
    })
  }
}

export class ChatRepository extends KnexRepositoryBase<
  Chat,
  ChatState,
  ChatId,
  NotificationsChat
> {
  constructor(
    id: string,
    @Inject(KNEX_CONNECTION_DI_TOKEN) knex: Knex,
    @Inject(TX_CONTAINER_DI_TOKEN) txContainer: TxContainer,
  ) {
    super(
      id || v4(),
      knex,
      "notifications_chat",
      "id",
      ChatSpecMapper,
      ChatAggregateMapper,
      txContainer,
    )
  }
}
