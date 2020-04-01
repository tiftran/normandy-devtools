import React from "react";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  getByText,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RecipeEditor from "devtools/components/recipes/RecipeEditor";
import * as Environment from "devtools/contexts/environment";
import NormandyAPI from "devtools/utils/api";
import { ActionsResponse, ActionFactory, ConsoleLogRecipeFactory } from "./dataFactory";

describe("`recipeEditor`", () => {
  it("should allow fields to be edited and saved", async () => {
    const mockActions = ActionsResponse();

    const fetchActionsSpy = jest
      .spyOn(NormandyAPI.prototype, "fetchActions")
      .mockReturnValue(mockActions);

    jest
      .spyOn(Environment, "useSelectedEnvironmentAPI")
      .mockReturnValue(new NormandyAPI());
    jest
      .spyOn(Environment, "useSelectedEnvironmentAuth")
      .mockImplementation(jest.fn());
    const { getByTestId, getByText, container } = render(
      <RecipeEditor match={{ params: {} }} />,
    );
    expect(fetchActionsSpy).toHaveBeenCalled();
    expect(getByText("Select an action")).toBeInTheDocument();
    const name = "Recipe Name";
    const experimentSlug = "Experiment Slug";
    const extraFilterExpression = "(normandy.channel in [nightly])";
    const argumentsValue = '{"message":"hello" }';

    fireEvent.change(getByTestId("recipeName"), {
      target: { value: name },
    });

    fireEvent.change(getByTestId("experimentSlug"), {
      target: { value: experimentSlug },
    });

    fireEvent.change(getByTestId("filter_expression"), {
      target: { value: extraFilterExpression },
    });
    fireEvent.click(getByTestId("actions"));
    fireEvent.click(getByText("console-log"));
  });


  it("should display recipe info from Normandy", async () => {
    const recipeData = ConsoleLogRecipeFactory.build();
    const mockActions = ActionsResponse();

    const fetchActionsSpy = jest
      .spyOn(NormandyAPI.prototype, "fetchActions")
      .mockReturnValue(mockActions);

    const fetchRecipeSpy = jest.spyOn(NormandyAPI.prototype, "fetchRecipe").mockReturnValue(recipeData);
    const codeMirror = require("react-codemirror2");

    jest
      .spyOn(Environment, "useSelectedEnvironmentAPI")
      .mockReturnValue(new NormandyAPI());
    jest
      .spyOn(Environment, "useSelectedEnvironmentAuth")
      .mockImplementation(jest.fn());
    const { getByTestId, getByText, getByRole } = render(
      <RecipeEditor match={{ params: {id:3} }} />,
    );
    expect(fetchActionsSpy).toHaveBeenCalled();
    expect(fetchRecipeSpy).toHaveBeenCalled();
    expect(getByText(recipeData.latest_revision.name)).toBeInTheDocument();
    expect(getByText(recipeData.latest_revision.extra_filter_expression)).toBeInTheDocument();

});});
