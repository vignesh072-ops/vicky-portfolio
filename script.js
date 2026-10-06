// ===============================
// MINION INTERACTION
// ===============================

const minion = document.querySelector(".minion");
const speech = document.querySelector(".speech");

minion.addEventListener("click", function () {

    // Add animation
    minion.classList.add("clicked");

    // Show speech bubble
    speech.classList.add("show");

    // Change message
    speech.innerHTML = "Hi! 👋";

    // Remove animation after 600ms
    setTimeout(function () {
        minion.classList.remove("clicked");
    }, 600);

    // Hide speech after 2 seconds
    setTimeout(function () {
        speech.classList.remove("show");
    }, 2000);

});


// ===============================
// TOUCH SUPPORT
// ===============================

minion.addEventListener("touchstart", function () {

    speech.innerHTML = "Hi! 👋";

    speech.classList.add("show");

    minion.classList.add("clicked");

    setTimeout(function () {
        minion.classList.remove("clicked");
    }, 600);

    setTimeout(function () {
        speech.classList.remove("show");
    }, 2000);

});


// ===============================
// SCROLL REVEAL
// ===============================

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    },
    {
        threshold: 0.15
    }
);


cards.forEach(function (card) {

    card.style.opacity = "0";

    card.style.transform =
        "translateY(30px)";

    card.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(card);

});