/* =========================================================
   PUBLIC PORTFOLIO.JS
   Reads projects from the same localStorage used by Admin
   ========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "projects";


/* =========================================================
   ELEMENTS
========================================================= */

const projectContainer =
    document.getElementById("projectContainer");

const noProject =
    document.getElementById("noProject");


/* =========================================================
   PROJECT STATE
========================================================= */

let activeProject = null;
let activeProjectCard = null;

let projectOpening = false;
let projectClosing = false;


/* =========================================================
   GET PROJECTS
========================================================= */

function getProjects() {

    try {

        const savedProjects =
            localStorage.getItem(STORAGE_KEY);

        if (!savedProjects) {
            return [];
        }

        const parsedProjects =
            JSON.parse(savedProjects);

        return Array.isArray(parsedProjects)
            ? parsedProjects
            : [];

    } catch (error) {

        console.error(
            "Unable to load portfolio projects:",
            error
        );

        return [];

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
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
   DISPLAY PROJECTS
========================================================= */

function displayProjects() {

    if (!projectContainer) {
        return;
    }

    projectContainer.innerHTML = "";

    const projects = getProjects();

    if (!projects.length) {

        if (noProject) {
            noProject.style.display = "block";
        }

        return;
    }

    if (noProject) {
        noProject.style.display = "none";
    }


    projects.forEach((project, index) => {

        const card =
            document.createElement("article");

        card.className = "project-card";

        card.dataset.index = index;


        /* =================================================
           IMAGE
        ================================================= */

        const image =
            document.createElement("img");

        image.className = "project-image";

        image.src =
            project.image ||
            "profilepic.jpg";

        image.alt =
            project.title ||
            "Portfolio Project";

        image.onerror = function () {

            this.src = "profilepic.jpg";

        };


        /* =================================================
           CONTENT
        ================================================= */

        const content =
            document.createElement("div");

        content.className =
            "project-content";


        /* =================================================
           META
        ================================================= */

        const meta =
            document.createElement("div");

        meta.className =
            "project-meta";


        if (project.category) {

            const category =
                document.createElement("span");

            category.className =
                "category";

            category.textContent =
                project.category;

            meta.appendChild(category);

        }


        if (project.status) {

            const status =
                document.createElement("span");

            status.className =
                "status";

            status.textContent =
                project.status;

            meta.appendChild(status);

        }


        /* =================================================
           TITLE
        ================================================= */

        const title =
            document.createElement("h2");

        title.className =
            "project-title";

        title.textContent =
            project.title ||
            "Untitled Project";


        /* =================================================
           DESCRIPTION
        ================================================= */

        const description =
            document.createElement("p");

        description.className =
            "project-description";

        description.textContent =
            project.description ||
            "No project description available.";


        /* =================================================
           TOOLS
        ================================================= */

        let toolsElement = null;

        if (project.tools) {

            toolsElement =
                document.createElement("p");

            toolsElement.className =
                "tools-used";

            toolsElement.innerHTML =
                `<strong>Tools:</strong> ${escapeHTML(project.tools)}`;

        }


        /* =================================================
           VIEW BUTTON
        ================================================= */

        const viewButton =
            document.createElement("button");

        viewButton.type = "button";

        viewButton.className =
            "view-btn";

        viewButton.textContent =
            "View Project";


        /* =================================================
           APPEND
        ================================================= */

        content.appendChild(meta);
        content.appendChild(title);
        content.appendChild(description);

        if (toolsElement) {
            content.appendChild(toolsElement);
        }

        content.appendChild(viewButton);

        card.appendChild(image);
        card.appendChild(content);


        /* =================================================
           CARD CLICK
        ================================================= */

        card.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest("a") ||
                    event.target.closest("button")
                ) {

                    if (
                        !event.target.closest(".view-btn")
                    ) {
                        return;
                    }

                }

                openProjectPreview(
                    project,
                    card
                );

            }
        );


        viewButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                openProjectPreview(
                    project,
                    card
                );

            }
        );


        projectContainer.appendChild(card);

    });

}


/* =========================================================
   CREATE PREVIEW
========================================================= */

