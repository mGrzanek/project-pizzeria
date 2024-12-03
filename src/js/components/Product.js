import { templates, select, classNames } from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    renderInMenu(){
      const thisProduct = this;
  
      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */
      thisProduct.menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      thisProduct.menuContainer.appendChild(thisProduct.element);
    }
  
    getElements(){
      const thisProduct = this;
  
      thisProduct.dom = {};
    
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      thisProduct.dom.cart = document.querySelector(select.cart.toggleTrigger);
    }
  
    initAccordion() {
      const thisProduct = this;
      
      /* START: add event listener to clickable trigger on event click */
      thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const productActive = thisProduct.menuContainer.querySelector(select.all.menuProductsActive);
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(productActive && productActive != thisProduct.element){
          productActive.classList.remove(classNames.menuProduct.wrapperActive);
        }
        /* toggle active class on thisProduct.element */
          thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }
  
    initAmountWidget() {
      const thisProduct = this;
  
      thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
      thisProduct.dom.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      })
    }
  
    initOrderForm() {
      const thisProduct = this;
  
      thisProduct.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.dom.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
  
      thisProduct.dom.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
  
    processOrder() {
      const thisProduct = this;
  
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      // set price to default price
      let price = thisProduct.data.price;
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          const productImage = thisProduct.dom.imageWrapper.querySelector(`.${paramId}-${optionId}`);
          const optionSelected = paramId in formData && formData[paramId].includes(optionId);
          if(productImage){
            if(optionSelected) {
              productImage.classList.add(classNames.menuProduct.imageVisible);
              if(!option.default){
                price += option.price;
              } 
            } else if(option.default) {
              price -= option.price;
              productImage.classList.remove(classNames.menuProduct.imageVisible);
            } else {
              productImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      thisProduct.singlePrice = price;
      thisProduct.price = price * thisProduct.amountWidget.dom.input.value;
      // update calculated price in the HTML
      thisProduct.dom.priceElem.innerHTML = thisProduct.price;
    }
  
    prepareCartProduct(){
      const thisProduct = this;
  
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        singlePrice: thisProduct.singlePrice,
        price: thisProduct.price, 
        params: thisProduct.prepareCartProductParams()
      };
      return productSummary;
    }
  
    prepareCartProductParams(){
      const thisProduct = this;
  
      const paramsObj = {};
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        paramsObj[paramId] = {
          label: param.label,
          options: {}
        }
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId]; 
          const optionSelected = paramId in formData && formData[paramId].includes(optionId);  
          if(optionSelected) {
            paramsObj[paramId].options[optionId] = option.label;
          } 
        }
      }
      return paramsObj;
    }
  
    addToCart(){
      const thisProduct = this;
  
      //app.cart.add(thisProduct.prepareCartProduct());
      thisProduct.dom.cart.classList.add(classNames.cart.glow);

      setTimeout(() => {
        thisProduct.dom.cart.classList.remove(classNames.cart.glow);
      }, "1000");
      
      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct.prepareCartProduct(),
        },
      }
      );
      thisProduct.element.dispatchEvent(event);

      thisProduct.element.classList.remove(classNames.menuProduct.wrapperActive);
    }
  }

export default Product;