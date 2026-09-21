/* =========================================================
   BLOG.JS
   SUPABASE VERSION
========================================================= */


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

const BLOG_TABLE =
    "blog_posts";


/* =========================================================
   BLOG DATA
========================================================= */

let blogs = [];

let activeBlogCard = null;

let blogClosing = false;

let blogOpening = false;


/* =========================================================
   LOAD BLOGS
========================================================= */

async function loadBlogs() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(BLOG_TABLE)
                .select("*")
                .order(
                    "blog_date",
                    {
                        ascending: false
                    }
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Supabase Blog Error:",
                error
            );

            blogs = [];

            return;
        }


        blogs =
            Array.isArray(data)
                ? data.map(
                    normalizeBlog
                )
                : [];


    } catch (error) {

        console.error(
            "Unable to load blogs:",
            error
        );

        blogs = [];
    }

}


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeBlog(blog) {

    const date =
        blog.blog_date ||
        blog.date ||
        blog.blogDate ||
        "";


    return {

        ...blog,

        title:
            blog.title ||
            "Untitled Blog",

        category:
            blog.category ||
            "Others",

        date:
            date,

        image:
            blog.image ||
            "profilepic.jpg",

        content:
            blog.content ||
            blog.description ||
            "",

        featured:
            blog.featured === true,

        order:
            blog.blog_order ||
            999

    };

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {

        return "";

    }


    let value =
        String(date);


    if (
        value.includes("T")
    ) {

        value =
            value.split("T")[0];

    }


    const d =
        new Date(
            value + "T00:00:00"
        );


    if (
        isNaN(d.getTime())
    ) {

        return value;

    }


    return d.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   SORT
========================================================= */

function sortBlogs(blogArray) {

    return [...blogArray].sort(
        function(a, b) {

            const dateA =
                new Date(
                    (
                        a.date ||
                        "1970-01-01"
                    ) +
                    "T00:00:00"
                );


            const dateB =
                new Date(
                    (
                        b.date ||
                        "1970-01-01"
                    ) +
                    "T00:00:00"
                );


            const difference =
                dateB - dateA;


            if (
                difference !== 0
            ) {

                return difference;

            }


            return (
                (a.order || 999) -
                (b.order || 999)
            );

        }
    );

}


/* =========================================================
   DISPLAY BLOGS
========================================================= */

async function displayBlogs() {

    await loadBlogs();


    const container =
        document.getElementById(
            "blogContainer"
        );


    const featuredContainer =
        document.getElementById(
            "featuredContainer"
        );


    const noBlog =
        document.getElementById(
            "noBlog"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (featuredContainer) {

        featuredContainer.innerHTML =
            "";

    }


    const sortedBlogs =
        sortBlogs(blogs);


    /* =====================================================
       LATEST BLOGS
    ===================================================== */

    sortedBlogs.forEach(
        function(blog) {

            const originalIndex =
                blogs.indexOf(blog);


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "blog-card";


            card.dataset.category =
                blog.category;


            card.innerHTML = `

                <img
                    class="blog-card-image"
                    src="${escapeHTML(
                        blog.image
                    )}"
                    alt="${escapeHTML(
                        blog.title
                    )}"
                >

                <div class="blog-info">

                    <span class="blog-category">
                        ${escapeHTML(
                            blog.category
                        )}
                    </span>

                    ${
                        blog.featured
                            ? `
                                <span class="featured-badge">
                                    Featured
                                </span>
                              `
                            : ""
                    }

                    <h2>
                        ${escapeHTML(
                            blog.title
                        )}
                    </h2>

                    <p>
                        Blog Date:
                        ${formatDate(
                            blog.date
                        )}
                    </p>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openBlog(
                        originalIndex,
                        card
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );


    /* =====================================================
       FEATURED BLOGS
    ===================================================== */

    if (featuredContainer) {

        const featuredBlogs =
            sortedBlogs.filter(
                function(blog) {

                    return (
                        blog.featured === true
                    );

                }
            );


        featuredBlogs.forEach(
            function(blog) {

                const originalIndex =
                    blogs.indexOf(blog);


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "featured-card";


                card.innerHTML = `

                    <img
                        src="${escapeHTML(
                            blog.image
                        )}"
                        alt="${escapeHTML(
                            blog.title
                        )}"
                    >

                    <span class="featured-badge">
                        Featured
                    </span>

                    <div class="blog-info">

                        <span class="blog-category">
                            ${escapeHTML(
                                blog.category
                            )}
                        </span>

                        <h2>
                            ${escapeHTML(
                                blog.title
                            )}
                        </h2>

                        <p>
                            Blog Date:
                            ${formatDate(
                                blog.date
                            )}
                        </p>

                    </div>

                `;


                card.addEventListener(
                    "click",
                    function() {

                        openBlog(
                            originalIndex,
                            card
                        );

                    }
                );


                featuredContainer.appendChild(
                    card
                );

            }
        );

    }


    if (noBlog) {

        noBlog.style.display =
            sortedBlogs.length
                ? "none"
                : "block";

    }


    applySearchAndFilter();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FORMAT CONTENT
========================================================= */

function formatContent(content) {

    if (!content) {

        return "";

    }


    const paragraphs =
        String(content)
            .trim()
            .split(/\n\s*\n/)
            .filter(
                function(paragraph) {

                    return (
                        paragraph.trim()
                    );

                }
            );


    return paragraphs
        .map(
            function(paragraph) {

                return `
                    <p>
                        ${escapeHTML(
                            paragraph.trim()
                        ).replace(
                            /\n/g,
                            "<br>"
                        )}
                    </p>
                `;

            }
        )
        .join("");

}


/* =========================================================
   OPEN BLOG
========================================================= */

async function openBlog(
    index,
    sourceCard = null
) {

    if (
        blogOpening ||
        blogClosing ||
        !sourceCard
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "blogOverlay"
        );


    const preview =
        document.getElementById(
            "blogPreview"
        );


    if (
        !overlay ||
        !preview
    ) {

        return;

    }


    await loadBlogs();


    const blog =
        blogs[index];


    if (!blog) {

        return;

    }


    blogOpening =
        true;


    activeBlogCard =
        sourceCard;


    blogClosing =
        false;


    /* =====================================================
       PREVIEW CONTENT
    ===================================================== */

    preview.innerHTML = `

        <div class="preview-content">

            <img
                src="${escapeHTML(
                    blog.image
                )}"
                alt="${escapeHTML(
                    blog.title
                )}"
            >

            <span class="blog-category">
                ${escapeHTML(
                    blog.category
                )}
            </span>

            ${
                blog.featured
                    ? `
                        <span class="featured-badge">
                            Featured
                        </span>
                      `
                    : ""
            }

            <h2>
                ${escapeHTML(
                    blog.title
                )}
            </h2>

            <p class="preview-date">
                ${formatDate(
                    blog.date
                )}
            </p>

            <div class="preview-description">

                ${formatContent(
                    blog.content
                )}

            </div>

        </div>

    `;


    /* =====================================================
       RESET OVERLAY
    ===================================================== */

    overlay.style.display =
        "block";

    overlay.style.opacity =
        "0";


    /* =====================================================
       RESET PREVIEW
    ===================================================== */

    preview.style.display =
        "block";

    preview.style.opacity =
        "0";

    preview.style.transform =
        "translate(-50%, -50%) scale(.25)";


    document.body.style.overflow =
        "hidden";


    /* =====================================================
       FLIP CARD OUT
    ===================================================== */

    const flipAnimation =
        activeBlogCard.animate(

            [

                {
                    transform:
                        "perspective(1000px) rotateY(0deg) scale(1)",
                    opacity: 1
                },

                {
                    transform:
                        "perspective(1000px) rotateY(90deg) scale(.96)",
                    opacity: 0
                }

            ],

            {

                duration: 500,

                easing:
                    "cubic-bezier(.4,0,.2,1)",

                fill:
                    "forwards"

            }

        );


    await flipAnimation.finished;


    /* =====================================================
       MAKE SURE CARD IS HIDDEN
    ===================================================== */

    activeBlogCard.style.opacity =
        "0";

    activeBlogCard.style.transform =
        "perspective(1000px) rotateY(90deg) scale(.96)";


    /* =====================================================
       OVERLAY FADE IN
    ===================================================== */

    const overlayAnimation =
        overlay.animate(

            [

                {
                    opacity: 0
                },

                {
                    opacity: 1
                }

            ],

            {

                duration: 250,

                easing:
                    "ease-out",

                fill:
                    "forwards"

            }

        );


    /* =====================================================
       PREVIEW GROW
    ===================================================== */

    const previewAnimation =
        preview.animate(

            [

                {
                    opacity: 0,

                    transform:
                        "translate(-50%, -50%) scale(.25)"
                },

                {
                    opacity: 1,

                    transform:
                        "translate(-50%, -50%) scale(1)"
                }

            ],

            {

                duration: 550,

                easing:
                    "cubic-bezier(.22,1,.36,1)",

                fill:
                    "forwards"

            }

        );


    await Promise.all([
        overlayAnimation.finished,
        previewAnimation.finished
    ]);


    blogOpening =
        false;


    /* =====================================================
       CLOSE PREVIEW
    ===================================================== */

    preview.onclick =
        function() {

            closePreview();

        };


    overlay.onclick =
        function(event) {

            if (
                event.target === overlay
            ) {

                closePreview();

            }

        };

}


/* =========================================================
   CLOSE PREVIEW
========================================================= */

async function closePreview() {

    const overlay =
        document.getElementById(
            "blogOverlay"
        );


    const preview =
        document.getElementById(
            "blogPreview"
        );


    if (
        !overlay ||
        !preview ||
        overlay.style.display !== "block"
    ) {

        return;

    }


    if (
        blogClosing ||
        blogOpening
    ) {

        return;

    }


    blogClosing =
        true;


    /* =====================================================
       SHRINK PREVIEW
    ===================================================== */

    const shrinkAnimation =
        preview.animate(

            [

                {
                    opacity: 1,

                    transform:
                        "translate(-50%, -50%) scale(1)"
                },

                {
                    opacity: 0,

                    transform:
                        "translate(-50%, -50%) scale(.25)"
                }

            ],

            {

                duration: 450,

                easing:
                    "cubic-bezier(.4,0,.2,1)",

                fill:
                    "forwards"

            }

        );


    /* =====================================================
       FADE OVERLAY
    ===================================================== */

    const overlayAnimation =
        overlay.animate(

            [

                {
                    opacity: 1
                },

                {
                    opacity: 0
                }

            ],

            {

                duration: 450,

                easing:
                    "ease-in",

                fill:
                    "forwards"

            }

        );


    await Promise.all([
        shrinkAnimation.finished,
        overlayAnimation.finished
    ]);


    /* =====================================================
       HIDE PREVIEW
    ===================================================== */

    preview.style.display =
        "none";

    preview.style.opacity =
        "0";

    preview.style.transform =
        "translate(-50%, -50%) scale(.25)";

    preview.innerHTML =
        "";


    overlay.style.display =
        "none";

    overlay.style.opacity =
        "0";


    /* =====================================================
       FLIP CARD BACK
    ===================================================== */

    if (activeBlogCard) {

        activeBlogCard.style.opacity =
            "0";

        activeBlogCard.style.transform =
            "perspective(1000px) rotateY(-90deg) scale(.96)";


        const flipBack =
            activeBlogCard.animate(

                [

                    {
                        transform:
                            "perspective(1000px) rotateY(-90deg) scale(.96)",
                        opacity: 0
                    },

                    {
                        transform:
                            "perspective(1000px) rotateY(0deg) scale(1)",
                        opacity: 1
                    }

                ],

                {

                    duration: 500,

                    easing:
                        "cubic-bezier(.22,1,.36,1)",

                    fill:
                        "forwards"

                }

            );


        await flipBack.finished;


        activeBlogCard.style.opacity =
            "";

        activeBlogCard.style.transform =
            "";

    }


    /* =====================================================
       RESET
    ===================================================== */

    activeBlogCard =
        null;

    blogClosing =
        false;

    document.body.style.overflow =
        "";

}


/* =========================================================
   SEARCH
========================================================= */

function applySearchAndFilter() {

    const search =
        document.getElementById(
            "search"
        );


    const filter =
        document.getElementById(
            "filterCategory"
        );


    const cards =
        document.querySelectorAll(
            "#blogContainer .blog-card"
        );


    if (
        !search ||
        !filter
    ) {

        return;

    }


    const searchText =
        search.value
            .toLowerCase()
            .trim();


    const category =
        filter.value;


    let visible =
        0;


    cards.forEach(
        function(card) {

            const title =
                card
                    .querySelector("h2")
                    ?.textContent
                    .toLowerCase() ||
                "";


            const cardCategory =
                card.dataset.category ||
                "";


            const matchesSearch =
                title.includes(
                    searchText
                );


            const matchesCategory =
                category === "All" ||
                category === "All Categories" ||
                cardCategory === category;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                card.style.display =
                    "";

                visible++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    const noBlog =
        document.getElementById(
            "noBlog"
        );


    if (noBlog) {

        noBlog.style.display =
            visible === 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   SEARCH INPUT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const search =
            document.getElementById(
                "search"
            );


        const filter =
            document.getElementById(
                "filterCategory"
            );


        if (search) {

            search.addEventListener(
                "input",
                applySearchAndFilter
            );

        }


        if (filter) {

            filter.addEventListener(
                "change",
                applySearchAndFilter
            );

        }

    }
);


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closePreview();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayBlogs();

    }
);