function createProjectPreview(project) {

    const oldOverlay =
        document.getElementById(
            "projectPreviewOverlay"
        );

    if (oldOverlay) {
        oldOverlay.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "projectPreviewOverlay";

    overlay.className =
        "project-preview-overlay";


    /* =====================================================
       PREVIEW BOX
    ===================================================== */

    const box =
        document.createElement("div");

    box.className =
        "project-preview-box";


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    const closeButton =
        document.createElement("button");

    closeButton.type = "button";

    closeButton.className =
        "project-preview-close";

    closeButton.innerHTML =
        "&times;";

    closeButton.setAttribute(
        "aria-label",
        "Close project preview"
    );


    /* =====================================================
       COVER
    ===================================================== */

    const cover =
        document.createElement("div");

    cover.className =
        "project-preview-cover";


    const image =
        document.createElement("img");

    image.src =
        project.image ||
        "profilepic.jpg";

    image.alt =
        project.title ||
        "Portfolio Project";

    image.onerror = function () {

        this.src =
            "profilepic.jpg";

    };

    cover.appendChild(image);


    /* =====================================================
       CONTENT
    ===================================================== */

    const content =
        document.createElement("div");

    content.className =
        "project-preview-content";


    /* =====================================================
       META
    ===================================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "project-preview-meta";


    if (project.category) {

        const category =
            document.createElement("span");

        category.className =
            "category";

        category.textContent =
            project.category;

        meta.appendChild(category);

    }


    if (project.status) {

        const status =
            document.createElement("span");

        status.className =
            "status";

        status.textContent =
            project.status;

        meta.appendChild(status);

    }


    /* =====================================================
       TITLE
    ===================================================== */

    const title =
        document.createElement("h2");

    title.className =
        "project-preview-title";

    title.textContent =
        project.title ||
        "Untitled Project";


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    const description =
        document.createElement("p");

    description.className =
        "project-preview-description";

    description.textContent =
        project.description ||
        "No project description available.";


    /* =====================================================
       TOOLS
    ===================================================== */

    const toolsSection =
        document.createElement("div");

    toolsSection.className =
        "preview-extra-section";


    if (project.tools) {

        toolsSection.innerHTML = `
            <h3>Tools Used</h3>
            <p>${escapeHTML(project.tools)}</p>
        `;

    }


    /* =====================================================
       HIGHLIGHTS
    ===================================================== */

    const highlightsSection =
        document.createElement("div");

    highlightsSection.className =
        "preview-extra-section";


    if (
        Array.isArray(project.highlights) &&
        project.highlights.length
    ) {

        let highlightsHTML =
            "<h3>Project Highlights</h3>";

        highlightsHTML +=
            '<div class="preview-highlights">';


        project.highlights.forEach(
            (highlight, index) => {

                let icon = "✨";
                let highlightTitle = "";
                let highlightText = "";


                if (
                    typeof highlight === "object" &&
                    highlight !== null
                ) {

                    icon =
                        highlight.icon ||
                        [
                            "📱",
                            "🎨",
                            "🍽️",
                            "🖥️",
                            "✨",
                            "💡"
                        ][index % 6];

                    highlightTitle =
                        highlight.title ||
                        "";

                    highlightText =
                        highlight.text ||
                        highlight.description ||
                        "";

                } else {

                    highlightTitle =
                        highlight;

                }


                highlightsHTML += `
                    <div class="preview-highlight-item">

                        <div class="preview-highlight-icon">
                            ${escapeHTML(icon)}
                        </div>

                        <div class="preview-highlight-content">

                            ${
                                highlightTitle
                                    ? `<h4>${escapeHTML(highlightTitle)}</h4>`
                                    : ""
                            }

                            ${
                                highlightText
                                    ? `<p>${escapeHTML(highlightText)}</p>`
                                    : ""
                            }

                        </div>

                    </div>
                `;

            }
        );


        highlightsHTML +=
            "</div>";

        highlightsSection.innerHTML =
            highlightsHTML;

    }


    /* =====================================================
       FEATURES
    ===================================================== */

    const featuresSection =
        document.createElement("div");

    featuresSection.className =
        "preview-extra-section";


    if (
        Array.isArray(project.features) &&
        project.features.length
    ) {

        let featuresHTML =
            "<h3>Key Features</h3>";

        featuresHTML +=
            '<ul class="preview-features">';


        project.features.forEach(
            feature => {

                if (!feature) {
                    return;
                }

                featuresHTML += `
                    <li>
                        ${escapeHTML(feature)}
                    </li>
                `;

            }
        );


        featuresHTML +=
            "</ul>";

        featuresSection.innerHTML =
            featuresHTML;

    }


    /* =====================================================
       DESIGN CONCEPT
    ===================================================== */

    const conceptSection =
        document.createElement("div");

    conceptSection.className =
        "preview-extra-section";


    if (project.designConcept) {

        conceptSection.innerHTML = `
            <h3>Design Concept</h3>
            <p>
                ${escapeHTML(project.designConcept)}
            </p>
        `;

    }


    /* =====================================================
       MY ROLE
    ===================================================== */

    const roleSection =
        document.createElement("div");

    roleSection.className =
        "preview-extra-section";


    const roles =
        Array.isArray(project.roles)
            ? project.roles
            : Array.isArray(project.role)
                ? project.role
                : [];


    if (roles.length) {

        let rolesHTML =
            "<h3>My Role</h3>";

        rolesHTML +=
            '<ul class="preview-role">';


        roles.forEach(
            role => {

                if (!role) {
                    return;
                }

                rolesHTML += `
                    <li>
                        ${escapeHTML(role)}
                    </li>
                `;

            }
        );


        rolesHTML +=
            "</ul>";

        roleSection.innerHTML =
            rolesHTML;

    }


    /* =====================================================
       ACTIONS
    ===================================================== */

    const actions =
        document.createElement("div");

    actions.className =
        "project-preview-actions";


    if (project.link) {

        const link =
            document.createElement("a");

        link.href =
            project.link;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

        link.className =
            "view-btn";

        link.textContent =
            "View Project";

        actions.appendChild(link);

    }


    const closeAction =
        document.createElement("button");

    closeAction.type =
        "button";

    closeAction.className =
        "edit-btn";

    closeAction.textContent =
        "Close";

    closeAction.addEventListener(
        "click",
        closeProjectPreview
    );

    actions.appendChild(closeAction);


    /* =====================================================
       APPEND CONTENT
    ===================================================== */

    content.appendChild(meta);
    content.appendChild(title);
    content.appendChild(description);

    if (project.tools) {
        content.appendChild(toolsSection);
    }

    if (
        Array.isArray(project.highlights) &&
        project.highlights.length
    ) {
        content.appendChild(highlightsSection);
    }

    if (
        Array.isArray(project.features) &&
        project.features.length
    ) {
        content.appendChild(featuresSection);
    }

    if (project.designConcept) {
        content.appendChild(conceptSection);
    }

    if (roles.length) {
        content.appendChild(roleSection);
    }

    content.appendChild(actions);


    box.appendChild(closeButton);
    box.appendChild(cover);
    box.appendChild(content);

    overlay.appendChild(box);

    document.body.appendChild(overlay);


    /* =====================================================
       CLOSE EVENTS
    ===================================================== */

    closeButton.addEventListener(
        "click",
        closeProjectPreview
    );


    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === overlay
            ) {
                closeProjectPreview();
            }

        }
    );


    /* =====================================================
       ANIMATION
    ===================================================== */

    requestAnimationFrame(() => {

        overlay.classList.add(
            "preview-visible"
        );

        box.classList.add(
            "preview-box-visible"
        );

    });

}


