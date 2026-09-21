// =========================================================
// ADMIN.JS
// ADMIN LOGIN + CREATE ADMIN PASSWORD
// LOCAL STORAGE AUTHENTICATION
// =========================================================


// =========================================================
// ADMIN SETTINGS
// =========================================================

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD_KEY =
    "adminPassword";

const ADMIN_LOGIN_KEY =
    "adminLoggedIn";

const ADMIN_LAST_LOGIN_KEY =
    "adminLastLogin";


// =========================================================
// LOGIN ELEMENTS
// =========================================================

const loginForm =
    document.getElementById("loginForm");

const adminUsername =
    document.getElementById("adminUsername");

const adminPassword =
    document.getElementById("adminPassword");

const passwordToggle =
    document.getElementById("passwordToggle");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginMessage =
    document.getElementById("loginMessage");


// =========================================================
// CREATE PASSWORD ELEMENTS
// =========================================================

const createAdminPasswordButton =
    document.getElementById(
        "createAdminPasswordButton"
    );

const createPasswordOverlay =
    document.getElementById(
        "createPasswordOverlay"
    );

const closeCreatePasswordButton =
    document.getElementById(
        "closeCreatePassword"
    );

const createPasswordForm =
    document.getElementById(
        "createPasswordForm"
    );

const createAdminPassword =
    document.getElementById(
        "createAdminPassword"
    );

const confirmAdminPassword =
    document.getElementById(
        "confirmAdminPassword"
    );

const createPasswordButton =
    document.getElementById(
        "createPasswordButton"
    );

const createPasswordButtonText =
    document.getElementById(
        "createPasswordButtonText"
    );

const cancelCreatePassword =
    document.getElementById(
        "cancelCreatePassword"
    );


// =========================================================
// LOGIN MESSAGE
// =========================================================

function showLoginMessage(
    message,
    type
) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message";

    if (type) {

        loginMessage.classList.add(
            type
        );

    }

}


function clearLoginMessage() {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


// =========================================================
// GET SAVED ADMIN PASSWORD
// =========================================================

function getAdminPassword() {

    return localStorage.getItem(
        ADMIN_PASSWORD_KEY
    );

}


// =========================================================
// CHECK IF ADMIN PASSWORD EXISTS
// =========================================================

function hasAdminPassword() {

    const password =
        getAdminPassword();

    return (
        password !== null &&
        password !== ""
    );

}


// =========================================================
// OPEN CREATE PASSWORD MODAL
// =========================================================

function openCreatePassword() {

    clearLoginMessage();

    if (!createPasswordOverlay) {

        console.error(
            "Create Password Overlay not found."
        );

        return;

    }


    createPasswordOverlay.removeAttribute(
        "hidden"
    );


    createPasswordOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    if (createAdminPassword) {

        setTimeout(
            function () {

                createAdminPassword.focus();

            },
            100
        );

    }

}


// =========================================================
// CLOSE CREATE PASSWORD MODAL
// =========================================================

function closeCreatePasswordModal() {

    if (!createPasswordOverlay) {
        return;
    }


    createPasswordOverlay.classList.remove(
        "active"
    );


    createPasswordOverlay.setAttribute(
        "hidden",
        ""
    );


    document.body.style.overflow =
        "";


    if (createPasswordForm) {

        createPasswordForm.reset();

    }


    if (createPasswordButton) {

        createPasswordButton.disabled =
            false;

    }


    if (createPasswordButtonText) {

        createPasswordButtonText.textContent =
            "Create Password";

    }

}


// =========================================================
// OPEN CREATE PASSWORD BUTTON
// =========================================================

if (createAdminPasswordButton) {

    createAdminPasswordButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openCreatePassword();

        }
    );

} else {

    console.error(
        "createAdminPasswordButton not found."
    );

}


// =========================================================
// CLOSE BUTTON
// =========================================================

if (closeCreatePasswordButton) {

    closeCreatePasswordButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeCreatePasswordModal();

        }
    );

}


// =========================================================
// CANCEL BUTTON
// =========================================================

