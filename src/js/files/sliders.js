/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Базові стилі
import "../../scss/base/swiper.scss";
// Повний набір стилів з scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Повний набір стилів з node_modules
// import 'swiper/css';

// Ініціалізація слайдерів
function initSliders() {
  // Список слайдерів
  // Перевіряємо, чи є слайдер на сторінці
  if (document.querySelector(".pricing__slider")) {
    // Вказуємо склас потрібного слайдера
    // Створюємо слайдер
    new Swiper(".pricing__slider", {

      slidesPerView: "auto",
      spaceBetween: 40,
      autoHeight: false,
      speed: 800,

      // Брейкпоінти
      breakpoints: {
        320: {
          enabled: false,
        },
        479.98: {
          enabled: true,
          spaceBetween: 24,
        },
        768: {
          spaceBetween: 40,
        },
      },

      // Події
      on: {},
    });
  }
  if (document.querySelector(".hero__slider")) {
    // Вказуємо склас потрібного слайдера
    // Створюємо слайдер
    new Swiper(".hero__slider", {

      modules: [Autoplay],
      slidesPerView: "auto",
      spaceBetween: 88,
      autoHeight: false,
      speed: 5000,
      allowTouchMove: false,
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: true, // или сделать так, чтобы восстанавливался autoplay после взаимодействия
      },

      breakpoints: {
        320: {
          spaceBetween: 24,
        },
        479.98: {
          spaceBetween: 42,
        },
        768: {
          spaceBetween: 56,
        },
        991: {
          spaceBetween: 88,
        },
      },

      // Події
      on: {},
    });
  }
}
// Скролл на базі слайдера (за класом swiper scroll для оболонки слайдера)
function initSlidersScroll() {
  let sliderScrollItems = document.querySelectorAll(".swiper_scroll");
  if (sliderScrollItems.length > 0) {
    for (let index = 0; index < sliderScrollItems.length; index++) {
      const sliderScrollItem = sliderScrollItems[index];
      const sliderScrollBar =
        sliderScrollItem.querySelector(".swiper-scrollbar");
      const sliderScroll = new Swiper(sliderScrollItem, {
        observer: true,
        observeParents: true,
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: {
          enabled: true,
        },
        scrollbar: {
          el: sliderScrollBar,
          draggable: true,
          snapOnRelease: false,
        },
        mousewheel: {
          releaseOnEdges: true,
        },
      });
      sliderScroll.scrollbar.updateSize();
    }
  }
}

window.addEventListener("load", function (e) {
  // Запуск ініціалізації слайдерів
  initSliders();
  // Запуск ініціалізації скролла на базі слайдера (за класом swiper_scroll)
  //initSlidersScroll();
});
