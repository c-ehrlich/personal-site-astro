import { createEffect, createSignal, type JSX, Switch, Match } from "solid-js";
// @ts-expect-error - @motionone/solid has messed up types
import { Presence, Motion } from "@motionone/solid";

const THEME_KEY = "cje-theme";

/**
 * This has theme flash unless it is used together with
 * the `ThemeToggleInline` component and view transitions.
 */

export function ThemeToggle() {
  const theme1 = localStorage.getItem(THEME_KEY);
  const [theme, setTheme] = createSignal(theme1);

  createEffect(() => {
    if (theme()) {
      if (theme() === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    }
  });

  function handleSwitchTheme() {
    const oldTheme = theme();
    const newTheme = oldTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
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
