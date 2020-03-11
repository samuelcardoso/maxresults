export default class Background {
  static run() {
    chrome.webNavigation.onCompleted.addListener(function(details) {
      // const result = evaluate("string(//*[@id="rso"]/div/div/div[2]/div/div/div[1]/a/h3)", Foo, null, XPathResult.STRING_TYPE);
      // chrome.tabs.executeScript(details.tabId, {
      //     code: `
      //       alert(0);
      //     `
      // });
    }, {
      url: [{
          // Runs on example.com, example.net, but also example.foo.com
          hostContains: '.google.'
      }],
    });
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
}
