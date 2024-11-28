import { select, settings, templates, classNames } from './../settings.js';
import utils from './../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
    constructor(element){
      const thisCart = this;
  
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
    }
  
    getElements(element) {
      const thisCart = this;
  
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    }
  
    initActions(){
      const thisCart = this;
  
      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
  
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
  
      thisCart.dom.productList.addEventListener('remove', function(event){
        const productToRemove = event.detail.cartProduct;
        thisCart.remove(productToRemove);
      });
  
      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();
      });
    }
  
    add(menuProduct){
      const thisCart = this;
  
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
  
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
    }
  
    update() {
      const thisCart = this;
  
      const deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
  
      for(let product of thisCart.products){
        console.log(product);
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }
      
      if(thisCart.subtotalPrice > 0){
        thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
        thisCart.dom.deliveryFee.innerHTML = deliveryFee;  
      } else {
        thisCart.totalPrice = thisCart.subtotalPrice;
        thisCart.dom.deliveryFee.innerHTML = 0;
      }
      for(let totalPrice of thisCart.dom.totalPrice){
        totalPrice.innerHTML = thisCart.totalPrice;
      }
  
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
  
      console.log('subtotalPrice: ', thisCart.subtotalPrice);
      console.log('totalNumber: ', thisCart.totalNumber);
      console.log('deliveryFee: ', deliveryFee);
      console.log('totalPrice: ', thisCart.totalPrice);
    }
  
    remove(productToRemove){
      const thisCart = this;
      
      productToRemove.dom.wrapper.remove();
      const indexOfProductToRemove = thisCart.products.indexOf(productToRemove);
      thisCart.products.splice(indexOfProductToRemove, 1);
      console.log('products: ', thisCart.products);
      thisCart.update();
    }
  
  
    sendOrder(){
      const thisCart = this;
  
      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: settings.cart.defaultDeliveryFee,
        products: []
      };
      console.log('payload', payload);
      for(let prod of thisCart.products){
        payload.products.push(prod.getData());
      }
  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      };
  
      if(payload.products.length > 0){
        if(payload.phone && !isNaN(payload.phone)){
          if( payload.address && payload.address.length > 3){
            fetch(url, options)
              .then(function(response){
                return response.json();
              }).then(function(parsedResponse){
              console.log('parsedResponse', parsedResponse);
              thisCart.products = [];
              thisCart.dom.productList.innerHTML = '';
              thisCart.dom.address.value = '';
              thisCart.dom.phone.value = '';
              thisCart.update();
              thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
            }); 
          } else {
            alert("Incorrect address!");
          }
        } else {
          alert("Incorrect phone number!");
        }
      } else {
        alert("Empty order! Add product to cart.")
      }
    }
  }

export default Cart;