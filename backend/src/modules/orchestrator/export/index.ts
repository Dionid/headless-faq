import { WidgetQuestionCreated } from "modules/faq/application/events"
import { EventBus, EventBusProvider } from "@dddl/eda"
import { OnWidgetQuestionCreatedAsync } from "modules/orchestrator/application/on-widget-question"

export function initOrchestratorService(
  syncEventBusProvider: EventBusProvider,
  asyncEventBusProvider: EventBusProvider,
): void {
  asyncEventBusProvider.subscribe(WidgetQuestionCreated, OnWidgetQuestionCreatedAsync)
}
