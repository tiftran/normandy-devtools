import faker from "faker";
import { Factory, Field, AutoIncrementField } from "./factory";

export class ConsoleLogRecipeFactory extends Factory {
  getFields() {
    return {
      latest_revision: {
        name: new Field(faker.lorem.words),
        action: { id: 4 },
        arguments: {
          message: faker.lorem.words(),
        },
        extra_filter_expression: faker.lorem.words(),
      },
    };
  }
}

export const ActionsResponse = () => {
  const actionNames = [
    "show-heartbeat",
    "opt-out-study",
    "preference-experiment",
    "console-log",
    "preference-rollout",
    "preference-rollback",
    "addon-study",
    "branched-addon-study",
    "multi-preference-experiment",
  ];
  const actionResults = actionNames.map((action, index) => {
    return { id: index + 1, name: action };
  });

  return { results: actionResults };
};

export class ActionFactory extends Factory {
  getFields() {
    return {
      id: new AutoIncrementField(),
      argument_schema: {},
      implementation_url: faker.internet.url(),
      name: faker.lorem.slug(),
    };
  }
}
