import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import recipes from "./recipes";

function App() {
  const params = useParams<{ recipe: string }>();
  const recipe = recipes.find((r) => r.label === params.recipe);

  const [scale, setScale] = useState(1);

  return (
    <main className="flex gap-4">
      <Sidebar recipes={recipes} />
      <div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          className="w-24"
          value={scale}
          onChange={(e) => setScale(parseInt(e.currentTarget.value))}
        />
        {recipe && <Recipe {...recipe} scale={scale} />}
      </div>
    </main>
  );
}

type Recipe = {
  label: string;
  ingredients: Array<{ label: string; quantity: number; unit: string }>;
  steps: Array<string>;
  img: string;
};

function Sidebar({ recipes }: { recipes: Array<Recipe> }) {
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSearch("");
  }, [location.pathname]);

  return (
    <aside className="h-[100vh] overflow-y-auto">
      <div className="p-2">
        <label htmlFor="recipe-search" className="block">
          Filtrer:
        </label>
        <input
          id="recipe-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="border-slate-200 border-[1px] rounded w-44"
        />
      </div>

      <ul className="grid gap-4 justify-center">
        {recipes
          .filter((r) => r.label.toLowerCase().includes(search.toLowerCase()))
          .map((recipe) => (
            <li key={recipe.label}>
              <Link
                to={"/" + recipe.label}
                className="rounded shadow block w-32 h-36 hover:shadow-slate-400 transition-all overflow-hidden whitespace-nowrap"
              >
                <p className="text-center w-11/12 mx-auto overflow-x-hidden text-ellipsis">
                  {recipe.label}
                </p>
                <div className="overflow-hidden">
                  <img
                    src={recipe.img}
                    className="aspect-square hover:scale-110 transition-all"
                  />
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </aside>
  );
}

function Recipe({ scale, ingredients, steps }: Recipe & { scale?: number }) {
  scale ??= 1;

  return (
    <div>
      <div>
        <h3>Ingrédients</h3>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.label}>
              <span>{ingredient.label}</span>
              <span> - </span>
              <span className={scale > 1 ? "font-bold" : ""}>
                {ingredient.quantity * scale} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Étapes</h3>
        <ol>
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
