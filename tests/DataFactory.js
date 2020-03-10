import faker from "faker";
import { Factory } from "./factory";

export class RecipeListFactory extends Factory{
  getFields(){
    return{
      results:[]
    }
  }

  postGeneration(){
    const{ generateRecipes} = this.options;
    const results = [];
    for (let i = 0; i < generateRecipes; i++){
      results.push(RecipeFactory.build());
    }
    this.data.results = [...this.data.results, ...results];
  }
}

export class RecipeFactory extends Factory {
  getFields(){
    return{
      arguments: "",
      filter_expression: "",
    }
  }
}