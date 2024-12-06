import { classNames } from "./../settings.js";

class Validator{
    constructor(element){
        const thisValidator = this;

        thisValidator.getElements(element);
    }

    getElements(element){
        const thisValidator = this;

        thisValidator.dom = {};
        thisValidator.dom.wrapper = element;
    }

    addressToggleClassValidate(addressValue){
        const thisValidator = this;
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.success, 
          addressValue && addressValue.length > 3
        );
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.error,
          !addressValue || addressValue.length <= 3
        );
    }

    phoneToggleClassValidate(phoneValue){
        const thisValidator = this;
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.success,
          phoneValue && !isNaN(phoneValue) && phoneValue.length >=9 && phoneValue.length < 12
        );
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.error,
          !phoneValue || isNaN(phoneValue) || phoneValue.length < 9 || phoneValue.length > 11
        );
    }

    valuePhoneValidate(phone){
        if(phone && !isNaN(phone) && phone.length >=9 && phone.length < 12){
            return true;        
        } else {
            alert("Incorrect phone number!");
        }
    }

    valueAddressValidate(address){
        if( address && address.length > 3){
            return true
        } else {
            alert("Incorrect address!");
          }
    }
}

export default Validator;