/* =========================
   DARK MODE / THEME TOGGLE
========================= */

const themeToggle = document.getElementById("themeToggle");
const themeLogo = document.getElementById("themeLogo");
const themeLabel = document.getElementById("themeLabel");


/* =========================
   LOGO FILES
========================= */

const lightLogo = "logo.png";
const darkLogo = "logos.jpg";


/* =========================
   APPLY THEME
========================= */

function applyTheme(theme) {

    if (theme === "dark") {

        document.documentElement.classList.add("dark-mode");

        if (themeLogo) {
            themeLogo.src = darkLogo;
            themeLogo.alt = "Dark Mode Logo";
        }

        if (themeLabel) {
            themeLabel.textContent = "Dark Mode";
        }

    } else {

        document.documentElement.classList.remove("dark-mode");

        if (themeLogo) {
            themeLogo.src = lightLogo;
            themeLogo.alt = "Light Mode Logo";
        }

        if (themeLabel) {
            themeLabel.textContent = "Light Mode";
        }

    }

}


/* =========================
   LOAD SAVED THEME
========================= */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    applyTheme("dark");

} else {

    applyTheme("light");

}


/* =========================
   TOGGLE THEME
========================= */

if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const currentTheme =
            document.documentElement.classList.contains("dark-mode")
                ? "dark"
                : "light";


        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";


        localStorage.setItem("theme", newTheme);

        applyTheme(newTheme);

    });

}