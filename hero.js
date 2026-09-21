/* =====================================
   HERO IMAGE SLIDESHOW
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const heroImage = document.getElementById("heroProfileImage");


    /* =========================
       CHECK HERO IMAGE
    ========================= */

    if (!heroImage) {
        return;
    }


    /* =========================
       HERO IMAGE LIST
       
       profile.jpg = original photo
       wen.png     = transparent photo
       wenn.png    = transparent photo
       wennn.png   = transparent photo
    ========================= */

    const heroImages = [
        "profile.jpg",
        "wen.png",
        "wenn.png",
        "wennn.png"
    ];


    let currentImage = 0;


    /* =========================
       PRELOAD IMAGES
    ========================= */

    heroImages.forEach(function (imageSource) {

        const image = new Image();

        image.src = imageSource;

    });


    /* =========================
       CHANGE HERO IMAGE
    ========================= */

    function changeHeroImage() {

        currentImage++;


        /* Return to first image */

        if (currentImage >= heroImages.length) {

            currentImage = 0;

        }


        /* Fade out */

        heroImage.classList.add("changing");


        /* Wait for fade */

        setTimeout(function () {

            heroImage.src = heroImages[currentImage];

            heroImage.alt = "Loyd Ywen Masangcay";


            /* Fade in after image loads */

            heroImage.onload = function () {

                heroImage.classList.remove("changing");

            };


        }, 400);

    }


    /* =========================
       START SLIDESHOW
       
       3.5 seconds per image
    ========================= */

    setInterval(changeHeroImage, 3500);

});