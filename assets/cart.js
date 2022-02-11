class CartAPI {
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
class Cart {
    constructor(props) {
        this.cartCountElement = document.querySelector('[data-cart-count]');
        this.items = [];
        Handlebars.registerHelper("formatNumber", Cart.formatNumberToPrice);
        this.cartItemMarkUp = Handlebars.compile(`
            {{#each items as | item |}}
                <div class="cart__row pb-3 mb-3 d-flex align-items-center">
                  <div class="cart__meta small--text-left">
                    <div class="cart__product-information">
                      <div class="cart__image-wrapper">
                        <img class="cart__image" alt="{{ item.featured_image.alt }}" src="{{ item.featured_image.url }}">
                      </div>
                      <div>
                        <div class="list-view-item__title">
                          <a href="" class="cart__product-title">
                            {{ item.product_title }}
                          </a>
                        </div>
    
                        <ul class="product-details">
                           {{#each item.variant_options}}
                                <li class="product-details__item product-details__item--property">{{.}}</li>
                           {{/each}}
                        </ul>
                        <p class="cart__remove">
                          <a href="/cart/change?line={{@index}}&amp;quantity=0" class="text-link js-cart-remove text-link--accent">Remove</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="cart__price text-right">
                    {{ formatNumber item.final_price }}
                  </div>
                  <div class="cart__quantity-td text-right">
                    <div class="cart__qty">
                        <input class="cart__qty-input js-quantity-changer" type="number" value="{{ item.quantity }}" min="1" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="cart__final-price text-right">                 
                    <div>
                      <span class="js-line-final-price">{{ formatNumber item.final_line_price }}</span>
                    </div>
                  </div>
                </div>
            {{/each}}
        `);
        this.readyToUseMarkUp = null;
        this.subTotalElement = document.querySelector('.cart-subtotal__price');
        this.getCartItems();
    }

    static cartChangeRequest(line, quantity) {
        return CartAPI.post(`/cart/change.js`, {
            line,
            quantity
        })
    }

    static formatNumberToPrice(number) {
        return (+number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00', '');
    }

    static getIndexOfElement(element) {
        let parent = element.closest('.cart__row')
        let wrapper = parent.parentElement;
        let arrayOfParents = Array.from
        (wrapper.querySelectorAll('.cart__row'));
        return arrayOfParents.indexOf(parent) + 1;
    }

    getCartItems() {
        return CartAPI.get('/cart.js')
            .then(res => {
                let wrapper = document.createElement('div')
                wrapper.innerHTML = this.cartItemMarkUp({items: res.data.items})
                this.readyToUseMarkUp = wrapper
                this.setEventListenersToElements()
                this.placeElements()
            })
            .catch(err => {
                console.log(err);
            })
    }


    setEventListenersToElements () {
        const QUANTITY_CHANGER = 'js-quantity-changer';
        const REMOVE_BUTTON_WRAPPER = 'js-cart-remove';

        let quantityChangerElements = this.readyToUseMarkUp.querySelectorAll(`.${QUANTITY_CHANGER}`)
        let removeButtonElements = this.readyToUseMarkUp.querySelectorAll(`.${REMOVE_BUTTON_WRAPPER}`)

        quantityChangerElements.forEach((quantityChanger) => {
            quantityChanger.addEventListener('change', this.changeQuantity.bind(quantityChanger))
        })

        removeButtonElements.forEach((removeButton) => {
            removeButton.addEventListener('click', this.removeItem.bind(removeButton))
        })

    }

    changeQuantity(event) {
        event.preventDefault();
        if (+this.value === 0) {
            let boundRemoveElement = cart.removeItem.bind(this, event);
            boundRemoveElement();
        }
        const index = Cart.getIndexOfElement(this)
        Cart.cartChangeRequest(index, +this.value)
            .then(res => {
                cart.countSubTotal(`${Cart.formatNumberToPrice(res.data.items_subtotal_price)} ${res.data.currency}`)
                this.closest('.cart__row').querySelector('.js-line-final-price').innerText =
                    Cart.formatNumberToPrice(res.data.items[index - 1].final_line_price)
                cart.cartCountElement.innerText = res.data.item_count
            })
            .catch(err => {
                console.log(err);
            })
    }


    removeItem(event) {
        event.preventDefault();
        const index = Cart.getIndexOfElement(this)
        Cart.cartChangeRequest(index, 0)
            .then(res => {
                this.closest('.cart__row').remove();
                cart.countSubTotal(
                    `${Cart.formatNumberToPrice(res.data.items_subtotal_price)} ${res.data.currency}`
                )
                cart.cartCountElement.innerText = res.data.item_count
            })
            .catch(err => {
                console.log(err)
            })
    }

    countSubTotal(subTotal) {
        this.subTotalElement.innerText = subTotal
    }


    placeElements (){
        let cartItemsWrapper = document.querySelector('.cart-items-wrapper');
        cartItemsWrapper.appendChild(this.readyToUseMarkUp);
    }



}

let cart = new Cart();
