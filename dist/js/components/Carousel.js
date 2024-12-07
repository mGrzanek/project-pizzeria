/* eslint-disable no-undef */
class Carousel {
    constructor(element){
        const thisCarousel = this;

        thisCarousel.render(element);
        thisCarousel.initPlugin();
    }

    render(element){
        const thisCarousel = this;

        thisCarousel.dom = {};
        thisCarousel.dom.wrapper = element;
    }

    initPlugin(){
        const thisCarousel = this;
        
        // eslint-disable-next-line no-unused-vars
        let flkty = new Flickity(thisCarousel.dom.wrapper, {
            cellAlign: 'left',
            contain: true,
            autoPlay: 3000, 
            wrapAround: true,
            prevNextButtons: false,
        });
    }
}

export default Carousel;