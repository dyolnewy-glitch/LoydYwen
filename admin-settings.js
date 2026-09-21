const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD_KEY = "adminPassword";
const ADMIN_LOGIN_KEY = "adminLoggedIn";
const ADMIN_LAST_LOGIN_KEY = "adminLastLogin";

const ADMIN_PASSWORD_CHANGED_KEY = "adminPasswordChangedAt";

const WEBSITE_SETTINGS_KEY = "websiteSettings";
const CONTENT_PREFERENCES_KEY = "contentPreferences";

const DEFAULT_ADMIN_PASSWORD = "admin123";

const SUPABASE_URL =
    "https://pgkrgwplunepdvrmixvj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nq1UrsN6b0YXQcKfWvKfwQ_OhJiS6yy";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

const PASSWORD_HISTORY_TABLE =
    "admin_password_history";

const DEFAULT_WEBSITE_SETTINGS = {
    websiteName: "Loyd Ywen Masangcay",
    description: "Personal portfolio website of Loyd Ywen Masangcay.",
    email: "",
    location: "Urdaneta City, Pangasinan",
    facebook: "",
    instagram: "",
    github: "",
    linkedin: ""
};

const DEFAULT_CONTENT_PREFERENCES = {
    blogPerPage: 4,
    galleryPerPage: 12,
    defaultBlogCategory: "All",
    defaultGalleryCategory: "All"
};

document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    setupTheme();

    if (!checkAdminLogin()) {
        return;
    }

    setupAccountSection();
    setupPasswordModal();
    setupWebsiteSettings();
    setupContentPreferences();
    setupMaintenance();
    setupResetPassword();
    setupLogout();
});

function getStorageObject(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        const parsed = JSON.parse(saved);

        return parsed || fallback;
    }
    catch (error) {
        console.error(
            "Storage read error:",
            error
        );

        return fallback;
    }
}

function saveStorageObject(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;
    }
    catch (error) {
        console.error(
            "Storage save error:",
            error
        );

        return false;
    }
}

function applyTheme() {
    const savedTheme =
        localStorage.getItem("theme") ||
        "light";

    document.documentElement.classList.toggle(
        "dark-mode",
        savedTheme === "dark"
    );

    document.body.classList.toggle(
        "dark-mode",
        savedTheme === "dark"
    );

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

    const themeIcon =
        document.getElementById(
            "themeIcon"
        );

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    if (themeIcon) {
        themeIcon.textContent =
            savedTheme === "dark"
                ? "☀️"
                : "🌙";
    }

    if (themeToggle) {
        themeToggle.title =
            savedTheme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            savedTheme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
        );
    }
}

function setupTheme() {
    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            const currentTheme =
                localStorage.getItem(
                    "theme"
                ) || "light";

            const newTheme =
                currentTheme === "dark"
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

function checkAdminLogin() {
    const loggedIn =
        localStorage.getItem(
            ADMIN_LOGIN_KEY
        );

    if (loggedIn !== "true") {
        window.location.href =
            "admin.html";

        return false;
    }

    return true;
}

function setupAccountSection() {
    const usernameElement =
        document.getElementById(
            "settingsUsername"
        );

    if (usernameElement) {
        usernameElement.textContent =
            ADMIN_USERNAME;
    }

    const lastLoginElement =
        document.getElementById(
            "lastLoginDisplay"
        );

    if (!lastLoginElement) {
        return;
    }

    const lastLogin =
        localStorage.getItem(
            ADMIN_LAST_LOGIN_KEY
        );

    if (!lastLogin) {
        lastLoginElement.textContent =
            "No login recorded";

        return;
    }

    const loginDate =
        new Date(lastLogin);

    if (
        Number.isNaN(
            loginDate.getTime()
        )
    ) {
        lastLoginElement.textContent =
            "Unknown";

        return;
    }

    lastLoginElement.textContent =
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

function setupPasswordModal() {
    const changePasswordButton =
        document.getElementById(
            "changePasswordButton"
        );

    const passwordModal =
        document.getElementById(
            "changePasswordModal"
        );

    const closePasswordButton =
        document.getElementById(
            "closePasswordModal"
        );

    const cancelPasswordButton =
        document.getElementById(
            "cancelPasswordButton"
        );

    const changePasswordForm =
        document.getElementById(
            "changePasswordForm"
        );

    if (!changePasswordButton) {
        console.error(
            "changePasswordButton was not found."
        );

        return;
    }

    if (!passwordModal) {
        console.error(
            "changePasswordModal was not found."
        );

        return;
    }

    changePasswordButton.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            openChangePasswordModal();
        }
    );

    if (closePasswordButton) {
        closePasswordButton.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();

                closeChangePasswordModal();
            }
        );
    }

    if (cancelPasswordButton) {
        cancelPasswordButton.addEventListener(
            "click",
            function (event) {
                event.preventDefault();

                closeChangePasswordModal();
            }
        );
    }

    passwordModal.addEventListener(
        "click",
        function (event) {
            if (
                event.target ===
                passwordModal
            ) {
                closeChangePasswordModal();
            }
        }
    );

    if (changePasswordForm) {
        changePasswordForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                changeAdminPassword();
            }
        );
    }

    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                passwordModal.hidden === false
            ) {
                closeChangePasswordModal();
            }
        }
    );

    setupPasswordToggles();
}

