export default class DomUtils {
    static getElementByXpath(xPath) {
        return document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // mutation observer is not working for all the tree
    // const waitForElement = require("wait-for-element");
    // waitForElement('', 10000).then((element) => {});
    static waitForElement(selector, interval = 2000, timeout = 10000): Promise<Node | unknown> {
        const promiseEl = new Promise((resolve, reject) => {
            const event = setInterval(() => {
                const el = document.querySelector(selector);
                if(el) {
                    clearInterval(event);
                    resolve(el);
                }
            }, interval);
        });
        const promiseTimeout =  new Promise((resolve, reject) =>
            setTimeout(() => reject));
        return Promise.race([
            promiseTimeout, 
            promiseEl
        ]);

        return new Promise((resolve, reject) => {
            const event = setInterval(() => {
                const el = document.querySelector(selector);
                if(el) {
                    clearInterval(event);
    
                }
            }, timeout);
        });
    }
}