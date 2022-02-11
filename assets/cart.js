document.addEventListener("DOMContentLoaded", loadCart)


class Cart {
    constructor(props) {
        this.items = [];
        this.cartItemMarkUp = `
            <tr class="cart__row">
              <td class="cart__meta small--text-left">
                <div class="cart__product-information">
                  <div class="cart__image-wrapper">
                    <img class="cart__image" alt="" src="">
                  </div>
                  <div>
                    <div class="list-view-item__title">
                      <a href="" class="cart__product-title">
                        
                      </a>
                    </div>

                    <ul class="product-details">
                      <li class="product-details__item product-details__item--variant-option"></li>
                      <li class="product-details__item product-details__item--property"></li>
                    </ul>

                    <p class="cart__remove">
                      <a href="/cart/change?line={{ forloop.index }}&amp;quantity=0" class="text-link text-link--accent">Remove</a>
                    </p>
                  </div>
                </div>
              </td>
              <td class="cart__price text-right">
                
              </td>
            </tr>
        `
    }


    getCartItems() {
        return API.get('/cart.js')
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            })
    }


}
