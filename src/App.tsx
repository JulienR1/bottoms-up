import clsx, { ClassValue } from "clsx";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
  tags: Array<string>;
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Array<string>>([]);
  const [collapsed, setCollapsed] = useState(false);

  const tags = useMemo(
    () =>
      [
        ...recipes.reduce((acc, curr) => {
          curr.tags.forEach((t) => acc.add(t));
          return acc;
        }, new Set<string>()),
      ].sort((a, b) => a.localeCompare(b)),
    [recipes],
  );

  return (
    <>
      <div
        className={cn(
          "absolute h-[100vh] w-[100vw] md:hidden",
          collapsed && "hidden",
        )}
        onClick={() => setCollapsed(true)}
      />

      <aside className="h-[100vh] overflow-y-auto flex-shrink-0 z-10 bg-white">
        {collapsed === true && (
          <div className="block md:hidden ml-2">
            <button onClick={() => setCollapsed(false)}>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-1 bg-slate-300 rounded"></div>
                <div className="w-4 h-1 bg-slate-300 rounded"></div>
                <div className="w-4 h-1 bg-slate-300 rounded"></div>
              </div>
            </button>
          </div>
        )}

        <div className={cn(collapsed ? "hidden md:block" : "block")}>
          <div className="p-2 flex flex-col gap-1">
            <button onClick={() => setShowFilters((v) => !v)}>
              <p>Filtres {showFilters ? "^" : "v"}</p>
            </button>

            <div className={cn("hidden", showFilters && "block")}>
              {tags.map((tag) => (
                <div key={tag}>
                  <input
                    id={`tag-${tag}`}
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.currentTarget.checked;
                      setFilters((previous) =>
                        checked
                          ? [...previous, tag]
                          : previous.filter((t) => t !== tag),
                      );
                    }}
                  />
                  <label htmlFor={`tag-${tag}`} className="pl-2">
                    {tag[0].toUpperCase() + tag.slice(1).toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <ul className="grid gap-4 justify-center">
            {recipes
              .filter((r) => filters.every((f) => r.tags.includes(f)))
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
        </div>
      </aside>
    </>
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