if (cancelCreatePassword) {

    cancelCreatePassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeCreatePasswordModal();

        }
    );

}


// =========================================================
// CLICK OUTSIDE MODAL
// =========================================================

if (createPasswordOverlay) {

    createPasswordOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                createPasswordOverlay
            ) {

                closeCreatePasswordModal();

            }

        }
    );

}


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            createPasswordOverlay &&
            !createPasswordOverlay.hasAttribute(
                "hidden"
            )
        ) {

            closeCreatePasswordModal();

        }

    }
);


// =========================================================
// CREATE ADMIN PASSWORD FORM
// =========================================================

if (createPasswordForm) {

    createPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newPassword =
                createAdminPassword
                    ? createAdminPassword.value
                    : "";


            const confirmPassword =
                confirmAdminPassword
                    ? confirmAdminPassword.value
                    : "";


            clearLoginMessage();


            // =================================================
            // EMPTY PASSWORD
            // =================================================

            if (
                newPassword === "" ||
                confirmPassword === ""
            ) {

                showLoginMessage(
                    "Please enter and confirm your new password.",
                    "error"
                );

                return;

            }


            // =================================================
            // PASSWORD LENGTH
            // =================================================

            if (
                newPassword.length < 6
            ) {

                showLoginMessage(
                    "Password must be at least 6 characters.",
                    "error"
                );


                if (createAdminPassword) {

                    createAdminPassword.focus();

                }

                return;

            }


            // =================================================
            // PASSWORD MATCH
            // =================================================

            if (
                newPassword !==
                confirmPassword
            ) {

                showLoginMessage(
                    "Passwords do not match.",
                    "error"
                );


                if (confirmAdminPassword) {

                    confirmAdminPassword.value =
                        "";

                    confirmAdminPassword.focus();

                }

                return;

            }


            // =================================================
            // DISABLE CREATE BUTTON
            // =================================================

            if (createPasswordButton) {

                createPasswordButton.disabled =
                    true;

            }


            if (createPasswordButtonText) {

                createPasswordButtonText.textContent =
                    "Creating...";

            }


            // =================================================
            // SAVE PASSWORD
            // =================================================

            try {

                localStorage.setItem(
                    ADMIN_PASSWORD_KEY,
                    newPassword
                );


                localStorage.removeItem(
                    ADMIN_LOGIN_KEY
                );


                localStorage.removeItem(
                    ADMIN_LAST_LOGIN_KEY
                );


                // =================================================
                // SUCCESS
                // =================================================

                showLoginMessage(
                    "Admin password created successfully. You can now log in.",
                    "success"
                );


                if (createPasswordButtonText) {

                    createPasswordButtonText.textContent =
                        "Created!";

                }


                setTimeout(
                    function () {

                        closeCreatePasswordModal();

                        if (adminPassword) {

                            adminPassword.focus();

                        }

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Unable to save admin password:",
                    error
                );


                showLoginMessage(
                    "Unable to create admin password.",
                    "error"
                );


                if (createPasswordButton) {

                    createPasswordButton.disabled =
                        false;

                }


                if (createPasswordButtonText) {

                    createPasswordButtonText.textContent =
                        "Create Password";

                }

            }

        }
    );

} else {

    console.error(
        "createPasswordForm not found."
    );

}


