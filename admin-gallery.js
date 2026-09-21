/* =========================================================
   ADMIN GALLERY.JS
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
   SUPABASE SETTINGS
========================================================= */

const GALLERY_TABLE =
    "gallery_items";

const GALLERY_BUCKET =
    "gallery-images";


/* =========================================================
   LOCAL STORAGE
========================================================= */

const GALLERY_STORAGE_KEY =
    "galleryItems";

let galleryItems = [];

let editingIndex = -1;


/* =========================================================
   ELEMENTS
========================================================= */

const galleryTableBody =
    document.getElementById(
        "galleryTableBody"
    );

const noGalleryItems =
    document.getElementById(
        "noGalleryItems"
    );

const galleryModal =
    document.getElementById(
        "galleryModal"
    );

const galleryForm =
    document.getElementById(
        "galleryForm"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const galleryImage =
    document.getElementById(
        "galleryImage"
    );

const galleryFileName =
    document.getElementById(
        "galleryFileName"
    );

const galleryCategory =
    document.getElementById(
        "galleryCategory"
    );

const imagePreviewBox =
    document.getElementById(
        "imagePreviewBox"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const automaticDate =
    document.getElementById(
        "automaticDate"
    );

const addGalleryButton =
    document.getElementById(
        "addGalleryButton"
    );

const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );

const cancelGalleryButton =
    document.getElementById(
        "cancelGalleryButton"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const themeIcon =
    document.getElementById(
        "themeIcon"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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
   DATE
========================================================= */

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const date =
        new Date(dateString);

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================================
   GET IMAGE NAME
========================================================= */

function getImageName(item) {

    if (!item) {
        return "Unnamed Image";
    }

    /*
       Supabase database:
       title = filename
    */

    if (item.title) {

        return String(
            item.title
        )
            .split("/")
            .pop();
    }

    /*
       Local compatibility
    */

    if (item.fileName) {

        return String(
            item.fileName
        )
            .split("/")
            .pop();
    }

    /*
       Fallback from image URL
    */

    if (item.image) {

        try {

            return decodeURIComponent(
                String(
                    item.image
                )
                    .split("?")[0]
                    .split("/")
                    .pop()
            );

        }
        catch (error) {

            return String(
                item.image
            )
                .split("?")[0]
                .split("/")
                .pop();
        }
    }

    return "Unnamed Image";
}


/* =========================================================
   GET STORAGE PATH
========================================================= */

function getStoragePath(imageUrl) {

    if (!imageUrl) {
        return "";
    }

    const marker =
        "/storage/v1/object/public/" +
        GALLERY_BUCKET +
        "/";

    const markerIndex =
        imageUrl.indexOf(
            marker
        );

    if (
        markerIndex === -1
    ) {
        return "";
    }

    const path =
        imageUrl.substring(
            markerIndex +
            marker.length
        );

    try {

        return decodeURIComponent(
            path
        );

    }
    catch (error) {

        return path;
    }
}


/* =========================================================
   SAVE LOCAL CACHE
========================================================= */

function saveLocalCache() {

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

async function loadGallery() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
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
                "Supabase load error:",
                error
            );

            alert(
                "Unable to load Gallery from Supabase.\n\n" +
                error.message
            );

            return;
        }


        galleryItems =
            (data || []).map(
                function(item) {

                    return {

                        id:
                            item.id,

                        /*
                           title is the actual
                           database filename column
                        */

                        title:
                            item.title || "",

                        fileName:
                            item.title || "",

                        category:
                            item.category || "",

                        image:
                            item.image || "",

                        date:
                            item.created_at || ""
                    };
                }
            );


        saveLocalCache();

        renderGallery();


        console.log(
            "Gallery loaded from Supabase:",
            galleryItems
        );

    }
    catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );

        alert(
            "Something went wrong while loading Gallery."
        );
    }
}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderGallery() {

    if (!galleryTableBody) {
        return;
    }

    galleryTableBody.innerHTML =
        "";


    if (
        !galleryItems.length
    ) {

        if (noGalleryItems) {

            noGalleryItems.style.display =
                "block";
        }

        return;
    }


    if (noGalleryItems) {

        noGalleryItems.style.display =
            "none";
    }


    galleryItems.forEach(
        function(
            item,
            index
        ) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>
                    <div class="gallery-picture-name">
                        ${escapeHTML(
                            getImageName(item)
                        )}
                    </div>
                </td>

                <td>
                    <span class="gallery-category">
                        ${escapeHTML(
                            item.category ||
                            "Other"
                        )}
                    </span>
                </td>

                <td>
                    <span class="gallery-date">
                        ${escapeHTML(
                            formatDate(
                                item.date
                            )
                        )}
                    </span>
                </td>

                <td>
                    <div class="gallery-actions">

                        <button
                            type="button"
                            class="gallery-edit-btn"
                            onclick="editGallery(${index})"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="gallery-delete-btn"
                            onclick="deleteGallery(${index})"
                        >
                            Delete
                        </button>

                    </div>
                </td>
            `;


            galleryTableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   RESET FORM
========================================================= */

function resetGalleryForm() {

    if (galleryForm) {

        galleryForm.reset();
    }


    if (imagePreview) {

        imagePreview.src =
            "";
    }


    if (imagePreviewBox) {

        imagePreviewBox.style.display =
            "none";
    }


    if (automaticDate) {

        automaticDate.value =
            getToday();
    }
}


/* =========================================================
   OPEN ADD MODAL
========================================================= */

function openAddModal() {

    editingIndex =
        -1;


    resetGalleryForm();


    if (modalTitle) {

        modalTitle.textContent =
            "Add Gallery Image";
    }


    if (galleryModal) {

        galleryModal.classList.add(
            "show"
        );

        galleryModal.style.display =
            "flex";
    }
}


/* =========================================================
   EDIT GALLERY
========================================================= */

function editGallery(index) {

    if (!galleryItems[index]) {
        return;
    }


    editingIndex =
        index;


    const item =
        galleryItems[index];


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Gallery Image";
    }


    /*
       Database title column
       is used as filename
    */

    if (galleryFileName) {

        galleryFileName.value =
            item.title ||
            item.fileName ||
            "";
    }


    if (galleryCategory) {

        galleryCategory.value =
            item.category ||
            "";
    }


    if (automaticDate) {

        automaticDate.value =
            item.date
                ? String(
                    item.date
                ).substring(
                    0,
                    10
                )
                : getToday();
    }


    /*
       Clear new file selection
    */

    if (galleryImage) {

        galleryImage.value =
            "";
    }


    /*
       Show existing image
    */

    if (
        item.image &&
        imagePreview &&
        imagePreviewBox
    ) {

        imagePreview.src =
            item.image;

        imagePreviewBox.style.display =
            "block";
    }
    else {

        if (imagePreview) {

            imagePreview.src =
                "";
        }

        if (imagePreviewBox) {

            imagePreviewBox.style.display =
                "none";
        }
    }


    if (galleryModal) {

        galleryModal.classList.add(
            "show"
        );

        galleryModal.style.display =
            "flex";
    }
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeGalleryModal() {

    editingIndex =
        -1;


    if (galleryModal) {

        galleryModal.classList.remove(
            "show"
        );

        galleryModal.style.display =
            "none";
    }


    resetGalleryForm();
}


/* =========================================================
   IMAGE FILE PREVIEW
========================================================= */

if (galleryImage) {

    galleryImage.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                this.value =
                    "";

                return;
            }


            /*
               Automatically use
               selected filename
            */

            if (galleryFileName) {

                galleryFileName.value =
                    file.name;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    if (imagePreview) {

                        imagePreview.src =
                            event.target.result;
                    }


                    if (imagePreviewBox) {

                        imagePreviewBox.style.display =
                            "block";
                    }
                };


            reader.readAsDataURL(
                file
            );
        }
    );
}


/* =========================================================
   IMAGE PATH PREVIEW
========================================================= */

if (galleryFileName) {

    galleryFileName.addEventListener(
        "input",
        function() {

            const value =
                this.value.trim();


            if (!value) {

                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "none";
                }

                return;
            }


            /*
               Correct image filename regex
            */

            const imagePattern =
                /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;


            if (
                value.startsWith(
                    "data:image"
                ) ||
                imagePattern.test(
                    value
                ) ||
                value.startsWith(
                    "http://"
                ) ||
                value.startsWith(
                    "https://"
                )
            ) {

                if (imagePreview) {

                    imagePreview.src =
                        value;
                }


                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "block";
                }
            }
        }
    );
}


/* =========================================================
   UPLOAD IMAGE TO SUPABASE STORAGE
========================================================= */

async function uploadGalleryImage(file) {

    if (!file) {
        return null;
    }


    let originalName =
        file.name
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /[^a-zA-Z0-9._-]/g,
                ""
            );


    if (!originalName) {

        originalName =
            "gallery-image";
    }


    const timestamp =
        Date.now();


    const randomNumber =
        Math.floor(
            Math.random() * 100000
        );


    const storagePath =
        `${timestamp}-${randomNumber}-${originalName}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                GALLERY_BUCKET
            )
            .upload(
                storagePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (error) {

        console.error(
            "Storage upload error:",
            error
        );

        throw error;
    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from(
                GALLERY_BUCKET
            )
            .getPublicUrl(
                storagePath
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Unable to create public image URL."
        );
    }


    return {

        path:
            storagePath,

        publicUrl:
            data.publicUrl
    };
}


/* =========================================================
   DELETE IMAGE FROM SUPABASE STORAGE
========================================================= */

async function deleteGalleryStorageImage(
    imageUrl
) {

    const storagePath =
        getStoragePath(
            imageUrl
        );


    if (!storagePath) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                GALLERY_BUCKET
            )
            .remove(
                [
                    storagePath
                ]
            );


    if (error) {

        console.warn(
            "Storage delete warning:",
            error
        );
    }
}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (galleryForm) {

    galleryForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            if (
                this.dataset.submitting ===
                "true"
            ) {

                return;
            }


            this.dataset.submitting =
                "true";


            try {

                const fileName =
                    galleryFileName
                        ? galleryFileName.value.trim()
                        : "";


                const category =
                    galleryCategory
                        ? galleryCategory.value
                        : "";


                /*
                   Filename is required
                */

                if (!fileName) {

                    alert(
                        "Please enter a picture filename."
                    );

                    return;
                }


                /*
                   Category is required
                */

                if (!category) {

                    alert(
                        "Please select a category."
                    );

                    return;
                }


                /*
                   Get selected image
                */

                const selectedFile =
                    galleryImage &&
                    galleryImage.files &&
                    galleryImage.files[0]
                        ? galleryImage.files[0]
                        : null;


                /* =================================================
                   EDIT
                ================================================= */

                if (
                    editingIndex !== -1 &&
                    galleryItems[editingIndex]
                ) {

                    const currentItem =
                        galleryItems[
                            editingIndex
                        ];


                    let imageValue =
                        currentItem.image ||
                        "";


                    let uploadedNewImage =
                        null;


                    /*
                       If a new image was selected,
                       upload it first.
                    */

                    if (selectedFile) {

                        uploadedNewImage =
                            await uploadGalleryImage(
                                selectedFile
                            );


                        imageValue =
                            uploadedNewImage.publicUrl;
                    }


                    /*
                       IMPORTANT:
                       title = filename
                    */

                    const updateData = {

                        title:
                            fileName,

                        category:
                            category,

                        image:
                            imageValue
                    };


                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .from(
                                GALLERY_TABLE
                            )
                            .update(
                                updateData
                            )
                            .eq(
                                "id",
                                currentItem.id
                            )
                            .select()
                            .single();


                    if (error) {

                        /*
                           If database update failed,
                           delete newly uploaded image.
                        */

                        if (
                            uploadedNewImage
                        ) {

                            await deleteGalleryStorageImage(
                                uploadedNewImage.publicUrl
                            );
                        }

                        throw error;
                    }


                    /*
                       Delete old image only
                       after successful update.
                    */

                    if (
                        uploadedNewImage &&
                        currentItem.image
                    ) {

                        await deleteGalleryStorageImage(
                            currentItem.image
                        );
                    }


                    /*
                       Update local array
                    */

                    galleryItems[
                        editingIndex
                    ] = {

                        id:
                            data.id,

                        title:
                            data.title || "",

                        fileName:
                            data.title || "",

                        category:
                            data.category || "",

                        image:
                            data.image || "",

                        date:
                            data.created_at || ""
                    };


                    saveLocalCache();

                    renderGallery();

                    closeGalleryModal();


                    alert(
                        "Gallery image updated successfully."
                    );


                    return;
                }


                /* =================================================
                   ADD
                ================================================= */

                let imageValue =
                    "";


                /*
                   If user selected a file,
                   upload to Supabase Storage.
                */

                if (selectedFile) {

                    const uploadedImage =
                        await uploadGalleryImage(
                            selectedFile
                        );


                    imageValue =
                        uploadedImage.publicUrl;
                }


                /*
                   If there is no uploaded file,
                   allow an existing URL/path.
                */

                else {

                    imageValue =
                        fileName;
                }


                /*
                   IMPORTANT:
                   title = filename
                */

                const insertData = {

                    title:
                        fileName,

                    category:
                        category,

                    image:
                        imageValue
                };


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from(
                            GALLERY_TABLE
                        )
                        .insert(
                            insertData
                        )
                        .select()
                        .single();


                if (error) {

                    /*
                       If insert failed,
                       remove uploaded image.
                    */

                    if (
                        selectedFile &&
                        imageValue
                    ) {

                        await deleteGalleryStorageImage(
                            imageValue
                        );
                    }

                    throw error;
                }


                /*
                   Add new item to local array
                */

                galleryItems.unshift({

                    id:
                        data.id,

                    title:
                        data.title || "",

                    fileName:
                        data.title || "",

                    category:
                        data.category || "",

                    image:
                        data.image || "",

                    date:
                        data.created_at || ""
                });


                saveLocalCache();

                renderGallery();

                closeGalleryModal();


                alert(
                    "Gallery image added successfully."
                );

            }
            catch (error) {

                console.error(
                    "Gallery save error:",
                    error
                );


                alert(
                    "Unable to save Gallery image.\n\n" +
                    (
                        error.message ||
                        "Unknown error"
                    )
                );
            }
            finally {

                this.dataset.submitting =
                    "false";
            }
        }
    );
}


