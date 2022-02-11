class Cart {
    constructor(props) {
        this.items = [];
        this.cartItemMarkUp = Handlebars.compile(`
            {{#each items as | item |}}
                <tr class="cart__row">
                  <td class="cart__meta small--text-left">
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
                          <a href="/cart/change?line={{@index}}&amp;quantity=0" class="text-link text-link--accent">Remove</a>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="cart__price text-right">
                    {{ item.final_price }}
                  </td>
                  <td class="cart__quantity-td text-right">
                    <div class="cart__qty">
                        <input class="cart__qty-input" type="number" value="{{ item.quantity }}" min="0" pattern="[0-9]*">
                    </div>
                  </td>
                  <td class="cart__final-price text-right">                 
                    <div>
                      <span>{{ item.final_line_price }}</span>
                    </div>
                  </td>
                </tr>
            {{/each}}
        `);
        this.getCartItems();
    }


    getCartItems() {
        return API.get('/cart.js')
            .then(res => {
                let wrapper = document.createElement('div')
                wrapper.innerHTML = this.cartItemMarkUp({items: res.data.items})
                console.log(wrapper)
            })
            .catch(err => {
                console.log(err);
            })
    }


}

let cart = new Cart();
