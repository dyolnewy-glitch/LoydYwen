/* =========================================================
   ADMIN MESSAGES
========================================================= */


/* =========================================================
   PAGE CLASS
========================================================= */

document.body.classList.add("admin-messages-page");


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://pgkrgwplunepdvrmixvj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nq1UrsN6b0YXQcKfWvKfwQ_OhJiS6yy";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   MESSAGE DATA
========================================================= */

let messages = [];

let activeMessageIndex = -1;


/* =========================================================
   ELEMENTS
========================================================= */

const messageTableBody =
    document.getElementById("messageTableBody");

const noMessages =
    document.getElementById("noMessages");

const totalMessages =
    document.getElementById("totalMessages");

const unreadMessages =
    document.getElementById("unreadMessages");

const readMessages =
    document.getElementById("readMessages");

const messageSearch =
    document.getElementById("messageSearch");

const messageFilter =
    document.getElementById("messageFilter");


/* =========================================================
   MODAL ELEMENTS
========================================================= */

const messageModal =
    document.getElementById("messageModal");

const closeMessageModal =
    document.getElementById("closeMessageModal");

const modalAvatar =
    document.getElementById("modalAvatar");

const modalName =
    document.getElementById("modalName");

const modalEmail =
    document.getElementById("modalEmail");

const modalSubject =
    document.getElementById("modalSubject");

const modalDate =
    document.getElementById("modalDate");

const modalStatus =
    document.getElementById("modalStatus");

const modalMessage =
    document.getElementById("modalMessage");

const markReadButton =
    document.getElementById("markReadButton");

const deleteMessageButton =
    document.getElementById("deleteMessageButton");


/* =========================================================
   ADMIN HEADER ELEMENTS
========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {
        return "?";
    }


    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(dateValue);
    }


    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT DATE + TIME
========================================================= */

function formatDateTime(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(dateValue);
    }


    return date.toLocaleString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   GET SUBJECT
========================================================= */

function getSubject(message) {

    if (!message) {
        return "No Subject";
    }


    return (
        message.subject ||
        message.title ||
        "No Subject"
    );

}


/* =========================================================
   GET MESSAGE CONTENT
========================================================= */

function getMessageContent(message) {

    if (!message) {
        return "";
    }


    return (
        message.message ||
        message.content ||
        message.body ||
        ""
    );

}


/* =========================================================
   GET MESSAGE DATE
========================================================= */

function getMessageDate(message) {

    if (!message) {
        return "";
    }


    return (
        message.created_at ||
        message.date ||
        message.createdAt ||
        message.timestamp ||
        ""
    );

}


/* =========================================================
   LOAD MESSAGES FROM SUPABASE
========================================================= */

async function loadMessages() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("contact_messages")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Supabase error loading messages:",
                error
            );

            messages = [];

            if (noMessages) {

                noMessages.classList.add(
                    "show"
                );

            }

            updateSummary();
            renderMessages();

            return;

        }


        messages =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Messages loaded:",
            messages
        );


        updateSummary();
        renderMessages();

    } catch (error) {

        console.error(
            "Unexpected error loading messages:",
            error
        );

        messages = [];

        updateSummary();
        renderMessages();

    }

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {

    const total =
        messages.length;


    const unread =
        messages.filter(
            message => !message.read
        ).length;


    const read =
        messages.filter(
            message => !!message.read
        ).length;


    if (totalMessages) {

        totalMessages.textContent =
            total;

    }


    if (unreadMessages) {

        unreadMessages.textContent =
            unread;

    }


    if (readMessages) {

        readMessages.textContent =
            read;

    }

}


/* =========================================================
   GET FILTERED MESSAGES
========================================================= */

