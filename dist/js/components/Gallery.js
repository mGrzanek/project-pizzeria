import { select, templates } from '../settings.js';
import utils from './../utils.js';

class Gallery {
    constructor(data){
        const thisGallery = this;

        thisGallery.data = data;
        thisGallery.render();
    }

    render(){
        const thisGallery = this;

        const generatedHTML = templates.gallerySection(thisGallery.data);
        thisGallery.element = utils.createDOMFromHTML(generatedHTML);
        thisGallery.dom = {};
        thisGallery.dom.wrapper = document.querySelector(select.home.galleryContainer);
        thisGallery.dom.wrapper.appendChild(thisGallery.element);
    }
}

export default Gallery;