/* =========================================================
   ADMIN PORTFOLIO
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const PROJECT_STORAGE_KEY = "projects";


let projects =
    JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY)) || [];


let editingIndex = -1;


/* =========================================================
   ELEMENTS
========================================================= */

const projectTableBody =
    document.getElementById("projectTableBody");

const noProjects =
    document.getElementById("noProjects");

const addProjectButton =
    document.getElementById("addProjectButton");

const projectModal =
    document.getElementById("projectModal");

const closeProjectModal =
    document.getElementById("closeProjectModal");

const cancelProjectButton =
    document.getElementById("cancelProjectButton");

const projectForm =
    document.getElementById("projectForm");

const modalTitle =
    document.getElementById("modalTitle");

const addHighlightButton =
    document.getElementById("addHighlightButton");

const addFeatureButton =
    document.getElementById("addFeatureButton");

const addRoleButton =
    document.getElementById("addRoleButton");

const highlightsList =
    document.getElementById("highlightsList");

const featuresList =
    document.getElementById("featuresList");

const rolesList =
    document.getElementById("rolesList");

const automaticDate =
    document.getElementById("automaticDate");

const previewProjectButton =
    document.getElementById("previewProjectButton");

const previewOverlay =
    document.getElementById("previewOverlay");

const closePreview =
    document.getElementById("closePreview");



/* =========================================================
   FORM ELEMENTS
========================================================= */

const projectTitle =
    document.getElementById("projectTitle");

const projectCategory =
    document.getElementById("projectCategory");

const projectStatus =
    document.getElementById("projectStatus");

const projectImage =
    document.getElementById("projectImage");

const projectLink =
    document.getElementById("projectLink");

const projectTools =
    document.getElementById("projectTools");

const projectDescription =
    document.getElementById("projectDescription");

const designConcept =
    document.getElementById("designConcept");



/* =========================================================
   PREVIEW ELEMENTS
========================================================= */

const previewImageWrapper =
    document.getElementById("previewImageWrapper");

const previewImage =
    document.getElementById("previewImage");

const previewCategory =
    document.getElementById("previewCategory");

const previewStatus =
    document.getElementById("previewStatus");

const previewTitle =
    document.getElementById("previewTitle");

const previewDescription =
    document.getElementById("previewDescription");

const previewTools =
    document.getElementById("previewTools");

const previewHighlightsSection =
    document.getElementById("previewHighlightsSection");

const previewHighlights =
    document.getElementById("previewHighlights");

const previewFeaturesSection =
    document.getElementById("previewFeaturesSection");

const previewFeatures =
    document.getElementById("previewFeatures");

const previewConceptSection =
    document.getElementById("previewConceptSection");

const previewConcept =
    document.getElementById("previewConcept");

const previewRoleSection =
    document.getElementById("previewRoleSection");

const previewRoles =
    document.getElementById("previewRoles");

const previewLink =
    document.getElementById("previewLink");



/* =========================================================
   DEFAULT PROJECTS
========================================================= */

