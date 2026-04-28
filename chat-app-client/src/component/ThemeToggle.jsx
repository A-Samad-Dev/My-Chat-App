import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("system"); // "dark", "light", or "system"

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (themeMode) => {
    const html = document.documentElement;

    if (themeMode === "dark") {
      html.classList.add("dark");
    } else if (themeMode === "light") {
      html.classList.remove("dark");
    } else if (themeMode === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="fixed flex flex-col items-center justify-center gap-2 px-3 py-2 my-2 text-sm text-black bg-yellow-500 rounded top-4 right-4">
      {theme !== "dark" && (
        <button
          onClick={() => handleThemeChange("dark")}
          className="px-2 py-1 text-white bg-gray-800 rounded hover:bg-gray-900"
        >
          Dark
        </button>
      )}

      {theme !== "light" && (
        <button
          onClick={() => handleThemeChange("light")}
          className="px-2 py-1 text-black bg-white rounded hover:bg-gray-100"
        >
          Light
        </button>
      )}

      {theme !== "system" && (
        <button
          onClick={() => handleThemeChange("system")}
          className="px-2 py-1 text-black bg-gray-400 rounded hover:bg-gray-500"
        >
          System
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;