function openChangePasswordModal() {
    const passwordModal =
        document.getElementById(
            "changePasswordModal"
        );

    if (!passwordModal) {
        alert(
            "Change Password modal could not be loaded."
        );

        return;
    }

    passwordModal.hidden = false;

    passwordModal.removeAttribute(
        "hidden"
    );

    document.body.classList.add(
        "password-modal-open"
    );

    clearPasswordMessage();

    const form =
        document.getElementById(
            "changePasswordForm"
        );

    if (form) {
        form.reset();
    }

    const currentPassword =
        document.getElementById(
            "currentPassword"
        );

    if (currentPassword) {
        setTimeout(
            function () {
                currentPassword.focus();
            },
            100
        );
    }
}

function closeChangePasswordModal() {
    const passwordModal =
        document.getElementById(
            "changePasswordModal"
        );

    const form =
        document.getElementById(
            "changePasswordForm"
        );

    if (form) {
        form.reset();
    }

    if (passwordModal) {
        passwordModal.hidden = true;

        passwordModal.setAttribute(
            "hidden",
            ""
        );
    }

    document.body.classList.remove(
        "password-modal-open"
    );

    clearPasswordMessage();
}

async function savePasswordHistory() {
    const changedAt =
        new Date().toISOString();

    try {
        localStorage.setItem(
            ADMIN_PASSWORD_CHANGED_KEY,
            changedAt
        );
    }
    catch (error) {
        console.warn(
            "Unable to save local password change date:",
            error
        );
    }

    try {
        const {
            error
        } =
            await supabaseClient
                .from(
                    PASSWORD_HISTORY_TABLE
                )
                .insert({
                    username:
                        ADMIN_USERNAME,

                    action:
                        "password_changed"
                });

        if (error) {
            console.error(
                "Supabase password history error:",
                error
            );

            return false;
        }

        console.log(
            "Password change recorded in Supabase."
        );

        return true;
    }
    catch (error) {
        console.error(
            "Password history connection error:",
            error
        );

        return false;
    }
}

async function changeAdminPassword() {
    const currentPassword =
        document.getElementById(
            "currentPassword"
        );

    const newPassword =
        document.getElementById(
            "newPassword"
        );

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {
        showPasswordMessage(
            "Password form could not be loaded."
        );

        return;
    }

    let savedPassword =
        localStorage.getItem(
            ADMIN_PASSWORD_KEY
        );

    if (!savedPassword) {
        savedPassword =
            DEFAULT_ADMIN_PASSWORD;

        localStorage.setItem(
            ADMIN_PASSWORD_KEY,
            savedPassword
        );
    }

    if (
        currentPassword.value !==
        savedPassword
    ) {
        showPasswordMessage(
            "Current password is incorrect."
        );

        currentPassword.focus();

        return;
    }

    if (
        newPassword.value.length < 6
    ) {
        showPasswordMessage(
            "New password must be at least 6 characters."
        );

        newPassword.focus();

        return;
    }

    if (
        newPassword.value !==
        confirmPassword.value
    ) {
        showPasswordMessage(
            "Passwords do not match."
        );

        confirmPassword.focus();

        return;
    }

    if (
        newPassword.value ===
        currentPassword.value
    ) {
        showPasswordMessage(
            "New password must be different from the current password."
        );

        newPassword.focus();

        return;
    }

    try {
        localStorage.setItem(
            ADMIN_PASSWORD_KEY,
            newPassword.value
        );
    }
    catch (error) {
        console.error(
            "Password save error:",
            error
        );

        showPasswordMessage(
            "Unable to save the new password."
        );

        return;
    }

    showPasswordMessage(
        "Password changed successfully."
    );

    await savePasswordHistory();

    setTimeout(
        function () {
            localStorage.removeItem(
                ADMIN_LOGIN_KEY
            );

            window.location.href =
                "admin.html";
        },
        1000
    );
}

function showPasswordMessage(message) {
    const messageElement =
        document.getElementById(
            "passwordMessage"
        );

    if (!messageElement) {
        alert(message);

        return;
    }

    messageElement.textContent =
        message;
}

function clearPasswordMessage() {
    const messageElement =
        document.getElementById(
            "passwordMessage"
        );

    if (messageElement) {
        messageElement.textContent =
            "";
    }
}

