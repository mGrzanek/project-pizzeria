import { select, settings, templates } from "./../settings.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
import utils from "./../utils.js";

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
    }

    getData(){
        const thisBooking = this;

        const dateStartParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const dateEndParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            bookings: [
                dateStartParam, 
                dateEndParam, 
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                dateStartParam, 
                dateEndParam, 
            ],
            eventsRepeat: [ 
                settings.db.repeatParam,
                dateEndParam,
            ]
        }

        console.log('getDate params: ', params);

        const urls = {
            bookings:       settings.db.url + '/' + settings.db.bookings 
                                            + '?' + params.bookings.join('&'),
            eventsCurrent:  settings.db.url + '/' + settings.db.events   
                                            + '?' +  params.eventsCurrent.join('&'),
            eventsRepeat:   settings.db.url + '/' + settings.db.events   
                                            + '?' +  params.eventsRepeat.join('&'),
        }

        console.log('urls: ', urls);

        Promise.all([
            fetch(urls.bookings), 
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat)
        ]) 
            .then(function(allResponses){
                const bookingResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json()
                ])
            })
            .then(function([bookings, eventsCurrent, eventsRepeat]){
                console.log(bookings);
                console.log(eventsCurrent);
                console.log(eventsRepeat);
            });
    }

    render(element){
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    } 

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.peopleAmount.addEventListener('updated', function(){
            console.log('people widget updated!');
        });

        thisBooking.dom.hoursAmount.addEventListener('updated', function(){
            console.log('hours widget updated!');
        });
    }
}

export default Booking;