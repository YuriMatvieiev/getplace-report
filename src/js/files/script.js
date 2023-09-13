// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// Get all the button and video elements
const buttons = document.querySelectorAll(".location__button");
const videos = document.querySelectorAll(".location__video");

// Select the header element
const header = document.querySelector("header");
if (header) {
  let prevScrollPos = window.pageYOffset;

  // Function to handle scroll event
  function handleScroll() {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos) {
      // Scrolling up
      header.classList.remove("_header-scroll-down");
      header.classList.add("_header-scroll-up");
    } else if (prevScrollPos < currentScrollPos) {
      // Scrolling down
      header.classList.remove("_header-scroll-up");
      header.classList.add("_header-scroll-down");
    }

    if (currentScrollPos === 0) {
      // Scrolled to the top
      header.classList.remove("_header-scroll-down");
      header.classList.remove("_header-scroll-up");
    }

    prevScrollPos = currentScrollPos;
  }

  // Attach the scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Add a click event listener to each button
  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      // Show the corresponding video element
      videos[index].style.display = "block";

      // Hide the button
      button.style.display = "none";

      // Start playing the video
      const iframe = videos[index].querySelector("iframe");
      iframe.src = iframe.dataset.src + "?autoplay=1";
    });
  });
}

// document.addEventListener("DOMContentLoaded", function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const locationInput = urlParams.get("address");
//   const locationAddress = document.getElementById("locationAddress");
//   if (locationInput) {
//     locationAddress.textContent = locationInput;
//   }
// });
