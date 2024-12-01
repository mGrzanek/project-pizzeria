import { templates } from "./../settings.js";

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.getElements(element);
        thisBooking.render();
        //thisBooking.initWidgets();
        console.log('booking!');
    }

    getElements(element){
        const thisBooking = this;

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
    }
    render(){
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
    }
    
}

export default Booking;