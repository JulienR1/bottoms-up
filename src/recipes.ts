import recipes from "./recipes.json";

export default recipes.sort((a, b) =>
  a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
);
