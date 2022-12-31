import { createEffect, createSignal } from "solid-js";

export function TestSolid() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme"));

  createEffect(() => {
    localStorage.setItem("theme", theme() || "dark");
    if (theme() === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  });

  function handleSwitchTheme() {
    setTheme(theme() === "light" ? "dark" : "light");
  }

  return (
    <div>
      <button
        class="border border-red-500 p-4 dark:border-green-500"
        onClick={handleSwitchTheme}
      >
        {theme() === "light" ? "light" : "dark"}
      </button>
    </div>
  );
}