// =========================================================
// PASSWORD SHOW / HIDE
// =========================================================

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (!adminPassword) {
                return;
            }


            if (
                adminPassword.type ===
                "password"
            ) {

                adminPassword.type =
                    "text";


                passwordToggle.textContent =
                    "🙈";


                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );


            } else {

                adminPassword.type =
                    "password";


                passwordToggle.textContent =
                    "👁";


                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


// =========================================================
// LOGIN FORM
// =========================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearLoginMessage();


            // =================================================
            // GET LOGIN VALUES
            // =================================================

            const username =
                adminUsername
                    ? adminUsername.value.trim()
                    : "";


            const password =
                adminPassword
                    ? adminPassword.value
                    : "";


            // =================================================
            // EMPTY FIELDS
            // =================================================

            if (
                username === "" ||
                password === ""
            ) {

                showLoginMessage(
                    "Please enter your username and password.",
                    "error"
                );

                return;

            }


            // =================================================
            // USERNAME CHECK
            // =================================================

            if (
                username !==
                ADMIN_USERNAME
            ) {

                showLoginMessage(
                    "Incorrect username or password.",
                    "error"
                );


                if (adminPassword) {

                    adminPassword.value =
                        "";

                    adminPassword.focus();

                }

                return;

            }


            // =================================================
            // GET SAVED PASSWORD
            // =================================================

            const savedPassword =
                getAdminPassword();


            // =================================================
            // PASSWORD NOT CREATED
            // =================================================

            if (!savedPassword) {

                showLoginMessage(
                    "Please create an Admin Password first.",
                    "error"
                );

                return;

            }


            // =================================================
            // PASSWORD CHECK
            // =================================================

            if (
                password !==
                savedPassword
            ) {

                showLoginMessage(
                    "Incorrect username or password.",
                    "error"
                );


                if (adminPassword) {

                    adminPassword.value =
                        "";

                    adminPassword.focus();

                }

                return;

            }


            // =================================================
            // LOGIN SUCCESS
            // =================================================

            localStorage.setItem(
                ADMIN_LOGIN_KEY,
                "true"
            );


            localStorage.setItem(
                ADMIN_LAST_LOGIN_KEY,
                new Date().toISOString()
            );


            // =================================================
            // LOGIN BUTTON LOADING
            // =================================================

            if (loginButton) {

                loginButton.disabled =
                    true;

            }


            if (loginButtonText) {

                loginButtonText.textContent =
                    "Logging in...";

            }


            // =================================================
            // REDIRECT TO DASHBOARD
            // =================================================

            setTimeout(
                function () {

                    window.location.href =
                        "admin-dashboard.html";

                },
                300
            );

        }
    );

} else {

    console.error(
        "loginForm not found."
    );

}


// =========================================================
// DEFAULT USERNAME
// =========================================================

if (adminUsername) {

    adminUsername.value =
        ADMIN_USERNAME;

}


// =========================================================
// INITIAL CREATE PASSWORD STATE
// =========================================================

if (createPasswordOverlay) {

    createPasswordOverlay.setAttribute(
        "hidden",
        ""
    );

    createPasswordOverlay.classList.remove(
        "active"
    );

}


// =========================================================
// PREVENT SCROLLING IF MODAL IS OPEN
// =========================================================

window.addEventListener(
    "beforeunload",
    function () {

        document.body.style.overflow =
            "";

    }
);


// =========================================================
// CHECK LOGIN STATUS
// =========================================================

function checkAdminLoginStatus() {

    const loggedIn =
        localStorage.getItem(
            ADMIN_LOGIN_KEY
        );


    if (
        loggedIn === "true"
    ) {

        window.location.replace(
            "admin-dashboard.html"
        );

    }

}


// =========================================================
// PAGE LOAD
// =========================================================

checkAdminLoginStatus();


// =========================================================
// PAGE SHOW
// =========================================================

window.addEventListener(
    "pageshow",
    function (event) {

        checkAdminLoginStatus();


        if (
            event.persisted
        ) {

            window.location.reload();

        }

    }
);


// =========================================================
// STORAGE SYNC
// =========================================================

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            ADMIN_LOGIN_KEY
        ) {

            if (
                event.newValue !==
                "true"
            ) {

                if (
                    !window.location.pathname.endsWith(
                        "admin.html"
                    )
                ) {

                    window.location.replace(
                        "admin.html"
                    );

                }

            }

        }

    }
);


// =========================================================
// DEBUG
// =========================================================

console.log(
    "ADMIN.JS loaded successfully."
);

console.log(
    "Create Password Button:",
    createAdminPasswordButton
);

console.log(
    "Create Password Overlay:",
    createPasswordOverlay
);

console.log(
    "Create Password Form:",
    createPasswordForm
);