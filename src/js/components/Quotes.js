import { templates, select } from "./../settings.js";
import utils from "./../utils.js";

class Quotes {
    constructor(data){
        const thisQuotes = this;

        console.log(thisQuotes);
        thisQuotes.data = data;
        thisQuotes.render();
    }
    render(){
        const thisQuotes = this;

        const generatedHTML = templates.quotesSection(thisQuotes.data);
        thisQuotes.element = utils.createDOMFromHTML(generatedHTML);
        thisQuotes.dom = {};
        thisQuotes.dom.wrapper = document.querySelector(select.home.carouselWrapper);
        thisQuotes.dom.wrapper.appendChild(thisQuotes.element);
    }
}

export default Quotes;