function getFilteredMessages() {

    const search =
        messageSearch
            ? messageSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        messageFilter
            ? messageFilter.value
            : "all";


    return messages
        .map(
            (message, index) => ({
                message,
                index
            })
        )
        .filter(item => {

            const message =
                item.message;


            const name =
                String(
                    message.name || ""
                ).toLowerCase();


            const email =
                String(
                    message.email || ""
                ).toLowerCase();


            const subject =
                String(
                    getSubject(message)
                ).toLowerCase();


            const content =
                String(
                    getMessageContent(message)
                ).toLowerCase();


            const matchesSearch =
                !search ||
                name.includes(search) ||
                email.includes(search) ||
                subject.includes(search) ||
                content.includes(search);


            let matchesFilter =
                true;


            if (filter === "unread") {

                matchesFilter =
                    !message.read;

            }


            if (filter === "read") {

                matchesFilter =
                    !!message.read;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages() {

    if (!messageTableBody) {
        return;
    }


    const filteredMessages =
        getFilteredMessages();


    messageTableBody.innerHTML = "";


    if (
        filteredMessages.length === 0
    ) {

        if (noMessages) {

            noMessages.classList.add(
                "show"
            );

        }

        updateSummary();

        return;

    }


    if (noMessages) {

        noMessages.classList.remove(
            "show"
        );

    }


    filteredMessages.forEach(
        item => {

            const message =
                item.message;

            const index =
                item.index;


            const row =
                document.createElement("tr");


            row.classList.add(
                "message-row"
            );


            if (!message.read) {

                row.classList.add(
                    "message-unread"
                );

            }


            const name =
                message.name ||
                "Unknown Sender";


            const email =
                message.email ||
                "No email";


            const subject =
                getSubject(message);


            const content =
                getMessageContent(message);


            const date =
                getMessageDate(message);


            const initials =
                getInitials(name);


            const statusClass =
                message.read
                    ? "read"
                    : "unread";


            const statusText =
                message.read
                    ? "Read"
                    : "Unread";


            row.innerHTML = `

                <td>

                    <div class="message-sender">

                        <div class="message-sender-avatar">

                            ${escapeHTML(initials)}

                        </div>

                        <div class="message-sender-info">

                            <span class="message-sender-name">

                                ${escapeHTML(name)}

                            </span>

                            <span class="message-sender-preview">

                                ${escapeHTML(
                                    content.substring(0, 45)
                                )}

                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <div class="message-email">

                        ${escapeHTML(email)}

                    </div>

                </td>


                <td>

                    <div class="message-subject">

                        ${escapeHTML(subject)}

                    </div>

                </td>


                <td>

                    <div class="message-date">

                        ${escapeHTML(
                            formatDate(date)
                        )}

                    </div>

                </td>


                <td>

                    <span
                        class="message-status ${statusClass}">

                        ${statusText}

                    </span>

                </td>


                <td>

                    <div class="message-actions">

                        <button
                            type="button"
                            class="message-action-btn delete"
                            title="Delete Message"
                            data-action="delete"
                            data-index="${index}">

                            🗑️

                        </button>

                    </div>

                </td>

            `;


            /* =================================================
               ENTIRE ROW IS CLICKABLE
            ================================================= */

            row.addEventListener(
                "click",
                function(event) {

                    const deleteButton =
                        event.target.closest(
                            ".message-action-btn.delete"
                        );


                    if (deleteButton) {
                        return;
                    }


                    openMessage(index);

                }
            );


            messageTableBody.appendChild(row);

        }
    );


    updateSummary();

}


/* =========================================================
   OPEN MESSAGE
========================================================= */

async function openMessage(index) {

    if (
        index < 0 ||
        index >= messages.length
    ) {
        return;
    }


    activeMessageIndex =
        index;


    const message =
        messages[index];


    const name =
        message.name ||
        "Unknown Sender";


    const email =
        message.email ||
        "No email";


    const subject =
        getSubject(message);


    const content =
        getMessageContent(message);


    const date =
        getMessageDate(message);


    /* =====================================================
       LOAD MODAL DATA
    ===================================================== */

    if (modalAvatar) {

        modalAvatar.textContent =
            getInitials(name);

    }


    if (modalName) {

        modalName.textContent =
            name;

    }


    if (modalEmail) {

        modalEmail.textContent =
            email;

    }


    if (modalSubject) {

        modalSubject.textContent =
            subject;

    }


    if (modalDate) {

        modalDate.textContent =
            formatDateTime(date);

    }


    if (modalMessage) {

        modalMessage.textContent =
            content ||
            "No message content.";

    }


    updateModalStatus();
    updateReadButton();


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    if (messageModal) {

        messageModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       AUTOMATICALLY MARK AS READ
    ===================================================== */

    if (!message.read) {

        const messageId =
            message.id;


        const {
            error
        } = await supabaseClient
            .from("contact_messages")
            .update({
                read: true
            })
            .eq(
                "id",
                messageId
            );


        if (error) {

            console.error(
                "Error marking message as read:",
                error
            );

            return;

        }


        message.read = true;


        updateSummary();
        updateModalStatus();
        updateReadButton();

        renderMessages();

    }

}


/* =========================================================
   UPDATE MODAL STATUS
========================================================= */

function updateModalStatus() {

    if (
        activeMessageIndex < 0 ||
        activeMessageIndex >= messages.length ||
        !modalStatus
    ) {
        return;
    }


    const message =
        messages[activeMessageIndex];


    modalStatus.textContent =
        message.read
            ? "Read"
            : "Unread";


    modalStatus.className =
        "message-status " +
        (
            message.read
                ? "read"
                : "unread"
        );

}


/* =========================================================
   UPDATE READ BUTTON
========================================================= */

function updateReadButton() {

    if (
        activeMessageIndex < 0 ||
        activeMessageIndex >= messages.length ||
        !markReadButton
    ) {
        return;
    }


    const message =
        messages[activeMessageIndex];


    if (message.read) {

        markReadButton.textContent =
            "Mark as Unread";

    } else {

        markReadButton.textContent =
            "Mark as Read";

    }

}


/* =========================================================
   CLOSE MESSAGE MODAL
========================================================= */

function closeMessage() {

    if (messageModal) {

        messageModal.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";


    activeMessageIndex =
        -1;

}


/* =========================================================
   TOGGLE READ STATUS
========================================================= */

async function toggleReadStatus() {

    if (
        activeMessageIndex < 0 ||
        activeMessageIndex >= messages.length
    ) {
        return;
    }


    const message =
        messages[activeMessageIndex];


    const newReadStatus =
        !message.read;


    if (markReadButton) {

        markReadButton.disabled =
            true;

    }


    try {

        const {
            error
        } = await supabaseClient
            .from("contact_messages")
            .update({
                read: newReadStatus
            })
            .eq(
                "id",
                message.id
            );


        if (error) {

            console.error(
                "Error updating message status:",
                error
            );

            alert(
                "Unable to update message status. Please try again."
            );

            return;

        }


        message.read =
            newReadStatus;


        updateSummary();
        updateModalStatus();
        updateReadButton();
        renderMessages();

    } catch (error) {

        console.error(
            "Unexpected error updating message:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

    } finally {

        if (markReadButton) {

            markReadButton.disabled =
                false;

        }

    }

}


/* =========================================================
   DELETE MESSAGE
========================================================= */

async function deleteMessage(index) {

    if (
        index < 0 ||
        index >= messages.length
    ) {
        return;
    }


    const message =
        messages[index];


    const name =
        message.name ||
        "this sender";


    const confirmed =
        window.confirm(
            `Delete the message from ${name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from("contact_messages")
            .delete()
            .eq(
                "id",
                message.id
            );


        if (error) {

            console.error(
                "Error deleting message:",
                error
            );

            alert(
                "Unable to delete the message. Please try again."
            );

            return;

        }


        messages.splice(
            index,
            1
        );


        /* =====================================================
           UPDATE ACTIVE MESSAGE INDEX
        ===================================================== */

        if (
            activeMessageIndex === index
        ) {

            closeMessage();

        } else if (
            activeMessageIndex > index
        ) {

            activeMessageIndex--;

        }


        renderMessages();
        updateSummary();

    } catch (error) {

        console.error(
            "Unexpected error deleting message:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

    }

}


/* =========================================================
   DELETE BUTTON
========================================================= */

if (messageTableBody) {

    messageTableBody.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".message-action-btn.delete"
                );


            if (!button) {
                return;
            }


            event.stopPropagation();


            const index =
                Number(
                    button.dataset.index
                );


            deleteMessage(index);

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (messageSearch) {

    messageSearch.addEventListener(
        "input",
        function() {

            renderMessages();

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

if (messageFilter) {

    messageFilter.addEventListener(
        "change",
        function() {

            renderMessages();

        }
    );

}


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (closeMessageModal) {

    closeMessageModal.addEventListener(
        "click",
        function() {

            closeMessage();

        }
    );

}


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

if (messageModal) {

    messageModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === messageModal
            ) {

                closeMessage();

            }

        }
    );

}


/* =========================================================
   MARK READ / UNREAD
========================================================= */

if (markReadButton) {

    markReadButton.addEventListener(
        "click",
        function() {

            toggleReadStatus();

        }
    );

}


/* =========================================================
   DELETE FROM MODAL
========================================================= */

if (deleteMessageButton) {

    deleteMessageButton.addEventListener(
        "click",
        function() {

            if (
                activeMessageIndex >= 0
            ) {

                deleteMessage(
                    activeMessageIndex
                );

            }

        }
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            messageModal &&
            messageModal.classList.contains("show")
        ) {

            closeMessage();

        }

    }
);


/* =========================================================
   ADMIN THEME
========================================================= */

function updateThemeIcon() {

    if (!themeIcon) {
        return;
    }


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    themeIcon.textContent =
        isDark
            ? "☀️"
            : "🌙";

}


/* =========================================================
   LOAD SAVED THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }


    updateThemeIcon();

}


/* =========================================================
   THEME TOGGLE
========================================================= */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function() {

            const isDark =
                document.body.classList.toggle(
                    "dark-mode"
                );


            localStorage.setItem(
                "theme",
                isDark
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            /*
               Remove these only if your login system
               actually uses these localStorage keys.
            */

            localStorage.removeItem(
                "adminLoggedIn"
            );

            localStorage.removeItem(
                "adminSession"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


/* =========================================================
   STORAGE CHANGES
========================================================= */

/*
   Messages are now stored in Supabase,
   so the old localStorage "messages"
   storage listener is no longer needed.
*/


/* =========================================================
   INITIALIZE
========================================================= */

loadTheme();

loadMessages();