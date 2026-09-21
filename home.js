```javascript
/* =====================================
   HOME HERO IMAGE SLIDESHOW
===================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================
       HERO IMAGE
    ========================= */

    const heroImage =
        document.getElementById("heroProfileImage");


    /* Stop if image doesn't exist */

    if (!heroImage) {
        return;
    }



    /* =========================
       IMAGE LIST
    ========================= */

    const heroImages = [

        "profile.jpg",

        "wen.jpg",

        "wenn.jpg",

        "wennn.jpg"

    ];



    /* =========================
       CURRENT IMAGE
    ========================= */

    let currentImage = 0;



    /* =========================
       PRELOAD IMAGES
       Para hindi mabagal ang
       pagpapalit
    ========================= */

    heroImages.forEach(function (image) {

        const preload = new Image();

        preload.src = image;

    });



    /* =========================
       CHANGE IMAGE
    ========================= */

    function changeHeroImage() {


        /* Fade out */

        heroImage.classList.add(
            "hero-image-changing"
        );


        setTimeout(function () {


            /* Move to next image */

            currentImage++;


            /* Back to first image */

            if (
                currentImage >=
                heroImages.length
            ) {

                currentImage = 0;

            }


            /* Change image */

            heroImage.src =
                heroImages[currentImage];


            /* Fade in */

            setTimeout(function () {

                heroImage.classList.remove(
                    "hero-image-changing"
                );

            }, 80);


        }, 450);

    }



    /* =========================
       AUTOMATIC SLIDESHOW

       4 seconds
    ========================= */

    setInterval(
        changeHeroImage,
        4000
    );


});
```
