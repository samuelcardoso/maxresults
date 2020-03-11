const API_DATA = {
  SEARCH_FLIGHTS_API: 'https://bff-site.maxmilhas.com.br/search',
  TOKEN: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXhtaWxoYXMuY29tLmJyIiwiaWF0IjoxNTE1MDkwNzA0LCJhdWQiOiJtYXhtaWxoYXMuY29tLmJyIiwic3ViIjoid3d3MiIsImVudiI6InByZCJ9.fkHem_jbevJJTOJUYAsd8OEULuJEvnbg2EN4XYmS75c'
};

export default class MaxMilhasService {
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
    {
      searchId,
      airline
    }
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
