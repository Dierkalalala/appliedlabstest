const swiper = new Swiper('.featured__swiper-products', {
    slidesPerView: 4,
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
    }
})
class API {
    constructor() {
        this.baseUrl = '';
    }
    static get(url) {
        return axios.get(url)
    }

    static post (url, data) {
        return axios.post(url, data)
    }
}

(function ProductWorkSpace() {
    let productOptionChanger = document.querySelectorAll('.product__option-wrapper label')
    let optionSelectors = document.querySelectorAll('.js-option-selectors');
    let selectWithAllVariants = document.querySelector('.product-select');
    let activeSelectors = [];
    let selectedProductId = selectWithAllVariants.value;
    let addToCartBtn = document.querySelector('.js-add-to-cart-btn');


    window.addEventListener('DOMContentLoaded', _startProductWorkSpace)
    function _startProductWorkSpace() {
        _setActiveStates()
        productOptionChanger.forEach(optionChanger => {
            optionChanger.addEventListener('click', changeOption)
        })
        addToCartBtn.addEventListener('click', addToCart);
    }

    function changeOption() {
        let activeSelectorIndex = this.closest('.js-option-selectors')
            .getAttribute('data-id').split('-')[1]
        activeSelectors[activeSelectorIndex].classList.remove('selected')
        activeSelectors[activeSelectorIndex] = this
        activeSelectors[activeSelectorIndex].classList.add('selected')
        _changeActiveSelectedProduct();

    }

    function _setActiveStates() {
        optionSelectors.forEach(selector => {
            activeSelectors.push(Array.from(selector.children)
                .find(select => select.classList.contains('selected')))
        })

    }

    function _changeActiveSelectedProduct() {
        let allOptions = Array.from(selectWithAllVariants.options)
        activeSelectors.forEach(selector => {
            allOptions = allOptions.filter(option => option.text.indexOf(selector.innerText) !== -1)
        })
        selectedProductId = allOptions[0].value
    }

    function addToCart() {
        API.post('/cart/add.js', {
            id: selectedProductId,
            quantity: 1,
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

    }



})()









































