/* =========================================================
   PUBLIC GALLERY
   SUPABASE VERSION
========================================================= */


/* =========================================================
   SUPABASE CONFIG
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
   STORAGE
========================================================= */

const GALLERY_STORAGE_KEY =
    "galleryItems";

const GALLERY_TABLE =
    "gallery_items";


let galleryItems =
    JSON.parse(
        localStorage.getItem(
            GALLERY_STORAGE_KEY
        )
    ) || [];


let currentFilter =
    "All Categories";


let currentLightboxIndex =
    -1;


/* =========================================================
   ELEMENTS
========================================================= */

const galleryGrid =
    document.getElementById(
        "galleryGrid"
    );


const galleryEmpty =
    document.getElementById(
        "galleryEmpty"
    );


const galleryFilter =
    document.getElementById(
        "galleryFilter"
    );


const galleryLightbox =
    document.getElementById(
        "galleryLightbox"
    );


const galleryLightboxImage =
    document.getElementById(
        "galleryLightboxImage"
    );


const galleryLightboxClose =
    document.getElementById(
        "galleryLightboxClose"
    );


const galleryLightboxPrev =
    document.getElementById(
        "galleryLightboxPrev"
    );


const galleryLightboxNext =
    document.getElementById(
        "galleryLightboxNext"
    );


/* =========================================================
   IMAGE SOURCE
========================================================= */

function getImageSource(item) {

    if (!item) {
        return "";
    }


    return (
        item.image ||
        item.fileName ||
        ""
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value || "")
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
   SAVE LOCAL BACKUP
========================================================= */

function saveLocalBackup() {

    localStorage.setItem(
        GALLERY_STORAGE_KEY,
        JSON.stringify(
            galleryItems
        )
    );

}


/* =========================================================
   LOAD GALLERY FROM SUPABASE
========================================================= */

async function loadGalleryFromSupabase() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from(
                GALLERY_TABLE
            )
            .select(
                "id, title, category, image, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Supabase Gallery Error:",
                error
            );

            console.log(
                "Using localStorage backup."
            );

            renderGallery();

            return;

        }


        galleryItems =
            data || [];


        saveLocalBackup();


        renderGallery();


        console.log(
            "Gallery loaded from Supabase:",
            galleryItems
        );

    }

    catch (error) {

        console.error(
            "Gallery connection error:",
            error
        );


        console.log(
            "Using localStorage backup."
        );


        renderGallery();

    }

}


/* =========================================================
   FILTER ITEMS
========================================================= */

function getFilteredItems() {

    if (
        currentFilter ===
        "All Categories"
    ) {

        return galleryItems;

    }


    return galleryItems.filter(
        function(item) {

            return (
                item.category ===
                currentFilter
            );

        }
    );

}


/* =========================================================
   RENDER PUBLIC GALLERY
========================================================= */

function renderGallery() {

    if (!galleryGrid) {
        return;
    }


    galleryGrid.innerHTML = "";


    const filteredItems =
        getFilteredItems();


    if (
        filteredItems.length === 0
    ) {

        if (galleryEmpty) {

            galleryEmpty.classList.add(
                "show"
            );

        }

        return;

    }


    if (galleryEmpty) {

        galleryEmpty.classList.remove(
            "show"
        );

    }


    filteredItems.forEach(
        function(item, index) {

            const imageSource =
                getImageSource(
                    item
                );


            if (!imageSource) {
                return;
            }


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "gallery-card";


            card.innerHTML = `

                <div class="gallery-image-wrapper">

                    <img
                        src="${escapeHTML(imageSource)}"
                        alt="Gallery Image"
                        loading="lazy">

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openLightbox(
                        index
                    );

                }
            );


            galleryGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

if (galleryFilter) {

    galleryFilter.addEventListener(
        "change",
        function() {

            currentFilter =
                this.value;


            renderGallery();

        }
    );

}


/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(index) {

    const filteredItems =
        getFilteredItems();


    if (
        index < 0 ||
        index >= filteredItems.length
    ) {

        return;

    }


    currentLightboxIndex =
        index;


    const item =
        filteredItems[index];


    const imageSource =
        getImageSource(
            item
        );


    if (!imageSource) {
        return;
    }


    galleryLightboxImage.src =
        imageSource;


    galleryLightboxImage.alt =
        "Gallery Image";


    galleryLightbox.classList.add(
        "show"
    );


    galleryLightbox.classList.add(
        "active"
    );


    document.body.classList.add(
        "lightbox-open"
    );

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    if (!galleryLightbox) {
        return;
    }


    galleryLightbox.classList.remove(
        "show"
    );


    galleryLightbox.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "lightbox-open"
    );


    currentLightboxIndex =
        -1;

}


/* =========================================================
   PREVIOUS IMAGE
========================================================= */

function showPreviousImage() {

    const filteredItems =
        getFilteredItems();


    if (
        filteredItems.length === 0
    ) {

        return;

    }


    currentLightboxIndex--;


    if (
        currentLightboxIndex < 0
    ) {

        currentLightboxIndex =
            filteredItems.length - 1;

    }


    updateLightboxImage(
        filteredItems[
            currentLightboxIndex
        ]
    );

}


/* =========================================================
   NEXT IMAGE
========================================================= */

function showNextImage() {

    const filteredItems =
        getFilteredItems();


    if (
        filteredItems.length === 0
    ) {

        return;

    }


    currentLightboxIndex++;


    if (
        currentLightboxIndex >=
        filteredItems.length
    ) {

        currentLightboxIndex = 0;

    }


    updateLightboxImage(
        filteredItems[
            currentLightboxIndex
        ]
    );

}


/* =========================================================
   UPDATE LIGHTBOX
========================================================= */

function updateLightboxImage(item) {

    if (!item) {
        return;
    }


    const imageSource =
        getImageSource(
            item
        );


    if (!imageSource) {
        return;
    }


    galleryLightboxImage.src =
        imageSource;

}


/* =========================================================
   LIGHTBOX EVENTS
========================================================= */

if (galleryLightboxClose) {

    galleryLightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (galleryLightboxPrev) {

    galleryLightboxPrev.addEventListener(
        "click",
        showPreviousImage
    );

}


if (galleryLightboxNext) {

    galleryLightboxNext.addEventListener(
        "click",
        showNextImage
    );

}


if (galleryLightbox) {

    galleryLightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                galleryLightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !galleryLightbox ||
            !galleryLightbox.classList.contains(
                "show"
            )
        ) {

            return;

        }


        if (
            event.key ===
            "Escape"
        ) {

            closeLightbox();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            showPreviousImage();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            showNextImage();

        }

    }
);


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            GALLERY_STORAGE_KEY
        ) {

            galleryItems =
                JSON.parse(
                    event.newValue
                ) || [];


            renderGallery();

        }

    }
);


/* =========================================================
   VISIBILITY SYNC
========================================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            /*
             * Do not replace Supabase data
             * with old localStorage data.
             *
             * Instead, refresh from Supabase.
             */

            loadGalleryFromSupabase();

        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

loadGalleryFromSupabase();