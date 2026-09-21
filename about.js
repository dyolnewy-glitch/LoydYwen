// =====================================
// ABOUT PAGE JAVASCRIPT
// =====================================


const editBtn = document.getElementById("editBtn");

const editOverlay = document.getElementById("editOverlay");

const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");


const aboutDisplay = document.getElementById("aboutDisplay");

const funFactsDisplay = document.getElementById("funFactsDisplay");


const aboutInput = document.getElementById("aboutInput");

const funFactsInput = document.getElementById("funFactsInput");


const profileImage = document.getElementById("profileImage");

const imageInput = document.getElementById("imageInput");

const changePhotoBtn = document.getElementById("changePhotoBtn");


let oldAbout = "";

let oldFunFacts = "";

let oldImage = "";




// =====================================
// LOAD SAVED DATA
// =====================================

window.addEventListener("DOMContentLoaded", () => {


    const savedAbout =
        localStorage.getItem("aboutContent");


    const savedFacts =
        localStorage.getItem("funFactsContent");


    const savedImage =
        localStorage.getItem("profilePicture");



    if (savedAbout) {

        aboutDisplay.innerHTML =
            savedAbout;

    }



    if (savedFacts) {

        funFactsDisplay.innerHTML =
            savedFacts;

    }



    if (savedImage) {

        profileImage.src =
            savedImage;

    }


});




// =====================================
// CHANGE PHOTO
// =====================================

changePhotoBtn.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);





imageInput.addEventListener(
    "change",
    (event) => {


        const file =
            event.target.files[0];


        if (!file) {

            return;

        }



        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;

        }



        const reader =
            new FileReader();



        reader.onload = function () {


            // Preview image

            profileImage.src =
                reader.result;



            // Automatic save

            localStorage.setItem(
                "profilePicture",
                reader.result
            );

        };



        reader.readAsDataURL(file);


    }
);




// =====================================
// OPEN EDIT
// =====================================

editBtn.addEventListener(
    "click",
    () => {


        oldAbout =
            aboutDisplay.innerHTML;


        oldFunFacts =
            funFactsDisplay.innerHTML;


        oldImage =
            profileImage.src;



        aboutInput.value =
            getText(aboutDisplay);


        funFactsInput.value =
            getText(funFactsDisplay);



        editOverlay.style.display =
            "flex";


    }
);




// =====================================
// SAVE TEXT
// =====================================

saveBtn.addEventListener(
    "click",
    () => {


        let aboutText =
            aboutInput.value.trim();


        let factsText =
            funFactsInput.value.trim();



        if (
            aboutText === "" ||
            factsText === ""
        ) {

            alert(
                "Please complete all fields."
            );

            return;

        }



        // Create About paragraphs

        aboutDisplay.innerHTML =
            createParagraphs(
                aboutText
            );



        // Create Fun Facts paragraph

        funFactsDisplay.innerHTML =
            "<p>" +
            factsText +
            "</p>";



        // Save About content

        localStorage.setItem(
            "aboutContent",
            aboutDisplay.innerHTML
        );



        // Save Fun Facts content

        localStorage.setItem(
            "funFactsContent",
            funFactsDisplay.innerHTML
        );



        closeEditor();



        alert(
            "Changes saved!"
        );


    }
);




// =====================================
// CANCEL EDIT
// =====================================

cancelBtn.addEventListener(
    "click",
    () => {


        aboutDisplay.innerHTML =
            oldAbout;


        funFactsDisplay.innerHTML =
            oldFunFacts;



        // Hindi na ibabalik ang picture
        // dahil automatic saved na siya



        closeEditor();


    }
);




// =====================================
// CLOSE EDITOR
// =====================================

function closeEditor() {


    editOverlay.style.display =
        "none";


    imageInput.value =
        "";


}




// =====================================
// GET TEXT ONLY
// =====================================

function getText(element) {


    return element.innerText.trim();


}




// =====================================
// CREATE PARAGRAPHS
// =====================================

function createParagraphs(text) {


    return text

        .split("\n\n")

        .map(item => {

            return "<p>" +
                item +
                "</p>";

        })

        .join("");


}