/* =========================================================
   DELETE GALLERY
========================================================= */

async function deleteGallery(index) {

    if (!galleryItems[index]) {
        return;
    }


    const item =
        galleryItems[index];


    const imageName =
        getImageName(
            item
        );


    const confirmed =
        confirm(
            `Are you sure you want to delete "${imageName}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        /*
           Delete database row first
        */

        const {
            error
        } =
            await supabaseClient
                .from(
                    GALLERY_TABLE
                )
                .delete()
                .eq(
                    "id",
                    item.id
                );


        if (error) {
            throw error;
        }


        /*
           Delete storage image
        */

        if (item.image) {

            await deleteGalleryStorageImage(
                item.image
            );
        }


        /*
           Remove local item
        */

        galleryItems.splice(
            index,
            1
        );


        saveLocalCache();

        renderGallery();


        alert(
            "Gallery image deleted successfully."
        );

    }
    catch (error) {

        console.error(
            "Gallery delete error:",
            error
        );


        alert(
            "Unable to delete Gallery image.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );
    }
}


/* =========================================================
   ADD BUTTON
========================================================= */

if (addGalleryButton) {

    addGalleryButton.addEventListener(
        "click",
        openAddModal
    );
}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeGalleryModal
    );
}


if (cancelGalleryButton) {

    cancelGalleryButton.addEventListener(
        "click",
        closeGalleryModal
    );
}


/* =========================================================
   CLOSE OUTSIDE MODAL
========================================================= */

if (galleryModal) {

    galleryModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                galleryModal
            ) {

                closeGalleryModal();
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
            event.key ===
            "Escape"
        ) {

            if (
                galleryModal &&
                galleryModal.classList.contains(
                    "show"
                )
            ) {

                closeGalleryModal();
            }
        }
    }
);


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        ) ||
        "light";


    if (
        savedTheme ===
        "dark"
    ) {

        document.documentElement.classList.add(
            "dark-mode"
        );


        if (themeIcon) {

            themeIcon.textContent =
                "☀️";
        }

    }
    else {

        document.documentElement.classList.remove(
            "dark-mode"
        );


        if (themeIcon) {

            themeIcon.textContent =
                "🌙";
        }
    }
}


/* =========================================================
   THEME TOGGLE
========================================================= */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function() {

            const isDark =
                document.documentElement.classList.toggle(
                    "dark-mode"
                );


            localStorage.setItem(
                "theme",
                isDark
                    ? "dark"
                    : "light"
            );


            if (themeIcon) {

                themeIcon.textContent =
                    isDark
                        ? "☀️"
                        : "🌙";
            }
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
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            window.location.href =
                "index.html";
        }
    );
}


/* =========================================================
   THEME STORAGE SYNC
========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            "theme"
        ) {

            applyTheme();
        }
    }
);


/* =========================================================
   REFRESH WHEN TAB BECOMES ACTIVE
========================================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadGallery();

            applyTheme();
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

applyTheme();

loadGallery();