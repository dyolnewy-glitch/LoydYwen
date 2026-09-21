
/* ==================================================
   ADMIN DASHBOARD
================================================== */

const SUPABASE_URL =
    "https://pgkrgwplunepdvrmixvj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nq1UrsN6b0YXQcKfWvKfwQ_OhJiS6yy";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ==================================================
   LOGIN PROTECTION
================================================== */

if (
    localStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.replace("admin.html");
}


/* ==================================================
   ELEMENTS
================================================== */

const logoutButton =
    document.getElementById("logoutButton");

const dashboardDate =
    document.getElementById("dashboardDate");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const portfolioCount =
    document.getElementById("portfolioCount");

const galleryCount =
    document.getElementById("galleryCount");

const blogCount =
    document.getElementById("blogCount");

const messageCount =
    document.getElementById("messageCount");


/* ==================================================
   STORAGE KEYS
================================================== */

const STORAGE_KEYS = {

    portfolio: "projects",

    gallery: "galleryItems",

    messages: "messages"

};


/* ==================================================
   SAFE STORAGE ARRAY
================================================== */

function getStorageArray(key) {

    try {

        const storedData =
            localStorage.getItem(key);

        if (!storedData) {
            return [];
        }

        const parsedData =
            JSON.parse(storedData);

        return Array.isArray(parsedData)
            ? parsedData
            : [];

    } catch (error) {

        console.error(
            "Unable to read localStorage:",
            key,
            error
        );

        return [];

    }

}


/* ==================================================
   LAST LOGIN
================================================== */

function displayLastLogin() {

    if (!dashboardDate) {
        return;
    }

    const lastLogin =
        localStorage.getItem(
            "adminLastLogin"
        );

    if (!lastLogin) {

        dashboardDate.textContent =
            "No login record";

        return;

    }

    const loginDate =
        new Date(lastLogin);

    if (
        Number.isNaN(
            loginDate.getTime()
        )
    ) {

        dashboardDate.textContent =
            "Unknown";

        return;

    }

    dashboardDate.textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ).format(loginDate);

}


/* ==================================================
   GET BLOG COUNT FROM SUPABASE
================================================== */

async function getBlogCount() {

    if (!blogCount) {
        return;
    }

    try {

        const {
            count,
            error
        } = await supabaseClient
            .from("blog_posts")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );

        if (error) {

            console.error(
                "Unable to get blog count:",
                error
            );

            blogCount.textContent =
                "0";

            return;

        }

        blogCount.textContent =
            count ?? 0;

    } catch (error) {

        console.error(
            "Blog count error:",
            error
        );

        blogCount.textContent =
            "0";

    }

}


/* ==================================================
   UPDATE DASHBOARD COUNTS
================================================== */

async function updateDashboardCounts() {

    const portfolioData =
        getStorageArray(
            STORAGE_KEYS.portfolio
        );

    const galleryData =
        getStorageArray(
            STORAGE_KEYS.gallery
        );

    const messageData =
        getStorageArray(
            STORAGE_KEYS.messages
        );


    /* ================================
       PORTFOLIO
    ================================= */

    if (portfolioCount) {

        portfolioCount.textContent =
            portfolioData.length;

    }


    /* ================================
       GALLERY
    ================================= */

    if (galleryCount) {

        galleryCount.textContent =
            galleryData.length;

    }


    /* ================================
       BLOG
    ================================= */

    await getBlogCount();


    /* ================================
       MESSAGES
    ================================= */

    if (messageCount) {

        messageCount.textContent =
            messageData.length;

    }

}


/* ==================================================
   REFRESH DASHBOARD
================================================== */

async function refreshDashboard() {

    await updateDashboardCounts();

    displayLastLogin();

}


/* ==================================================
   INITIAL LOAD
================================================== */

refreshDashboard();


/* ==================================================
   THEME
================================================== */

function applyTheme() {

    const savedTheme =
        localStorage.getItem("theme") || "light";

    const isDark =
        savedTheme === "dark";

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    document.documentElement.classList.toggle(
        "dark-mode",
        isDark
    );

    if (themeIcon) {

        themeIcon.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }

    if (themeToggle) {

        themeToggle.title =
            isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
        );

    }

}


/* ==================================================
   INITIAL THEME
================================================== */

applyTheme();


/* ==================================================
   DARK MODE BUTTON
================================================== */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            const currentlyDark =
                localStorage.getItem("theme") === "dark";

            const newTheme =
                currentlyDark
                    ? "light"
                    : "dark";

            localStorage.setItem(
                "theme",
                newTheme
            );

            applyTheme();

        }
    );

}


/* ==================================================
   STORAGE SYNC
================================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (event.key === "theme") {

            applyTheme();

        }

        if (
            event.key === "projects" ||
            event.key === "galleryItems" ||
            event.key === "messages" ||
            event.key === "adminLastLogin"
        ) {

            refreshDashboard();

        }

        if (event.key === "adminLoggedIn") {

            if (
                event.newValue !== "true"
            ) {

                window.location.replace(
                    "admin.html"
                );

            }

        }

    }
);


/* ==================================================
   REFRESH WHEN RETURNING TO DASHBOARD
================================================== */

window.addEventListener(
    "pageshow",
    function () {

        refreshDashboard();

        if (
            localStorage.getItem(
                "adminLoggedIn"
            ) !== "true"
        ) {

            window.location.replace(
                "admin.html"
            );

        }

    }
);


/* ==================================================
   REFRESH WHEN TAB BECOMES ACTIVE
================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState === "visible"
        ) {

            refreshDashboard();

        }

    }
);


/* ==================================================
   LOGOUT
================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmLogout) {
                return;
            }

            localStorage.removeItem(
                "adminLoggedIn"
            );

            localStorage.removeItem(
                "adminSession"
            );

            window.location.replace(
                "admin.html"
            );

        }
    );

}


/* ==================================================
   PERIODIC UPDATE
================================================== */

setInterval(
    function () {

        if (
            document.visibilityState === "visible"
        ) {

            refreshDashboard();

        }

    },
    1000
);
