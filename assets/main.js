console.log('hello world')
const swiper = new Swiper('.featured__swiper-products', {
    loop: true,

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 0
        },
        // when window width is >= 769px
        768: {
            slidesPerView: 2,
            spaceBetween: 16
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 16
        }
});
