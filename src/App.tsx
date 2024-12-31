import clsx, { ClassValue } from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";
import recipes from "./recipes";

const MAX = 5;
const MIN = 1;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [scale, setScale] = useState(1);

  return (
    <main className="flex gap-4 h-[100vh] overflow-hidden">
      <Sidebar recipe={recipe} recipes={recipes} selectRecipe={setRecipe} />
      <div className="flex flex-grow flex-col">
        <div className="grid items-center text-lg grid-cols-[1fr_2fr_1fr] md:grid-cols-[20rem_1fr_20rem]">
          <h1
            className="whitespace-nowrap overflow-x-hidden text-ellipsis"
            style={{ fontVariant: "small-caps" }}
          >
            {recipe?.label ?? ""}
          </h1>
          <div className="flex-grow">
            <ScaleSelector scale={scale} setScale={setScale} />
          </div>
        </div>
        <div className="overflow-y-auto">
          {recipe && <Recipe {...recipe} scale={scale} />}
        </div>
      </div>
    </main>
  );
}

type Recipe = {
  label: string;
  ingredients: Array<{
    label: string;
    quantity: number | string;
    unit: string;
  }>;
  steps: Array<string>;
  img: string;
};

function Sidebar({
  recipe,
  recipes,
  selectRecipe,
}: {
  recipe: Recipe | null;
  recipes: Array<Recipe>;
  selectRecipe: (recipe: Recipe) => void;
}) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="h-[100vh] overflow-y-auto flex-shrink-0">
      {collapsed === true && (
        <div className="block sm:hidden ml-2">
          <button onClick={() => setCollapsed(false)}>
            <div className="flex flex-col gap-1">
              <div className="w-4 h-1 bg-slate-300 rounded"></div>
              <div className="w-4 h-1 bg-slate-300 rounded"></div>
              <div className="w-4 h-1 bg-slate-300 rounded"></div>
            </div>
          </button>
        </div>
      )}
      {collapsed === false && (
        <>
          <div className="p-2 flex">
            <div>
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
            <div className="block sm:hidden">
              <button className="px-2" onClick={() => setCollapsed(true)}>
                X
              </button>
            </div>
          </div>

          <ul className="grid gap-4 justify-center">
            {recipes
              .filter((r) =>
                r.label.toLowerCase().includes(search.toLowerCase()),
              )
              .map((r) => (
                <li key={r.label}>
                  <button
                    onClick={() => selectRecipe(r)}
                    className={cn(
                      "rounded shadow block w-32 h-36 hover:shadow-slate-400 transition-all overflow-hidden whitespace-nowrap",
                      recipe?.label === r.label && "font-bold bg-red-400",
                    )}
                  >
                    <p className="text-center w-11/12 mx-auto overflow-x-hidden text-ellipsis">
                      {r.label}
                    </p>
                    <div className="overflow-hidden">
                      <img
                        src={r.img}
                        className="aspect-square hover:scale-110 transition-all"
                      />
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </aside>
  );
}

function ScaleSelector({
  scale,
  setScale,
}: {
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="w-fit mx-auto">
      <div className="flex">
        <button
          className="text-lg p-2"
          onClick={() => setScale((s) => Math.max(s - 1, MIN))}
        >
          {"<"}
        </button>
        <input
          value={scale}
          className="w-12 text-center font-medium text-lg block"
          onChange={(e) => setScale(parseFloat(e.currentTarget.value))}
        />
        <button
          className="text-lg p-2"
          onClick={() => setScale((s) => Math.min(s + 1, MAX))}
        >
          {">"}
        </button>
      </div>

      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        className="w-24"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
}

function Recipe({
  scale,
  ingredients,
  steps,
  img,
}: Recipe & { scale?: number }) {
  scale ??= 1;

  return (
    <div className="flex gap-8 flex-col md:flex-row justify-center my-8 md:items-center pr-8 md:pr-0">
      <figure className="w-44 h-44 overflow-hidden relative flex-shrink-0">
        <img className="block" src={img} />
      </figure>

      <div className="flex-shrink-0">
        <h3 className="font-semibold underline text-lg">Ingrédients</h3>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.label}>
              <span className="capitalize">{ingredient.label}</span>
              <span> - </span>
              <span className={scale > 1 ? "font-bold" : ""}>
                {parseFloat(ingredient.quantity.toString()) * scale}
                {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold underline text-lg">Étapes</h3>
        <ol className="list-decimal list-inside">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
