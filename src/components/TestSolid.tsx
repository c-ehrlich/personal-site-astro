import { createEffect, createSignal } from "solid-js";

export function TestSolid() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme"));

  createEffect(() => {
    if (theme()) {
      document.documentElement.setAttribute("data-theme", theme());
      localStorage.setItem("theme", theme());
    } else {
      setTheme("dark");
    }
  });

  function handleSwitchTheme() {
    setTheme(theme() === "light" ? "dark" : "light");
  }

  return (
    <div>
      <button class="border border-red-500 p-4" onClick={handleSwitchTheme}>
        {theme() === "dark" ? "dark" : "light"}
      </button>
    </div>
  );
}
