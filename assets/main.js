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
    let cartCountElement = document.querySelector('#CartCount');
    let productOptionChanger = document.querySelectorAll('.product__option-wrapper label')
    let optionSelectors = document.querySelectorAll('.js-option-selectors');
    let selectWithAllVariants = document.querySelector('.product-select');
    let activeSelectors = [];
    let selectedProductId = selectWithAllVariants.value;
    let addToCartBtn = document.querySelector('.js-add-to-cart-btn');
    let cartPopUp = document.querySelector('.cart-popup-wrapper');
    let priceElement = document.querySelector('.product__textbox-price');


    window.addEventListener('DOMContentLoaded', _startProductWorkSpace)
    function _startProductWorkSpace() {
        _setActiveStates()
        productOptionChanger.forEach(optionChanger => {
            optionChanger.addEventListener('click', changeOption)
        })
        addToCartBtn.addEventListener('click', addToCart);

        document.querySelector('.cart-popup__close').addEventListener('click', closeCartPopUp)
        document.querySelector('.cart-popup__dismiss-button').addEventListener('click', closeCartPopUp)
    }

    function closeCartPopUp() {
        document.querySelector('.cart-popup-wrapper').classList.add('cart-popup-wrapper--hidden')
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
        _changePrice(allOptions[0].getAttribute('data-price'));
    }

    function _changePrice(price) {
        priceElement.innerText = price
    }

    function _editCartPopUpContent(data) {
        let title = data.product_title;
        let options = data.options_with_values;
        let image = data.image;
        let detailsMarkUp = options.map(option =>
            `<li class="product-details__item product-details__item--variant-option">${option.name}: ${option.value}</li>`
        ).join('');
        document.querySelector('.cart-popup-item__title').innerText = title;
        document.querySelector('.cart-popup-item__description .product-details').innerHTML = detailsMarkUp;
        document.querySelector('.cart-popup-item__image-wrapper').classList.remove('hide')
        document.querySelector('.cart-popup-item__image-wrapper').innerHTML = `
            <img src="${image}" class="cart-popup-item__image" data-cart-popup-image alt="${title}">
        `;
    }

    function _showAddToCartPopUp(data) {
        _editCartPopUpContent(data)
        cartPopUp.classList.remove('cart-popup-wrapper--hidden')
    }

    function addToCart() {
        API.post('/cart/add.js', {
            id: selectedProductId,
            quantity: 1,
        })
            .then(res => {
                _showAddToCartPopUp(res.data)
                getCart()
            })
            .catch(err => {
                console.log(err)
            })
    }
    function getCart() {
        API.get('/cart.js')
            .then(res => {
                document.querySelector('[data-cart-popup-cart-quantity]').innerText = res.data.item_count
                cartCountElement.innerText = res.data.item_count
                cartCountElement.classList.remove('hide')
                cartCountElement.classList.remove('critical-hidden')
            })
            .catch(err => {
                console.log(err);
            })
    }



})()









































