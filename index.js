var url_regex = /https:\/\/assessment\.peardeck\.com\/student\/assessment\/([a-f0-9]+)\/class\/([a-f0-9]+)\/uta\/([a-f0-9]+)\/itemId\/([a-f0-9]+)/;

Element.prototype._addEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function(type, listener, options) {
  var blocked_events = ["focus", "focusin", "focusout", "blur", "visibilitychange", "webkitvisibilitychange", "mozvisibilitychange", "msvisibilitychange", "focusin", "focusout"]
  var fullscreen_events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"]
  
  if (blocked_events.includes(type)) {
    console.log("[pearhack] blocked event "+type)
  }

  else if (fullscreen_events.includes(type)) {
    console.log("[pearhack] intercepted event "+type);
    var callback = function(event) {
      if (document.fullscreenElement == null && url_regex.test(window.location)) {
        console.log("[pearhack] blocked fullscreenchange function call");
      }
      else {
        listener(event);
      }
    }
    this._addEventListener(type, callback, options);
  }
    
  else {
    this._addEventListener(type, listener, options);
    console.log("[pearhack] allowed event "+type);  
  }
};

function payload() {
  window.addEventListener = Element.prototype.addEventListener;
  window._addEventListener = Element.prototype._addEventListener;
  document.addEventListener = Element.prototype.addEventListener;
  document._addEventListener = Element.prototype._addEventListener;
  console.log("[pearhack] overwritten addEventListener");  

  document.oldTitle = document.title;
  document.title = "PearHack Auto Inject";
  setTimeout(function(){document.title = document.oldTitle}, 5000)
}
window.onload = payload;