function setupPasswordToggles() {
    const toggles =
        document.querySelectorAll(
            ".password-toggle"
        );

    toggles.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();

                    const wrapper =
                        button.closest(
                            ".input-wrapper"
                        );

                    if (!wrapper) {
                        return;
                    }

                    const input =
                        wrapper.querySelector(
                            "input"
                        );

                    if (!input) {
                        return;
                    }

                    if (
                        input.type ===
                        "password"
                    ) {
                        input.type =
                            "text";

                        button.textContent =
                            "🙈";

                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );
                    }
                    else {
                        input.type =
                            "password";

                        button.textContent =
                            "👁";

                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }
                }
            );
        }
    );
}

function setupWebsiteSettings() {
    const settings =
        getStorageObject(
            WEBSITE_SETTINGS_KEY,
            DEFAULT_WEBSITE_SETTINGS
        );

    const websiteName =
        document.getElementById(
            "websiteName"
        );

    const websiteDescription =
        document.getElementById(
            "websiteDescription"
        );

    const websiteEmail =
        document.getElementById(
            "websiteEmail"
        );

    const websiteLocation =
        document.getElementById(
            "websiteLocation"
        );

    if (websiteName) {
        websiteName.value =
            settings.websiteName ||
            "";
    }

    if (websiteDescription) {
        websiteDescription.value =
            settings.description ||
            "";
    }

    if (websiteEmail) {
        websiteEmail.value =
            settings.email ||
            "";
    }

    if (websiteLocation) {
        websiteLocation.value =
            settings.location ||
            "";
    }

    const form =
        document.getElementById(
            "websiteSettingsForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const updatedSettings = {
                websiteName:
                    websiteName
                        ? websiteName.value.trim()
                        : "",

                description:
                    websiteDescription
                        ? websiteDescription.value.trim()
                        : "",

                email:
                    websiteEmail
                        ? websiteEmail.value.trim()
                        : "",

                location:
                    websiteLocation
                        ? websiteLocation.value.trim()
                        : "",

                facebook:
                    settings.facebook ||
                    "",

                instagram:
                    settings.instagram ||
                    "",

                github:
                    settings.github ||
                    "",

                linkedin:
                    settings.linkedin ||
                    ""
            };

            const saved =
                saveStorageObject(
                    WEBSITE_SETTINGS_KEY,
                    updatedSettings
                );

            if (saved) {
                showWebsiteMessage(
                    "Website information saved successfully."
                );
            }
            else {
                showWebsiteMessage(
                    "Unable to save website information."
                );
            }
        }
    );
}

function showWebsiteMessage(message) {
    const messageElement =
        document.getElementById(
            "websiteInfoMessage"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    setTimeout(
        function () {
            messageElement.textContent =
                "";
        },
        3000
    );
}

function setupContentPreferences() {
    const preferences =
        getStorageObject(
            CONTENT_PREFERENCES_KEY,
            DEFAULT_CONTENT_PREFERENCES
        );

    const blogPerPage =
        document.getElementById(
            "blogPerPage"
        );

    const galleryPerPage =
        document.getElementById(
            "galleryPerPage"
        );

    const defaultBlogCategory =
        document.getElementById(
            "defaultBlogCategory"
        );

    const defaultGalleryCategory =
        document.getElementById(
            "defaultGalleryCategory"
        );

    if (blogPerPage) {
        blogPerPage.value =
            preferences.blogPerPage;
    }

    if (galleryPerPage) {
        galleryPerPage.value =
            preferences.galleryPerPage;
    }

    if (defaultBlogCategory) {
        defaultBlogCategory.value =
            preferences.defaultBlogCategory;
    }

    if (defaultGalleryCategory) {
        defaultGalleryCategory.value =
            preferences.defaultGalleryCategory;
    }

    const form =
        document.getElementById(
            "contentPreferencesForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const updatedPreferences = {
                blogPerPage:
                    blogPerPage
                        ? Number(
                            blogPerPage.value
                        )
                        : 4,

                galleryPerPage:
                    galleryPerPage
                        ? Number(
                            galleryPerPage.value
                        )
                        : 12,

                defaultBlogCategory:
                    defaultBlogCategory
                        ? defaultBlogCategory.value
                        : "All",

                defaultGalleryCategory:
                    defaultGalleryCategory
                        ? defaultGalleryCategory.value
                        : "All"
            };

            const saved =
                saveStorageObject(
                    CONTENT_PREFERENCES_KEY,
                    updatedPreferences
                );

            if (saved) {
                showContentPreferencesMessage(
                    "Content preferences saved successfully."
                );
            }
            else {
                showContentPreferencesMessage(
                    "Unable to save content preferences."
                );
            }
        }
    );
}

