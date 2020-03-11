import DomUtils from "../utils/dom.utils";

export default class Foreground {
  static async run() {
    if(window.location.href.indexOf(
      'https://www.google.com/flights') === 0) {
        const p = await Promise.all([
          DomUtils.waitForElement('#flt-ica-5>jsl>span>span'),
          DomUtils.waitForElement('#flt-ica-6>jsl>span>span'),
          DomUtils.waitForElement('#flt-app > div.gws-flights__flex-column.gws-flights__flex-grow > main.gws-flights__flex-column.gws-flights__active-tab.gws-flights__flights-search > div.gws-flights__form.gws-flights__scrollbar-padding > div > div.gws-flights-form__form-card > div.gws-flights__flex-box.gws-flights__align-center > div.gws-flights-form__input-container.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-form__calendar-input.flt-body2 > div.flt-input.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-form__departure-input.gws-flights-form__round-trip > div.gws-flights__flex-filler.gws-flights__ellipsize.gws-flights-form__input-target > span'),
          DomUtils.waitForElement('#flt-ica-8 > span'),
          DomUtils.waitForElement('#flt-app > div.gws-flights__flex-column.gws-flights__flex-grow > main.gws-flights__flex-column.gws-flights__active-tab.gws-flights__flights-search > div.gws-flights__flex-grow.gws-flights-results__results.gws-flights__flex-column.gws-flights__scrollbar-padding > div.gws-flights-results__results-container.gws-flights__center-content > div.gws-flights__flex-grow.gws-flights-results__slice-results-desktop > div.gws-flights-results__best-flights > ol')
        ]);

        const flightData = {}
        const from          = (p[0] as Node).textContent;
        const to            = (p[1] as Node).textContent;
        const dateDeparture = (p[2] as Node).textContent;
        const dateArrival   = (p[3] as Node).textContent;
        const flights = (p[4] as any);
        
        console.debug(`from: ${from} - ${to} - ${dateDeparture} - ${dateArrival}`);
        for(const el of flights.children){
          console.debug(el.getAttribute('data-fp'));
        }

        debugger;
        const postData = {tripType: "RT",
          from: "REC", //origem
          to: "RIO", //destino
          outboundDate: "2020-06-22", //data de partida
          inboundDate: "2020-06-28", //data de volta
          cabin: "EC", //classe econômica (EC) ou executiva (EX)
          adults: 2, //adultos
          children: 1, //crianças
          infants: 0 //bebês
        }

        // const port = await chrome.runtime.connect({name: "maxmilhas"});
        const port = chrome.runtime.connect(null, {name: 'maxmilhas'});      
        port.onDisconnect.addListener(obj => {
          console.log('disconnected port');
        })
        port.postMessage({msg: {
          type: 'search-intention',
          data: postData
        }});
        port.onMessage.addListener((msg) => {
          console.debug(msg);
          alert('X');
          debugger;
        });
        // const bgPage = chrome.extension.getBackgroundPage() as any;
        // console.debug(bgPage);
        // debugger;
        // const response = await bgPage.postSearchIntention(postData);
        // console.debug(response);

        // const flightsValues = await this.postSearchIntention(postData);
        // console.debug(flightsValues);
        // flight number: data-fp="CNFGIG0G32185"
        // horario: gws-flights-results__times-row
        // price: gws-flights-results__itinerary-price
        // bagagens: gws-flights-results__itinerary-badge
    }
    // document.addEventListener("click", (event) => {
    //   console.debug(event);
    //   debugger;
    // }, false);
  }
}
