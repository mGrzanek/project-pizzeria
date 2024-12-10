import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Home from './components/Home.js';
import Quotes from './components/Quotes.js';
import Gallery from './components/Gallery.js';
import Booking from './components/Booking.js';
import Carousel from './components/Carousel.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = `#/${id}`;
      });
    } 
  },
  activatePage(pageId){
    const thisApp = this;

    for(let page of thisApp.pages){
      page.classList.toggle(
        classNames.pages.active, 
        page.id == pageId
      );
    }

    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == `#${pageId}`
      );
    }
  },
  initMenu:  function() {
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  }, 
  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method  */
        thisApp.initMenu();
      });
  },
  initCart: function(){
    const thisApp = this;

    
    const cartElem = document.querySelector(select.containerOf.cart);

    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    })
  },
  initCarousel(){
    const thisApp = this;

    thisApp.carousel = thisApp.homeWrapper.querySelector(select.home.carouselWrapper);

    thisApp.carousel = new Carousel(thisApp.carousel);
  },
  initQuotes: function(){
    const thisApp = this;

    for(let quoteData in thisApp.data.quotes){
      thisApp.quotes = new Quotes( thisApp.data.quotes[quoteData]);
    }
  },
  initGallery: function(){
    const thisApp = this;

    for(let galleryData in thisApp.data.gallery){
      thisApp.gallery = new Gallery(thisApp.data.gallery[galleryData]);
    }
  },
  initHome: function(){
    const thisApp = this;

    const urlQuotes = settings.db.url + '/' + settings.db.quotes;
    const urlGallery = settings.db.url + '/' + settings.db.gallery;
    thisApp.homeWrapper = document.querySelector(select.containerOf.home); 
    thisApp.home = new Home(thisApp.homeWrapper);
    thisApp.home.homeLinks = document.querySelectorAll(select.home.homeLinks);

    for(let link of thisApp.home.homeLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = `#/${id}`;
      });
    } 

    fetch(urlQuotes)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.quotes = parsedResponse;
        thisApp.initQuotes();
        thisApp.initCarousel();
      });

    fetch(urlGallery)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.gallery = parsedResponse;
        thisApp.initGallery();
      })
  },
  initBooking: function(){
    const thisApp = this;

    const bookingWrapper = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingWrapper);
  },
  init: function(){
    const thisApp = this;
    console.log(thisApp);

    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initHome();
    thisApp.initBooking();
  },
};

app.init();