/* =========================================================
   OPEN PROJECT PREVIEW
========================================================= */

function openProjectPreview(
    project,
    card
) {

    if (
        projectOpening ||
        projectClosing
    ) {
        return;
    }


    if (
        activeProjectCard &&
        activeProjectCard !== card
    ) {
        activeProjectCard.classList.remove(
            "active-project-card"
        );
    }


    activeProject =
        project;

    activeProjectCard =
        card;

    projectOpening =
        true;


    if (card) {

        card.classList.add(
            "active-project-card"
        );

    }


    /*
       Small delay keeps the card-click
       animation smooth.
    */

    setTimeout(
        () => {

            createProjectPreview(
                project
            );

            projectOpening =
                false;

        },
        400
    );

}


/* =========================================================
   CLOSE PROJECT PREVIEW
========================================================= */

function closeProjectPreview() {

    if (
        projectClosing ||
        !activeProject
    ) {
        return;
    }


    projectClosing =
        true;


    const overlay =
        document.getElementById(
            "projectPreviewOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "preview-closing"
        );

        const box =
            overlay.querySelector(
                ".project-preview-box"
            );

        if (box) {

            box.classList.add(
                "preview-box-closing"
            );

        }

    }


    setTimeout(
        () => {

            if (overlay) {
                overlay.remove();
            }


            if (activeProjectCard) {

                activeProjectCard.classList.remove(
                    "active-project-card"
                );

            }


            activeProject =
                null;

            activeProjectCard =
                null;

            projectClosing =
                false;

        },
        400
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            activeProject
        ) {

            closeProjectPreview();

        }

    }
);


/* =========================================================
   REAL-TIME-LIKE LOCAL STORAGE UPDATE
========================================================= */

/*
   If Admin Portfolio is open in another browser tab
   and saves a project, this page will update when
   the localStorage storage event fires.
*/

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === STORAGE_KEY
        ) {

            displayProjects();

        }

    }
);


/* =========================================================
   PAGE VISIBILITY UPDATE
========================================================= */

/*
   When returning to the Public Portfolio tab,
   reload the project list from localStorage.
*/

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState === "visible"
        ) {

            displayProjects();

        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

displayProjects();