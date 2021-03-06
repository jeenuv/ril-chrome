import RilList from './rilList.js';
function ExtensionIcon(){}

ExtensionIcon.set = function(icon){
  const object = new Object();
  object.path = chrome.extension.getURL(icon);
  chrome.browserAction.setIcon(object);
};

ExtensionIcon.updateNumber = function(){
  const list = RilList.getItemsArray();
  const size = list.length;
  const txt = new Object();
  if(localStorage['removeUncountLabel'] == 'true')
    txt.text = '';
  else
    txt.text=size.toString();
  chrome.browserAction.setBadgeText(txt);
};

ExtensionIcon.loaded = function(){
  ExtensionIcon.set('images/bookmark.png');
};

ExtensionIcon.loading = function(){
  ExtensionIcon.set('images/loader_table.gif');
};

export default ExtensionIcon;