const defaultProjects = [

    {
        title: "Dinezy",

        category: "UI/UX Design",

        status: "Completed",

        image: "dinezy.jpg",

        link: "https://www.figma.com/design/Dinezy",

        tools: "Figma",

        description:
            "A restaurant booking app mockup and UI design created in Figma. Dinezy focuses on providing a simple, modern, and user-friendly experience for browsing restaurants and making table reservations.",

        highlights: [

            {
                icon: "📱",
                title: "Mobile App",
                description:
                    "Designed as a mobile restaurant booking experience."
            },

            {
                icon: "🎨",
                title: "UI/UX Design",
                description:
                    "Focused on clean layouts and an easy user experience."
            },

            {
                icon: "🍽️",
                title: "Restaurant Booking",
                description:
                    "Designed around browsing restaurants and reserving tables."
            },

            {
                icon: "🖥️",
                title: "Figma Prototype",
                description:
                    "Created and organized using Figma."
            }

        ],

        features: [

            "Restaurant browsing",

            "Restaurant menu viewing",

            "Table reservation",

            "Booking management",

            "Reservation status",

            "User profile"

        ],

        designConcept:
            "Dinezy was designed with simplicity and convenience in mind. The interface focuses on making restaurant discovery and table reservation easier through clear navigation, organized information, and a modern mobile layout.",

        roles: [

            "UI/UX Design",

            "Interface Layout",

            "Visual Design",

            "Prototype Design"

        ],

        date: "2026-09-11"

    },


    {
        title: "Photo Strips",

        category: "Graphic Design",

        status: "Completed",

        image: "pts.jpg",

        link: "",

        tools: "Canva",

        description:
            "A collection of 26 photo strips created as a graphic design project using Canva.",

        highlights: [

            {
                icon: "📸",
                title: "Photo Strip Collection",
                description:
                    "Created a collection of 26 photo strips."
            },

            {
                icon: "🎨",
                title: "Graphic Design",
                description:
                    "Designed layouts with a focus on visual composition."
            },

            {
                icon: "🖼️",
                title: "Photo Editing",
                description:
                    "Combined photos and design elements into finished strips."
            }

        ],

        features: [

            "26 photo strips",

            "Custom layouts",

            "Photo editing",

            "Graphic composition"

        ],

        designConcept:
            "The Photo Strips project focuses on creating simple and visually organized photo compositions while keeping the final layouts fun and personal.",

        roles: [

            "Graphic Design",

            "Photo Editing",

            "Layout Design"

        ],

        date: "2026-09-10"

    },


    {
        title: "Gabi Street Eats After Dark",

        category: "UI/UX Design",

        status: "Ongoing",

        image: "gabi.jpg",

        link: "https://www.figma.com/design/Gabi-Food-app",

        tools: "Figma",

        description:
            "A food discovery and ordering app concept designed around street food experiences at night.",

        highlights: [

            {
                icon: "🍜",
                title: "Food Discovery",
                description:
                    "Designed an experience for discovering street food options."
            },

            {
                icon: "🌙",
                title: "Night Food Concept",
                description:
                    "Focused on the atmosphere and experience of evening street food."
            },

            {
                icon: "📱",
                title: "Mobile UI",
                description:
                    "Designed the interface with a mobile-first experience."
            }

        ],

        features: [

            "Food browsing",

            "Food details",

            "Restaurant information",

            "Mobile interface"

        ],

        designConcept:
            "Gabi Street Eats After Dark uses a modern food-app concept centered around discovering street food and places to eat during the evening.",

        roles: [

            "UI/UX Design",

            "Interface Layout",

            "Visual Design",

            "Prototype Design"

        ],

        date: "2026-09-10"

    }

];



/* =========================================================
   INITIALIZE PROJECTS
========================================================= */

if (!localStorage.getItem(PROJECT_STORAGE_KEY)) {

    projects = defaultProjects;

    saveProjects();

}



/* =========================================================
   SAVE PROJECTS
========================================================= */

function saveProjects(){

    localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify(projects)
    );

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

    if(value === null || value === undefined){

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
   FORMAT DATE
========================================================= */

function formatDate(dateString){

    if(!dateString){

        return "—";

    }

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-US",
        {
            month:"short",
            day:"numeric",
            year:"numeric"
        }
    );

}



/* =========================================================
   TODAY
========================================================= */

function getToday(){

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2,"0");

    const day =
        String(today.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;

}



/* =========================================================
   RENDER TABLE
========================================================= */

