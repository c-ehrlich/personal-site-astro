import { createEffect, createSignal, JSX, Switch, Match } from "solid-js";
import { Motion, Presence } from "@motionone/solid";

/**
 * This has theme flash unless it is used together with
 * the `ThemeToggleInline` component and view transitions.
 */

export function ThemeToggle() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme"));

  createEffect(() => {
    if (theme()) {
      localStorage.setItem("theme", theme() || "dark");
      if (theme() === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  });

  function handleSwitchTheme() {
    setTheme(theme() === "light" ? "dark" : "light");
  }

  return (
    <Presence exitBeforeEnter initial={false}>
      <Switch fallback={<div>idk</div>}>
        <Match when={theme() === "light"}>
          <ThemeToggleButton handleClick={handleSwitchTheme}>
            🌤️
          </ThemeToggleButton>
        </Match>
        <Match when={theme() === "dark"}>
          <ThemeToggleButton handleClick={handleSwitchTheme}>
            🌙
          </ThemeToggleButton>
        </Match>
      </Switch>
    </Presence>
  );
}

function ThemeToggleButton(props: {
  children: JSX.Element;
  handleClick: () => void;
}) {
  return (
    <Motion.div
      initial={{ y: -30, opacity: 0.25 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0.25 }}
      transition={{ duration: 0.25 }}
    >
      <button class="text-4xl" onClick={props.handleClick}>
        {props.children}
      </button>
    </Motion.div>
  );
}
