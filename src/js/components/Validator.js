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
        const regex = /^([a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9]{3,}|[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9./-]{3,})(\s[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s/-]+)?$/;
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.success, 
          addressValue && regex.test(addressValue)
        );
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.error,
          !addressValue || !regex.test(addressValue)
        );
    }

    phoneToggleClassValidate(phoneValue){
        const thisValidator = this;
        const regex = /^[0-9]{9,11}$/;
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.success,
          phoneValue && regex.test(phoneValue)
        );
  
        thisValidator.dom.wrapper.classList.toggle(
          classNames.cart.error,
          !phoneValue || !regex.test(phoneValue)
        );
    }

    valuePhoneValidate(phone){
        const regex = /^[0-9]{9,11}$/;

        if(phone && regex.test(phone)){
            return true;        
        } else {
            alert("Incorrect phone number!");
        }
    }

    valueAddressValidate(address){
        const regex = /^([a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9]{3,}|[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9./-]{3,})(\s[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s/-]+)?$/;

        if( address && regex.test(address)) {
            return true
        } else {
            alert("Incorrect address!");
        }
    }
}

export default Validator;