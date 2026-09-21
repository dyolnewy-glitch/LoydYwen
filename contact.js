
/* =========================================================
   CONTACT.JS
========================================================= */


/* =========================================================
   SUPABASE CONNECTION
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


console.log("contact.js connected!");



/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");


const sendMessageBtn =
    document.getElementById("sendMessageBtn");



if (contactForm) {


    contactForm.addEventListener(
        "submit",
        async function(event) {

            /* =================================================
               PREVENT PAGE REFRESH
            ================================================== */

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
            ================================================== */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();



            /* =================================================
               BASIC VALIDATION
            ================================================== */

            if (!name || !email || !message) {

                alert(
                    "Please complete all fields."
                );

                return;

            }



            /* =================================================
               PREVENT DOUBLE SUBMISSION
            ================================================== */

            if (sendMessageBtn) {

                sendMessageBtn.disabled = true;

                sendMessageBtn.textContent =
                    "Sending...";

            }



            /* =================================================
               SAVE MESSAGE TO SUPABASE
            ================================================== */

            try {

                const {
                    data,
                    error
                } = await supabaseClient

                    .from("contact_messages")

                    .insert([

                        {
                            name: name,

                            email: email,

                            subject:
                                "Contact Form Message",

                            message: message,

                            read: false
                        }

                    ])

                    .select()
                    .single();



                /* =================================================
                   CHECK FOR ERROR
                ================================================== */

                if (error) {

                    console.error(
                        "Supabase error:",
                        error
                    );


                    alert(
                        "Unable to send your message. Please try again."
                    );


                    return;

                }



                /* =================================================
                   SUCCESS
                ================================================== */

                console.log(
                    "Message saved successfully:",
                    data
                );


                alert(
                    "Message sent successfully!"
                );



                /* =================================================
                   CLEAR FORM
                ================================================== */

                contactForm.reset();


            } catch (error) {

                console.error(
                    "Unexpected error:",
                    error
                );


                alert(
                    "Something went wrong. Please try again."
                );


            } finally {

                /* =================================================
                   RESTORE BUTTON
                ================================================== */

                if (sendMessageBtn) {

                    sendMessageBtn.disabled = false;

                    sendMessageBtn.textContent =
                        "Send Message";

                }

            }

        }
    );


} else {

    console.log(
        "contactForm not found."
    );

}
