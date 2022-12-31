import { createEffect, createSignal, JSX } from "solid-js";
import { Motion, Presence } from "@motionone/solid";

export function ThemeToggle() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme"));

  createEffect(() => {
    console.log("running createEffect", theme());
    if (theme()) {
      console.log("setting theme");
      localStorage.setItem("theme", theme() || "dark");
      if (theme() === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } else {
      setTheme("dark");
    }
  });

  function handleSwitchTheme() {
    setTheme(theme() === "light" ? "dark" : "light");
  }

  return (
    <div>
      <p class="text-red-500">{theme()}</p>
      <Presence exitBeforeEnter>
        {theme() === "light" ? (
          <ThemeButton handleClick={handleSwitchTheme}>🌤️</ThemeButton>
        ) : (
          <ThemeButton handleClick={handleSwitchTheme}>🌙</ThemeButton>
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
