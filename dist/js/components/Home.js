import { templates, select, classNames } from "./../settings.js";
import Carousel from "./Carousel.js";

class Home {
    constructor(element){
        const thisHome = this;

        thisHome.favoritePhoto = [];

        thisHome.render(element);
        thisHome.getElements();
        thisHome.initCarousel();
        thisHome.initActions();
    }

    render(element){
        const thisHome = this;

        const generatedHTML = templates.homeWidget();
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.wrapper.innerHTML = generatedHTML;
    }

    getElements(){
        const thisHome = this;
        
        thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carouselWrapper);
        thisHome.dom.gallery = thisHome.dom.wrapper.querySelector(select.home.galleryContainer);
    }

    initCarousel(){
        const thisHome = this;

        thisHome.carousel = new Carousel(thisHome.dom.carousel);
    }

    initActions(){
        const thisHome = this;

        thisHome.dom.gallery.addEventListener('click', function(event){
            const clickedElement = event.target;
            if(clickedElement.classList.contains(classNames.home.heartIcon)){
                thisHome.initFavoritePhoto(event);
            } else if(clickedElement.classList.contains(classNames.home.shareIcon)){
                thisHome.initShare(event);
            }
        });
    }

    initFavoritePhoto(event){
        const thisHome = this;

        console.log(event);
        console.log('parent', event.target.offsetParent);
        event.preventDefault();
        const clickedElement = event.target;
        const parentElement = event.target.offsetParent;
        const attribute = clickedElement.getAttribute('data-id');
        if(thisHome.favoritePhoto.includes(attribute)){
            parentElement.classList.remove(classNames.home.favorite);
            const attributeToRemove = thisHome.favoritePhoto.indexOf(attribute);
            thisHome.favoritePhoto.splice(attributeToRemove, 1);
        } else {
            parentElement.classList.add(classNames.home.favorite);
            thisHome.favoritePhoto.push(attribute);
        }
        console.log('favoriteImages', thisHome.favoritePhoto);
    }

    initShare(event){
        event.preventDefault();
        alert('Thank you for sharing!');
    }
}

export default Home;