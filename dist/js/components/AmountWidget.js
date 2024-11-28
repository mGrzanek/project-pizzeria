import { select, settings } from './../settings.js';

class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);
      thisWidget.initActions();
      
      console.log('thisWidget: ', thisWidget);
      console.log('constructor element: ', element);
      console.log(thisWidget.dom.input);
    }
  
    getElements(element){
      const thisWidget = this;
  
      thisWidget.dom = {};
      thisWidget.dom.element = element;
      thisWidget.dom.input = thisWidget.dom.element.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkIncrease);
    }
  
    initActions(){
      const thisWidget = this;
  
      thisWidget.dom.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.dom.input.value);
      });
  
      thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(parseInt(thisWidget.dom.input.value) - parseInt(settings.amountWidget.decreaseValue));
      });
  
      thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(parseInt(thisWidget.dom.input.value) + parseInt(settings.amountWidget.increaseValue));
      });
    }
  
    announce() {
      const thisWidget = this;
  
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.dom.element.dispatchEvent(event);
    }
  
    setValue(value){
      const thisWidget = this;
  
      const newValue = parseInt(value);
  
      /* TO DO: Add validation  */
      if(newValue !== thisWidget.value 
        && !isNaN(newValue)
        && newValue >= settings.amountWidget.defaultMin
        && newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
      }   
      thisWidget.dom.input.value = thisWidget.value;
      thisWidget.announce();
    }
  }

export default AmountWidget;