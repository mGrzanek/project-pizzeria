/* eslint-disable no-unused-vars */
import { classNames, select, settings, templates } from "./../settings.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
import Validator from "./Validator.js";
import utils from "./../utils.js";

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initValidation();
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.selectedTable = null;
        thisBooking.bookedTablesAmount = [];
        console.log('bookedTableAmount', thisBooking.bookedTablesAmount);
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

        const urls = {
            bookings:       settings.db.url + '/' + settings.db.bookings 
                                            + '?' + params.bookings.join('&'),
            eventsCurrent:  settings.db.url + '/' + settings.db.events   
                                            + '?' +  params.eventsCurrent.join('&'),
            eventsRepeat:   settings.db.url + '/' + settings.db.events   
                                            + '?' +  params.eventsRepeat.join('&'),
        }

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
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });
    }
    
    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;
        
        const dateMin = thisBooking.datePicker.minDate;
        const dateMax = thisBooking.datePicker.maxDate;
        thisBooking.booked = {};

        for(let item of bookings){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for(let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for(let item of eventsRepeat){
            if(item.repeat === 'daily'){
                for(let loopDate = dateMin; loopDate <= dateMax; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }           
        }
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table){
        const thisBooking = this;

        const startHour = utils.hourToNumber(hour);

        if(typeof thisBooking.booked[date] === 'undefined'){
            thisBooking.booked[date] = {};
        }

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
            if(typeof thisBooking.booked[date][hourBlock] === 'undefined'){
                thisBooking.booked[date][hourBlock] = [];
            } 
            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDOM(){
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
        
        let allAvailable = false;

        if(
            typeof thisBooking.booked[thisBooking.date] === 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] === 'undefined'
        ){
            allAvailable = true;
        }

        for(let table of thisBooking.dom.tables){
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if(
                !allAvailable
                && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
        thisBooking.setRangeSliderGrdient();
    }

    setRangeSliderGrdient() {
        const thisBooking = this;
    
        thisBooking.dom.rangeSliderWrapper = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.rangeSlider);
        
        const hoursBooked = thisBooking.booked[thisBooking.date];
        const gradientHours = [];
        const openHour = settings.hours.open;
        const closed = settings.hours.close;
        const allHourBlocks = (closed - openHour)/0.5;
        let hour = openHour;
        let color = '';
    
        for (let i = 0; i < allHourBlocks; i++) {
            if (hour in hoursBooked) {
                if(hoursBooked[hour].length < 2) {
                    color = 'green';
                } else if(hoursBooked[hour].length == 2){
                    color ='orange';
                } else if( hoursBooked[hour].length > 2){
                    color = 'red';
                }
            } else {
                color = 'green';
            }

            let gradient = (i/(allHourBlocks-1)) * 100;

            gradientHours.push(`${color} ${gradient}%`);
            hour += 0.5;
        }
        
        const gradientValues = gradientHours.join(', ');
        console.log(gradientValues);
    
        thisBooking.dom.rangeSliderWrapper.style.background = `linear-gradient(to right, ${gradientValues})`;
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
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.tablesWrapper = thisBooking.dom.wrapper.querySelector(select.booking.tablesWrapper);
        thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
        thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.widgets.starters.input);
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    } 

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        console.log('slider', thisBooking.dom.rangeSlider);

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDOM();
            thisBooking.removeSelected()
        });

        thisBooking.dom.tablesWrapper.addEventListener('click', function(event){
            thisBooking.initTables(event);
        });

        thisBooking.dom.form.addEventListener('submit', function(event){
            event.preventDefault();
            thisBooking.sendBooking();
        });

        thisBooking.dom.phone.addEventListener('input', function(){
            thisBooking.phoneValidator.phoneToggleClassValidate(thisBooking.dom.phone.value);
        });

        thisBooking.dom.address.addEventListener('input', function(){
            thisBooking.addressValidator.addressToggleClassValidate(thisBooking.dom.address.value);
        });
    }

    initValidation(){
        const thisBooking = this;

        thisBooking.phoneValidator = new Validator(thisBooking.dom.phone);
        thisBooking.addressValidator = new Validator(thisBooking.dom.address);
    }

    initTables(event){
        const thisBooking = this;
        const clickedElement = event.target;
        
        if(clickedElement.classList.contains(classNames.booking.table)){
            if(!clickedElement.classList.contains(classNames.booking.tableBooked)){
                const tableAttribute = clickedElement.getAttribute(settings.booking.tableIdAttribute);
                if(!clickedElement.classList.contains(classNames.booking.selectedTable)){
                    thisBooking.removeSelected();
                    thisBooking.selectedTable = tableAttribute;
                    clickedElement.classList.add(classNames.booking.selectedTable);
                } else {
                    clickedElement.classList.remove(classNames.booking.selectedTable);
                }
            } else {
                alert('This table is already booked!')
            }
        }
        
        console.log(thisBooking.selectedTable);
    }

    removeSelected(){
        const thisBooking = this;
        
        for(let table of thisBooking.dom.tables){
            if(table.classList.contains(classNames.booking.selectedTable)){
                table.classList.remove(classNames.booking.selectedTable)
            }
        }
    }

    sendBooking(){
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.bookings;

        const payload = {
            date: thisBooking.datePicker.value,
            hour: thisBooking.hourPicker.value,
            table: parseInt(thisBooking.selectedTable),
            duration: thisBooking.hoursAmountWidget.value,
            ppl: thisBooking.peopleAmountWidget.value,
            starters: [],
            phone: thisBooking.dom.phone.value,
            address: thisBooking.dom.address.value
        };

        for(let starter of thisBooking.dom.starters){
            if(starter.checked){
                payload.starters.push(starter.value);
            }
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };

        if(payload.table){
            if(thisBooking.phoneValidator.valuePhoneValidate(payload.phone)){
                if(thisBooking.addressValidator.valueAddressValidate(payload.address)){
                    fetch(url, options)
                        .then(function(response){
                            return response.json();
                        }).then(function(parsedResponse){
                            console.log(parsedResponse);
                            thisBooking.makeBooked(
                                parsedResponse.date, 
                                parsedResponse.hour, 
                                parsedResponse.duration, 
                                parsedResponse.table
                            );
                            thisBooking.updateDOM();
                            thisBooking.removeSelected();
                            thisBooking.dom.phone.value = '';
                            thisBooking.dom.address.value = '';
                            thisBooking.dom.address.classList.remove(classNames.cart.success);
                            thisBooking.dom.phone.classList.remove(classNames.cart.success);
                        }).catch((error) =>{
                        console.warn('Something went wrong...', error);
                        });
                }
            }
        } else {
            alert('Table is not selected!');
        }
        
    }
}

export default Booking;