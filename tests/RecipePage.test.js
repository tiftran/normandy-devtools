import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RecipeListing from "devtools/components/recipes/RecipeListing";
import RecipesPage from "devtools/components/pages/RecipesPage";
//global.browser.experiments.normandy = jest.fn();


import React from "react";

describe("The `Recipe Page` component", () => {
  let browserSpy;
  //const RecipeListing = require("devtools/components/recipes/RecipeListing");
  //const RecipesPage = require("devtools/components/pages/RecipesPage");
  beforeAll(() => {

    //global.browser.experiments.normandy = jest.fn();
    //browserSpy = jest.spyOn(global, "broswer", "get");

  });

  it("should render write a recipe model, when button is clicked", async () => {

    const response = { experiments: { normandy: "" } };
    //jest.spyOn(RecipeListing, "browser", "get").mockImplementation(() => Promise.resolve(response));
    //jest.spyOn(RecipeListing, "browser", "get").mockImplementation(() => jest.fn());
    const { getByText } = await render(<RecipesPage />);
    expect(getByText("Write & Run Arbitrary")).toBeInTheDocument();

  });
});
