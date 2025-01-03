import { select, settings } from './../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
    constructor(element) {
      super(element, settings.amountWidget.defaultValue);
      const thisWidget = this;
      
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);
      thisWidget.initActions();
    }
  
    getElements(){
      const thisWidget = this;
  
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }
  
    initActions(){
      const thisWidget = this;
  
      thisWidget.dom.input.addEventListener('change', function() {
        thisWidget.value = thisWidget.dom.input.value;
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

    parseValue(value){
      return parseInt(value);
    }

    isValid(value){
      return !isNaN(value)
        && value > settings.amountWidget.defaultMin 
        && value <= settings.amountWidget.defaultMax;
    }

    renderValue(){
      const thisWidget = this;

      thisWidget.dom.input.value = thisWidget.value;
    }
  }

export default AmountWidget;