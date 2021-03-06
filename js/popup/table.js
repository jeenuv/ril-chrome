function Table(){
  this.listeners = {};
}

Table.prototype.on = function(eventName, callback){
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(callback);
};

Table.prototype.render = function(list){
  let list_content = "";
  for(let i = 0; i < list.length; i++)
  {
    const item = list[i];
    item.index = i;
    const html = this.getItemHtml(item);
    list_content += html;
  }

  document.querySelector("#table_list").innerHTML = list_content;
  const markAsReadIcons = document.querySelectorAll(".table_img_mark_as_read");
  for(let i = 0; i< markAsReadIcons.length; i++){
    const icon = markAsReadIcons[i];
    icon.addEventListener('click', this.markAsRead.bind(this));
  }
  const itemLinkTds = document.querySelectorAll(".item_link_td");
  for(let i = 0; i< itemLinkTds.length; i++){
    const item = itemLinkTds[i];
    item.addEventListener('click', this.tryToMarkAsRead.bind(this));
  }
};

Table.prototype.markAsRead = function(ev){
  const item_id = ev.target.getAttribute('item_id');
  const id = ev.target.getAttribute('index');
  this.changeElemStyle(id);
  this.listeners['markAsRead'].forEach(function(callback){
    callback(parseInt(item_id));
  });
};

Table.prototype.tryToMarkAsRead = function(ev){
  const item_id = ev.target.getAttribute('item_id');
  this.listeners['autoMarkAsRead'].forEach(function(callback){
    callback(parseInt(item_id));
  });
};

Table.prototype.getItemHtml = function(item){
  const title = this.getItemTitle(item);

  let actionIcon = 'icon-ok';
  if(localStorage['deleteItensOption'] === 'true'){
    actionIcon = 'icon-remove';
  }
  return `
    <tr class="table_row" id="line_index_${item.index}">
      <td class="no_border favicon">
      <span>
        <img src="${this.getFaviconUrl(item)}" id="favicon_index_${item.index}" class="favicon_img" />
      </span>
      </td>
      <td nowrap='nowrap' class="item_link_td" item_id="${item.item_id}">
      <span id="title_span_index_${item.index}">
        <a href="${this.getItemUrl(item)}" target="_blank" title="${title}">${title}</a>
      </span>
      </td>
      <td class="no_border table_img_mark_as_read ${actionIcon}" id="list_img_index_${item.index}" item_id="${item.item_id}" index="${item.index}" title="Mark as Read">
      </td>
    </tr>`;
};

Table.prototype.getFaviconUrl = function(item){
  const url = this.getItemUrl(item);
  return "http://www.google.com/s2/favicons?domain_url="+ encodeURIComponent(url);
};

Table.prototype.getItemTitle = function(item){
  let title = '';
  if(item.resolved_title)
    title = item.resolved_title;
  else if(item.given_title)
    title =  item.given_title;
  else
    title = this.getItemUrl(item);

  return title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

Table.prototype.getItemUrl = function(item){
  if(item.resolved_url)
    return item.resolved_url;
  return item.given_url;
};

Table.prototype.getDomain = function(url){
  if(!url)
    return "";
  url = url.replace(/https?/,"");
  url = url.replace("://", "");
  const index = url.indexOf("/");
  url = "http://" + url.substr(0, index);
  if(url.length > 30)
    url = url.substr(0, 30) + "...";
  return url;
};

Table.prototype.changeElemStyle = function(id){
  if(document.getElementById("list_img_index_"+id))
  {
    document.getElementById("list_img_index_"+id).style.backgroundImage="url('images/uncheck.png')";
    const elem = document.getElementById("line_index_"+id);
    elem.style.opacity = 0.3;
    elem.style.textDecoration = "line-through";
  }
};

export default Table;
