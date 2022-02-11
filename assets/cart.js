class Cart {
    constructor(props) {
        this.items = [];
        this.cartItemMarkUp = Handlebars.compile(`
            {{#each items as | item |}}
                <div class="cart__row">
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
                    {{ item.final_price }}
                  </div>
                  <div class="cart__quantity-td text-right">
                    <div class="cart__qty">
                        <input class="cart__qty-input js-quantity-changer" type="number" value="{{ item.quantity }}" min="1" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="cart__final-price text-right">                 
                    <div>
                      <span>{{ item.final_line_price }}</span>
                    </div>
                  </div>
                </div>
            {{/each}}
        `);
        this.readyToUseMarkUp = null;
        this.getCartItems();
    }

    cartChangeRequest(line, quantity) {
        return API.get(`/cart/change?line=${line}&quantity=${quantity}`)
    }

    getCartItems() {
        return API.get('/cart.js')
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
        console.log(this)
        if (+this.value === 0) {
            let boundRemoveElement = this.removeItem.bind(this);
            boundRemoveElement();
        }
    }

    removeItem(event) {
        event.preventDefault();
        let parent = this.closest('.cart__row')
        let wrapper = parent.parentElement;
        let arrayOfParents = Array.from
        (wrapper.querySelectorAll('.cart__row'));
        console.log(arrayOfParents.indexOf(parent));

    }


    placeElements (){
        let cartItemsWrapper = document.querySelector('.cart-items-wrapper');
        cartItemsWrapper.appendChild(this.readyToUseMarkUp);
    }



}

let cart = new Cart();