function showContentPreferencesMessage(message) {
    const messageElement =
        document.getElementById(
            "contentPreferencesMessage"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    setTimeout(
        function () {
            messageElement.textContent =
                "";
        },
        3000
    );
}

function setupMaintenance() {
    const exportButton =
        document.getElementById(
            "exportDataButton"
        );

    const clearButton =
        document.getElementById(
            "clearLocalDataButton"
        );

    const resetButton =
        document.getElementById(
            "resetPreferencesButton"
        );

    if (exportButton) {
        exportButton.addEventListener(
            "click",
            function () {
                exportLocalData();
            }
        );
    }

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            function () {
                const confirmed =
                    confirm(
                        "Are you sure you want to clear local website data?"
                    );

                if (!confirmed) {
                    return;
                }

                localStorage.removeItem(
                    "projects"
                );

                localStorage.removeItem(
                    "galleryItems"
                );

                localStorage.removeItem(
                    "blogs"
                );

                localStorage.removeItem(
                    "messages"
                );

                localStorage.removeItem(
                    WEBSITE_SETTINGS_KEY
                );

                localStorage.removeItem(
                    CONTENT_PREFERENCES_KEY
                );

                showMaintenanceMessage(
                    "Local website data has been cleared."
                );
            }
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            function () {
                const confirmed =
                    confirm(
                        "Reset content preferences to their default values?"
                    );

                if (!confirmed) {
                    return;
                }

                saveStorageObject(
                    CONTENT_PREFERENCES_KEY,
                    DEFAULT_CONTENT_PREFERENCES
                );

                const blogPerPage =
                    document.getElementById(
                        "blogPerPage"
                    );

                const galleryPerPage =
                    document.getElementById(
                        "galleryPerPage"
                    );

                const defaultBlogCategory =
                    document.getElementById(
                        "defaultBlogCategory"
                    );

                const defaultGalleryCategory =
                    document.getElementById(
                        "defaultGalleryCategory"
                    );

                if (blogPerPage) {
                    blogPerPage.value =
                        DEFAULT_CONTENT_PREFERENCES.blogPerPage;
                }

                if (galleryPerPage) {
                    galleryPerPage.value =
                        DEFAULT_CONTENT_PREFERENCES.galleryPerPage;
                }

                if (defaultBlogCategory) {
                    defaultBlogCategory.value =
                        DEFAULT_CONTENT_PREFERENCES.defaultBlogCategory;
                }

                if (defaultGalleryCategory) {
                    defaultGalleryCategory.value =
                        DEFAULT_CONTENT_PREFERENCES.defaultGalleryCategory;
                }

                showMaintenanceMessage(
                    "Content preferences have been reset."
                );
            }
        );
    }
}

function exportLocalData() {
    const data = {
        websiteSettings:
            getStorageObject(
                WEBSITE_SETTINGS_KEY,
                DEFAULT_WEBSITE_SETTINGS
            ),

        contentPreferences:
            getStorageObject(
                CONTENT_PREFERENCES_KEY,
                DEFAULT_CONTENT_PREFERENCES
            ),

        projects:
            getStorageObject(
                "projects",
                []
            ),

        galleryItems:
            getStorageObject(
                "galleryItems",
                []
            ),

        blogs:
            getStorageObject(
                "blogs",
                []
            ),

        messages:
            getStorageObject(
                "messages",
                []
            )
    };

    const json =
        JSON.stringify(
            data,
            null,
            4
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "website-local-data.json";

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    URL.revokeObjectURL(
        url
    );

    showMaintenanceMessage(
        "Local data exported successfully."
    );
}

function showMaintenanceMessage(message) {
    const messageElement =
        document.getElementById(
            "maintenanceMessage"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    setTimeout(
        function () {
            messageElement.textContent =
                "";
        },
        3000
    );
}

function setupResetPassword() {
    const resetPasswordButton =
        document.getElementById(
            "resetPasswordButton"
        );

    if (!resetPasswordButton) {
        return;
    }

    resetPasswordButton.addEventListener(
        "click",
        function () {
            const confirmed =
                confirm(
                    "Reset the admin password to the default password?"
                );

            if (!confirmed) {
                return;
            }

            localStorage.setItem(
                ADMIN_PASSWORD_KEY,
                DEFAULT_ADMIN_PASSWORD
            );

            localStorage.setItem(
                ADMIN_PASSWORD_CHANGED_KEY,
                new Date().toISOString()
            );

            alert(
                "Admin password has been reset to the default password: admin123"
            );

            localStorage.removeItem(
                ADMIN_LOGIN_KEY
            );

            window.location.href =
                "admin.html";
        }
    );
}

function setupLogout() {
    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            localStorage.removeItem(
                ADMIN_LOGIN_KEY
            );

            window.location.href =
                "admin.html";
        }
    );
}