function renderProjects(){

    projectTableBody.innerHTML = "";



    if(!projects.length){

        noProjects.classList.add("show");

        return;

    }


    noProjects.classList.remove("show");



    projects.forEach((project,index)=>{

        const row =
            document.createElement("tr");


        const statusClass =
            project.status === "Completed"
                ? "completed"
                : "ongoing";


        row.innerHTML = `

            <td class="project-name-cell">

                <div class="project-name">

                    ${escapeHTML(project.title)}

                </div>

            </td>


            <td>

                <span class="category-badge">

                    ${escapeHTML(project.category)}

                </span>

            </td>


            <td>

                <span class="status-badge ${statusClass}">

                    ${escapeHTML(project.status)}

                </span>

            </td>


            <td>

                ${formatDate(project.date)}

            </td>


            <td>

                <div class="table-actions">

                    <button
                        type="button"
                        class="table-action-btn edit"
                        data-action="edit"
                        data-index="${index}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="table-action-btn delete"
                        data-action="delete"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        projectTableBody.appendChild(row);

    });

}



/* =========================================================
   OPEN ADD MODAL
========================================================= */

function openAddModal(){

    editingIndex = -1;

    modalTitle.textContent =
        "Add Project";

    projectForm.reset();

    highlightsList.innerHTML = "";

    featuresList.innerHTML = "";

    rolesList.innerHTML = "";

    automaticDate.textContent =
        formatDate(getToday());


    addHighlight();

    addFeature();

    addRole();


    projectModal.classList.add("show");

    document.body.style.overflow = "hidden";

}



/* =========================================================
   OPEN EDIT MODAL
========================================================= */

function openEditModal(index){

    const project =
        projects[index];

    if(!project){

        return;

    }


    editingIndex = index;

    modalTitle.textContent =
        "Edit Project";


    projectTitle.value =
        project.title || "";

    projectCategory.value =
        project.category || "";

    projectStatus.value =
        project.status || "";

    projectImage.value =
        project.image || "";

    projectLink.value =
        project.link || "";

    projectTools.value =
        project.tools || "";

    projectDescription.value =
        project.description || "";

    designConcept.value =
        project.designConcept || "";


    automaticDate.textContent =
        formatDate(project.date);


    highlightsList.innerHTML = "";

    featuresList.innerHTML = "";

    rolesList.innerHTML = "";


    if(project.highlights && project.highlights.length){

        project.highlights.forEach(highlight=>{

            addHighlight(highlight);

        });

    }else{

        addHighlight();

    }


    if(project.features && project.features.length){

        project.features.forEach(feature=>{

            addFeature(feature);

        });

    }else{

        addFeature();

    }


    if(project.roles && project.roles.length){

        project.roles.forEach(role=>{

            addRole(role);

        });

    }else{

        addRole();

    }


    projectModal.classList.add("show");

    document.body.style.overflow = "hidden";

}



/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(){

    projectModal.classList.remove("show");

    document.body.style.overflow = "";

}



/* =========================================================
   ADD HIGHLIGHT
========================================================= */

function addHighlight(data = {}){

    const item =
        document.createElement("div");

    item.className =
        "dynamic-item";


    item.innerHTML = `

        <div class="dynamic-item-grid">

            <input
                type="text"
                class="dynamic-input highlight-icon"
                placeholder="📱"
                value="${escapeHTML(data.icon || "")}"
            >


            <input
                type="text"
                class="dynamic-input highlight-title"
                placeholder="Highlight title"
                value="${escapeHTML(data.title || "")}"
            >


            <textarea
                class="dynamic-textarea highlight-description"
                placeholder="Highlight description"
            >${escapeHTML(data.description || "")}</textarea>


            <button
                type="button"
                class="remove-dynamic-btn"
                title="Remove highlight"
            >
                ×
            </button>

        </div>

    `;


    item
        .querySelector(".remove-dynamic-btn")
        .addEventListener(
            "click",
            ()=>{
                item.remove();
            }
        );


    highlightsList.appendChild(item);

}



/* =========================================================
   ADD FEATURE
========================================================= */

function addFeature(value = ""){

    const item =
        document.createElement("div");

    item.className =
        "dynamic-item feature-item";


    item.innerHTML = `

        <div class="dynamic-feature-content">

            <input
                type="text"
                class="dynamic-input feature-value"
                placeholder="Example: Restaurant browsing"
                value="${escapeHTML(value)}"
            >

        </div>


        <button
            type="button"
            class="remove-dynamic-btn"
            title="Remove feature"
        >
            ×
        </button>

    `;


    item
        .querySelector(".remove-dynamic-btn")
        .addEventListener(
            "click",
            ()=>{
                item.remove();
            }
        );


    featuresList.appendChild(item);

}



/* =========================================================
   ADD ROLE
========================================================= */

function addRole(value = ""){

    const item =
        document.createElement("div");

    item.className =
        "dynamic-item feature-item";


    item.innerHTML = `

        <div class="dynamic-feature-content">

            <input
                type="text"
                class="dynamic-input role-value"
                placeholder="Example: UI/UX Design"
                value="${escapeHTML(value)}"
            >

        </div>


        <button
            type="button"
            class="remove-dynamic-btn"
            title="Remove role"
        >
            ×
        </button>

    `;


    item
        .querySelector(".remove-dynamic-btn")
        .addEventListener(
            "click",
            ()=>{
                item.remove();
            }
        );


    rolesList.appendChild(item);

}



/* =========================================================
   GET HIGHLIGHTS
========================================================= */

function getHighlights(){

    const items =
        highlightsList.querySelectorAll(".dynamic-item");


    return Array.from(items)
        .map(item=>{

            return {

                icon:
                    item
                        .querySelector(".highlight-icon")
                        .value.trim(),

                title:
                    item
                        .querySelector(".highlight-title")
                        .value.trim(),

                description:
                    item
                        .querySelector(".highlight-description")
                        .value.trim()

            };

        })
        .filter(item =>
            item.icon ||
            item.title ||
            item.description
        );

}



/* =========================================================
   GET FEATURES
========================================================= */

function getFeatures(){

    const items =
        featuresList.querySelectorAll(".dynamic-item");


    return Array.from(items)
        .map(item=>{

            return item
                .querySelector(".feature-value")
                .value.trim();

        })
        .filter(Boolean);

}



/* =========================================================
   GET ROLES
========================================================= */

function getRoles(){

    const items =
        rolesList.querySelectorAll(".dynamic-item");


    return Array.from(items)
        .map(item=>{

            return item
                .querySelector(".role-value")
                .value.trim();

        })
        .filter(Boolean);

}



/* =========================================================
   GET FORM DATA
========================================================= */

function getFormProject(){

    const existingDate =
        editingIndex >= 0 &&
        projects[editingIndex]
            ? projects[editingIndex].date
            : getToday();


    return {

        title:
            projectTitle.value.trim(),

        category:
            projectCategory.value,

        status:
            projectStatus.value,

        image:
            projectImage.value.trim(),

        link:
            projectLink.value.trim(),

        tools:
            projectTools.value.trim(),

        description:
            projectDescription.value.trim(),

        highlights:
            getHighlights(),

        features:
            getFeatures(),

        designConcept:
            designConcept.value.trim(),

        roles:
            getRoles(),

        date:
            existingDate

    };

}



/* =========================================================
   SAVE FORM
========================================================= */

projectForm.addEventListener(
    "submit",
    function(event){

        event.preventDefault();


        const project =
            getFormProject();


        if(!project.title){

            alert("Please enter a project title.");

            projectTitle.focus();

            return;

        }


        if(!project.category){

            alert("Please select a category.");

            projectCategory.focus();

            return;

        }


        if(!project.status){

            alert("Please select a status.");

            projectStatus.focus();

            return;

        }


        if(editingIndex === -1){

            projects.unshift(project);

        }else{

            projects[editingIndex] =
                project;

        }


        saveProjects();

        renderProjects();

        closeModal();


        alert(
            editingIndex === -1
                ? "Project added successfully."
                : "Project updated successfully."
        );

    }
);



/* =========================================================
   DELETE PROJECT
========================================================= */

function deleteProject(index){

    const project =
        projects[index];

    if(!project){

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${project.title}"?`
        );


    if(!confirmed){

        return;

    }


    projects.splice(index,1);

    saveProjects();

    renderProjects();

}



/* =========================================================
   TABLE ACTIONS
========================================================= */

projectTableBody.addEventListener(
    "click",
    function(event){

        const button =
            event.target.closest(
                ".table-action-btn"
            );


        if(!button){

            return;

        }


        const index =
            Number(button.dataset.index);

        const action =
            button.dataset.action;


        if(action === "edit"){

            openEditModal(index);

        }


        if(action === "delete"){

            deleteProject(index);

        }

    }
);



/* =========================================================
   PREVIEW PROJECT
========================================================= */

function previewProject(){

    const project =
        getFormProject();


    previewCategory.textContent =
        project.category || "Category";


    previewStatus.textContent =
        project.status || "Status";


    previewTitle.textContent =
        project.title || "Project Title";


    previewDescription.textContent =
        project.description ||
        "No project description yet.";


    if(project.tools){

        previewTools.style.display =
            "inline-flex";

        previewTools.textContent =
            "🛠 Tools Used: " +
            project.tools;

    }else{

        previewTools.style.display =
            "none";

    }



    /* IMAGE */

    if(project.image){

        previewImage.src =
            project.image;

        previewImage.alt =
            project.title || "Project Image";

        previewImageWrapper.classList.remove(
            "empty"
        );


        previewImage.onerror =
            function(){

                previewImageWrapper.classList.add(
                    "empty"
                );

            };

    }else{

        previewImage.src = "";

        previewImageWrapper.classList.add(
            "empty"
        );

    }



    /* HIGHLIGHTS */

    previewHighlights.innerHTML = "";


    if(project.highlights.length){

        previewHighlightsSection.style.display =
            "block";


        project.highlights.forEach(highlight=>{

            const item =
                document.createElement("div");

            item.className =
                "preview-highlight";


            item.innerHTML = `

                <div class="preview-highlight-icon">

                    ${escapeHTML(highlight.icon)}

                </div>


                <h4>

                    ${escapeHTML(highlight.title)}

                </h4>


                <p>

                    ${escapeHTML(highlight.description)}

                </p>

            `;


            previewHighlights.appendChild(item);

        });

    }else{

        previewHighlightsSection.style.display =
            "none";

    }



    /* FEATURES */

    previewFeatures.innerHTML = "";


    if(project.features.length){

        previewFeaturesSection.style.display =
            "block";


        project.features.forEach(feature=>{

            const li =
                document.createElement("li");

            li.textContent =
                feature;

            previewFeatures.appendChild(li);

        });

    }else{

        previewFeaturesSection.style.display =
            "none";

    }



    /* CONCEPT */

    if(project.designConcept){

        previewConceptSection.style.display =
            "block";

        previewConcept.textContent =
            project.designConcept;

    }else{

        previewConceptSection.style.display =
            "none";

    }



    /* ROLES */

    previewRoles.innerHTML = "";


    if(project.roles.length){

        previewRoleSection.style.display =
            "block";


        project.roles.forEach(role=>{

            const li =
                document.createElement("li");

            li.textContent =
                role;

            previewRoles.appendChild(li);

        });

    }else{

        previewRoleSection.style.display =
            "none";

    }



    /* LINK */

    if(project.link){

        previewLink.href =
            project.link;

        previewLink.classList.remove(
            "hidden"
        );

    }else{

        previewLink.href =
            "#";

        previewLink.classList.add(
            "hidden"
        );

    }


    previewOverlay.classList.add(
        "show"
    );

}



/* =========================================================
   CLOSE PREVIEW
========================================================= */

function closeProjectPreview(){

    previewOverlay.classList.remove(
        "show"
    );

}



/* =========================================================
   THEME
========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");


function applyTheme(){

    const savedTheme =
        localStorage.getItem("theme");


    if(savedTheme === "dark"){

        document.documentElement.classList.add(
            "dark-mode"
        );

        themeIcon.textContent = "☀️";

    }else{

        document.documentElement.classList.remove(
            "dark-mode"
        );

        themeIcon.textContent = "🌙";

    }

}


themeToggle.addEventListener(
    "click",
    function(){

        document.documentElement.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.documentElement.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );


        themeIcon.textContent =
            isDark ? "☀️" : "🌙";

    }
);



/* =========================================================
   LOGOUT
========================================================= */

const logoutButton =
    document.getElementById("logoutButton");


logoutButton.addEventListener(
    "click",
    function(){

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if(!confirmed){

            return;

        }


        /*
         * If you already have Supabase
         * authentication, put your
         * signOut() function here.
         */

        window.location.href =
            "index.html";

    }
);



/* =========================================================
   EVENT LISTENERS
========================================================= */

addProjectButton.addEventListener(
    "click",
    openAddModal
);


closeProjectModal.addEventListener(
    "click",
    closeModal
);


cancelProjectButton.addEventListener(
    "click",
    closeModal
);


addHighlightButton.addEventListener(
    "click",
    ()=>{
        addHighlight();
    }
);


addFeatureButton.addEventListener(
    "click",
    ()=>{
        addFeature();
    }
);


addRoleButton.addEventListener(
    "click",
    ()=>{
        addRole();
    }
);


previewProjectButton.addEventListener(
    "click",
    previewProject
);


closePreview.addEventListener(
    "click",
    closeProjectPreview
);



/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE
========================================================= */

projectModal.addEventListener(
    "click",
    function(event){

        if(event.target === projectModal){

            closeModal();

        }

    }
);


previewOverlay.addEventListener(
    "click",
    function(event){

        if(event.target === previewOverlay){

            closeProjectPreview();

        }

    }
);



/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key !== "Escape"){

            return;

        }


        if(projectModal.classList.contains("show")){

            closeModal();

        }


        if(previewOverlay.classList.contains("show")){

            closeProjectPreview();

        }

    }
);



/* =========================================================
   INITIAL LOAD
========================================================= */

applyTheme();

renderProjects();