/* =========================================================
   ADMIN BLOG
   SUPABASE VERSION
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://pgkrgwplunepdvrmixvj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nq1UrsN6b0YXQcKfWvKfwQ_OhJiS6yy";

let supabaseClient = null;

const BLOG_TABLE = "blog_posts";
const BLOG_BUCKET = "blog-images";


/* =========================================================
   CATEGORIES
========================================================= */

const BLOG_CATEGORIES = [
    "School Experience",
    "Project",
    "Technology",
    "Design & Creativity",
    "OJT Experience",
    "Personal",
    "Others"
];


/* =========================================================
   AUTOMATIC FEATURED
========================================================= */

const AUTOMATIC_FEATURED_TITLES = [
    "Graduation Day",
    "OJT Experience"
];


/* =========================================================
   DATA
========================================================= */

let blogs = [];

let editingIndex = -1;

let activeCategoryFilter = "All Categories";


/* =========================================================
   ELEMENTS
========================================================= */

let blogTableBody;
let noBlogItems;

let addBlogButton;

let blogModal;
let closeBlogModalButton;
let cancelBlogButton;

let blogForm;

let blogModalTitle;

let blogTitle;
let blogImage;
let blogImagePath;
let blogImagePreview;
let blogImagePlaceholder;

let blogCategory;
let blogCategoryFilter;

let blogDate;
let blogFeatured;
let blogContent;

let themeToggle;
let themeIcon;

let logoutButton;


/* =========================================================
   GET ELEMENTS
========================================================= */

function getElements() {

    blogTableBody =
        document.getElementById("blogTableBody");

    noBlogItems =
        document.getElementById("noBlogItems");

    addBlogButton =
        document.getElementById("addBlogButton");

    blogModal =
        document.getElementById("blogModal");

    closeBlogModalButton =
        document.getElementById("closeBlogModal");

    cancelBlogButton =
        document.getElementById("cancelBlogButton");

    blogForm =
        document.getElementById("blogForm");

    blogModalTitle =
        document.getElementById("blogModalTitle");

    blogTitle =
        document.getElementById("blogTitle");

    blogImage =
        document.getElementById("blogImage");

    blogImagePath =
        document.getElementById("blogImagePath");

    blogImagePreview =
        document.getElementById("blogImagePreview");

    blogImagePlaceholder =
        document.getElementById("blogImagePlaceholder");

    blogCategory =
        document.getElementById("blogCategory");

    blogCategoryFilter =
        document.getElementById("blogCategoryFilter");

    blogDate =
        document.getElementById("blogDate");

    blogFeatured =
        document.getElementById("blogFeatured");

    blogContent =
        document.getElementById("blogContent");

    themeToggle =
        document.getElementById("themeToggle");

    themeIcon =
        document.getElementById("themeIcon");

    logoutButton =
        document.getElementById("logoutButton");

}


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

function initializeSupabase() {

    if (
        typeof window.supabase === "undefined" ||
        !window.supabase.createClient
    ) {

        console.error(
            "Supabase CDN is not loaded."
        );

        return false;
    }

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        return true;

    } catch (error) {

        console.error(
            "Supabase initialization failed:",
            error
        );

        return false;
    }

}


/* =========================================================
   LOAD BLOGS
========================================================= */

async function loadBlogs() {

    if (!supabaseClient) {

        blogs = [];

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(BLOG_TABLE)
            .select("*")
            .order("blog_date", {
                ascending: false
            })
            .order("created_at", {
                ascending: false
            });

        if (error) {

            console.error(
                "Error loading blogs:",
                error
            );

            blogs = [];

            return;
        }

        blogs = Array.isArray(data)
            ? data.map(normalizeBlog)
            : [];

    } catch (error) {

        console.error(
            "Unexpected blog loading error:",
            error
        );

        blogs = [];
    }

}


/* =========================================================
   NORMALIZE BLOG
========================================================= */

function normalizeBlog(blog) {

    return {

        id:
            blog.id || "",

        title:
            blog.title || "Untitled Blog",

        category:
            blog.category || "Others",

        content:
            blog.content ||
            blog.description ||
            "",

        image:
            blog.image ||
            blog.img ||
            blog.imageUrl ||
            "",

        date:
            blog.blog_date ||
            blog.date ||
            blog.blogDate ||
            "",

        publishedDate:
            blog.published_date ||
            "",

        updatedDate:
            blog.updated_date ||
            "",

        featured:
            blog.featured === true,

        order:
            blog.blog_order ||
            999,

        created_at:
            blog.created_at ||
            ""

    };

}


/* =========================================================
   GET CURRENT DATE
========================================================= */

function getCurrentDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {

    if (!value) {

        return "No Date";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {

        return value;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   GET IMAGE
========================================================= */

function getBlogImage(blog) {

    return (
        blog.image ||
        blog.img ||
        blog.imageUrl ||
        ""
    );

}


/* =========================================================
   AUTOMATIC FEATURED
========================================================= */

function isAutomaticFeatured(title) {

    return AUTOMATIC_FEATURED_TITLES.some(
        featuredTitle =>
            featuredTitle.toLowerCase() ===
            String(title).trim().toLowerCase()
    );

}


/* =========================================================
   OPEN ADD BLOG
========================================================= */

function openAddBlog() {

    editingIndex = -1;

    if (!blogModal) {

        console.error(
            "Blog modal was not found."
        );

        return;
    }

    if (blogModalTitle) {

        blogModalTitle.textContent =
            "Add Blog";
    }

    if (blogForm) {

        blogForm.reset();
    }

    if (blogDate) {

        blogDate.value =
            getCurrentDate();
    }

    if (blogFeatured) {

        blogFeatured.checked = false;
    }

    clearImagePreview();

    blogModal.classList.add("show");

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE BLOG MODAL
========================================================= */

function closeBlogModal() {

    if (!blogModal) {

        return;
    }

    blogModal.classList.remove("show");

    document.body.classList.remove(
        "modal-open"
    );

    editingIndex = -1;

}


/* =========================================================
   SHOW IMAGE PREVIEW
========================================================= */

function showImagePreview(src) {

    if (!src) {

        clearImagePreview();

        return;
    }

    if (blogImagePreview) {

        blogImagePreview.src = src;

        blogImagePreview.style.display =
            "block";
    }

    if (blogImagePlaceholder) {

        blogImagePlaceholder.style.display =
            "none";
    }

}


/* =========================================================
   CLEAR IMAGE PREVIEW
========================================================= */

function clearImagePreview() {

    if (blogImagePreview) {

        blogImagePreview.src = "";

        blogImagePreview.style.display =
            "none";
    }

    if (blogImagePlaceholder) {

        blogImagePlaceholder.style.display =
            "block";
    }

}


/* =========================================================
   HANDLE IMAGE UPLOAD
========================================================= */

function handleImageUpload(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) {

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function () {

            showImagePreview(
                reader.result
            );

        };

    reader.readAsDataURL(file);

}


/* =========================================================
   HANDLE IMAGE PATH
========================================================= */

function handleImagePath() {

    if (!blogImagePath) {

        return;
    }

    const path =
        blogImagePath.value.trim();

    if (!path) {

        if (
            !blogImage ||
            !blogImage.files ||
            !blogImage.files.length
        ) {

            clearImagePreview();
        }

        return;
    }

    showImagePreview(path);

}


/* =========================================================
   IMAGE ERROR
========================================================= */

function handleImageError() {

    clearImagePreview();

}


/* =========================================================
   UPLOAD IMAGE TO SUPABASE STORAGE
========================================================= */

async function uploadBlogImage(file) {

    if (!supabaseClient || !file) {

        return "";
    }

    try {

        const extension =
            file.name.includes(".")
                ? file.name
                    .split(".")
                    .pop()
                    .toLowerCase()
                : "jpg";

        const safeName =
            file.name
                .replace(
                    /\.[^/.]+$/,
                    ""
                )
                .replace(
                    /[^a-zA-Z0-9_-]/g,
                    "-"
                );

        const uniqueName =
            `${Date.now()}-${safeName}.${extension}`;

        const filePath =
            uniqueName;

        const {
            error: uploadError
        } = await supabaseClient
            .storage
            .from(BLOG_BUCKET)
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );

        if (uploadError) {

            console.error(
                "Image upload error:",
                uploadError
            );

            return "";
        }

        const {
            data
        } =
            supabaseClient
                .storage
                .from(BLOG_BUCKET)
                .getPublicUrl(filePath);

        return data?.publicUrl || "";

    } catch (error) {

        console.error(
            "Unexpected image upload error:",
            error
        );

        return "";
    }

}


/* =========================================================
   EDIT BLOG
========================================================= */

function editBlog(index) {

    if (
        index < 0 ||
        index >= blogs.length
    ) {

        return;
    }

    const blog =
        blogs[index];

    editingIndex =
        index;

    if (blogModalTitle) {

        blogModalTitle.textContent =
            "Edit Blog";
    }

    if (blogTitle) {

        blogTitle.value =
            blog.title || "";
    }

    if (blogCategory) {

        blogCategory.value =
            blog.category || "Others";
    }

    if (blogDate) {

        blogDate.value =
            blog.date || "";
    }

    if (blogFeatured) {

        blogFeatured.checked =
            blog.featured === true;
    }

    if (blogContent) {

        blogContent.value =
            blog.content || "";
    }

    if (blogImagePath) {

        blogImagePath.value =
            blog.image || "";
    }

    if (blogImage) {

        blogImage.value = "";
    }

    if (blog.image) {

        showImagePreview(
            blog.image
        );

    } else {

        clearImagePreview();
    }

    if (blogModal) {

        blogModal.classList.add("show");
    }

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   DELETE OLD IMAGE
========================================================= */

async function deleteStorageImage(imageUrl) {

    if (
        !supabaseClient ||
        !imageUrl ||
        !imageUrl.includes(BLOG_BUCKET)
    ) {

        return;
    }

    try {

        const marker =
            `/storage/v1/object/public/${BLOG_BUCKET}/`;

        const index =
            imageUrl.indexOf(marker);

        if (index === -1) {

            return;
        }

        const filePath =
            imageUrl.substring(
                index + marker.length
            );

        await supabaseClient
            .storage
            .from(BLOG_BUCKET)
            .remove([
                filePath
            ]);

    } catch (error) {

        console.warn(
            "Could not delete old image:",
            error
        );
    }

}


/* =========================================================
   HANDLE BLOG SUBMIT
========================================================= */

async function handleBlogSubmit(event) {

    event.preventDefault();

    if (!supabaseClient) {

        alert(
            "Supabase is not connected yet."
        );

        return;
    }

    const title =
        blogTitle
            ? blogTitle.value.trim()
            : "";

    const category =
        blogCategory
            ? blogCategory.value
            : "";

    const date =
        blogDate
            ? blogDate.value
            : "";

    const content =
        blogContent
            ? blogContent.value.trim()
            : "";

    if (!title) {

        alert(
            "Please enter a blog title."
        );

        if (blogTitle) {

            blogTitle.focus();
        }

        return;
    }

    if (!category) {

        alert(
            "Please select a category."
        );

        if (blogCategory) {

            blogCategory.focus();
        }

        return;
    }

    if (!content) {

        alert(
            "Please enter blog content."
        );

        if (blogContent) {

            blogContent.focus();
        }

        return;
    }

    const automaticFeatured =
        isAutomaticFeatured(title);

    const featured =
        automaticFeatured
            ? true
            : blogFeatured
                ? blogFeatured.checked
                : false;

    const file =
        blogImage &&
        blogImage.files &&
        blogImage.files[0]
            ? blogImage.files[0]
            : null;

    let imageUrl = "";

    if (file) {

        imageUrl =
            await uploadBlogImage(file);

        if (!imageUrl) {

            alert(
                "The image could not be uploaded."
            );

            return;
        }

    } else {

        imageUrl =
            blogImagePath
                ? blogImagePath.value.trim()
                : "";
    }


    /* =====================================================
       EDIT
    ===================================================== */

    if (editingIndex >= 0) {

        const existingBlog =
            blogs[editingIndex];

        const updateData = {

            title:
                title,

            category:
                category,

            content:
                content,

            blog_date:
                date || null,

            featured:
                featured,

            updated_date:
                getCurrentDate()

        };

        if (imageUrl) {

            updateData.image =
                imageUrl;
        }

        const {
            data,
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .update(updateData)
                .eq(
                    "id",
                    existingBlog.id
                )
                .select()
                .single();

        if (error) {

            console.error(
                "Update blog error:",
                error
            );

            alert(
                "Failed to update blog.\n\n" +
                error.message
            );

            return;
        }

        if (
            file &&
            existingBlog.image &&
            existingBlog.image !== imageUrl
        ) {

            await deleteStorageImage(
                existingBlog.image
            );
        }

        console.log(
            "Blog updated:",
            data
        );

    }

    /* =====================================================
       ADD
    ===================================================== */

    else {

        const insertData = {

            title:
                title,

            category:
                category,

            content:
                content,

            image:
                imageUrl,

            blog_date:
                date || null,

            published_date:
                getCurrentDate(),

            updated_date:
                getCurrentDate(),

            featured:
                featured,

            blog_order:
                999

        };

        const {
            data,
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .insert(
                    insertData
                )
                .select()
                .single();

        if (error) {

            console.error(
                "Insert blog error:",
                error
            );

            alert(
                "Failed to add blog.\n\n" +
                error.message
            );

            return;
        }

        console.log(
            "Blog added:",
            data
        );
    }


    /* =====================================================
       REFRESH
    ===================================================== */

    await loadBlogs();

    renderBlogs();

    closeBlogModal();

}


/* =========================================================
   CREATE IMAGE
========================================================= */

function createBlogImage(blog) {

    const image =
        document.createElement("img");

    image.className =
        "blog-admin-thumb";

    image.alt =
        blog.title || "Blog Image";

    const imageUrl =
        getBlogImage(blog);

    if (imageUrl) {

        image.src =
            imageUrl;

    } else {

        image.style.display =
            "none";
    }

    image.onerror =
        function () {

            this.style.display =
                "none";
        };

    return image;

}


/* =========================================================
   CATEGORY BADGE
========================================================= */

function createCategoryBadge(category) {

    const badge =
        document.createElement("span");

    badge.className =
        "blog-category-badge";

    badge.textContent =
        category || "Others";

    return badge;

}


/* =========================================================
   FEATURED ELEMENT
========================================================= */

function createFeaturedElement(isFeatured) {

    if (isFeatured) {

        const badge =
            document.createElement("span");

        badge.className =
            "blog-featured-badge";

        badge.textContent =
            "Featured";

        return badge;
    }

    const text =
        document.createElement("span");

    text.className =
        "blog-not-featured";

    text.textContent =
        "No";

    return text;

}


/* =========================================================
   FILTER BLOGS
========================================================= */

function getFilteredBlogs() {

    if (
        activeCategoryFilter ===
        "All Categories"
    ) {

        return blogs;
    }

    return blogs.filter(
        blog =>
            blog.category ===
            activeCategoryFilter
    );

}


/* =========================================================
   RENDER BLOGS
========================================================= */

function renderBlogs() {

    if (!blogTableBody) {

        return;
    }

    blogTableBody.innerHTML = "";

    const filteredBlogs =
        getFilteredBlogs();

    if (!filteredBlogs.length) {

        if (noBlogItems) {

            noBlogItems.style.display =
                "block";
        }

        return;
    }

    if (noBlogItems) {

        noBlogItems.style.display =
            "none";
    }

    filteredBlogs.forEach(
        blog => {

            const actualIndex =
                blogs.indexOf(blog);

            const row =
                document.createElement("tr");


            /* IMAGE */

            const imageCell =
                document.createElement("td");

            imageCell.appendChild(
                createBlogImage(blog)
            );


            /* TITLE */

            const titleCell =
                document.createElement("td");

            titleCell.textContent =
                blog.title ||
                "Untitled Blog";


            /* CATEGORY */

            const categoryCell =
                document.createElement("td");

            categoryCell.appendChild(
                createCategoryBadge(
                    blog.category
                )
            );


            /* DATE */

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                formatDate(
                    blog.date
                );


            /* FEATURED */

            const featuredCell =
                document.createElement("td");

            featuredCell.appendChild(
                createFeaturedElement(
                    blog.featured
                )
            );


            /* ACTIONS */

            const actionsCell =
                document.createElement("td");

            actionsCell.className =
                "blog-actions";


            const editButton =
                document.createElement("button");

            editButton.type =
                "button";

            editButton.className =
                "blog-edit-btn";

            editButton.textContent =
                "Edit";

            editButton.addEventListener(
                "click",
                function () {

                    editBlog(
                        actualIndex
                    );

                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.className =
                "blog-delete-btn";

            deleteButton.textContent =
                "Delete";

            deleteButton.addEventListener(
                "click",
                function () {

                    deleteBlog(
                        actualIndex
                    );

                }
            );


            actionsCell.appendChild(
                editButton
            );

            actionsCell.appendChild(
                deleteButton
            );


            row.appendChild(
                imageCell
            );

            row.appendChild(
                titleCell
            );

            row.appendChild(
                categoryCell
            );

            row.appendChild(
                dateCell
            );

            row.appendChild(
                featuredCell
            );

            row.appendChild(
                actionsCell
            );

            blogTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   DELETE BLOG
========================================================= */

async function deleteBlog(index) {

    if (
        index < 0 ||
        index >= blogs.length
    ) {

        return;
    }

    const blog =
        blogs[index];

    const confirmed =
        confirm(
            `Delete "${blog.title}"?`
        );

    if (!confirmed) {

        return;
    }

    if (!supabaseClient) {

        alert(
            "Supabase is not connected."
        );

        return;
    }

    try {

        const {
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .delete()
                .eq(
                    "id",
                    blog.id
                );

        if (error) {

            console.error(
                "Delete blog error:",
                error
            );

            alert(
                "Failed to delete blog.\n\n" +
                error.message
            );

            return;
        }

        if (blog.image) {

            await deleteStorageImage(
                blog.image
            );
        }

        await loadBlogs();

        renderBlogs();

    } catch (error) {

        console.error(
            error
        );

        alert(
            "An unexpected error occurred."
        );
    }

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function handleCategoryFilter() {

    activeCategoryFilter =
        blogCategoryFilter
            ? blogCategoryFilter.value
            : "All Categories";

    renderBlogs();

}


/* =========================================================
   ADMIN THEME
========================================================= */

function applyAdminTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        ) === "true";

    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );

    document.documentElement.classList.toggle(
        "dark-mode",
        darkMode
    );

    if (themeIcon) {

        themeIcon.textContent =
            darkMode
                ? "☀"
                : "☾";
    }

}


/* =========================================================
   TOGGLE ADMIN THEME
========================================================= */

function toggleAdminTheme() {

    const current =
        localStorage.getItem(
            "darkMode"
        ) === "true";

    localStorage.setItem(
        "darkMode",
        String(!current)
    );

    applyAdminTheme();

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutAdmin() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    window.location.href =
        "admin-login.html";

}


/* =========================================================
   MODAL CLICK
========================================================= */

function handleModalClick(event) {

    if (
        event.target === blogModal
    ) {

        closeBlogModal();
    }

}


/* =========================================================
   ESCAPE
========================================================= */

function handleEscape(event) {

    if (
        event.key !== "Escape"
    ) {

        return;
    }

    if (
        blogModal &&
        blogModal.classList.contains(
            "show"
        )
    ) {

        closeBlogModal();
    }

}


/* =========================================================
   STORAGE EVENT
========================================================= */

function handleStorage(event) {

    if (
        event.key === "darkMode"
    ) {

        applyAdminTheme();
    }

}


/* =========================================================
   VISIBILITY
========================================================= */

async function handleVisibility() {

    if (
        document.visibilityState ===
        "visible"
    ) {

        applyAdminTheme();

        if (supabaseClient) {

            await loadBlogs();

            renderBlogs();
        }
    }

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /* =====================================================
       ADD BLOG BUTTON
    ===================================================== */

    if (addBlogButton) {

        addBlogButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                openAddBlog();

            }
        );

    } else {

        console.error(
            "Add Blog button #addBlogButton was not found."
        );
    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeBlogModalButton) {

        closeBlogModalButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeBlogModal();

            }
        );

    }


    /* =====================================================
       CANCEL BUTTON
    ===================================================== */

    if (cancelBlogButton) {

        cancelBlogButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeBlogModal();

            }
        );

    }


    /* =====================================================
       FORM
    ===================================================== */

    if (blogForm) {

        blogForm.addEventListener(
            "submit",
            handleBlogSubmit
        );

    }


    /* =====================================================
       IMAGE FILE
    ===================================================== */

    if (blogImage) {

        blogImage.addEventListener(
            "change",
            handleImageUpload
        );

    }


    /* =====================================================
       IMAGE PATH
    ===================================================== */

    if (blogImagePath) {

        blogImagePath.addEventListener(
            "input",
            handleImagePath
        );
    }


    /* =====================================================
       IMAGE PREVIEW ERROR
    ===================================================== */

    if (blogImagePreview) {

        blogImagePreview.addEventListener(
            "error",
            handleImageError
        );

    }


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    if (blogCategoryFilter) {

        blogCategoryFilter.addEventListener(
            "change",
            handleCategoryFilter
        );

    }


    /* =====================================================
       THEME
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            toggleAdminTheme
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutAdmin
        );

    }


    /* =====================================================
       MODAL BACKGROUND
    ===================================================== */

    if (blogModal) {

        blogModal.addEventListener(
            "click",
            handleModalClick
        );

    }


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        handleEscape
    );


    /* =====================================================
       STORAGE
    ===================================================== */

    window.addEventListener(
        "storage",
        handleStorage
    );


    /* =====================================================
       VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        handleVisibility
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeAdminBlog() {

    getElements();

    applyAdminTheme();

    /*
       IMPORTANT:
       Event listeners are connected BEFORE
       Supabase initialization.
       This means Add Blog can open even
       if Supabase has a temporary problem.
    */

    setupEventListeners();

    const supabaseReady =
        initializeSupabase();

    if (!supabaseReady) {

        console.error(
            "Supabase is not ready."
        );

        return;
    }

    await loadBlogs();

    renderBlogs();

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdminBlog
    );

} else {

    initializeAdminBlog();

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openAddBlog =
    openAddBlog;

window.closeBlogModal =
    closeBlogModal;

window.editBlog =
    editBlog;

window.deleteBlog =
    deleteBlog;