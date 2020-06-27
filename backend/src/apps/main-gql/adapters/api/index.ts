import { Module, Scope } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { MainResolver } from "./resolvers"
import { CQ_BUS_DI_TOKEN, CQBus } from "@dddl/cqrs"
import { JSONObjectScalar } from "apps/common/utils/scalars"
import * as os from "os"
import * as path from "path"

export function InitAppModule(cqBus: CQBus) {
  @Module({
    imports: [
      GraphQLModule.forRoot({
        introspection: true,
        playground: true,
        autoSchemaFile: path.join(os.tmpdir(), "schema.gql"), // `os.tmpdir()` needed for GAE
      }),
    ],
    providers: [
      MainResolver,
      JSONObjectScalar,
      {
        provide: CQ_BUS_DI_TOKEN,
        useValue: cqBus,
      },
    ],
  })
  class AppModule {}
  return AppModule
}
