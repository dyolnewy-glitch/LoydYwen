// =========================================================
// ADMIN.JS
// ADMIN LOGIN
// SUPABASE AUTHENTICATION
// =========================================================


// =========================================================
// SUPABASE SETTINGS
// =========================================================

const SUPABASE_URL =
    "https://pgkrgwplunepdvrmixvj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nq1UrsN6b0YXQcKfWvKfwQ_OhJiS6yy";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================================
// LOGIN ELEMENTS
// =========================================================

const loginForm =
    document.getElementById("loginForm");

const adminEmail =
    document.getElementById("adminEmail");

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
        async function (event) {

            event.preventDefault();


            clearLoginMessage();


            // =================================================
            // GET LOGIN VALUES
            // =================================================

            const email =
                adminEmail
                    ? adminEmail.value.trim()
                    : "";


            const password =
                adminPassword
                    ? adminPassword.value
                    : "";


            // =================================================
            // EMPTY FIELDS
            // =================================================

            if (
                email === "" ||
                password === ""
            ) {

                showLoginMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            // =================================================
            // DISABLE LOGIN BUTTON
            // =================================================

            if (loginButton) {

                loginButton.disabled =
                    true;

            }


            if (loginButtonText) {

                loginButtonText.textContent =
                    "Logging in...";

            }


            try {

                // =================================================
                // SUPABASE AUTH LOGIN
                // =================================================

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                // =================================================
                // LOGIN ERROR
                // =================================================

                if (error) {

                    console.error(
                        "Supabase login error:",
                        error
                    );


                    showLoginMessage(
                        "Incorrect email or password.",
                        "error"
                    );


                    if (adminPassword) {

                        adminPassword.value =
                            "";

                        adminPassword.focus();

                    }


                    if (loginButton) {

                        loginButton.disabled =
                            false;

                    }


                    if (loginButtonText) {

                        loginButtonText.textContent =
                            "Login to Dashboard";

                    }


                    return;

                }


                // =================================================
                // CHECK SESSION
                // =================================================

                if (
                    !data ||
                    !data.session ||
                    !data.user
                ) {

                    showLoginMessage(
                        "Login failed. Please try again.",
                        "error"
                    );


                    if (loginButton) {

                        loginButton.disabled =
                            false;

                    }


                    if (loginButtonText) {

                        loginButtonText.textContent =
                            "Login to Dashboard";

                    }


                    return;

                }


                // =================================================
                // LOGIN SUCCESS
                // =================================================

                console.log(
                    "Admin login successful:",
                    data.user.email
                );


                showLoginMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                if (loginButtonText) {

                    loginButtonText.textContent =
                        "Login successful!";

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

            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );


                showLoginMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );


                if (loginButton) {

                    loginButton.disabled =
                        false;

                }


                if (loginButtonText) {

                    loginButtonText.textContent =
                        "Login to Dashboard";

                }

            }

        }
    );

} else {

    console.error(
        "loginForm not found."
    );

}


// =========================================================
// CHECK EXISTING SUPABASE SESSION
// =========================================================

async function checkAdminLoginStatus() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Unable to get Supabase session:",
                error
            );

            return;

        }


        // =================================================
        // ALREADY LOGGED IN
        // =================================================

        if (
            data &&
            data.session &&
            data.session.user
        ) {

            window.location.replace(
                "admin-dashboard.html"
            );

        }

    } catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }

}


// =========================================================
// SUPABASE AUTH STATE LISTENER
// =========================================================

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Supabase Auth State:",
            event
        );


        if (
            event === "SIGNED_IN" &&
            session
        ) {

            console.log(
                "Admin signed in:",
                session.user.email
            );

        }


        if (
            event === "SIGNED_OUT"
        ) {

            console.log(
                "Admin signed out."
            );

        }

    }
);


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
// PREVENT SCROLLING ISSUES
// =========================================================

window.addEventListener(
    "beforeunload",
    function () {

        document.body.style.overflow =
            "";

    }
);


// =========================================================
// DEBUG
// =========================================================

console.log(
    "ADMIN.JS loaded successfully."
);

console.log(
    "Supabase Auth is enabled."
);
