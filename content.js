chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    chrome.storage.sync.get("key", (dbValue) => {
        if (msg.text === 'addMaxResults') {
            if (!isMyScriptLoaded(dbValue.key.mainLinkPage)) {
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = dbValue.key.mainLinkPage;
                var head = document.getElementsByTagName('head')[0];
                if(head) {
                    head.insertBefore(s, head.firstChild);
                }

                if (dbValue.key.iFramesXpathAndLink) {
                    var iFramesXpathAndLink = JSON.parse(dbValue.key.iFramesXpathAndLink);
                    for (i = 0; i < iFramesXpathAndLink.length; i++) {
                        try {
                            var sif = document.createElement("script");
                            sif.type = "text/javascript";
                            sif.src = iFramesXpathAndLink[i].link;
                            var headIFrame = getElementByXpath(iFramesXpathAndLink[i].xPath).contentDocument.getElementsByTagName('head')[0];
                            if (headIFrame) {
                                headIFrame.insertBefore(sif, headIFrame.firstChild);
                            }
                        } catch (error) {
                            console.log('Error inserting MaxResults inside an IFrame, maybe you forgot to run Chrome in insecure mode:');
                            console.log(error);
                        }
                    }
                }
            }
        } else if (msg.text === 'removeMaxResults') {
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src == dbValue.key.mainLinkPage) {
                    scripts[i].parentNode.removeChild(scripts[i]);
                    break;
                }
            }
        }

        sendResponse();
    });
});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function isMyScriptLoaded(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}