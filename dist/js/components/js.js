import { templates, select, settings, classNames } from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';
import { utils } from '../utils.js';

export class Booking {
  constructor(bookingContainer) {
    const thisBooking = this;

    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectTable();
  }
  render(bookingContainer) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    //console.log('generatedHTML is: ', generatedHTML);
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookingContainer;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    //thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.bookingForm);
    //console.log(thisBooking.dom.form);
    thisBooking.dom.submitButton = thisBooking.dom.wrapper.querySelector(
      select.booking.bookTable
    );
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.booking.bookPhone
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.booking.bookAddress
    );
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.starters
    );
  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    //console.log('datePicker', thisBooking.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
    thisBooking.dom.submitButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisBooking.sendReservation();
      // thisBooking.rangeSliderColour();
      //console.log('reservation sent!');
    });
  }
  getData() {
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(
      thisBooking.datePicker.minDate
    );
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(
      thisBooking.datePicker.maxDate
    );

    const endDate = {};
    endDate[settings.db.dateEndParamKey] =
      startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent:
        settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    //console.log('getData params', params);

    const urls = {
      booking:
        settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent:
        settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat:
        settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    //console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function ([
        bookingsResponse,
        eventsCurrentResponse,
        eventsRepeatResponse,
      ]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let event of eventsCurrent) {
      //console.log('Event current:', event);
      thisBooking.makeBooked(
        event.date,
        event.hour,
        event.duration,
        event.table
      );
    }
    for (let event of bookings) {
      //console.log('Booking:', event);
      thisBooking.makeBooked(
        event.date,
        event.hour,
        event.duration,
        event.table
      );
    }
    for (let event of eventsRepeat) {
      //console.log('Event repeat: ', event);
      if (event.repeat == 'daily') {
        // sprawdzamy czy element w tablicy jest "daily"
        for (
          let date = thisBooking.datePicker.minDate;
          date <= thisBooking.datePicker.maxDate;
          date = utils.addDays(date, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(date),
            event.hour,
            event.duration,
            event.table
          );
        }
      }
      if (event.repeat == 'weekly') {
        for (
          let date = thisBooking.datePicker.minDate;
          date <= thisBooking.datePicker.maxDate;
          date = utils.addDays(date, 7)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(date),
            event.hour,
            event.duration,
            event.table
          );
        }
      }
    }
    //console.log('Bookings: ', thisBooking.booked);

    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const bookedTime = utils.hourToNumber(hour);
    //console.log('booked time: ', bookedTime);

    for (
      let hourBlock = bookedTime;
      hourBlock < bookedTime + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      for (let tableId = 0; tableId < table.length; tableId++) {
        thisBooking.booked[date][hourBlock].push(table[tableId]);
        //console.log('adding table nr', table[tableId]);
      }
    }
    //console.log(thisBooking.booked[date]);
  }
  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value; // what day;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value); // what hour;

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);

      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        typeof thisBooking.booked[thisBooking.date] != 'undefined' &&
        typeof thisBooking.booked[thisBooking.date][thisBooking.hour] !=
          'undefined' &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
        //console.log('table booked: ' + tableId);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        //console.log('available!' + tableId);
      }
    }
    thisBooking.rangeSliderColour();
  }
  selectTable() {
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function () {
        if (
          table.classList.contains(classNames.booking.tableBooked) === false
        ) {
          table.classList.toggle(classNames.booking.tableSelected);
        }
      });
    }
  }
  sendReservation() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: [],
      ppl: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };
    //console.log(payload);

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        payload.starters.push(starter.value);
        //console.log(starter.value);
      }
    }

    for (let table of thisBooking.dom.tables) {
      const tableBooked = table.classList.contains(
        classNames.booking.tableSelected
      );
      if (tableBooked) {
        thisBooking.tableId = table.getAttribute(
          settings.booking.tableIdAttribute
        );
        thisBooking.tableId = parseInt(thisBooking.tableId);

        payload.table.push(thisBooking.tableId);
        //console.log(thisBooking.tableId);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
        thisBooking.makeBooked(
          payload.date,
          payload.hour,
          payload.duration,
          payload.table
        );
        console.log('booked: ', thisBooking.booked[payload.date]);
      });

    alert('Thank you for the reservation!');
  }
  rangeSliderColour() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    const hoursBooked = thisBooking.booked[thisBooking.date];

    const gradientArr = [];
    let gradient = 0;
    let time = 12;
    let color;

    for (let i = 0; i < 24; i++) {
      if (hoursBooked.hasOwnProperty(time)) {
        if (hoursBooked[time].length <= 2) {
          color = 'orange';
        } else {
          color = 'red';
        }
      } else {
        color = 'green';
      }
      gradientArr.push(`${color} ${gradient}%`);
      gradient += 100 / 24;
      time += 0.5;
    }

    const coloursString = gradientArr.join(', ');

    thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.slider
    ).style.background = `linear-gradient(90deg, ${coloursString})`;
  }
}