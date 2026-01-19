import React, { useMemo, useState } from "react";
import TipCalculator from "./components/TipCalculator.jsx";

const themeValues = ["light", "dark"];

export default function App() {
  const [theme, setTheme] = useState("light");

  const nextTheme = useMemo(() => {
    const currentIndex = themeValues.indexOf(theme);
    return themeValues[(currentIndex + 1) % themeValues.length];
  }, [theme]);

  return (
    <div className={`app app--${theme}`}>
      <header className="app__header">
        <div>
          <p className="app__eyebrow">TippyAI</p>
          <p className="app__subtitle">
            Fast splits, named shares, and cash tip helpers for small groups.
          </p>
        </div>
        <button
          className="button button--ghost"
          type="button"
          onClick={() => setTheme(nextTheme)}
        >
          Switch to {nextTheme} mode
        </button>
      </header>
      <TipCalculator />
    </div>
  );
}
