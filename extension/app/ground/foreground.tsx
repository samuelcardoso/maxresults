import DomUtils from "../utils/dom.utils";

const API_DATA = {
  SEARCH_FLIGHTS_API: 'https://bff-site.maxmilhas.com.br/search',
  TOKEN: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXhtaWxoYXMuY29tLmJyIiwiaWF0IjoxNTE1MDkwNzA0LCJhdWQiOiJtYXhtaWxoYXMuY29tLmJyIiwic3ViIjoid3d3MiIsImVudiI6InByZCJ9.fkHem_jbevJJTOJUYAsd8OEULuJEvnbg2EN4XYmS75c'
};

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

        const flightsValues = await this.postSearchIntention(postData);
        console.debug(flightsValues);
        debugger;
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

  static async postSearchIntention(
    {
      tripType,
      from,
      to,
      outboundDate,
      inboundDate,
      cabin,
      adults,
      children,
      infants
  }) {
    return fetch(`${API_DATA.SEARCH_FLIGHTS_API}?time=1583891717316`,
      {
        method: 'POST',
        body:    JSON.stringify({
          tripType: tripType,
          from: from,
          to: to,
          outboundDate: outboundDate,
          inboundDate: inboundDate,
          cabin: cabin,
          adults: adults,
          children: children,
          infants: infants
        }),
        headers: { 
          'Authorization': API_DATA.TOKEN,
          'Content-Type': 'application/json;charset=UTF-8'
        },
    })
    .then(res => {
      console.debug(res);
      debugger;
      return res.json()
    })
    .then(json => {
      console.debug(json);
      debugger;
      console.log(json)
    }).catch(err => {
      console.debug(err);
      debugger;
    });
  }

  static async searchFlights(
    searchId: string,
    airline: string
  ) {
    return fetch(`${API_DATA.SEARCH_FLIGHTS_API}/search/${searchId}/flights?airline=${airline}`,
      {
        method: 'GET',
        headers: { 
          'Authorization': API_DATA.TOKEN
        },
    })
    .then(res => {
      console.debug(res);
      debugger;
      return res.json()
    })
    .then(json => {
      console.debug(json);
      debugger;
      console.log(json)
    }).catch(err => {
      console.debug(err);
      debugger;
    });
  }
}
