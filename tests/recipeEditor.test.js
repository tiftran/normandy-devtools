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
import {
  FormControl,
} from "rsuite";
import { ActionsResponse, ActionFactory, ConsoleLogRecipeFactory } from "./dataFactory";

describe("`recipeEditor`", () => {
  it("should allow fields to be edited and saved", async () => {
    const mockActions = ActionFactory.build();

    const fetchActionsSpy = jest
      .spyOn(NormandyAPI.prototype, "fetchActions")
      .mockReturnValue(mockActions);

    const codeMirror = require("react-codemirror2");
   /* jest
      .spyOn(codeMirror, "Controlled")
      .mockReturnValueOnce(props => (
        <input
          name="extra_filter_expression"
          data-testid="extraFilterExpression"
          value=""
          {...props}
        />
      ))
      .mockReturnValueOnce(
        <input name="arguments" data-testid="arguments" value="" />,
      );

    */
    jest
      .spyOn(Environment, "useSelectedEnvironmentAPI")
      .mockReturnValue(new NormandyAPI());
    jest
      .spyOn(Environment, "useSelectedEnvironmentAuth")
      .mockImplementation(jest.fn());
    const { getByTestId, getByText, getByRole } = render(
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
   // fireEvent.change(getByTestId("extraFilterExpression"), {
   //   target: { value: extraFilterExpression },
   // });
    fireEvent.click(getByRole("combobox"));
    fireEvent.click(getByText("console-log"));
  });
  it("should display recipe info from Normandy", async () => {
    const recipeData = ConsoleLogRecipeFactory.build({}, {});
    const mockActions = ActionsResponse();

    const fetchActionsSpy = jest
      .spyOn(NormandyAPI.prototype, "fetchActions")
      .mockReturnValue(mockActions);

    const fetchRecipeSpy = jest.spyOn(NormandyAPI.prototype, "fetchRecipe").mockReturnValue(recipeData);
    const codeMirror = require("react-codemirror2");
     /*jest
       .spyOn(codeMirror, "Controlled")
       .mockReturnValueOnce(props => (
         <FormControl
           name="extra_filter_expression"
           data-testid="extraFilterExpression"
         />
       ))
       .mockReturnValueOnce(
         <FormControl name="arguments" data-testid="arguments" />,
       );

*/
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

});});
