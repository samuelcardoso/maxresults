
var mainLinkPage = document.getElementById('mainLinkPage');
var iFrameXpath = document.getElementById('iFrameXpath');
var iFrameLink = document.getElementById('iFrameLink');
var checkInterval = document.getElementById('checkInterval');
var buttonSave = document.getElementById('buttonSave');
var buttonAdd = document.getElementById('buttonAdd');
var iFrameList = document.getElementById('iframe-list');
var iFramesXpathAndLink = null;

buttonSave.addEventListener('click', save, false);
buttonAdd.addEventListener('click', add, false);

chrome.storage.sync.get("key", function(dbValue) {
  if(dbValue.key) {
    mainLinkPage.value = dbValue.key.mainLinkPage;
    checkInterval.value = dbValue.key.checkInterval;
    iFramesXpathAndLink = dbValue.key.iFramesXpathAndLink ? JSON.parse(dbValue.key.iFramesXpathAndLink) : undefined;
    if(iFramesXpathAndLink) {
      loadIframes();
    }
  }
});

function remove(event) {
  if(event) {
    event.preventDefault();
  }

  let element = event.target;
  element.parentNode.parentNode.removeChild(element.parentNode);
}

function add(event, iFrameXpathAndLink) {
  if(event) {
    event.preventDefault();
  }

  let div = document.createElement('div');
  div.className="form-row";
  
  let inputIFrameXpath = document.createElement('input');
  inputIFrameXpath.placeholder = "XPath";
  if(iFrameXpathAndLink) {
    inputIFrameXpath.value = iFrameXpathAndLink.xPath;
  }

  let inputIFrameLink = document.createElement('input');
  inputIFrameLink.placeholder = "Link Path";
  if(iFrameXpathAndLink) {
    inputIFrameLink.value = iFrameXpathAndLink.link;
  }

  let buttonRemove = document.createElement('button');
  buttonRemove.textContent = "-";
  buttonRemove.addEventListener('click', remove, false);

  div.appendChild(inputIFrameXpath);
  div.appendChild(inputIFrameLink);
  div.appendChild(buttonRemove);
  
  iFrameList.appendChild(div);
}

function loadIframes() {
  if(iFramesXpathAndLink) {
    for(i=0; i<iFramesXpathAndLink.length; i++)
    {
      add(null, iFramesXpathAndLink[i]);
    }
  }
}

function save(event) {
  event.preventDefault();

  if(!mainLinkPage.value) {
    alert('Main Link Page is required.');
    return;
  }

  if(!checkInterval.value) {
    alert('Check Interval is required.');
    return;
  }

  let childDivs = iFrameList.getElementsByTagName('input');
  
  var iFramesXpathAndLink = [];
  if(childDivs) {
    for(i=0; i<childDivs.length; i=i+2)
    {
      iFramesXpathAndLink.push({
        xPath: childDivs[i].value,
        link: childDivs[i+1].value
      });
    }
  }

  chrome.storage.sync.set(
    {
      "key":
    {
    'mainLinkPage': mainLinkPage.value ? mainLinkPage.value : "https://127.0.0.1:8000/maxresults.js",
    'checkInterval': checkInterval.value ? checkInterval.value : "1000",
    'iFramesXpathAndLink': JSON.stringify(iFramesXpathAndLink)
    }
  },() => {
    alert('Configurations Saved');
  });
}

