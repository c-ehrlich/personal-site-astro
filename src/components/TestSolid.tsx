import { createEffect, createSignal, JSX } from "solid-js";
import { Motion, Presence } from "@motionone/solid";

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
      <Presence exitBeforeEnter>
        {theme() === "dark" ? (
          <ThemeButton handleClick={handleSwitchTheme}>🌙</ThemeButton>
        ) : (
          <ThemeButton handleClick={handleSwitchTheme}>🌤️</ThemeButton>
        )}
      </Presence>
    </div>
  );
}

function ThemeButton(props: {
  children: JSX.Element;
  handleClick: () => void;
}) {
  return (
    <Motion.div
      initial={{ y: -50, opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0.5 }}
      transition={{ duration: 0.2 }}
    >
      <button class="text-4xl" onClick={props.handleClick}>
        {props.children}
      </button>
    </Motion.div>
  );
}
