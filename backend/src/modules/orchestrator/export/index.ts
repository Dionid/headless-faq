import { WidgetQuestionCreated } from "modules/faq/application/events"
import { EventBus, EventBusProvider } from "@dddl/core/dist/eda"
import { OnWidgetQuestionCreatedAsync } from "modules/orchestrator/application/on-widget-question"

export function initOrchestratorService(
  syncEventBusProvider: EventBusProvider,
  asyncEventBusProvider: EventBusProvider,
): void {
  asyncEventBusProvider.subscribe(WidgetQuestionCreated, OnWidgetQuestionCreatedAsync)
}
