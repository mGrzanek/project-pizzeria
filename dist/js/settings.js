export const select = {
    templateOf: {
      menuProduct: "#template-menu-product",
      cartProduct: '#template-cart-product',
      bookingWidget: '#template-booking-widget',
      homeWidget: "#template-home-widget",
      quotes: "#template-quotes",
      gallery: "#template-gallery",
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
      pages: '#pages',
      booking: '.booking-wrapper',
      home: '.home-wrapper',
    },
    booking: {
      peopleAmount: '.people-amount',
      hoursAmount: '.hours-amount',
      tables: '.floor-plan .table',
      tablesWrapper: '.floor-plan',
      form: '.booking-form',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    nav: {
        links: '.main-nav a',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
        amount: {
          input: 'input.amount',
          linkDecrease: 'a[href="#less"]',
          linkIncrease: 'a[href="#more"]'
        }, 
        datePicker: {
            wrapper: '.date-picker',
            input: `input[name="date"]`,
        },
        hourPicker: {
            wrapper: '.hour-picker',
            input: 'input[type="range"]',
            output: '.output',
            rangeSlider: '.rangeSlider',
        },
        starters: {
          input: 'input[name="starter"]',
        }
    },
    cart: {
        productList: '.cart__order-summary',
        toggleTrigger: '.cart__summary',
        totalNumber: `.cart__total-number`,
        totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
        subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
        deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
        form: '.cart__order',
        formSubmit: '.cart__order [type="submit"]',
        phone: '[name="phone"]',
        address: '[name="address"]',
        formInput: 'cart__order-confirmation input',
    },
    cartProduct: {
        amountWidget: '.widget-amount',
        price: '.cart__product-price',
        edit: '[href="#edit"]',
        remove: '[href="#remove"]',
    },
    home: {
      homeLinks: '.small a',
      carouselWrapper: '.main-carousel',
      galleryContainer: '.photo-container',
    }
};
  
export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
    success: 'success',
    error: 'error',
    glow: 'glow',
  },
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
    selectedTable: 'selected',
    table: 'table',
  },
  home: {
    favorite: 'favorite',
    heartIcon: 'fa-heart',
    shareIcon: 'fa-share-alt',
  },
  nav: {
      active: 'active',
  },
  pages: {
      active: 'active',
  }
};
  
export const settings = {
  amountWidget: {
    decreaseValue: 1,
    increaseValue: 1,
    defaultValue: 1,
    defaultMin: 0,
    defaultMax: 9,
  },
  cart: {
      defaultDeliveryFee: 20,
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    bookings: 'bookings',
    events: 'events',
    quotes: 'quotes',
    gallery: 'gallery',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
      maxDaysInFuture: 14,
  },
  booking: {
      tableIdAttribute: 'data-table',
  },
};
  
export const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
    homeWidget: Handlebars.compile(document.querySelector(select.templateOf.homeWidget).innerHTML),
    quotesSection: Handlebars.compile(document.querySelector(select.templateOf.quotes).innerHTML),
    gallerySection: Handlebars.compile(document.querySelector(select.templateOf.gallery).innerHTML),
  };