
/* ==================================================
   ADMIN DASHBOARD
   SUPABASE AUTHENTICATION
   SUPABASE LOGIN HISTORY
================================================== */


/* ==================================================
   SUPABASE SETTINGS
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
   LOGIN PROTECTION
   VERIFY SUPABASE SESSION
================================================== */

let dashboardAuthorized = false;
let redirectingToLogin = false;

async function protectDashboard() {
    try {
        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            throw error;
        }

        if (
            !data ||
            !data.session ||
            !data.session.user
        ) {
            dashboardAuthorized = false;
            redirectingToLogin = true;

            window.location.replace("admin.html");

            return false;
        }

        dashboardAuthorized = true;

        return true;

    } catch (error) {
        console.error(
            "Dashboard session verification failed:",
            error
        );

        dashboardAuthorized = false;
        redirectingToLogin = true;

        window.location.replace("admin.html");

        return false;
    }
}


/* ==================================================
   SAFE LOCAL STORAGE ARRAY
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
   LAST LOGIN FROM SUPABASE
================================================== */

async function displayLastLogin() {
    if (!dashboardDate) {
        return;
    }

    dashboardDate.textContent = "Loading...";

    try {
        const {
            data: userData,
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError) {
            throw userError;
        }

        if (!userData || !userData.user) {
            dashboardDate.textContent = "Unavailable";
            return;
        }

        const {
            data,
            error
        } = await supabaseClient
            .from("admin_login_history")
            .select("logged_in_at")
            .eq("user_id", userData.user.id)
            .order("logged_in_at", {
                ascending: false
            })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error(
                "Unable to load last login:",
                error
            );

            dashboardDate.textContent = "Unable to load";
            return;
        }

        if (!data || !data.logged_in_at) {
            dashboardDate.textContent = "No login record";
            return;
        }

        const loginDate =
            new Date(data.logged_in_at);

        if (Number.isNaN(loginDate.getTime())) {
            dashboardDate.textContent = "Unknown";
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

    } catch (error) {
        console.error(
            "Last login display error:",
            error
        );

        dashboardDate.textContent = "Unable to load";
    }
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

            blogCount.textContent = "0";

            return;
        }

        blogCount.textContent =
            count ?? 0;

    } catch (error) {
        console.error(
            "Blog count error:",
            error
        );

        blogCount.textContent = "0";
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


    /* PORTFOLIO */

    if (portfolioCount) {
        portfolioCount.textContent =
            portfolioData.length;
    }


    /* GALLERY */

    if (galleryCount) {
        galleryCount.textContent =
            galleryData.length;
    }


    /* BLOG */

    await getBlogCount();


    /* MESSAGES */

    if (messageCount) {
        messageCount.textContent =
            messageData.length;
    }
}


/* ==================================================
   REFRESH DASHBOARD
================================================== */

async function refreshDashboard() {
    if (
        !dashboardAuthorized ||
        redirectingToLogin
    ) {
        return;
    }

    await displayLastLogin();
    await updateDashboardCounts();
}


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
            isDark ? "☀️" : "🌙";
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
    }
);


/* ==================================================
   PAGE SHOW
   RECHECK SESSION WHEN RETURNING
================================================== */

window.addEventListener(
    "pageshow",
    async function (event) {
        if (!dashboardAuthorized) {
            return;
        }

        if (event.persisted) {
            const authorized =
                await protectDashboard();

            if (authorized) {
                await refreshDashboard();
            }
        }
    }
);


/* ==================================================
   TAB VISIBILITY
================================================== */

document.addEventListener(
    "visibilitychange",
    async function () {
        if (
            document.visibilityState !== "visible" ||
            !dashboardAuthorized
        ) {
            return;
        }

        await refreshDashboard();
    }
);


/* ==================================================
   LOGOUT
   SUPABASE SIGN OUT
================================================== */

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        async function () {
            if (
                !confirm(
                    "Are you sure you want to logout?"
                )
            ) {
                return;
            }

            logoutButton.disabled = true;
            logoutButton.textContent = "Logging out...";

            try {
                const {
                    error
                } = await supabaseClient.auth.signOut();

                if (error) {
                    throw error;
                }

                dashboardAuthorized = false;
                redirectingToLogin = true;

                // Remove legacy login flags, if present.
                localStorage.removeItem("adminLoggedIn");
                localStorage.removeItem("adminSession");

                window.location.replace("admin.html");

            } catch (error) {
                console.error(
                    "Logout failed:",
                    error
                );

                alert(
                    "Unable to logout. Please try again."
                );

                logoutButton.disabled = false;
                logoutButton.textContent = "Logout";
            }
        }
    );
}


/* ==================================================
   SUPABASE AUTH STATE LISTENER
================================================== */

supabaseClient.auth.onAuthStateChange(
    function (event) {
        if (
            event === "SIGNED_OUT" &&
            !redirectingToLogin
        ) {
            dashboardAuthorized = false;
            redirectingToLogin = true;

            window.location.replace("admin.html");
        }
    }
);


/* ==================================================
   INITIALIZATION
   VERIFY SESSION BEFORE LOADING DASHBOARD
================================================== */

async function initializeDashboard() {
    applyTheme();

    const authorized =
        await protectDashboard();

    if (!authorized) {
        return;
    }

    await refreshDashboard();

    console.log(
        "Admin dashboard loaded successfully."
    );
}

initializeDashboard();
