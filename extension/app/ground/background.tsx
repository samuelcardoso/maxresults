const API_DATA = {
  SEARCH_FLIGHTS_API: 'https://bff-site.maxmilhas.com.br/search',
  TOKEN: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXhtaWxoYXMuY29tLmJyIiwiaWF0IjoxNTE1MDkwNzA0LCJhdWQiOiJtYXhtaWxoYXMuY29tLmJyIiwic3ViIjoid3d3MiIsImVudiI6InByZCJ9.fkHem_jbevJJTOJUYAsd8OEULuJEvnbg2EN4XYmS75c'
};

export default class Background {
  static run() {
    // chrome.webNavigation.onCompleted.addListener(function(details) {
    //   // const result = evaluate("string(//*[@id="rso"]/div/div/div[2]/div/div/div[1]/a/h3)", Foo, null, XPathResult.STRING_TYPE);
    //   // chrome.tabs.executeScript(details.tabId, {
    //   //     code: `
    //   //       alert(0);
    //   //     `
    //   // });
    // }, {
    //   url: [{
    //       // Runs on example.com, example.net, but also example.foo.com
    //       hostContains: '.google.'
    //   }],
    // });

    // const port = chrome.runtime.connect({name: "maxmilhas"});
    debugger;
    chrome.runtime.onConnect.addListener(
      port => {
        if (port.name === 'maxmilhas') {
          port.onMessage.addListener(
            async obj => {
              if (obj && obj.msg && obj.msg.type === 'search-intention') {
                const ans = await this.postSearchIntention(obj.msg.data);
                port.postMessage({msg: ans});
                // alert(1);
                // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                //   alert(2);  
                //   alert(JSON.stringify(tabs[0].id));
                //   alert(JSON.stringify(ans));
                //   chrome.tabs.sendMessage(tabs[0].id, ans);
                //   alert(3);
                // });
                // console.debug(ans);
                // // sendResponse(ans);
                // debugger;
              }
            }
          );
        }
      });
      // async (obj, sender, sendResponse) => {
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //   chrome.tabs.sendMessage(tabs[0].id, request, response => {
      //       if (chrome.runtime.lastError) {
      //           // If I click learningPointButton, the line will excute, and log 'ERROR:  {message: "Could not establish connection. Receiving end does not exist."}' 
      //           console.log('ERROR: ', chrome.runtime.lastError);
      //       } else {
      //           console.log('The Content Script got the following Message: ' + JSON.stringify(response));
      //           sendResponse(response);
      //       }
      //   });
      // });
      
    //   return true;
    // });

    let buttonPressed = new Object();
    let checkId = undefined;

    chrome.browserAction.onClicked.addListener(function (tab) {
      chrome.storage.sync.get("key", (dbValue) => {
        if (buttonPressed[tab.id]) {
          buttonPressed[tab.id] = false;
        }
        else {
          buttonPressed[tab.id] = true;
        }

        if (buttonPressed[tab.id]) {
          chrome.browserAction.setIcon({ path: "images/app-on.png" });
          chrome.tabs.sendMessage(tab.id, { text: 'addMaxResults' });
          //   checkId = setInterval(() =>
          //   {
          //     chrome.tabs.sendMessage(tab.id, {text: 'addMaxResults'});
          //   }, dbValue.key.checkInterval);
        } else {
          chrome.browserAction.setIcon({ path: "images/app-off.png" });
          //   clearInterval(checkId);
          chrome.tabs.sendMessage(tab.id, { text: 'removeMaxResults' });
        }
      });
    });

    chrome.tabs.onActivated.addListener(function (activeInfo) {
      if (buttonPressed[activeInfo.tabId] === true) {
        chrome.browserAction.setIcon({ path: "images/app-on.png" });
      } else if (buttonPressed[activeInfo.tabId] === false) {
        chrome.browserAction.setIcon({ path: "images/app-off.png" });
      } else {
        chrome.browserAction.setIcon({ path: "images/logo-32.png" });
      }
    });

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
      return res.json()
    }).catch(err => {
      alert(3)
      alert(JSON.stringify(err))
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
