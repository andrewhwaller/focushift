/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var nonce;

      nonce = null;

      Rails.loadCSPNonce = function() {
        var ref;
        return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
      };

      Rails.cspNonce = function() {
        return nonce != null ? nonce : Rails.loadCSPNonce();
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.preventInsignificantClick = function(e) {
        var data, insignificantMetaClick, link, metaClick, method, primaryMouseKey;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        insignificantMetaClick = metaClick && method === 'GET' && !data;
        primaryMouseKey = e.button === 0;
        if (!primaryMouseKey || insignificantMetaClick) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        document.addEventListener('DOMContentLoaded', loadCSPNonce);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActiveStorage = {});
})(this, function(exports) {
  "use strict";
  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var sparkMd5 = createCommonjsModule(function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined) {
      var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex) {
        var bytes = [], length = hex.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD5() {
        this.reset();
      }
      SparkMD5.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD5.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD5.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash
        };
      };
      SparkMD5.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD5.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD5.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD5.hash = function(str, raw) {
        return SparkMD5.hashBinary(toUtf8(str), raw);
      };
      SparkMD5.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD5.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD5.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD5.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD5.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD5.prototype.setState.call(this, state);
      };
      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
      SparkMD5.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD5;
    });
  });
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = function() {
    createClass(FileChecksum, null, [ {
      key: "create",
      value: function create(file, callback) {
        var instance = new FileChecksum(file);
        instance.create(callback);
      }
    } ]);
    function FileChecksum(file) {
      classCallCheck(this, FileChecksum);
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    createClass(FileChecksum, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        this.callback = callback;
        this.md5Buffer = new sparkMd5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.fileReader.addEventListener("load", function(event) {
          return _this.fileReaderDidLoad(event);
        });
        this.fileReader.addEventListener("error", function(event) {
          return _this.fileReaderDidError(event);
        });
        this.readNextChunk();
      }
    }, {
      key: "fileReaderDidLoad",
      value: function fileReaderDidLoad(event) {
        this.md5Buffer.append(event.target.result);
        if (!this.readNextChunk()) {
          var binaryDigest = this.md5Buffer.end(true);
          var base64digest = btoa(binaryDigest);
          this.callback(null, base64digest);
        }
      }
    }, {
      key: "fileReaderDidError",
      value: function fileReaderDidError(event) {
        this.callback("Error reading " + this.file.name);
      }
    }, {
      key: "readNextChunk",
      value: function readNextChunk() {
        if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
          var start = this.chunkIndex * this.chunkSize;
          var end = Math.min(start + this.chunkSize, this.file.size);
          var bytes = fileSlice.call(this.file, start, end);
          this.fileReader.readAsArrayBuffer(bytes);
          this.chunkIndex++;
          return true;
        } else {
          return false;
        }
      }
    } ]);
    return FileChecksum;
  }();
  function getMetaValue(name) {
    var element = findElement(document.head, 'meta[name="' + name + '"]');
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    var elements = root.querySelectorAll(selector);
    return toArray$1(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent(element, type) {
    var eventInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var disabled = element.disabled;
    var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
    var event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray$1(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = function() {
    function BlobRecord(file, checksum, url) {
      var _this = this;
      classCallCheck(this, BlobRecord);
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type,
        byte_size: file.size,
        checksum: checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.xhr.setRequestHeader("X-CSRF-Token", getMetaValue("csrf-token"));
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobRecord, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(JSON.stringify({
          blob: this.attributes
        }));
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        if (this.status >= 200 && this.status < 300) {
          var response = this.response;
          var direct_upload = response.direct_upload;
          delete response.direct_upload;
          this.attributes = response;
          this.directUploadData = direct_upload;
          this.callback(null, this.toJSON());
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var result = {};
        for (var key in this.attributes) {
          result[key] = this.attributes[key];
        }
        return result;
      }
    }, {
      key: "status",
      get: function get$$1() {
        return this.xhr.status;
      }
    }, {
      key: "response",
      get: function get$$1() {
        var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
        if (responseType == "json") {
          return response;
        } else {
          return JSON.parse(response);
        }
      }
    } ]);
    return BlobRecord;
  }();
  var BlobUpload = function() {
    function BlobUpload(blob) {
      var _this = this;
      classCallCheck(this, BlobUpload);
      this.blob = blob;
      this.file = blob.file;
      var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (var key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobUpload, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(this.file.slice());
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
        if (status >= 200 && status < 300) {
          this.callback(null, response);
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
      }
    } ]);
    return BlobUpload;
  }();
  var id = 0;
  var DirectUpload = function() {
    function DirectUpload(file, url, delegate) {
      classCallCheck(this, DirectUpload);
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
    }
    createClass(DirectUpload, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        FileChecksum.create(this.file, function(error, checksum) {
          if (error) {
            callback(error);
            return;
          }
          var blob = new BlobRecord(_this.file, checksum, _this.url);
          notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
          blob.create(function(error) {
            if (error) {
              callback(error);
            } else {
              var upload = new BlobUpload(blob);
              notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
              upload.create(function(error) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, blob.toJSON());
                }
              });
            }
          });
        });
      }
    } ]);
    return DirectUpload;
  }();
  function notify(object, methodName) {
    if (object && typeof object[methodName] == "function") {
      for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        messages[_key - 2] = arguments[_key];
      }
      return object[methodName].apply(object, messages);
    }
  }
  var DirectUploadController = function() {
    function DirectUploadController(input, file) {
      classCallCheck(this, DirectUploadController);
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    createClass(DirectUploadController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = this.input.name;
        this.input.insertAdjacentElement("beforebegin", hiddenInput);
        this.dispatch("start");
        this.directUpload.create(function(error, attributes) {
          if (error) {
            hiddenInput.parentNode.removeChild(hiddenInput);
            _this.dispatchError(error);
          } else {
            hiddenInput.value = attributes.signed_id;
          }
          _this.dispatch("end");
          callback(error);
        });
      }
    }, {
      key: "uploadRequestDidProgress",
      value: function uploadRequestDidProgress(event) {
        var progress = event.loaded / event.total * 100;
        if (progress) {
          this.dispatch("progress", {
            progress: progress
          });
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        detail.file = this.file;
        detail.id = this.directUpload.id;
        return dispatchEvent(this.input, "direct-upload:" + name, {
          detail: detail
        });
      }
    }, {
      key: "dispatchError",
      value: function dispatchError(error) {
        var event = this.dispatch("error", {
          error: error
        });
        if (!event.defaultPrevented) {
          alert(error);
        }
      }
    }, {
      key: "directUploadWillCreateBlobWithXHR",
      value: function directUploadWillCreateBlobWithXHR(xhr) {
        this.dispatch("before-blob-request", {
          xhr: xhr
        });
      }
    }, {
      key: "directUploadWillStoreFileWithXHR",
      value: function directUploadWillStoreFileWithXHR(xhr) {
        var _this2 = this;
        this.dispatch("before-storage-request", {
          xhr: xhr
        });
        xhr.upload.addEventListener("progress", function(event) {
          return _this2.uploadRequestDidProgress(event);
        });
      }
    }, {
      key: "url",
      get: function get$$1() {
        return this.input.getAttribute("data-direct-upload-url");
      }
    } ]);
    return DirectUploadController;
  }();
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = function() {
    function DirectUploadsController(form) {
      classCallCheck(this, DirectUploadsController);
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(function(input) {
        return input.files.length;
      });
    }
    createClass(DirectUploadsController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var controllers = this.createDirectUploadControllers();
        var startNextController = function startNextController() {
          var controller = controllers.shift();
          if (controller) {
            controller.start(function(error) {
              if (error) {
                callback(error);
                _this.dispatch("end");
              } else {
                startNextController();
              }
            });
          } else {
            callback();
            _this.dispatch("end");
          }
        };
        this.dispatch("start");
        startNextController();
      }
    }, {
      key: "createDirectUploadControllers",
      value: function createDirectUploadControllers() {
        var controllers = [];
        this.inputs.forEach(function(input) {
          toArray$1(input.files).forEach(function(file) {
            var controller = new DirectUploadController(input, file);
            controllers.push(controller);
          });
        });
        return controllers;
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return dispatchEvent(this.form, "direct-uploads:" + name, {
          detail: detail
        });
      }
    } ]);
    return DirectUploadsController;
  }();
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    var target = event.target;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    var form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    var controller = new DirectUploadsController(form);
    var inputs = controller.inputs;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(function(error) {
        form.removeAttribute(processingAttribute);
        if (error) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      var _button = button, disabled = _button.disabled;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);
  exports.start = start;
  exports.DirectUpload = DirectUpload;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */

(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
/*!
	autosize 4.0.2
	license: MIT
	http://www.jacklmoore.com/autosize
*/

!function(e,t){if("function"==typeof define&&define.amd)define(["module","exports"],t);else if("undefined"!=typeof exports)t(module,exports);else{var n={exports:{}};t(n,n.exports),e.autosize=n.exports}}(this,function(e,t){"use strict";var n,o,p="function"==typeof Map?new Map:(n=[],o=[],{has:function(e){return-1<n.indexOf(e)},get:function(e){return o[n.indexOf(e)]},set:function(e,t){-1===n.indexOf(e)&&(n.push(e),o.push(t))},delete:function(e){var t=n.indexOf(e);-1<t&&(n.splice(t,1),o.splice(t,1))}}),c=function(e){return new Event(e,{bubbles:!0})};try{new Event("test")}catch(e){c=function(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!1),t}}function r(r){if(r&&r.nodeName&&"TEXTAREA"===r.nodeName&&!p.has(r)){var e,n=null,o=null,i=null,d=function(){r.clientWidth!==o&&a()},l=function(t){window.removeEventListener("resize",d,!1),r.removeEventListener("input",a,!1),r.removeEventListener("keyup",a,!1),r.removeEventListener("autosize:destroy",l,!1),r.removeEventListener("autosize:update",a,!1),Object.keys(t).forEach(function(e){r.style[e]=t[e]}),p.delete(r)}.bind(r,{height:r.style.height,resize:r.style.resize,overflowY:r.style.overflowY,overflowX:r.style.overflowX,wordWrap:r.style.wordWrap});r.addEventListener("autosize:destroy",l,!1),"onpropertychange"in r&&"oninput"in r&&r.addEventListener("keyup",a,!1),window.addEventListener("resize",d,!1),r.addEventListener("input",a,!1),r.addEventListener("autosize:update",a,!1),r.style.overflowX="hidden",r.style.wordWrap="break-word",p.set(r,{destroy:l,update:a}),"vertical"===(e=window.getComputedStyle(r,null)).resize?r.style.resize="none":"both"===e.resize&&(r.style.resize="horizontal"),n="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(n)&&(n=0),a()}function s(e){var t=r.style.width;r.style.width="0px",r.offsetWidth,r.style.width=t,r.style.overflowY=e}function u(){if(0!==r.scrollHeight){var e=function(e){for(var t=[];e&&e.parentNode&&e.parentNode instanceof Element;)e.parentNode.scrollTop&&t.push({node:e.parentNode,scrollTop:e.parentNode.scrollTop}),e=e.parentNode;return t}(r),t=document.documentElement&&document.documentElement.scrollTop;r.style.height="",r.style.height=r.scrollHeight+n+"px",o=r.clientWidth,e.forEach(function(e){e.node.scrollTop=e.scrollTop}),t&&(document.documentElement.scrollTop=t)}}function a(){u();var e=Math.round(parseFloat(r.style.height)),t=window.getComputedStyle(r,null),n="content-box"===t.boxSizing?Math.round(parseFloat(t.height)):r.offsetHeight;if(n<e?"hidden"===t.overflowY&&(s("scroll"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight):"hidden"!==t.overflowY&&(s("hidden"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight),i!==n){i=n;var o=c("autosize:resized");try{r.dispatchEvent(o)}catch(e){}}}}function i(e){var t=p.get(e);t&&t.destroy()}function d(e){var t=p.get(e);t&&t.update()}var l=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?((l=function(e){return e}).destroy=function(e){return e},l.update=function(e){return e}):((l=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return r(e)}),e}).destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],i),e},l.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],d),e}),t.default=l,e.exports=t.default});
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.dragula=e()}}(function(){return function e(n,t,r){function o(u,c){if(!t[u]){if(!n[u]){var a="function"==typeof require&&require;if(!c&&a)return a(u,!0);if(i)return i(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var l=t[u]={exports:{}};n[u][0].call(l.exports,function(e){var t=n[u][1][e];return o(t?t:e)},l,l.exports,e,n,t,r)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(e,n,t){"use strict";function r(e){var n=u[e];return n?n.lastIndex=0:u[e]=n=new RegExp(c+e+a,"g"),n}function o(e,n){var t=e.className;t.length?r(n).test(t)||(e.className+=" "+n):e.className=n}function i(e,n){e.className=e.className.replace(r(n)," ").trim()}var u={},c="(?:^|\\s)",a="(?:\\s|$)";n.exports={add:o,rm:i}},{}],2:[function(e,n,t){(function(t){"use strict";function r(e,n){function t(e){return-1!==le.containers.indexOf(e)||fe.isContainer(e)}function r(e){var n=e?"remove":"add";o(S,n,"mousedown",O),o(S,n,"mouseup",L)}function c(e){var n=e?"remove":"add";o(S,n,"mousemove",N)}function m(e){var n=e?"remove":"add";w[n](S,"selectstart",C),w[n](S,"click",C)}function h(){r(!0),L({})}function C(e){ce&&e.preventDefault()}function O(e){ne=e.clientX,te=e.clientY;var n=1!==i(e)||e.metaKey||e.ctrlKey;if(!n){var t=e.target,r=T(t);r&&(ce=r,c(),"mousedown"===e.type&&(p(t)?t.focus():e.preventDefault()))}}function N(e){if(ce){if(0===i(e))return void L({});if(void 0===e.clientX||e.clientX!==ne||void 0===e.clientY||e.clientY!==te){if(fe.ignoreInputTextSelection){var n=y("clientX",e),t=y("clientY",e),r=x.elementFromPoint(n,t);if(p(r))return}var o=ce;c(!0),m(),D(),B(o);var a=u(W);Z=y("pageX",e)-a.left,ee=y("pageY",e)-a.top,E.add(ie||W,"gu-transit"),K(),U(e)}}}function T(e){if(!(le.dragging&&J||t(e))){for(var n=e;v(e)&&t(v(e))===!1;){if(fe.invalid(e,n))return;if(e=v(e),!e)return}var r=v(e);if(r&&!fe.invalid(e,n)){var o=fe.moves(e,r,n,g(e));if(o)return{item:e,source:r}}}}function X(e){return!!T(e)}function Y(e){var n=T(e);n&&B(n)}function B(e){$(e.item,e.source)&&(ie=e.item.cloneNode(!0),le.emit("cloned",ie,e.item,"copy")),Q=e.source,W=e.item,re=oe=g(e.item),le.dragging=!0,le.emit("drag",W,Q)}function P(){return!1}function D(){if(le.dragging){var e=ie||W;M(e,v(e))}}function I(){ce=!1,c(!0),m(!0)}function L(e){if(I(),le.dragging){var n=ie||W,t=y("clientX",e),r=y("clientY",e),o=a(J,t,r),i=q(o,t,r);i&&(ie&&fe.copySortSource||!ie||i!==Q)?M(n,i):fe.removeOnSpill?R():A()}}function M(e,n){var t=v(e);ie&&fe.copySortSource&&n===Q&&t.removeChild(W),k(n)?le.emit("cancel",e,Q,Q):le.emit("drop",e,n,Q,oe),j()}function R(){if(le.dragging){var e=ie||W,n=v(e);n&&n.removeChild(e),le.emit(ie?"cancel":"remove",e,n,Q),j()}}function A(e){if(le.dragging){var n=arguments.length>0?e:fe.revertOnSpill,t=ie||W,r=v(t),o=k(r);o===!1&&n&&(ie?r&&r.removeChild(ie):Q.insertBefore(t,re)),o||n?le.emit("cancel",t,Q,Q):le.emit("drop",t,r,Q,oe),j()}}function j(){var e=ie||W;I(),z(),e&&E.rm(e,"gu-transit"),ue&&clearTimeout(ue),le.dragging=!1,ae&&le.emit("out",e,ae,Q),le.emit("dragend",e),Q=W=ie=re=oe=ue=ae=null}function k(e,n){var t;return t=void 0!==n?n:J?oe:g(ie||W),e===Q&&t===re}function q(e,n,r){function o(){var o=t(i);if(o===!1)return!1;var u=H(i,e),c=V(i,u,n,r),a=k(i,c);return a?!0:fe.accepts(W,i,Q,c)}for(var i=e;i&&!o();)i=v(i);return i}function U(e){function n(e){le.emit(e,f,ae,Q)}function t(){s&&n("over")}function r(){ae&&n("out")}if(J){e.preventDefault();var o=y("clientX",e),i=y("clientY",e),u=o-Z,c=i-ee;J.style.left=u+"px",J.style.top=c+"px";var f=ie||W,l=a(J,o,i),d=q(l,o,i),s=null!==d&&d!==ae;(s||null===d)&&(r(),ae=d,t());var p=v(f);if(d===Q&&ie&&!fe.copySortSource)return void(p&&p.removeChild(f));var m,h=H(d,l);if(null!==h)m=V(d,h,o,i);else{if(fe.revertOnSpill!==!0||ie)return void(ie&&p&&p.removeChild(f));m=re,d=Q}(null===m&&s||m!==f&&m!==g(f))&&(oe=m,d.insertBefore(f,m),le.emit("shadow",f,d,Q))}}function _(e){E.rm(e,"gu-hide")}function F(e){le.dragging&&E.add(e,"gu-hide")}function K(){if(!J){var e=W.getBoundingClientRect();J=W.cloneNode(!0),J.style.width=d(e)+"px",J.style.height=s(e)+"px",E.rm(J,"gu-transit"),E.add(J,"gu-mirror"),fe.mirrorContainer.appendChild(J),o(S,"add","mousemove",U),E.add(fe.mirrorContainer,"gu-unselectable"),le.emit("cloned",J,W,"mirror")}}function z(){J&&(E.rm(fe.mirrorContainer,"gu-unselectable"),o(S,"remove","mousemove",U),v(J).removeChild(J),J=null)}function H(e,n){for(var t=n;t!==e&&v(t)!==e;)t=v(t);return t===S?null:t}function V(e,n,t,r){function o(){var n,o,i,u=e.children.length;for(n=0;u>n;n++){if(o=e.children[n],i=o.getBoundingClientRect(),c&&i.left+i.width/2>t)return o;if(!c&&i.top+i.height/2>r)return o}return null}function i(){var e=n.getBoundingClientRect();return u(c?t>e.left+d(e)/2:r>e.top+s(e)/2)}function u(e){return e?g(n):n}var c="horizontal"===fe.direction,a=n!==e?i():o();return a}function $(e,n){return"boolean"==typeof fe.copy?fe.copy:fe.copy(e,n)}var G=arguments.length;1===G&&Array.isArray(e)===!1&&(n=e,e=[]);var J,Q,W,Z,ee,ne,te,re,oe,ie,ue,ce,ae=null,fe=n||{};void 0===fe.moves&&(fe.moves=l),void 0===fe.accepts&&(fe.accepts=l),void 0===fe.invalid&&(fe.invalid=P),void 0===fe.containers&&(fe.containers=e||[]),void 0===fe.isContainer&&(fe.isContainer=f),void 0===fe.copy&&(fe.copy=!1),void 0===fe.copySortSource&&(fe.copySortSource=!1),void 0===fe.revertOnSpill&&(fe.revertOnSpill=!1),void 0===fe.removeOnSpill&&(fe.removeOnSpill=!1),void 0===fe.direction&&(fe.direction="vertical"),void 0===fe.ignoreInputTextSelection&&(fe.ignoreInputTextSelection=!0),void 0===fe.mirrorContainer&&(fe.mirrorContainer=x.body);var le=b({containers:fe.containers,start:Y,end:D,cancel:A,remove:R,destroy:h,canMove:X,dragging:!1});return fe.removeOnSpill===!0&&le.on("over",_).on("out",F),r(),le}function o(e,n,r,o){var i={mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"},u={mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"},c={mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"};t.navigator.pointerEnabled?w[n](e,u[r],o):t.navigator.msPointerEnabled?w[n](e,c[r],o):(w[n](e,i[r],o),w[n](e,r,o))}function i(e){if(void 0!==e.touches)return e.touches.length;if(void 0!==e.which&&0!==e.which)return e.which;if(void 0!==e.buttons)return e.buttons;var n=e.button;return void 0!==n?1&n?1:2&n?3:4&n?2:0:void 0}function u(e){var n=e.getBoundingClientRect();return{left:n.left+c("scrollLeft","pageXOffset"),top:n.top+c("scrollTop","pageYOffset")}}function c(e,n){return"undefined"!=typeof t[n]?t[n]:S.clientHeight?S[e]:x.body[e]}function a(e,n,t){var r,o=e||{},i=o.className;return o.className+=" gu-hide",r=x.elementFromPoint(n,t),o.className=i,r}function f(){return!1}function l(){return!0}function d(e){return e.width||e.right-e.left}function s(e){return e.height||e.bottom-e.top}function v(e){return e.parentNode===x?null:e.parentNode}function p(e){return"INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName||m(e)}function m(e){return e?"false"===e.contentEditable?!1:"true"===e.contentEditable?!0:m(v(e)):!1}function g(e){function n(){var n=e;do n=n.nextSibling;while(n&&1!==n.nodeType);return n}return e.nextElementSibling||n()}function h(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function y(e,n){var t=h(n),r={pageX:"clientX",pageY:"clientY"};return e in r&&!(e in t)&&r[e]in t&&(e=r[e]),t[e]}var b=e("contra/emitter"),w=e("crossvent"),E=e("./classes"),x=document,S=x.documentElement;n.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./classes":1,"contra/emitter":5,crossvent:6}],3:[function(e,n,t){n.exports=function(e,n){return Array.prototype.slice.call(e,n)}},{}],4:[function(e,n,t){"use strict";var r=e("ticky");n.exports=function(e,n,t){e&&r(function(){e.apply(t||null,n||[])})}},{ticky:9}],5:[function(e,n,t){"use strict";var r=e("atoa"),o=e("./debounce");n.exports=function(e,n){var t=n||{},i={};return void 0===e&&(e={}),e.on=function(n,t){return i[n]?i[n].push(t):i[n]=[t],e},e.once=function(n,t){return t._once=!0,e.on(n,t),e},e.off=function(n,t){var r=arguments.length;if(1===r)delete i[n];else if(0===r)i={};else{var o=i[n];if(!o)return e;o.splice(o.indexOf(t),1)}return e},e.emit=function(){var n=r(arguments);return e.emitterSnapshot(n.shift()).apply(this,n)},e.emitterSnapshot=function(n){var u=(i[n]||[]).slice(0);return function(){var i=r(arguments),c=this||e;if("error"===n&&t["throws"]!==!1&&!u.length)throw 1===i.length?i[0]:i;return u.forEach(function(r){t.async?o(r,i,c):r.apply(c,i),r._once&&e.off(n,r)}),e}},e}},{"./debounce":4,atoa:3}],6:[function(e,n,t){(function(t){"use strict";function r(e,n,t,r){return e.addEventListener(n,t,r)}function o(e,n,t){return e.attachEvent("on"+n,f(e,n,t))}function i(e,n,t,r){return e.removeEventListener(n,t,r)}function u(e,n,t){var r=l(e,n,t);return r?e.detachEvent("on"+n,r):void 0}function c(e,n,t){function r(){var e;return p.createEvent?(e=p.createEvent("Event"),e.initEvent(n,!0,!0)):p.createEventObject&&(e=p.createEventObject()),e}function o(){return new s(n,{detail:t})}var i=-1===v.indexOf(n)?o():r();e.dispatchEvent?e.dispatchEvent(i):e.fireEvent("on"+n,i)}function a(e,n,r){return function(n){var o=n||t.event;o.target=o.target||o.srcElement,o.preventDefault=o.preventDefault||function(){o.returnValue=!1},o.stopPropagation=o.stopPropagation||function(){o.cancelBubble=!0},o.which=o.which||o.keyCode,r.call(e,o)}}function f(e,n,t){var r=l(e,n,t)||a(e,n,t);return h.push({wrapper:r,element:e,type:n,fn:t}),r}function l(e,n,t){var r=d(e,n,t);if(r){var o=h[r].wrapper;return h.splice(r,1),o}}function d(e,n,t){var r,o;for(r=0;r<h.length;r++)if(o=h[r],o.element===e&&o.type===n&&o.fn===t)return r}var s=e("custom-event"),v=e("./eventmap"),p=t.document,m=r,g=i,h=[];t.addEventListener||(m=o,g=u),n.exports={add:m,remove:g,fabricate:c}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./eventmap":7,"custom-event":8}],7:[function(e,n,t){(function(e){"use strict";var t=[],r="",o=/^on/;for(r in e)o.test(r)&&t.push(r.slice(2));n.exports=t}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(e,n,t){(function(e){function t(){try{var e=new r("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(n){}return!1}var r=e.CustomEvent;n.exports=t()?r:"function"==typeof document.createEvent?function(e,n){var t=document.createEvent("CustomEvent");return n?t.initCustomEvent(e,n.bubbles,n.cancelable,n.detail):t.initCustomEvent(e,!1,!1,void 0),t}:function(e,n){var t=document.createEventObject();return t.type=e,n?(t.bubbles=Boolean(n.bubbles),t.cancelable=Boolean(n.cancelable),t.detail=n.detail):(t.bubbles=!1,t.cancelable=!1,t.detail=void 0),t}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],9:[function(e,n,t){var r,o="function"==typeof setImmediate;r=o?function(e){setImmediate(e)}:function(e){setTimeout(e,0)},n.exports=r},{}]},{},[2])(2)});
//
// Navbar
//

'use strict';

var NavbarVertical = (function() {

	// Variables

    var $nav = $('.navbar-vertical .navbar-nav, .navbar-vertical .navbar-nav .nav');
	var $collapse = $('.navbar-vertical .collapse');
    var $dropdown = $('.navbar-vertical .dropdown');

	// Methods

	function accordion($this) {
		$this.closest($nav).find($collapse).not($this).collapse('hide');
	}

    function closeDropdown($this) {
        var $dropdownMenu = $this.find('.dropdown-menu');

        $dropdownMenu.addClass('close');

    	setTimeout(function() {
    		$dropdownMenu.removeClass('close');
    	}, 200);
	}


	// Events

	$collapse.on({
		'show.bs.collapse': function() {
			accordion($(this));
		}
	})

	$dropdown.on({
		'hide.bs.dropdown': function() {
			closeDropdown($(this));
		}
	})

})();

var NavbarCollapse = (function() {

	// Variables

    var $nav = $('#navbar-main'),
	    $collapse = $('#navbar-main-collapse'),
        $navTop = $('#navbar-top-main');


	// Methods

	function showNavbarCollapse($this) {
        $nav.addClass('navbar-collapsed');
        $navTop.addClass('navbar-collapsed');
        $('#header-main').addClass('header-collapse-show');
        $('body').addClass('modal-open');
	}

    function hideNavbarCollapse($this) {
        $this.removeClass('collapsing').addClass('collapsing-out');
        $nav.removeClass('navbar-collapsed').addClass('navbar-collapsed-out');
        $navTop.removeClass('navbar-collapsed').addClass('navbar-collapsed-out');
	}

    function hiddenNavbarCollapse($this) {
        $this.removeClass('collapsing-out');
        $nav.removeClass('navbar-collapsed-out');
        $navTop.removeClass('navbar-collapsed-out');
        $('#header-main').removeClass('header-collapse-show');
        $('body').removeClass('modal-open');
	}


	// Events

    if ($collapse.length) {
    	$collapse.on({
    		'show.bs.collapse': function() {
    			showNavbarCollapse($collapse);
    		}
    	})

        $collapse.on({
    		'hide.bs.collapse': function() {
                hideNavbarCollapse($collapse);
    		}
    	})

        $collapse.on({
    		'hidden.bs.collapse': function() {
                hiddenNavbarCollapse($collapse);
    		}
    	})
    }

})();


//
// Sticky Navbar
//

var NavbarSticky = (function() {

	// Variables

	var $nav = $('.navbar-sticky');


	// Methods

	function init($this) {

		var scrollTop = $(window).scrollTop(); // our current vertical position from the top

		// if we've scrolled more than the navigation, change its position to fixed to stick to top,
		// otherwise change it back to relative
		if (scrollTop > (navOffsetTop + 200)) {
			$this.addClass('sticky');
		} else {
			$this.removeClass('sticky');
		}
	}


	// Events

	if ($nav.length) {

        var navOffsetTop = $nav.offset().top;

		// Init sticky navbar
		init($nav);

		// re-calculate stickyness on scroll
		$(window).on({
			'scroll': function() {
				init($nav);
			}
		})
	}
})();
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],i=e.document,r=Object.getPrototypeOf,o=n.slice,s=n.concat,a=n.push,l=n.indexOf,c={},u=c.toString,f=c.hasOwnProperty,h=f.toString,d=h.call(Object),p={},g=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},m=function(e){return null!=e&&e===e.window},v={type:!0,src:!0,nonce:!0,noModule:!0};function y(e,t,n){var r,o,s=(n=n||i).createElement("script");if(s.text=e,t)for(r in v)(o=t[r]||t.getAttribute&&t.getAttribute(r))&&s.setAttribute(r,o);n.head.appendChild(s).parentNode.removeChild(s)}function b(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[u.call(e)]||"object":typeof e}var _="3.4.1",w=function(e,t){return new w.fn.init(e,t)},E=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;function x(e){var t=!!e&&"length"in e&&e.length,n=b(e);return!g(e)&&!m(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}w.fn=w.prototype={jquery:_,constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:a,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,i,r,o,s=arguments[0]||{},a=1,l=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[a]||{},a++),"object"==typeof s||g(s)||(s={}),a===l&&(s=this,a--);a<l;a++)if(null!=(e=arguments[a]))for(t in e)i=e[t],"__proto__"!==t&&s!==i&&(c&&i&&(w.isPlainObject(i)||(r=Array.isArray(i)))?(n=s[t],o=r&&!Array.isArray(n)?[]:r||w.isPlainObject(n)?n:{},r=!1,s[t]=w.extend(c,o,i)):void 0!==i&&(s[t]=i));return s},w.extend({expando:"jQuery"+(_+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==u.call(e)||(t=r(e))&&("function"!=typeof(n=f.call(t,"constructor")&&t.constructor)||h.call(n)!==d))},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t){y(e,{nonce:t&&t.nonce})},each:function(e,t){var n,i=0;if(x(e))for(n=e.length;i<n&&!1!==t.call(e[i],i,e[i]);i++);else for(i in e)if(!1===t.call(e[i],i,e[i]))break;return e},trim:function(e){return null==e?"":(e+"").replace(E,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(x(Object(e))?w.merge(n,"string"==typeof e?[e]:e):a.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:l.call(t,e,n)},merge:function(e,t){for(var n=+t.length,i=0,r=e.length;i<n;i++)e[r++]=t[i];return e.length=r,e},grep:function(e,t,n){for(var i=[],r=0,o=e.length,s=!n;r<o;r++)!t(e[r],r)!==s&&i.push(e[r]);return i},map:function(e,t,n){var i,r,o=0,a=[];if(x(e))for(i=e.length;o<i;o++)null!=(r=t(e[o],o,n))&&a.push(r);else for(o in e)null!=(r=t(e[o],o,n))&&a.push(r);return s.apply([],a)},guid:1,support:p}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});var T=function(e){var t,n,i,r,o,s,a,l,c,u,f,h,d,p,g,m,v,y,b,_="sizzle"+1*new Date,w=e.document,E=0,x=0,T=le(),C=le(),S=le(),A=le(),D=function(e,t){return e===t&&(f=!0),0},k={}.hasOwnProperty,N=[],I=N.pop,O=N.push,j=N.push,L=N.slice,P=function(e,t){for(var n=0,i=e.length;n<i;n++)if(e[n]===t)return n;return-1},H="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",q="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",R="\\["+M+"*("+q+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+q+"))|)"+M+"*\\]",F=":("+q+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+R+")*)|.*)\\)|)",W=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),U=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),V=new RegExp(M+"|>"),$=new RegExp(F),Q=new RegExp("^"+q+"$"),Y={ID:new RegExp("^#("+q+")"),CLASS:new RegExp("^\\.("+q+")"),TAG:new RegExp("^("+q+"|[*])"),ATTR:new RegExp("^"+R),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+H+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},K=/HTML$/i,X=/^(?:input|select|textarea|button)$/i,G=/^h\d$/i,J=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ne=function(e,t,n){var i="0x"+t-65536;return i!=i||n?t:i<0?String.fromCharCode(i+65536):String.fromCharCode(i>>10|55296,1023&i|56320)},ie=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,re=function(e,t){return t?"\0"===e?"�":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){h()},se=_e(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{j.apply(N=L.call(w.childNodes),w.childNodes),N[w.childNodes.length].nodeType}catch(t){j={apply:N.length?function(e,t){O.apply(e,L.call(t))}:function(e,t){for(var n=e.length,i=0;e[n++]=t[i++];);e.length=n-1}}}function ae(e,t,i,r){var o,a,c,u,f,p,v,y=t&&t.ownerDocument,E=t?t.nodeType:9;if(i=i||[],"string"!=typeof e||!e||1!==E&&9!==E&&11!==E)return i;if(!r&&((t?t.ownerDocument||t:w)!==d&&h(t),t=t||d,g)){if(11!==E&&(f=Z.exec(e)))if(o=f[1]){if(9===E){if(!(c=t.getElementById(o)))return i;if(c.id===o)return i.push(c),i}else if(y&&(c=y.getElementById(o))&&b(t,c)&&c.id===o)return i.push(c),i}else{if(f[2])return j.apply(i,t.getElementsByTagName(e)),i;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return j.apply(i,t.getElementsByClassName(o)),i}if(n.qsa&&!A[e+" "]&&(!m||!m.test(e))&&(1!==E||"object"!==t.nodeName.toLowerCase())){if(v=e,y=t,1===E&&V.test(e)){for((u=t.getAttribute("id"))?u=u.replace(ie,re):t.setAttribute("id",u=_),a=(p=s(e)).length;a--;)p[a]="#"+u+" "+be(p[a]);v=p.join(","),y=ee.test(e)&&ve(t.parentNode)||t}try{return j.apply(i,y.querySelectorAll(v)),i}catch(t){A(e,!0)}finally{u===_&&t.removeAttribute("id")}}}return l(e.replace(B,"$1"),t,i,r)}function le(){var e=[];return function t(n,r){return e.push(n+" ")>i.cacheLength&&delete t[e.shift()],t[n+" "]=r}}function ce(e){return e[_]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){for(var n=e.split("|"),r=n.length;r--;)i.attrHandle[n[r]]=t}function he(e,t){var n=t&&e,i=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(i)return i;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function de(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ge(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&se(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function me(e){return ce(function(t){return t=+t,ce(function(n,i){for(var r,o=e([],n.length,t),s=o.length;s--;)n[r=o[s]]&&(n[r]=!(i[r]=n[r]))})})}function ve(e){return e&&void 0!==e.getElementsByTagName&&e}for(t in n=ae.support={},o=ae.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!K.test(t||n&&n.nodeName||"HTML")},h=ae.setDocument=function(e){var t,r,s=e?e.ownerDocument||e:w;return s!==d&&9===s.nodeType&&s.documentElement&&(p=(d=s).documentElement,g=!o(d),w!==d&&(r=d.defaultView)&&r.top!==r&&(r.addEventListener?r.addEventListener("unload",oe,!1):r.attachEvent&&r.attachEvent("onunload",oe)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=J.test(d.getElementsByClassName),n.getById=ue(function(e){return p.appendChild(e).id=_,!d.getElementsByName||!d.getElementsByName(_).length}),n.getById?(i.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},i.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(i.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},i.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n,i,r,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];for(r=t.getElementsByName(e),i=0;o=r[i++];)if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),i.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,i=[],r=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[r++];)1===n.nodeType&&i.push(n);return i}return o},i.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],m=[],(n.qsa=J.test(d.querySelectorAll))&&(ue(function(e){p.appendChild(e).innerHTML="<a id='"+_+"'></a><select id='"+_+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||m.push("\\["+M+"*(?:value|"+H+")"),e.querySelectorAll("[id~="+_+"-]").length||m.push("~="),e.querySelectorAll(":checked").length||m.push(":checked"),e.querySelectorAll("a#"+_+"+*").length||m.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&m.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),p.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),m.push(",.*:")})),(n.matchesSelector=J.test(y=p.matches||p.webkitMatchesSelector||p.mozMatchesSelector||p.oMatchesSelector||p.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=y.call(e,"*"),y.call(e,"[s!='']:x"),v.push("!=",F)}),m=m.length&&new RegExp(m.join("|")),v=v.length&&new RegExp(v.join("|")),t=J.test(p.compareDocumentPosition),b=t||J.test(p.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,i=t&&t.parentNode;return e===i||!(!i||1!==i.nodeType||!(n.contains?n.contains(i):e.compareDocumentPosition&&16&e.compareDocumentPosition(i)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var i=!e.compareDocumentPosition-!t.compareDocumentPosition;return i||(1&(i=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===i?e===d||e.ownerDocument===w&&b(w,e)?-1:t===d||t.ownerDocument===w&&b(w,t)?1:u?P(u,e)-P(u,t):0:4&i?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,i=0,r=e.parentNode,o=t.parentNode,s=[e],a=[t];if(!r||!o)return e===d?-1:t===d?1:r?-1:o?1:u?P(u,e)-P(u,t):0;if(r===o)return he(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)a.unshift(n);for(;s[i]===a[i];)i++;return i?he(s[i],a[i]):s[i]===w?-1:a[i]===w?1:0}),d},ae.matches=function(e,t){return ae(e,null,null,t)},ae.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&h(e),n.matchesSelector&&g&&!A[t+" "]&&(!v||!v.test(t))&&(!m||!m.test(t)))try{var i=y.call(e,t);if(i||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return i}catch(e){A(t,!0)}return 0<ae(t,d,null,[e]).length},ae.contains=function(e,t){return(e.ownerDocument||e)!==d&&h(e),b(e,t)},ae.attr=function(e,t){(e.ownerDocument||e)!==d&&h(e);var r=i.attrHandle[t.toLowerCase()],o=r&&k.call(i.attrHandle,t.toLowerCase())?r(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},ae.escape=function(e){return(e+"").replace(ie,re)},ae.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},ae.uniqueSort=function(e){var t,i=[],r=0,o=0;if(f=!n.detectDuplicates,u=!n.sortStable&&e.slice(0),e.sort(D),f){for(;t=e[o++];)t===e[o]&&(r=i.push(o));for(;r--;)e.splice(i[r],1)}return u=null,e},r=ae.getText=function(e){var t,n="",i=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=r(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[i++];)n+=r(t);return n},(i=ae.selectors={cacheLength:50,createPseudo:ce,match:Y,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ae.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ae.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return Y.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&$.test(n)&&(t=s(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=T[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&T(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(i){var r=ae.attr(i,e);return null==r?"!="===t:!t||(r+="","="===t?r===n:"!="===t?r!==n:"^="===t?n&&0===r.indexOf(n):"*="===t?n&&-1<r.indexOf(n):"$="===t?n&&r.slice(-n.length)===n:"~="===t?-1<(" "+r.replace(W," ")+" ").indexOf(n):"|="===t&&(r===n||r.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,i,r){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===i&&0===r?function(e){return!!e.parentNode}:function(t,n,l){var c,u,f,h,d,p,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,v=a&&t.nodeName.toLowerCase(),y=!l&&!a,b=!1;if(m){if(o){for(;g;){for(h=t;h=h[g];)if(a?h.nodeName.toLowerCase()===v:1===h.nodeType)return!1;p=g="only"===e&&!p&&"nextSibling"}return!0}if(p=[s?m.firstChild:m.lastChild],s&&y){for(b=(d=(c=(u=(f=(h=m)[_]||(h[_]={}))[h.uniqueID]||(f[h.uniqueID]={}))[e]||[])[0]===E&&c[1])&&c[2],h=d&&m.childNodes[d];h=++d&&h&&h[g]||(b=d=0)||p.pop();)if(1===h.nodeType&&++b&&h===t){u[e]=[E,d,b];break}}else if(y&&(b=d=(c=(u=(f=(h=t)[_]||(h[_]={}))[h.uniqueID]||(f[h.uniqueID]={}))[e]||[])[0]===E&&c[1]),!1===b)for(;(h=++d&&h&&h[g]||(b=d=0)||p.pop())&&((a?h.nodeName.toLowerCase()!==v:1!==h.nodeType)||!++b||(y&&((u=(f=h[_]||(h[_]={}))[h.uniqueID]||(f[h.uniqueID]={}))[e]=[E,b]),h!==t)););return(b-=r)===i||b%i==0&&0<=b/i}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||ae.error("unsupported pseudo: "+e);return r[_]?r(t):1<r.length?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?ce(function(e,n){for(var i,o=r(e,t),s=o.length;s--;)e[i=P(e,o[s])]=!(n[i]=o[s])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ce(function(e){var t=[],n=[],i=a(e.replace(B,"$1"));return i[_]?ce(function(e,t,n,r){for(var o,s=i(e,null,r,[]),a=e.length;a--;)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:ce(function(e){return function(t){return 0<ae(e,t).length}}),contains:ce(function(e){return e=e.replace(te,ne),function(t){return-1<(t.textContent||r(t)).indexOf(e)}}),lang:ce(function(e){return Q.test(e||"")||ae.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===p},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return G.test(e.nodeName)},input:function(e){return X.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:me(function(){return[0]}),last:me(function(e,t){return[t-1]}),eq:me(function(e,t,n){return[n<0?n+t:n]}),even:me(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:me(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:me(function(e,t,n){for(var i=n<0?n+t:t<n?t:n;0<=--i;)e.push(i);return e}),gt:me(function(e,t,n){for(var i=n<0?n+t:n;++i<t;)e.push(i);return e})}}).pseudos.nth=i.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[t]=de(t);for(t in{submit:!0,reset:!0})i.pseudos[t]=pe(t);function ye(){}function be(e){for(var t=0,n=e.length,i="";t<n;t++)i+=e[t].value;return i}function _e(e,t,n){var i=t.dir,r=t.next,o=r||i,s=n&&"parentNode"===o,a=x++;return t.first?function(t,n,r){for(;t=t[i];)if(1===t.nodeType||s)return e(t,n,r);return!1}:function(t,n,l){var c,u,f,h=[E,a];if(l){for(;t=t[i];)if((1===t.nodeType||s)&&e(t,n,l))return!0}else for(;t=t[i];)if(1===t.nodeType||s)if(u=(f=t[_]||(t[_]={}))[t.uniqueID]||(f[t.uniqueID]={}),r&&r===t.nodeName.toLowerCase())t=t[i]||t;else{if((c=u[o])&&c[0]===E&&c[1]===a)return h[2]=c[2];if((u[o]=h)[2]=e(t,n,l))return!0}return!1}}function we(e){return 1<e.length?function(t,n,i){for(var r=e.length;r--;)if(!e[r](t,n,i))return!1;return!0}:e[0]}function Ee(e,t,n,i,r){for(var o,s=[],a=0,l=e.length,c=null!=t;a<l;a++)(o=e[a])&&(n&&!n(o,i,r)||(s.push(o),c&&t.push(a)));return s}function xe(e,t,n,i,r,o){return i&&!i[_]&&(i=xe(i)),r&&!r[_]&&(r=xe(r,o)),ce(function(o,s,a,l){var c,u,f,h=[],d=[],p=s.length,g=o||function(e,t,n){for(var i=0,r=t.length;i<r;i++)ae(e,t[i],n);return n}(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:Ee(g,h,e,a,l),v=n?r||(o?e:p||i)?[]:s:m;if(n&&n(m,v,a,l),i)for(c=Ee(v,d),i(c,[],a,l),u=c.length;u--;)(f=c[u])&&(v[d[u]]=!(m[d[u]]=f));if(o){if(r||e){if(r){for(c=[],u=v.length;u--;)(f=v[u])&&c.push(m[u]=f);r(null,v=[],c,l)}for(u=v.length;u--;)(f=v[u])&&-1<(c=r?P(o,f):h[u])&&(o[c]=!(s[c]=f))}}else v=Ee(v===s?v.splice(p,v.length):v),r?r(null,s,v,l):j.apply(s,v)})}function Te(e){for(var t,n,r,o=e.length,s=i.relative[e[0].type],a=s||i.relative[" "],l=s?1:0,u=_e(function(e){return e===t},a,!0),f=_e(function(e){return-1<P(t,e)},a,!0),h=[function(e,n,i){var r=!s&&(i||n!==c)||((t=n).nodeType?u(e,n,i):f(e,n,i));return t=null,r}];l<o;l++)if(n=i.relative[e[l].type])h=[_e(we(h),n)];else{if((n=i.filter[e[l].type].apply(null,e[l].matches))[_]){for(r=++l;r<o&&!i.relative[e[r].type];r++);return xe(1<l&&we(h),1<l&&be(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(B,"$1"),n,l<r&&Te(e.slice(l,r)),r<o&&Te(e=e.slice(r)),r<o&&be(e))}h.push(n)}return we(h)}return ye.prototype=i.filters=i.pseudos,i.setFilters=new ye,s=ae.tokenize=function(e,t){var n,r,o,s,a,l,c,u=C[e+" "];if(u)return t?0:u.slice(0);for(a=e,l=[],c=i.preFilter;a;){for(s in n&&!(r=U.exec(a))||(r&&(a=a.slice(r[0].length)||a),l.push(o=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),o.push({value:n,type:r[0].replace(B," ")}),a=a.slice(n.length)),i.filter)!(r=Y[s].exec(a))||c[s]&&!(r=c[s](r))||(n=r.shift(),o.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ae.error(e):C(e,l).slice(0)},a=ae.compile=function(e,t){var n,r,o,a,l,u,f=[],p=[],m=S[e+" "];if(!m){for(t||(t=s(e)),n=t.length;n--;)(m=Te(t[n]))[_]?f.push(m):p.push(m);(m=S(e,(r=p,a=0<(o=f).length,l=0<r.length,u=function(e,t,n,s,u){var f,p,m,v=0,y="0",b=e&&[],_=[],w=c,x=e||l&&i.find.TAG("*",u),T=E+=null==w?1:Math.random()||.1,C=x.length;for(u&&(c=t===d||t||u);y!==C&&null!=(f=x[y]);y++){if(l&&f){for(p=0,t||f.ownerDocument===d||(h(f),n=!g);m=r[p++];)if(m(f,t||d,n)){s.push(f);break}u&&(E=T)}a&&((f=!m&&f)&&v--,e&&b.push(f))}if(v+=y,a&&y!==v){for(p=0;m=o[p++];)m(b,_,t,n);if(e){if(0<v)for(;y--;)b[y]||_[y]||(_[y]=I.call(s));_=Ee(_)}j.apply(s,_),u&&!e&&0<_.length&&1<v+o.length&&ae.uniqueSort(s)}return u&&(E=T,c=w),b},a?ce(u):u))).selector=e}return m},l=ae.select=function(e,t,n,r){var o,l,c,u,f,h="function"==typeof e&&e,d=!r&&s(e=h.selector||e);if(n=n||[],1===d.length){if(2<(l=d[0]=d[0].slice(0)).length&&"ID"===(c=l[0]).type&&9===t.nodeType&&g&&i.relative[l[1].type]){if(!(t=(i.find.ID(c.matches[0].replace(te,ne),t)||[])[0]))return n;h&&(t=t.parentNode),e=e.slice(l.shift().value.length)}for(o=Y.needsContext.test(e)?0:l.length;o--&&(c=l[o],!i.relative[u=c.type]);)if((f=i.find[u])&&(r=f(c.matches[0].replace(te,ne),ee.test(l[0].type)&&ve(t.parentNode)||t))){if(l.splice(o,1),!(e=r.length&&be(l)))return j.apply(n,r),n;break}}return(h||a(e,d))(r,t,!g,n,!t||ee.test(e)&&ve(t.parentNode)||t),n},n.sortStable=_.split("").sort(D).join("")===_,n.detectDuplicates=!!f,h(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||fe(H,function(e,t,n){var i;if(!n)return!0===e[t]?t.toLowerCase():(i=e.getAttributeNode(t))&&i.specified?i.value:null}),ae}(e);w.find=T,w.expr=T.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=T.uniqueSort,w.text=T.getText,w.isXMLDoc=T.isXML,w.contains=T.contains,w.escapeSelector=T.escape;var C=function(e,t,n){for(var i=[],r=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(r&&w(e).is(n))break;i.push(e)}return i},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},A=w.expr.match.needsContext;function D(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var k=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function N(e,t,n){return g(t)?w.grep(e,function(e,i){return!!t.call(e,i,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return-1<l.call(t,e)!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var i=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===i.nodeType?w.find.matchesSelector(i,e)?[i]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,i=this.length,r=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<i;t++)if(w.contains(r[t],this))return!0}));for(n=this.pushStack([]),t=0;t<i;t++)w.find(e,r[t],n);return 1<i?w.uniqueSort(n):n},filter:function(e){return this.pushStack(N(this,e||[],!1))},not:function(e){return this.pushStack(N(this,e||[],!0))},is:function(e){return!!N(this,"string"==typeof e&&A.test(e)?w(e):e||[],!1).length}});var I,O=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var r,o;if(!e)return this;if(n=n||I,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:O.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:i,!0)),k.test(r[1])&&w.isPlainObject(t))for(r in t)g(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(o=i.getElementById(r[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,I=w(i);var j=/^(?:parents|prev(?:Until|All))/,L={children:!0,contents:!0,next:!0,prev:!0};function P(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,i=0,r=this.length,o=[],s="string"!=typeof e&&w(e);if(!A.test(e))for(;i<r;i++)for(n=this[i];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(s?-1<s.index(n):1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?l.call(w(e),this[0]):l.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return C(e,"parentNode")},parentsUntil:function(e,t,n){return C(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return C(e,"nextSibling")},prevAll:function(e){return C(e,"previousSibling")},nextUntil:function(e,t,n){return C(e,"nextSibling",n)},prevUntil:function(e,t,n){return C(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return void 0!==e.contentDocument?e.contentDocument:(D(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,i){var r=w.map(this,t,n);return"Until"!==e.slice(-5)&&(i=n),i&&"string"==typeof i&&(r=w.filter(i,r)),1<this.length&&(L[e]||w.uniqueSort(r),j.test(e)&&r.reverse()),this.pushStack(r)}});var H=/[^\x20\t\r\n\f]+/g;function M(e){return e}function q(e){throw e}function R(e,t,n,i){var r;try{e&&g(r=e.promise)?r.call(e).done(t).fail(n):e&&g(r=e.then)?r.call(e,t,n):t.apply(void 0,[e].slice(i))}catch(e){n.apply(void 0,[e])}}w.Callbacks=function(e){var t,n;e="string"==typeof e?(t=e,n={},w.each(t.match(H)||[],function(e,t){n[t]=!0}),n):w.extend({},e);var i,r,o,s,a=[],l=[],c=-1,u=function(){for(s=s||e.once,o=i=!0;l.length;c=-1)for(r=l.shift();++c<a.length;)!1===a[c].apply(r[0],r[1])&&e.stopOnFalse&&(c=a.length,r=!1);e.memory||(r=!1),i=!1,s&&(a=r?[]:"")},f={add:function(){return a&&(r&&!i&&(c=a.length-1,l.push(r)),function t(n){w.each(n,function(n,i){g(i)?e.unique&&f.has(i)||a.push(i):i&&i.length&&"string"!==b(i)&&t(i)})}(arguments),r&&!i&&u()),this},remove:function(){return w.each(arguments,function(e,t){for(var n;-1<(n=w.inArray(t,a,n));)a.splice(n,1),n<=c&&c--}),this},has:function(e){return e?-1<w.inArray(e,a):0<a.length},empty:function(){return a&&(a=[]),this},disable:function(){return s=l=[],a=r="",this},disabled:function(){return!a},lock:function(){return s=l=[],r||i||(a=r=""),this},locked:function(){return!!s},fireWith:function(e,t){return s||(t=[e,(t=t||[]).slice?t.slice():t],l.push(t),i||u()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],i="pending",r={state:function(){return i},always:function(){return o.done(arguments).fail(arguments),this},catch:function(e){return r.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,i){var r=g(e[i[4]])&&e[i[4]];o[i[1]](function(){var e=r&&r.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[i[0]+"With"](this,r?[e]:arguments)})}),e=null}).promise()},then:function(t,i,r){var o=0;function s(t,n,i,r){return function(){var a=this,l=arguments,c=function(){var e,c;if(!(t<o)){if((e=i.apply(a,l))===n.promise())throw new TypeError("Thenable self-resolution");c=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(c)?r?c.call(e,s(o,n,M,r),s(o,n,q,r)):(o++,c.call(e,s(o,n,M,r),s(o,n,q,r),s(o,n,M,n.notifyWith))):(i!==M&&(a=void 0,l=[e]),(r||n.resolveWith)(a,l))}},u=r?c:function(){try{c()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,u.stackTrace),o<=t+1&&(i!==q&&(a=void 0,l=[e]),n.rejectWith(a,l))}};t?u():(w.Deferred.getStackHook&&(u.stackTrace=w.Deferred.getStackHook()),e.setTimeout(u))}}return w.Deferred(function(e){n[0][3].add(s(0,e,g(r)?r:M,e.notifyWith)),n[1][3].add(s(0,e,g(t)?t:M)),n[2][3].add(s(0,e,g(i)?i:q))}).promise()},promise:function(e){return null!=e?w.extend(e,r):r}},o={};return w.each(n,function(e,t){var s=t[2],a=t[5];r[t[1]]=s.add,a&&s.add(function(){i=a},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),s.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=s.fireWith}),r.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,i=Array(n),r=o.call(arguments),s=w.Deferred(),a=function(e){return function(n){i[e]=this,r[e]=1<arguments.length?o.call(arguments):n,--t||s.resolveWith(i,r)}};if(t<=1&&(R(e,s.done(a(n)).resolve,s.reject,!t),"pending"===s.state()||g(r[n]&&r[n].then)))return s.then();for(;n--;)R(r[n],a(n),s.reject);return s.promise()}});var F=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&F.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var W=w.Deferred();function B(){i.removeEventListener("DOMContentLoaded",B),e.removeEventListener("load",B),w.ready()}w.fn.ready=function(e){return W.then(e).catch(function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0)!==e&&0<--w.readyWait||W.resolveWith(i,[w])}}),w.ready.then=W.then,"complete"===i.readyState||"loading"!==i.readyState&&!i.documentElement.doScroll?e.setTimeout(w.ready):(i.addEventListener("DOMContentLoaded",B),e.addEventListener("load",B));var U=function(e,t,n,i,r,o,s){var a=0,l=e.length,c=null==n;if("object"===b(n))for(a in r=!0,n)U(e,t,a,n[a],!0,o,s);else if(void 0!==i&&(r=!0,g(i)||(s=!0),c&&(s?(t.call(e,i),t=null):(c=t,t=function(e,t,n){return c.call(w(e),n)})),t))for(;a<l;a++)t(e[a],n,s?i:i.call(e[a],a,t(e[a],n)));return r?e:c?t.call(e):l?t(e[0],n):o},z=/^-ms-/,V=/-([a-z])/g;function $(e,t){return t.toUpperCase()}function Q(e){return e.replace(z,"ms-").replace(V,$)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function K(){this.expando=w.expando+K.uid++}K.uid=1,K.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var i,r=this.cache(e);if("string"==typeof t)r[Q(t)]=n;else for(i in t)r[Q(i)]=t[i];return r},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][Q(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,i=e[this.expando];if(void 0!==i){if(void 0!==t){n=(t=Array.isArray(t)?t.map(Q):(t=Q(t))in i?[t]:t.match(H)||[]).length;for(;n--;)delete i[t[n]]}(void 0===t||w.isEmptyObject(i))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var X=new K,G=new K,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function ee(e,t,n){var i,r;if(void 0===n&&1===e.nodeType)if(i="data-"+t.replace(Z,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(i))){try{n="true"===(r=n)||"false"!==r&&("null"===r?null:r===+r+""?+r:J.test(r)?JSON.parse(r):r)}catch(e){}G.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return G.hasData(e)||X.hasData(e)},data:function(e,t,n){return G.access(e,t,n)},removeData:function(e,t){G.remove(e,t)},_data:function(e,t,n){return X.access(e,t,n)},_removeData:function(e,t){X.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,i,r,o=this[0],s=o&&o.attributes;if(void 0===e){if(this.length&&(r=G.get(o),1===o.nodeType&&!X.get(o,"hasDataAttrs"))){for(n=s.length;n--;)s[n]&&0===(i=s[n].name).indexOf("data-")&&(i=Q(i.slice(5)),ee(o,i,r[i]));X.set(o,"hasDataAttrs",!0)}return r}return"object"==typeof e?this.each(function(){G.set(this,e)}):U(this,function(t){var n;if(o&&void 0===t)return void 0!==(n=G.get(o,e))?n:void 0!==(n=ee(o,e))?n:void 0;this.each(function(){G.set(this,e,t)})},null,t,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){G.remove(this,e)})}}),w.extend({queue:function(e,t,n){var i;if(e)return t=(t||"fx")+"queue",i=X.get(e,t),n&&(!i||Array.isArray(n)?i=X.access(e,t,w.makeArray(n)):i.push(n)),i||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),i=n.length,r=n.shift(),o=w._queueHooks(e,t);"inprogress"===r&&(r=n.shift(),i--),r&&("fx"===t&&n.unshift("inprogress"),delete o.stop,r.call(e,function(){w.dequeue(e,t)},o)),!i&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return X.get(e,n)||X.access(e,n,{empty:w.Callbacks("once memory").add(function(){X.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,i=1,r=w.Deferred(),o=this,s=this.length,a=function(){--i||r.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";s--;)(n=X.get(o[s],e+"queueHooks"))&&n.empty&&(i++,n.empty.add(a));return a(),r.promise(t)}});var te=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ne=new RegExp("^(?:([+-])=|)("+te+")([a-z%]*)$","i"),ie=["Top","Right","Bottom","Left"],re=i.documentElement,oe=function(e){return w.contains(e.ownerDocument,e)},se={composed:!0};re.getRootNode&&(oe=function(e){return w.contains(e.ownerDocument,e)||e.getRootNode(se)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&oe(e)&&"none"===w.css(e,"display")},le=function(e,t,n,i){var r,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];for(o in r=n.apply(e,i||[]),t)e.style[o]=s[o];return r};function ce(e,t,n,i){var r,o,s=20,a=i?function(){return i.cur()}:function(){return w.css(e,t,"")},l=a(),c=n&&n[3]||(w.cssNumber[t]?"":"px"),u=e.nodeType&&(w.cssNumber[t]||"px"!==c&&+l)&&ne.exec(w.css(e,t));if(u&&u[3]!==c){for(l/=2,c=c||u[3],u=+l||1;s--;)w.style(e,t,u+c),(1-o)*(1-(o=a()/l||.5))<=0&&(s=0),u/=o;u*=2,w.style(e,t,u+c),n=n||[]}return n&&(u=+u||+l||0,r=n[1]?u+(n[1]+1)*n[2]:+n[2],i&&(i.unit=c,i.start=u,i.end=r)),r}var ue={};function fe(e,t){for(var n,i,r,o,s,a,l,c=[],u=0,f=e.length;u<f;u++)(i=e[u]).style&&(n=i.style.display,t?("none"===n&&(c[u]=X.get(i,"display")||null,c[u]||(i.style.display="")),""===i.style.display&&ae(i)&&(c[u]=(l=s=o=void 0,s=(r=i).ownerDocument,a=r.nodeName,(l=ue[a])||(o=s.body.appendChild(s.createElement(a)),l=w.css(o,"display"),o.parentNode.removeChild(o),"none"===l&&(l="block"),ue[a]=l)))):"none"!==n&&(c[u]="none",X.set(i,"display",n)));for(u=0;u<f;u++)null!=c[u]&&(e[u].style.display=c[u]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var he=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,pe=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function me(e,t){var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&D(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,i=e.length;n<i;n++)X.set(e[n],"globalEval",!t||X.get(t[n],"globalEval"))}ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;var ye,be,_e=/<|&#?\w+;/;function we(e,t,n,i,r){for(var o,s,a,l,c,u,f=t.createDocumentFragment(),h=[],d=0,p=e.length;d<p;d++)if((o=e[d])||0===o)if("object"===b(o))w.merge(h,o.nodeType?[o]:o);else if(_e.test(o)){for(s=s||f.appendChild(t.createElement("div")),a=(de.exec(o)||["",""])[1].toLowerCase(),l=ge[a]||ge._default,s.innerHTML=l[1]+w.htmlPrefilter(o)+l[2],u=l[0];u--;)s=s.lastChild;w.merge(h,s.childNodes),(s=f.firstChild).textContent=""}else h.push(t.createTextNode(o));for(f.textContent="",d=0;o=h[d++];)if(i&&-1<w.inArray(o,i))r&&r.push(o);else if(c=oe(o),s=me(f.appendChild(o),"script"),c&&ve(s),n)for(u=0;o=s[u++];)pe.test(o.type||"")&&n.push(o);return f}ye=i.createDocumentFragment().appendChild(i.createElement("div")),(be=i.createElement("input")).setAttribute("type","radio"),be.setAttribute("checked","checked"),be.setAttribute("name","t"),ye.appendChild(be),p.checkClone=ye.cloneNode(!0).cloneNode(!0).lastChild.checked,ye.innerHTML="<textarea>x</textarea>",p.noCloneChecked=!!ye.cloneNode(!0).lastChild.defaultValue;var Ee=/^key/,xe=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ce(){return!0}function Se(){return!1}function Ae(e,t){return e===function(){try{return i.activeElement}catch(e){}}()==("focus"===t)}function De(e,t,n,i,r,o){var s,a;if("object"==typeof t){for(a in"string"!=typeof n&&(i=i||n,n=void 0),t)De(e,a,n,i,t[a],o);return e}if(null==i&&null==r?(r=n,i=n=void 0):null==r&&("string"==typeof n?(r=i,i=void 0):(r=i,i=n,n=void 0)),!1===r)r=Se;else if(!r)return e;return 1===o&&(s=r,(r=function(e){return w().off(e),s.apply(this,arguments)}).guid=s.guid||(s.guid=w.guid++)),e.each(function(){w.event.add(this,t,r,i,n)})}function ke(e,t,n){n?(X.set(e,t,!1),w.event.add(e,t,{namespace:!1,handler:function(e){var i,r,s=X.get(this,t);if(1&e.isTrigger&&this[t]){if(s.length)(w.event.special[t]||{}).delegateType&&e.stopPropagation();else if(s=o.call(arguments),X.set(this,t,s),i=n(this,t),this[t](),s!==(r=X.get(this,t))||i?X.set(this,t,!1):r={},s!==r)return e.stopImmediatePropagation(),e.preventDefault(),r.value}else s.length&&(X.set(this,t,{value:w.event.trigger(w.extend(s[0],w.Event.prototype),s.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===X.get(e,t)&&w.event.add(e,t,Ce)}w.event={global:{},add:function(e,t,n,i,r){var o,s,a,l,c,u,f,h,d,p,g,m=X.get(e);if(m)for(n.handler&&(n=(o=n).handler,r=o.selector),r&&w.find.matchesSelector(re,r),n.guid||(n.guid=w.guid++),(l=m.events)||(l=m.events={}),(s=m.handle)||(s=m.handle=function(t){return void 0!==w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),c=(t=(t||"").match(H)||[""]).length;c--;)d=g=(a=Te.exec(t[c])||[])[1],p=(a[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},u=w.extend({type:d,origType:g,data:i,handler:n,guid:n.guid,selector:r,needsContext:r&&w.expr.match.needsContext.test(r),namespace:p.join(".")},o),(h=l[d])||((h=l[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,i,p,s)||e.addEventListener&&e.addEventListener(d,s)),f.add&&(f.add.call(e,u),u.handler.guid||(u.handler.guid=n.guid)),r?h.splice(h.delegateCount++,0,u):h.push(u),w.event.global[d]=!0)},remove:function(e,t,n,i,r){var o,s,a,l,c,u,f,h,d,p,g,m=X.hasData(e)&&X.get(e);if(m&&(l=m.events)){for(c=(t=(t||"").match(H)||[""]).length;c--;)if(d=g=(a=Te.exec(t[c])||[])[1],p=(a[2]||"").split(".").sort(),d){for(f=w.event.special[d]||{},h=l[d=(i?f.delegateType:f.bindType)||d]||[],a=a[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=h.length;o--;)u=h[o],!r&&g!==u.origType||n&&n.guid!==u.guid||a&&!a.test(u.namespace)||i&&i!==u.selector&&("**"!==i||!u.selector)||(h.splice(o,1),u.selector&&h.delegateCount--,f.remove&&f.remove.call(e,u));s&&!h.length&&(f.teardown&&!1!==f.teardown.call(e,p,m.handle)||w.removeEvent(e,d,m.handle),delete l[d])}else for(d in l)w.event.remove(e,d+t[c],n,i,!0);w.isEmptyObject(l)&&X.remove(e,"handle events")}},dispatch:function(e){var t,n,i,r,o,s,a=w.event.fix(e),l=new Array(arguments.length),c=(X.get(this,"events")||{})[a.type]||[],u=w.event.special[a.type]||{};for(l[0]=a,t=1;t<arguments.length;t++)l[t]=arguments[t];if(a.delegateTarget=this,!u.preDispatch||!1!==u.preDispatch.call(this,a)){for(s=w.event.handlers.call(this,a,c),t=0;(r=s[t++])&&!a.isPropagationStopped();)for(a.currentTarget=r.elem,n=0;(o=r.handlers[n++])&&!a.isImmediatePropagationStopped();)a.rnamespace&&!1!==o.namespace&&!a.rnamespace.test(o.namespace)||(a.handleObj=o,a.data=o.data,void 0!==(i=((w.event.special[o.origType]||{}).handle||o.handler).apply(r.elem,l))&&!1===(a.result=i)&&(a.preventDefault(),a.stopPropagation()));return u.postDispatch&&u.postDispatch.call(this,a),a.result}},handlers:function(e,t){var n,i,r,o,s,a=[],l=t.delegateCount,c=e.target;if(l&&c.nodeType&&!("click"===e.type&&1<=e.button))for(;c!==this;c=c.parentNode||this)if(1===c.nodeType&&("click"!==e.type||!0!==c.disabled)){for(o=[],s={},n=0;n<l;n++)void 0===s[r=(i=t[n]).selector+" "]&&(s[r]=i.needsContext?-1<w(r,this).index(c):w.find(r,this,null,[c]).length),s[r]&&o.push(i);o.length&&a.push({elem:c,handlers:o})}return c=this,l<t.length&&a.push({elem:c,handlers:t.slice(l)}),a},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return he.test(t.type)&&t.click&&D(t,"input")&&ke(t,"click",Ce),!1},trigger:function(e){var t=this||e;return he.test(t.type)&&t.click&&D(t,"input")&&ke(t,"click"),!0},_default:function(e){var t=e.target;return he.test(t.type)&&t.click&&D(t,"input")&&X.get(t,"click")||D(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ce:Se,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:Se,isPropagationStopped:Se,isImmediatePropagationStopped:Se,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ce,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ce,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ce,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&Ee.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&xe.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({focus:"focusin",blur:"focusout"},function(e,t){w.event.special[e]={setup:function(){return ke(this,e,Ae),!1},trigger:function(){return ke(this,e),!0},delegateType:t}}),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,i=e.relatedTarget,r=e.handleObj;return i&&(i===this||w.contains(this,i))||(e.type=r.origType,n=r.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,i){return De(this,e,t,n,i)},one:function(e,t,n,i){return De(this,e,t,n,i,1)},off:function(e,t,n){var i,r;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,w(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(r in e)this.off(r,t,e[r]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Se),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ie=/<script|<style|<link/i,Oe=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return D(e,"table")&&D(11!==t.nodeType?t:t.firstChild,"tr")&&w(e).children("tbody")[0]||e}function Pe(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function He(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Me(e,t){var n,i,r,o,s,a,l,c;if(1===t.nodeType){if(X.hasData(e)&&(o=X.access(e),s=X.set(t,o),c=o.events))for(r in delete s.handle,s.events={},c)for(n=0,i=c[r].length;n<i;n++)w.event.add(t,r,c[r][n]);G.hasData(e)&&(a=G.access(e),l=w.extend({},a),G.set(t,l))}}function qe(e,t,n,i){t=s.apply([],t);var r,o,a,l,c,u,f=0,h=e.length,d=h-1,m=t[0],v=g(m);if(v||1<h&&"string"==typeof m&&!p.checkClone&&Oe.test(m))return e.each(function(r){var o=e.eq(r);v&&(t[0]=m.call(this,r,o.html())),qe(o,t,n,i)});if(h&&(o=(r=we(t,e[0].ownerDocument,!1,e,i)).firstChild,1===r.childNodes.length&&(r=o),o||i)){for(l=(a=w.map(me(r,"script"),Pe)).length;f<h;f++)c=r,f!==d&&(c=w.clone(c,!0,!0),l&&w.merge(a,me(c,"script"))),n.call(e[f],c,f);if(l)for(u=a[a.length-1].ownerDocument,w.map(a,He),f=0;f<l;f++)c=a[f],pe.test(c.type||"")&&!X.access(c,"globalEval")&&w.contains(u,c)&&(c.src&&"module"!==(c.type||"").toLowerCase()?w._evalUrl&&!c.noModule&&w._evalUrl(c.src,{nonce:c.nonce||c.getAttribute("nonce")}):y(c.textContent.replace(je,""),c,u))}return e}function Re(e,t,n){for(var i,r=t?w.filter(t,e):e,o=0;null!=(i=r[o]);o++)n||1!==i.nodeType||w.cleanData(me(i)),i.parentNode&&(n&&oe(i)&&ve(me(i,"script")),i.parentNode.removeChild(i));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var i,r,o,s,a,l,c,u=e.cloneNode(!0),f=oe(e);if(!(p.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(s=me(u),i=0,r=(o=me(e)).length;i<r;i++)a=o[i],"input"===(c=(l=s[i]).nodeName.toLowerCase())&&he.test(a.type)?l.checked=a.checked:"input"!==c&&"textarea"!==c||(l.defaultValue=a.defaultValue);if(t)if(n)for(o=o||me(e),s=s||me(u),i=0,r=o.length;i<r;i++)Me(o[i],s[i]);else Me(e,u);return 0<(s=me(u,"script")).length&&ve(s,!f&&me(e,"script")),u},cleanData:function(e){for(var t,n,i,r=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[X.expando]){if(t.events)for(i in t.events)r[i]?w.event.remove(n,i):w.removeEvent(n,i,t.handle);n[X.expando]=void 0}n[G.expando]&&(n[G.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Re(this,e,!0)},remove:function(e){return Re(this,e)},text:function(e){return U(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return qe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return qe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return qe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return qe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(me(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return U(this,function(e){var t=this[0]||{},n=0,i=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ie.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<i;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(me(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return qe(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(me(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,i=[],r=w(e),o=r.length-1,s=0;s<=o;s++)n=s===o?this:this.clone(!0),w(r[s])[t](n),a.apply(i,n.get());return this.pushStack(i)}});var Fe=new RegExp("^("+te+")(?!px)[a-z%]+$","i"),We=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(ie.join("|"),"i");function Ue(e,t,n){var i,r,o,s,a=e.style;return(n=n||We(e))&&(""!==(s=n.getPropertyValue(t)||n[t])||oe(e)||(s=w.style(e,t)),!p.pixelBoxStyles()&&Fe.test(s)&&Be.test(t)&&(i=a.width,r=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=i,a.minWidth=r,a.maxWidth=o)),void 0!==s?s+"":s}function ze(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function t(){if(u){c.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",u.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(c).appendChild(u);var t=e.getComputedStyle(u);r="1%"!==t.top,l=12===n(t.marginLeft),u.style.right="60%",a=36===n(t.right),o=36===n(t.width),u.style.position="absolute",s=12===n(u.offsetWidth/3),re.removeChild(c),u=null}}function n(e){return Math.round(parseFloat(e))}var r,o,s,a,l,c=i.createElement("div"),u=i.createElement("div");u.style&&(u.style.backgroundClip="content-box",u.cloneNode(!0).style.backgroundClip="",p.clearCloneStyle="content-box"===u.style.backgroundClip,w.extend(p,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),a},pixelPosition:function(){return t(),r},reliableMarginLeft:function(){return t(),l},scrollboxSize:function(){return t(),s}}))}();var Ve=["Webkit","Moz","ms"],$e=i.createElement("div").style,Qe={};function Ye(e){return w.cssProps[e]||Qe[e]||(e in $e?e:Qe[e]=function(e){for(var t=e[0].toUpperCase()+e.slice(1),n=Ve.length;n--;)if((e=Ve[n]+t)in $e)return e}(e)||e)}var Ke=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ge={position:"absolute",visibility:"hidden",display:"block"},Je={letterSpacing:"0",fontWeight:"400"};function Ze(e,t,n){var i=ne.exec(t);return i?Math.max(0,i[2]-(n||0))+(i[3]||"px"):t}function et(e,t,n,i,r,o){var s="width"===t?1:0,a=0,l=0;if(n===(i?"border":"content"))return 0;for(;s<4;s+=2)"margin"===n&&(l+=w.css(e,n+ie[s],!0,r)),i?("content"===n&&(l-=w.css(e,"padding"+ie[s],!0,r)),"margin"!==n&&(l-=w.css(e,"border"+ie[s]+"Width",!0,r))):(l+=w.css(e,"padding"+ie[s],!0,r),"padding"!==n?l+=w.css(e,"border"+ie[s]+"Width",!0,r):a+=w.css(e,"border"+ie[s]+"Width",!0,r));return!i&&0<=o&&(l+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-l-a-.5))||0),l}function tt(e,t,n){var i=We(e),r=(!p.boxSizingReliable()||n)&&"border-box"===w.css(e,"boxSizing",!1,i),o=r,s=Ue(e,t,i),a="offset"+t[0].toUpperCase()+t.slice(1);if(Fe.test(s)){if(!n)return s;s="auto"}return(!p.boxSizingReliable()&&r||"auto"===s||!parseFloat(s)&&"inline"===w.css(e,"display",!1,i))&&e.getClientRects().length&&(r="border-box"===w.css(e,"boxSizing",!1,i),(o=a in e)&&(s=e[a])),(s=parseFloat(s)||0)+et(e,t,n||(r?"border":"content"),o,i,s)+"px"}function nt(e,t,n,i,r){return new nt.prototype.init(e,t,n,i,r)}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Ue(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var r,o,s,a=Q(t),l=Xe.test(t),c=e.style;if(l||(t=Ye(a)),s=w.cssHooks[t]||w.cssHooks[a],void 0===n)return s&&"get"in s&&void 0!==(r=s.get(e,!1,i))?r:c[t];"string"==(o=typeof n)&&(r=ne.exec(n))&&r[1]&&(n=ce(e,t,r),o="number"),null!=n&&n==n&&("number"!==o||l||(n+=r&&r[3]||(w.cssNumber[a]?"":"px")),p.clearCloneStyle||""!==n||0!==t.indexOf("background")||(c[t]="inherit"),s&&"set"in s&&void 0===(n=s.set(e,n,i))||(l?c.setProperty(t,n):c[t]=n))}},css:function(e,t,n,i){var r,o,s,a=Q(t);return Xe.test(t)||(t=Ye(a)),(s=w.cssHooks[t]||w.cssHooks[a])&&"get"in s&&(r=s.get(e,!0,n)),void 0===r&&(r=Ue(e,t,i)),"normal"===r&&t in Je&&(r=Je[t]),""===n||n?(o=parseFloat(r),!0===n||isFinite(o)?o||0:r):r}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,i){if(n)return!Ke.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?tt(e,t,i):le(e,Ge,function(){return tt(e,t,i)})},set:function(e,n,i){var r,o=We(e),s=!p.scrollboxSize()&&"absolute"===o.position,a=(s||i)&&"border-box"===w.css(e,"boxSizing",!1,o),l=i?et(e,t,i,a,o):0;return a&&s&&(l-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-et(e,t,"border",!1,o)-.5)),l&&(r=ne.exec(n))&&"px"!==(r[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ze(0,n,l)}}}),w.cssHooks.marginLeft=ze(p.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Ue(e,"marginLeft"))||e.getBoundingClientRect().left-le(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var i=0,r={},o="string"==typeof n?n.split(" "):[n];i<4;i++)r[e+ie[i]+t]=o[i]||o[i-2]||o[0];return r}},"margin"!==e&&(w.cssHooks[e+t].set=Ze)}),w.fn.extend({css:function(e,t){return U(this,function(e,t,n){var i,r,o={},s=0;if(Array.isArray(t)){for(i=We(e),r=t.length;s<r;s++)o[t[s]]=w.css(e,t[s],!1,i);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,1<arguments.length)}}),((w.Tween=nt).prototype={constructor:nt,init:function(e,t,n,i,r,o){this.elem=e,this.prop=n,this.easing=r||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=i,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=nt.propHooks[this.prop];return e&&e.get?e.get(this):nt.propHooks._default.get(this)},run:function(e){var t,n=nt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):nt.propHooks._default.set(this),this}}).init.prototype=nt.prototype,(nt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||!w.cssHooks[e.prop]&&null==e.elem.style[Ye(e.prop)]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=nt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=nt.prototype.init,w.fx.step={};var it,rt,ot,st,at=/^(?:toggle|show|hide)$/,lt=/queueHooks$/;function ct(){rt&&(!1===i.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(ct):e.setTimeout(ct,w.fx.interval),w.fx.tick())}function ut(){return e.setTimeout(function(){it=void 0}),it=Date.now()}function ft(e,t){var n,i=0,r={height:e};for(t=t?1:0;i<4;i+=2-t)r["margin"+(n=ie[i])]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function ht(e,t,n){for(var i,r=(dt.tweeners[t]||[]).concat(dt.tweeners["*"]),o=0,s=r.length;o<s;o++)if(i=r[o].call(n,t,e))return i}function dt(e,t,n){var i,r,o=0,s=dt.prefilters.length,a=w.Deferred().always(function(){delete l.elem}),l=function(){if(r)return!1;for(var t=it||ut(),n=Math.max(0,c.startTime+c.duration-t),i=1-(n/c.duration||0),o=0,s=c.tweens.length;o<s;o++)c.tweens[o].run(i);return a.notifyWith(e,[c,i,n]),i<1&&s?n:(s||a.notifyWith(e,[c,1,0]),a.resolveWith(e,[c]),!1)},c=a.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:it||ut(),duration:n.duration,tweens:[],createTween:function(t,n){var i=w.Tween(e,c.opts,t,n,c.opts.specialEasing[t]||c.opts.easing);return c.tweens.push(i),i},stop:function(t){var n=0,i=t?c.tweens.length:0;if(r)return this;for(r=!0;n<i;n++)c.tweens[n].run(1);return t?(a.notifyWith(e,[c,1,0]),a.resolveWith(e,[c,t])):a.rejectWith(e,[c,t]),this}}),u=c.props;for(function(e,t){var n,i,r,o,s;for(n in e)if(r=t[i=Q(n)],o=e[n],Array.isArray(o)&&(r=o[1],o=e[n]=o[0]),n!==i&&(e[i]=o,delete e[n]),(s=w.cssHooks[i])&&"expand"in s)for(n in o=s.expand(o),delete e[i],o)n in e||(e[n]=o[n],t[n]=r);else t[i]=r}(u,c.opts.specialEasing);o<s;o++)if(i=dt.prefilters[o].call(c,e,u,c.opts))return g(i.stop)&&(w._queueHooks(c.elem,c.opts.queue).stop=i.stop.bind(i)),i;return w.map(u,ht,c),g(c.opts.start)&&c.opts.start.call(e,c),c.progress(c.opts.progress).done(c.opts.done,c.opts.complete).fail(c.opts.fail).always(c.opts.always),w.fx.timer(w.extend(l,{elem:e,anim:c,queue:c.opts.queue})),c}w.Animation=w.extend(dt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ce(n.elem,e,ne.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(H);for(var n,i=0,r=e.length;i<r;i++)n=e[i],dt.tweeners[n]=dt.tweeners[n]||[],dt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var i,r,o,s,a,l,c,u,f="width"in t||"height"in t,h=this,d={},p=e.style,g=e.nodeType&&ae(e),m=X.get(e,"fxshow");for(i in n.queue||(null==(s=w._queueHooks(e,"fx")).unqueued&&(s.unqueued=0,a=s.empty.fire,s.empty.fire=function(){s.unqueued||a()}),s.unqueued++,h.always(function(){h.always(function(){s.unqueued--,w.queue(e,"fx").length||s.empty.fire()})})),t)if(r=t[i],at.test(r)){if(delete t[i],o=o||"toggle"===r,r===(g?"hide":"show")){if("show"!==r||!m||void 0===m[i])continue;g=!0}d[i]=m&&m[i]||w.style(e,i)}if((l=!w.isEmptyObject(t))||!w.isEmptyObject(d))for(i in f&&1===e.nodeType&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],null==(c=m&&m.display)&&(c=X.get(e,"display")),"none"===(u=w.css(e,"display"))&&(c?u=c:(fe([e],!0),c=e.style.display||c,u=w.css(e,"display"),fe([e]))),("inline"===u||"inline-block"===u&&null!=c)&&"none"===w.css(e,"float")&&(l||(h.done(function(){p.display=c}),null==c&&(u=p.display,c="none"===u?"":u)),p.display="inline-block")),n.overflow&&(p.overflow="hidden",h.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]})),l=!1,d)l||(m?"hidden"in m&&(g=m.hidden):m=X.access(e,"fxshow",{display:c}),o&&(m.hidden=!g),g&&fe([e],!0),h.done(function(){for(i in g||fe([e]),X.remove(e,"fxshow"),d)w.style(e,i,d[i])})),l=ht(g?m[i]:0,i,h),i in m||(m[i]=l.start,g&&(l.end=l.start,l.start=0))}],prefilter:function(e,t){t?dt.prefilters.unshift(e):dt.prefilters.push(e)}}),w.speed=function(e,t,n){var i=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?i.duration=0:"number"!=typeof i.duration&&(i.duration in w.fx.speeds?i.duration=w.fx.speeds[i.duration]:i.duration=w.fx.speeds._default),null!=i.queue&&!0!==i.queue||(i.queue="fx"),i.old=i.complete,i.complete=function(){g(i.old)&&i.old.call(this),i.queue&&w.dequeue(this,i.queue)},i},w.fn.extend({fadeTo:function(e,t,n,i){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,i)},animate:function(e,t,n,i){var r=w.isEmptyObject(e),o=w.speed(t,n,i),s=function(){var t=dt(this,w.extend({},e),o);(r||X.get(this,"finish"))&&t.stop(!0)};return s.finish=s,r||!1===o.queue?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var i=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,r=null!=e&&e+"queueHooks",o=w.timers,s=X.get(this);if(r)s[r]&&s[r].stop&&i(s[r]);else for(r in s)s[r]&&s[r].stop&&lt.test(r)&&i(s[r]);for(r=o.length;r--;)o[r].elem!==this||null!=e&&o[r].queue!==e||(o[r].anim.stop(n),t=!1,o.splice(r,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=X.get(this),i=n[e+"queue"],r=n[e+"queueHooks"],o=w.timers,s=i?i.length:0;for(n.finish=!0,w.queue(this,e,[]),r&&r.stop&&r.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<s;t++)i[t]&&i[t].finish&&i[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,i,r){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ft(t,!0),e,i,r)}}),w.each({slideDown:ft("show"),slideUp:ft("hide"),slideToggle:ft("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,i){return this.animate(t,e,n,i)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(it=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),it=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,ct())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx&&w.fx.speeds[t]||t,n=n||"fx",this.queue(n,function(n,i){var r=e.setTimeout(n,t);i.stop=function(){e.clearTimeout(r)}})},ot=i.createElement("input"),st=i.createElement("select").appendChild(i.createElement("option")),ot.type="checkbox",p.checkOn=""!==ot.value,p.optSelected=st.selected,(ot=i.createElement("input")).value="t",ot.type="radio",p.radioValue="t"===ot.value;var pt,gt=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return U(this,w.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var i,r,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(r=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):r&&"set"in r&&void 0!==(i=r.set(e,n,t))?i:(e.setAttribute(t,n+""),n):r&&"get"in r&&null!==(i=r.get(e,t))?i:null==(i=w.find.attr(e,t))?void 0:i)},attrHooks:{type:{set:function(e,t){if(!p.radioValue&&"radio"===t&&D(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,i=0,r=t&&t.match(H);if(r&&1===e.nodeType)for(;n=r[i++];)e.removeAttribute(n)}}),pt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=gt[t]||w.find.attr;gt[t]=function(e,t,i){var r,o,s=t.toLowerCase();return i||(o=gt[s],gt[s]=r,r=null!=n(e,t,i)?s:null,gt[s]=o),r}});var mt=/^(?:input|select|textarea|button)$/i,vt=/^(?:a|area)$/i;function yt(e){return(e.match(H)||[]).join(" ")}function bt(e){return e.getAttribute&&e.getAttribute("class")||""}function _t(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(H)||[]}w.fn.extend({prop:function(e,t){return U(this,w.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var i,r,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,r=w.propHooks[t]),void 0!==n?r&&"set"in r&&void 0!==(i=r.set(e,n,t))?i:e[t]=n:r&&"get"in r&&null!==(i=r.get(e,t))?i:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):mt.test(e.nodeName)||vt.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),p.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this}),w.fn.extend({addClass:function(e){var t,n,i,r,o,s,a,l=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,bt(this)))});if((t=_t(e)).length)for(;n=this[l++];)if(r=bt(n),i=1===n.nodeType&&" "+yt(r)+" "){for(s=0;o=t[s++];)i.indexOf(" "+o+" ")<0&&(i+=o+" ");r!==(a=yt(i))&&n.setAttribute("class",a)}return this},removeClass:function(e){var t,n,i,r,o,s,a,l=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,bt(this)))});if(!arguments.length)return this.attr("class","");if((t=_t(e)).length)for(;n=this[l++];)if(r=bt(n),i=1===n.nodeType&&" "+yt(r)+" "){for(s=0;o=t[s++];)for(;-1<i.indexOf(" "+o+" ");)i=i.replace(" "+o+" "," ");r!==(a=yt(i))&&n.setAttribute("class",a)}return this},toggleClass:function(e,t){var n=typeof e,i="string"===n||Array.isArray(e);return"boolean"==typeof t&&i?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,bt(this),t),t)}):this.each(function(){var t,r,o,s;if(i)for(r=0,o=w(this),s=_t(e);t=s[r++];)o.hasClass(t)?o.removeClass(t):o.addClass(t);else void 0!==e&&"boolean"!==n||((t=bt(this))&&X.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":X.get(this,"__className__")||""))})},hasClass:function(e){var t,n,i=0;for(t=" "+e+" ";n=this[i++];)if(1===n.nodeType&&-1<(" "+yt(bt(n))+" ").indexOf(t))return!0;return!1}});var wt=/\r/g;w.fn.extend({val:function(e){var t,n,i,r=this[0];return arguments.length?(i=g(e),this.each(function(n){var r;1===this.nodeType&&(null==(r=i?e.call(this,n,w(this).val()):e)?r="":"number"==typeof r?r+="":Array.isArray(r)&&(r=w.map(r,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,r,"value")||(this.value=r))})):r?(t=w.valHooks[r.type]||w.valHooks[r.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(r,"value"))?n:"string"==typeof(n=r.value)?n.replace(wt,""):null==n?"":n:void 0}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:yt(w.text(e))}},select:{get:function(e){var t,n,i,r=e.options,o=e.selectedIndex,s="select-one"===e.type,a=s?null:[],l=s?o+1:r.length;for(i=o<0?l:s?o:0;i<l;i++)if(((n=r[i]).selected||i===o)&&!n.disabled&&(!n.parentNode.disabled||!D(n.parentNode,"optgroup"))){if(t=w(n).val(),s)return t;a.push(t)}return a},set:function(e,t){for(var n,i,r=e.options,o=w.makeArray(t),s=r.length;s--;)((i=r[s]).selected=-1<w.inArray(w.valHooks.option.get(i),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<w.inArray(w(e).val(),t)}},p.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),p.focusin="onfocusin"in e;var Et=/^(?:focusinfocus|focusoutblur)$/,xt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,r,o){var s,a,l,c,u,h,d,p,v=[r||i],y=f.call(t,"type")?t.type:t,b=f.call(t,"namespace")?t.namespace.split("."):[];if(a=p=l=r=r||i,3!==r.nodeType&&8!==r.nodeType&&!Et.test(y+w.event.triggered)&&(-1<y.indexOf(".")&&(y=(b=y.split(".")).shift(),b.sort()),u=y.indexOf(":")<0&&"on"+y,(t=t[w.expando]?t:new w.Event(y,"object"==typeof t&&t)).isTrigger=o?2:3,t.namespace=b.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[y]||{},o||!d.trigger||!1!==d.trigger.apply(r,n))){if(!o&&!d.noBubble&&!m(r)){for(c=d.delegateType||y,Et.test(c+y)||(a=a.parentNode);a;a=a.parentNode)v.push(a),l=a;l===(r.ownerDocument||i)&&v.push(l.defaultView||l.parentWindow||e)}for(s=0;(a=v[s++])&&!t.isPropagationStopped();)p=a,t.type=1<s?c:d.bindType||y,(h=(X.get(a,"events")||{})[t.type]&&X.get(a,"handle"))&&h.apply(a,n),(h=u&&a[u])&&h.apply&&Y(a)&&(t.result=h.apply(a,n),!1===t.result&&t.preventDefault());return t.type=y,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(r)||u&&g(r[y])&&!m(r)&&((l=r[u])&&(r[u]=null),w.event.triggered=y,t.isPropagationStopped()&&p.addEventListener(y,xt),r[y](),t.isPropagationStopped()&&p.removeEventListener(y,xt),w.event.triggered=void 0,l&&(r[u]=l)),t.result}},simulate:function(e,t,n){var i=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(i,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),p.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var i=this.ownerDocument||this,r=X.access(i,t);r||i.addEventListener(e,n,!0),X.access(i,t,(r||0)+1)},teardown:function(){var i=this.ownerDocument||this,r=X.access(i,t)-1;r?X.access(i,t,r):(i.removeEventListener(e,n,!0),X.remove(i,t))}}});var Tt=e.location,Ct=Date.now(),St=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(t){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var At=/\[\]$/,Dt=/\r?\n/g,kt=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i;function It(e,t,n,i){var r;if(Array.isArray(t))w.each(t,function(t,r){n||At.test(e)?i(e,r):It(e+"["+("object"==typeof r&&null!=r?t:"")+"]",r,n,i)});else if(n||"object"!==b(t))i(e,t);else for(r in t)It(e+"["+r+"]",t[r],n,i)}w.param=function(e,t){var n,i=[],r=function(e,t){var n=g(t)?t():t;i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){r(this.name,this.value)});else for(n in e)It(n,e[n],t,r);return i.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&Nt.test(this.nodeName)&&!kt.test(e)&&(this.checked||!he.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var Ot=/%20/g,jt=/#.*$/,Lt=/([?&])_=[^&]*/,Pt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ht=/^(?:GET|HEAD)$/,Mt=/^\/\//,qt={},Rt={},Ft="*/".concat("*"),Wt=i.createElement("a");function Bt(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var i,r=0,o=t.toLowerCase().match(H)||[];if(g(n))for(;i=o[r++];)"+"===i[0]?(i=i.slice(1)||"*",(e[i]=e[i]||[]).unshift(n)):(e[i]=e[i]||[]).push(n)}}function Ut(e,t,n,i){var r={},o=e===Rt;function s(a){var l;return r[a]=!0,w.each(e[a]||[],function(e,a){var c=a(t,n,i);return"string"!=typeof c||o||r[c]?o?!(l=c):void 0:(t.dataTypes.unshift(c),s(c),!1)}),l}return s(t.dataTypes[0])||!r["*"]&&s("*")}function zt(e,t){var n,i,r=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((r[n]?e:i||(i={}))[n]=t[n]);return i&&w.extend(!0,e,i),e}Wt.href=Tt.href,w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Tt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Ft,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Bt(qt),ajaxTransport:Bt(Rt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var r,o,s,a,l,c,u,f,h,d,p=w.ajaxSetup({},n),g=p.context||p,m=p.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),y=w.Callbacks("once memory"),b=p.statusCode||{},_={},E={},x="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(u){if(!a)for(a={};t=Pt.exec(s);)a[t[1].toLowerCase()+" "]=(a[t[1].toLowerCase()+" "]||[]).concat(t[2]);t=a[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return u?s:null},setRequestHeader:function(e,t){return null==u&&(e=E[e.toLowerCase()]=E[e.toLowerCase()]||e,_[e]=t),this},overrideMimeType:function(e){return null==u&&(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(u)T.always(e[T.status]);else for(t in e)b[t]=[b[t],e[t]];return this},abort:function(e){var t=e||x;return r&&r.abort(t),C(0,t),this}};if(v.promise(T),p.url=((t||p.url||Tt.href)+"").replace(Mt,Tt.protocol+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=(p.dataType||"*").toLowerCase().match(H)||[""],null==p.crossDomain){c=i.createElement("a");try{c.href=p.url,c.href=c.href,p.crossDomain=Wt.protocol+"//"+Wt.host!=c.protocol+"//"+c.host}catch(t){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=w.param(p.data,p.traditional)),Ut(qt,p,n,T),u)return T;for(h in(f=w.event&&p.global)&&0==w.active++&&w.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Ht.test(p.type),o=p.url.replace(jt,""),p.hasContent?p.data&&p.processData&&0===(p.contentType||"").indexOf("application/x-www-form-urlencoded")&&(p.data=p.data.replace(Ot,"+")):(d=p.url.slice(o.length),p.data&&(p.processData||"string"==typeof p.data)&&(o+=(St.test(o)?"&":"?")+p.data,delete p.data),!1===p.cache&&(o=o.replace(Lt,"$1"),d=(St.test(o)?"&":"?")+"_="+Ct+++d),p.url=o+d),p.ifModified&&(w.lastModified[o]&&T.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&T.setRequestHeader("If-None-Match",w.etag[o])),(p.data&&p.hasContent&&!1!==p.contentType||n.contentType)&&T.setRequestHeader("Content-Type",p.contentType),T.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Ft+"; q=0.01":""):p.accepts["*"]),p.headers)T.setRequestHeader(h,p.headers[h]);if(p.beforeSend&&(!1===p.beforeSend.call(g,T,p)||u))return T.abort();if(x="abort",y.add(p.complete),T.done(p.success),T.fail(p.error),r=Ut(Rt,p,n,T)){if(T.readyState=1,f&&m.trigger("ajaxSend",[T,p]),u)return T;p.async&&0<p.timeout&&(l=e.setTimeout(function(){T.abort("timeout")},p.timeout));try{u=!1,r.send(_,C)}catch(t){if(u)throw t;C(-1,t)}}else C(-1,"No Transport");function C(t,n,i,a){var c,h,d,_,E,x=n;u||(u=!0,l&&e.clearTimeout(l),r=void 0,s=a||"",T.readyState=0<t?4:0,c=200<=t&&t<300||304===t,i&&(_=function(e,t,n){for(var i,r,o,s,a=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),void 0===i&&(i=e.mimeType||t.getResponseHeader("Content-Type"));if(i)for(r in a)if(a[r]&&a[r].test(i)){l.unshift(r);break}if(l[0]in n)o=l[0];else{for(r in n){if(!l[0]||e.converters[r+" "+l[0]]){o=r;break}s||(s=r)}o=o||s}if(o)return o!==l[0]&&l.unshift(o),n[o]}(p,T,i)),_=function(e,t,n,i){var r,o,s,a,l,c={},u=e.dataTypes.slice();if(u[1])for(s in e.converters)c[s.toLowerCase()]=e.converters[s];for(o=u.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&i&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=u.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(!(s=c[l+" "+o]||c["* "+o]))for(r in c)if((a=r.split(" "))[1]===o&&(s=c[l+" "+a[0]]||c["* "+a[0]])){!0===s?s=c[r]:!0!==c[r]&&(o=a[0],u.unshift(a[1]));break}if(!0!==s)if(s&&e.throws)t=s(t);else try{t=s(t)}catch(e){return{state:"parsererror",error:s?e:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}(p,_,T,c),c?(p.ifModified&&((E=T.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=E),(E=T.getResponseHeader("etag"))&&(w.etag[o]=E)),204===t||"HEAD"===p.type?x="nocontent":304===t?x="notmodified":(x=_.state,h=_.data,c=!(d=_.error))):(d=x,!t&&x||(x="error",t<0&&(t=0))),T.status=t,T.statusText=(n||x)+"",c?v.resolveWith(g,[h,x,T]):v.rejectWith(g,[T,x,d]),T.statusCode(b),b=void 0,f&&m.trigger(c?"ajaxSuccess":"ajaxError",[T,p,c?h:d]),y.fireWith(g,[T,x]),f&&(m.trigger("ajaxComplete",[T,p]),--w.active||w.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,i,r){return g(n)&&(r=r||i,i=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:r,data:n,success:i},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e,t){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){w.globalEval(e,t)}})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},$t=w.ajaxSettings.xhr();p.cors=!!$t&&"withCredentials"in $t,p.ajax=$t=!!$t,w.ajaxTransport(function(t){var n,i;if(p.cors||$t&&!t.crossDomain)return{send:function(r,o){var s,a=t.xhr();if(a.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(s in t.xhrFields)a[s]=t.xhrFields[s];for(s in t.mimeType&&a.overrideMimeType&&a.overrideMimeType(t.mimeType),t.crossDomain||r["X-Requested-With"]||(r["X-Requested-With"]="XMLHttpRequest"),r)a.setRequestHeader(s,r[s]);n=function(e){return function(){n&&(n=i=a.onload=a.onerror=a.onabort=a.ontimeout=a.onreadystatechange=null,"abort"===e?a.abort():"error"===e?"number"!=typeof a.status?o(0,"error"):o(a.status,a.statusText):o(Vt[a.status]||a.status,a.statusText,"text"!==(a.responseType||"text")||"string"!=typeof a.responseText?{binary:a.response}:{text:a.responseText},a.getAllResponseHeaders()))}},a.onload=n(),i=a.onerror=a.ontimeout=n("error"),void 0!==a.onabort?a.onabort=i:a.onreadystatechange=function(){4===a.readyState&&e.setTimeout(function(){n&&i()})},n=n("abort");try{a.send(t.hasContent&&t.data||null)}catch(r){if(n)throw r}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){var t,n;if(e.crossDomain||e.scriptAttrs)return{send:function(r,o){t=w("<script>").attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),i.head.appendChild(t[0])},abort:function(){n&&n()}}});var Qt,Yt=[],Kt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Ct++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,i){var r,o,s,a=!1!==t.jsonp&&(Kt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Kt.test(t.data)&&"data");if(a||"jsonp"===t.dataTypes[0])return r=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(Kt,"$1"+r):!1!==t.jsonp&&(t.url+=(St.test(t.url)?"&":"?")+t.jsonp+"="+r),t.converters["script json"]=function(){return s||w.error(r+" was not called"),s[0]},t.dataTypes[0]="json",o=e[r],e[r]=function(){s=arguments},i.always(function(){void 0===o?w(e).removeProp(r):e[r]=o,t[r]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(r)),s&&g(o)&&o(s[0]),s=o=void 0}),"script"}),p.createHTMLDocument=((Qt=i.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Qt.childNodes.length),w.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(p.createHTMLDocument?((r=(t=i.implementation.createHTMLDocument("")).createElement("base")).href=i.location.href,t.head.appendChild(r)):t=i),s=!n&&[],(o=k.exec(e))?[t.createElement(o[1])]:(o=we([e],t,s),s&&s.length&&w(s).remove(),w.merge([],o.childNodes)));var r,o,s},w.fn.load=function(e,t,n){var i,r,o,s=this,a=e.indexOf(" ");return-1<a&&(i=yt(e.slice(a)),e=e.slice(0,a)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(r="POST"),0<s.length&&w.ajax({url:e,type:r||"GET",dataType:"html",data:t}).done(function(e){o=arguments,s.html(i?w("<div>").append(w.parseHTML(e)).find(i):e)}).always(n&&function(e,t){s.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var i,r,o,s,a,l,c=w.css(e,"position"),u=w(e),f={};"static"===c&&(e.style.position="relative"),a=u.offset(),o=w.css(e,"top"),l=w.css(e,"left"),("absolute"===c||"fixed"===c)&&-1<(o+l).indexOf("auto")?(s=(i=u.position()).top,r=i.left):(s=parseFloat(o)||0,r=parseFloat(l)||0),g(t)&&(t=t.call(e,n,w.extend({},a))),null!=t.top&&(f.top=t.top-a.top+s),null!=t.left&&(f.left=t.left-a.left+r),"using"in t?t.using.call(e,f):u.css(f)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,i=this[0];return i?i.getClientRects().length?(t=i.getBoundingClientRect(),n=i.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,i=this[0],r={top:0,left:0};if("fixed"===w.css(i,"position"))t=i.getBoundingClientRect();else{for(t=this.offset(),n=i.ownerDocument,e=i.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position");)e=e.parentNode;e&&e!==i&&1===e.nodeType&&((r=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),r.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-r.top-w.css(i,"marginTop",!0),left:t.left-r.left-w.css(i,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===w.css(e,"position");)e=e.offsetParent;return e||re})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(i){return U(this,function(e,i,r){var o;if(m(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===r)return o?o[t]:e[i];o?o.scrollTo(n?o.pageXOffset:r,n?r:o.pageYOffset):e[i]=r},e,i,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=ze(p.pixelPosition,function(e,n){if(n)return n=Ue(e,t),Fe.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,i){w.fn[i]=function(r,o){var s=arguments.length&&(n||"boolean"!=typeof r),a=n||(!0===r||!0===o?"margin":"border");return U(this,function(t,n,r){var o;return m(t)?0===i.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===r?w.css(t,n,a):w.style(t,n,r,a)},t,s?r:void 0,s)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return 0<arguments.length?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,i){return this.on(t,e,n,i)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,i,r;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return i=o.call(arguments,2),(r=function(){return e.apply(t||this,i.concat(o.call(arguments)))}).guid=e.guid=e.guid||w.guid++,r},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=D,w.isFunction=g,w.isWindow=m,w.camelCase=Q,w.type=b,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Xt=e.jQuery,Gt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Gt),t&&e.jQuery===w&&(e.jQuery=Xt),w},t||(e.jQuery=e.$=w),w}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("jquery")):"function"==typeof define&&define.amd?define(["exports","jquery"],t):t((e=e||self).bootstrap={},e.jQuery)}(this,function(e,t){"use strict";function n(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function i(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){var i,r,o;i=e,o=n[r=t],r in i?Object.defineProperty(i,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):i[r]=o})}return e}t=t&&t.hasOwnProperty("default")?t.default:t;var o="transitionend";var s={TRANSITION_END:"bsTransitionEnd",getUID:function(e){for(;e+=~~(1e6*Math.random()),document.getElementById(e););return e},getSelectorFromElement:function(e){var t=e.getAttribute("data-target");if(!t||"#"===t){var n=e.getAttribute("href");t=n&&"#"!==n?n.trim():""}try{return document.querySelector(t)?t:null}catch(e){return null}},getTransitionDurationFromElement:function(e){if(!e)return 0;var n=t(e).css("transition-duration"),i=t(e).css("transition-delay"),r=parseFloat(n),o=parseFloat(i);return r||o?(n=n.split(",")[0],i=i.split(",")[0],1e3*(parseFloat(n)+parseFloat(i))):0},reflow:function(e){return e.offsetHeight},triggerTransitionEnd:function(e){t(e).trigger(o)},supportsTransitionEnd:function(){return Boolean(o)},isElement:function(e){return(e[0]||e).nodeType},typeCheckConfig:function(e,t,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var r=n[i],o=t[i],a=o&&s.isElement(o)?"element":(l=o,{}.toString.call(l).match(/\s([a-z]+)/i)[1].toLowerCase());if(!new RegExp(r).test(a))throw new Error(e.toUpperCase()+': Option "'+i+'" provided type "'+a+'" but expected type "'+r+'".')}var l},findShadowRoot:function(e){if(!document.documentElement.attachShadow)return null;if("function"!=typeof e.getRootNode)return e instanceof ShadowRoot?e:e.parentNode?s.findShadowRoot(e.parentNode):null;var t=e.getRootNode();return t instanceof ShadowRoot?t:null}};t.fn.emulateTransitionEnd=function(e){var n=this,i=!1;return t(this).one(s.TRANSITION_END,function(){i=!0}),setTimeout(function(){i||s.triggerTransitionEnd(n)},e),this},t.event.special[s.TRANSITION_END]={bindType:o,delegateType:o,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}};var a="alert",l="bs.alert",c="."+l,u=t.fn[a],f={CLOSE:"close"+c,CLOSED:"closed"+c,CLICK_DATA_API:"click"+c+".data-api"},h=function(){function e(e){this._element=e}var n=e.prototype;return n.close=function(e){var t=this._element;e&&(t=this._getRootElement(e)),this._triggerCloseEvent(t).isDefaultPrevented()||this._removeElement(t)},n.dispose=function(){t.removeData(this._element,l),this._element=null},n._getRootElement=function(e){var n=s.getSelectorFromElement(e),i=!1;return n&&(i=document.querySelector(n)),i||(i=t(e).closest(".alert")[0]),i},n._triggerCloseEvent=function(e){var n=t.Event(f.CLOSE);return t(e).trigger(n),n},n._removeElement=function(e){var n=this;if(t(e).removeClass("show"),t(e).hasClass("fade")){var i=s.getTransitionDurationFromElement(e);t(e).one(s.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(i)}else this._destroyElement(e)},n._destroyElement=function(e){t(e).detach().trigger(f.CLOSED).remove()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),r=i.data(l);r||(r=new e(this),i.data(l,r)),"close"===n&&r[n](this)})},e._handleDismiss=function(e){return function(t){t&&t.preventDefault(),e.close(this)}},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),e}();t(document).on(f.CLICK_DATA_API,'[data-dismiss="alert"]',h._handleDismiss(new h)),t.fn[a]=h._jQueryInterface,t.fn[a].Constructor=h,t.fn[a].noConflict=function(){return t.fn[a]=u,h._jQueryInterface};var d="button",p="bs.button",g="."+p,m=".data-api",v=t.fn[d],y="active",b='[data-toggle^="button"]',_=".btn",w={CLICK_DATA_API:"click"+g+m,FOCUS_BLUR_DATA_API:"focus"+g+m+" blur"+g+m},E=function(){function e(e){this._element=e}var n=e.prototype;return n.toggle=function(){var e=!0,n=!0,i=t(this._element).closest('[data-toggle="buttons"]')[0];if(i){var r=this._element.querySelector('input:not([type="hidden"])');if(r){if("radio"===r.type)if(r.checked&&this._element.classList.contains(y))e=!1;else{var o=i.querySelector(".active");o&&t(o).removeClass(y)}if(e){if(r.hasAttribute("disabled")||i.hasAttribute("disabled")||r.classList.contains("disabled")||i.classList.contains("disabled"))return;r.checked=!this._element.classList.contains(y),t(r).trigger("change")}r.focus(),n=!1}}n&&this._element.setAttribute("aria-pressed",!this._element.classList.contains(y)),e&&t(this._element).toggleClass(y)},n.dispose=function(){t.removeData(this._element,p),this._element=null},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data(p);i||(i=new e(this),t(this).data(p,i)),"toggle"===n&&i[n]()})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),e}();t(document).on(w.CLICK_DATA_API,b,function(e){e.preventDefault();var n=e.target;t(n).hasClass("btn")||(n=t(n).closest(_)),E._jQueryInterface.call(t(n),"toggle")}).on(w.FOCUS_BLUR_DATA_API,b,function(e){var n=t(e.target).closest(_)[0];t(n).toggleClass("focus",/^focus(in)?$/.test(e.type))}),t.fn[d]=E._jQueryInterface,t.fn[d].Constructor=E,t.fn[d].noConflict=function(){return t.fn[d]=v,E._jQueryInterface};var x="carousel",T="bs.carousel",C="."+T,S=".data-api",A=t.fn[x],D={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},k={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},N="next",I="prev",O={SLIDE:"slide"+C,SLID:"slid"+C,KEYDOWN:"keydown"+C,MOUSEENTER:"mouseenter"+C,MOUSELEAVE:"mouseleave"+C,TOUCHSTART:"touchstart"+C,TOUCHMOVE:"touchmove"+C,TOUCHEND:"touchend"+C,POINTERDOWN:"pointerdown"+C,POINTERUP:"pointerup"+C,DRAG_START:"dragstart"+C,LOAD_DATA_API:"load"+C+S,CLICK_DATA_API:"click"+C+S},j="active",L=".active.carousel-item",P=".carousel-indicators",H={TOUCH:"touch",PEN:"pen"},M=function(){function e(e,t){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(t),this._element=e,this._indicatorsElement=this._element.querySelector(P),this._touchSupported="ontouchstart"in document.documentElement||0<navigator.maxTouchPoints,this._pointerEvent=Boolean(window.PointerEvent||window.MSPointerEvent),this._addEventListeners()}var n=e.prototype;return n.next=function(){this._isSliding||this._slide(N)},n.nextWhenVisible=function(){!document.hidden&&t(this._element).is(":visible")&&"hidden"!==t(this._element).css("visibility")&&this.next()},n.prev=function(){this._isSliding||this._slide(I)},n.pause=function(e){e||(this._isPaused=!0),this._element.querySelector(".carousel-item-next, .carousel-item-prev")&&(s.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},n.cycle=function(e){e||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},n.to=function(e){var n=this;this._activeElement=this._element.querySelector(L);var i=this._getItemIndex(this._activeElement);if(!(e>this._items.length-1||e<0))if(this._isSliding)t(this._element).one(O.SLID,function(){return n.to(e)});else{if(i===e)return this.pause(),void this.cycle();var r=i<e?N:I;this._slide(r,this._items[e])}},n.dispose=function(){t(this._element).off(C),t.removeData(this._element,T),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},n._getConfig=function(e){return e=r({},D,e),s.typeCheckConfig(x,e,k),e},n._handleSwipe=function(){var e=Math.abs(this.touchDeltaX);if(!(e<=40)){var t=e/this.touchDeltaX;0<t&&this.prev(),t<0&&this.next()}},n._addEventListeners=function(){var e=this;this._config.keyboard&&t(this._element).on(O.KEYDOWN,function(t){return e._keydown(t)}),"hover"===this._config.pause&&t(this._element).on(O.MOUSEENTER,function(t){return e.pause(t)}).on(O.MOUSELEAVE,function(t){return e.cycle(t)}),this._config.touch&&this._addTouchEventListeners()},n._addTouchEventListeners=function(){var e=this;if(this._touchSupported){var n=function(t){e._pointerEvent&&H[t.originalEvent.pointerType.toUpperCase()]?e.touchStartX=t.originalEvent.clientX:e._pointerEvent||(e.touchStartX=t.originalEvent.touches[0].clientX)},i=function(t){e._pointerEvent&&H[t.originalEvent.pointerType.toUpperCase()]&&(e.touchDeltaX=t.originalEvent.clientX-e.touchStartX),e._handleSwipe(),"hover"===e._config.pause&&(e.pause(),e.touchTimeout&&clearTimeout(e.touchTimeout),e.touchTimeout=setTimeout(function(t){return e.cycle(t)},500+e._config.interval))};t(this._element.querySelectorAll(".carousel-item img")).on(O.DRAG_START,function(e){return e.preventDefault()}),this._pointerEvent?(t(this._element).on(O.POINTERDOWN,function(e){return n(e)}),t(this._element).on(O.POINTERUP,function(e){return i(e)}),this._element.classList.add("pointer-event")):(t(this._element).on(O.TOUCHSTART,function(e){return n(e)}),t(this._element).on(O.TOUCHMOVE,function(t){var n;(n=t).originalEvent.touches&&1<n.originalEvent.touches.length?e.touchDeltaX=0:e.touchDeltaX=n.originalEvent.touches[0].clientX-e.touchStartX}),t(this._element).on(O.TOUCHEND,function(e){return i(e)}))}},n._keydown=function(e){if(!/input|textarea/i.test(e.target.tagName))switch(e.which){case 37:e.preventDefault(),this.prev();break;case 39:e.preventDefault(),this.next()}},n._getItemIndex=function(e){return this._items=e&&e.parentNode?[].slice.call(e.parentNode.querySelectorAll(".carousel-item")):[],this._items.indexOf(e)},n._getItemByDirection=function(e,t){var n=e===N,i=e===I,r=this._getItemIndex(t),o=this._items.length-1;if((i&&0===r||n&&r===o)&&!this._config.wrap)return t;var s=(r+(e===I?-1:1))%this._items.length;return-1===s?this._items[this._items.length-1]:this._items[s]},n._triggerSlideEvent=function(e,n){var i=this._getItemIndex(e),r=this._getItemIndex(this._element.querySelector(L)),o=t.Event(O.SLIDE,{relatedTarget:e,direction:n,from:r,to:i});return t(this._element).trigger(o),o},n._setActiveIndicatorElement=function(e){if(this._indicatorsElement){var n=[].slice.call(this._indicatorsElement.querySelectorAll(".active"));t(n).removeClass(j);var i=this._indicatorsElement.children[this._getItemIndex(e)];i&&t(i).addClass(j)}},n._slide=function(e,n){var i,r,o,a=this,l=this._element.querySelector(L),c=this._getItemIndex(l),u=n||l&&this._getItemByDirection(e,l),f=this._getItemIndex(u),h=Boolean(this._interval);if(o=e===N?(i="carousel-item-left",r="carousel-item-next","left"):(i="carousel-item-right",r="carousel-item-prev","right"),u&&t(u).hasClass(j))this._isSliding=!1;else if(!this._triggerSlideEvent(u,o).isDefaultPrevented()&&l&&u){this._isSliding=!0,h&&this.pause(),this._setActiveIndicatorElement(u);var d=t.Event(O.SLID,{relatedTarget:u,direction:o,from:c,to:f});if(t(this._element).hasClass("slide")){t(u).addClass(r),s.reflow(u),t(l).addClass(i),t(u).addClass(i);var p=parseInt(u.getAttribute("data-interval"),10);this._config.interval=p?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,p):this._config.defaultInterval||this._config.interval;var g=s.getTransitionDurationFromElement(l);t(l).one(s.TRANSITION_END,function(){t(u).removeClass(i+" "+r).addClass(j),t(l).removeClass(j+" "+r+" "+i),a._isSliding=!1,setTimeout(function(){return t(a._element).trigger(d)},0)}).emulateTransitionEnd(g)}else t(l).removeClass(j),t(u).addClass(j),this._isSliding=!1,t(this._element).trigger(d);h&&this.cycle()}},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data(T),o=r({},D,t(this).data());"object"==typeof n&&(o=r({},o,n));var s="string"==typeof n?n:o.slide;if(i||(i=new e(this,o),t(this).data(T,i)),"number"==typeof n)i.to(n);else if("string"==typeof s){if(void 0===i[s])throw new TypeError('No method named "'+s+'"');i[s]()}else o.interval&&o.ride&&(i.pause(),i.cycle())})},e._dataApiClickHandler=function(n){var i=s.getSelectorFromElement(this);if(i){var o=t(i)[0];if(o&&t(o).hasClass("carousel")){var a=r({},t(o).data(),t(this).data()),l=this.getAttribute("data-slide-to");l&&(a.interval=!1),e._jQueryInterface.call(t(o),a),l&&t(o).data(T).to(l),n.preventDefault()}}},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return D}}]),e}();t(document).on(O.CLICK_DATA_API,"[data-slide], [data-slide-to]",M._dataApiClickHandler),t(window).on(O.LOAD_DATA_API,function(){for(var e=[].slice.call(document.querySelectorAll('[data-ride="carousel"]')),n=0,i=e.length;n<i;n++){var r=t(e[n]);M._jQueryInterface.call(r,r.data())}}),t.fn[x]=M._jQueryInterface,t.fn[x].Constructor=M,t.fn[x].noConflict=function(){return t.fn[x]=A,M._jQueryInterface};var q="collapse",R="bs.collapse",F="."+R,W=t.fn[q],B={toggle:!0,parent:""},U={toggle:"boolean",parent:"(string|element)"},z={SHOW:"show"+F,SHOWN:"shown"+F,HIDE:"hide"+F,HIDDEN:"hidden"+F,CLICK_DATA_API:"click"+F+".data-api"},V="show",$="collapse",Q="collapsing",Y="collapsed",K='[data-toggle="collapse"]',X=function(){function e(e,t){this._isTransitioning=!1,this._element=e,this._config=this._getConfig(t),this._triggerArray=[].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var n=[].slice.call(document.querySelectorAll(K)),i=0,r=n.length;i<r;i++){var o=n[i],a=s.getSelectorFromElement(o),l=[].slice.call(document.querySelectorAll(a)).filter(function(t){return t===e});null!==a&&0<l.length&&(this._selector=a,this._triggerArray.push(o))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var n=e.prototype;return n.toggle=function(){t(this._element).hasClass(V)?this.hide():this.show()},n.show=function(){var n,i,r=this;if(!(this._isTransitioning||t(this._element).hasClass(V)||(this._parent&&0===(n=[].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter(function(e){return"string"==typeof r._config.parent?e.getAttribute("data-parent")===r._config.parent:e.classList.contains($)})).length&&(n=null),n&&(i=t(n).not(this._selector).data(R))&&i._isTransitioning))){var o=t.Event(z.SHOW);if(t(this._element).trigger(o),!o.isDefaultPrevented()){n&&(e._jQueryInterface.call(t(n).not(this._selector),"hide"),i||t(n).data(R,null));var a=this._getDimension();t(this._element).removeClass($).addClass(Q),this._element.style[a]=0,this._triggerArray.length&&t(this._triggerArray).removeClass(Y).attr("aria-expanded",!0),this.setTransitioning(!0);var l="scroll"+(a[0].toUpperCase()+a.slice(1)),c=s.getTransitionDurationFromElement(this._element);t(this._element).one(s.TRANSITION_END,function(){t(r._element).removeClass(Q).addClass($).addClass(V),r._element.style[a]="",r.setTransitioning(!1),t(r._element).trigger(z.SHOWN)}).emulateTransitionEnd(c),this._element.style[a]=this._element[l]+"px"}}},n.hide=function(){var e=this;if(!this._isTransitioning&&t(this._element).hasClass(V)){var n=t.Event(z.HIDE);if(t(this._element).trigger(n),!n.isDefaultPrevented()){var i=this._getDimension();this._element.style[i]=this._element.getBoundingClientRect()[i]+"px",s.reflow(this._element),t(this._element).addClass(Q).removeClass($).removeClass(V);var r=this._triggerArray.length;if(0<r)for(var o=0;o<r;o++){var a=this._triggerArray[o],l=s.getSelectorFromElement(a);null!==l&&(t([].slice.call(document.querySelectorAll(l))).hasClass(V)||t(a).addClass(Y).attr("aria-expanded",!1))}this.setTransitioning(!0),this._element.style[i]="";var c=s.getTransitionDurationFromElement(this._element);t(this._element).one(s.TRANSITION_END,function(){e.setTransitioning(!1),t(e._element).removeClass(Q).addClass($).trigger(z.HIDDEN)}).emulateTransitionEnd(c)}}},n.setTransitioning=function(e){this._isTransitioning=e},n.dispose=function(){t.removeData(this._element,R),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},n._getConfig=function(e){return(e=r({},B,e)).toggle=Boolean(e.toggle),s.typeCheckConfig(q,e,U),e},n._getDimension=function(){return t(this._element).hasClass("width")?"width":"height"},n._getParent=function(){var n,i=this;s.isElement(this._config.parent)?(n=this._config.parent,void 0!==this._config.parent.jquery&&(n=this._config.parent[0])):n=document.querySelector(this._config.parent);var r='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]',o=[].slice.call(n.querySelectorAll(r));return t(o).each(function(t,n){i._addAriaAndCollapsedClass(e._getTargetFromElement(n),[n])}),n},n._addAriaAndCollapsedClass=function(e,n){var i=t(e).hasClass(V);n.length&&t(n).toggleClass(Y,!i).attr("aria-expanded",i)},e._getTargetFromElement=function(e){var t=s.getSelectorFromElement(e);return t?document.querySelector(t):null},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),o=i.data(R),s=r({},B,i.data(),"object"==typeof n&&n?n:{});if(!o&&s.toggle&&/show|hide/.test(n)&&(s.toggle=!1),o||(o=new e(this,s),i.data(R,o)),"string"==typeof n){if(void 0===o[n])throw new TypeError('No method named "'+n+'"');o[n]()}})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return B}}]),e}();t(document).on(z.CLICK_DATA_API,K,function(e){"A"===e.currentTarget.tagName&&e.preventDefault();var n=t(this),i=s.getSelectorFromElement(this),r=[].slice.call(document.querySelectorAll(i));t(r).each(function(){var e=t(this),i=e.data(R)?"toggle":n.data();X._jQueryInterface.call(e,i)})}),t.fn[q]=X._jQueryInterface,t.fn[q].Constructor=X,t.fn[q].noConflict=function(){return t.fn[q]=W,X._jQueryInterface};for(var G="undefined"!=typeof window&&"undefined"!=typeof document,J=["Edge","Trident","Firefox"],Z=0,ee=0;ee<J.length;ee+=1)if(G&&0<=navigator.userAgent.indexOf(J[ee])){Z=1;break}var te=G&&window.Promise?function(e){var t=!1;return function(){t||(t=!0,window.Promise.resolve().then(function(){t=!1,e()}))}}:function(e){var t=!1;return function(){t||(t=!0,setTimeout(function(){t=!1,e()},Z))}};function ne(e){return e&&"[object Function]"==={}.toString.call(e)}function ie(e,t){if(1!==e.nodeType)return[];var n=e.ownerDocument.defaultView.getComputedStyle(e,null);return t?n[t]:n}function re(e){return"HTML"===e.nodeName?e:e.parentNode||e.host}function oe(e){if(!e)return document.body;switch(e.nodeName){case"HTML":case"BODY":return e.ownerDocument.body;case"#document":return e.body}var t=ie(e),n=t.overflow,i=t.overflowX,r=t.overflowY;return/(auto|scroll|overlay)/.test(n+r+i)?e:oe(re(e))}var se=G&&!(!window.MSInputMethodContext||!document.documentMode),ae=G&&/MSIE 10/.test(navigator.userAgent);function le(e){return 11===e?se:10===e?ae:se||ae}function ce(e){if(!e)return document.documentElement;for(var t=le(10)?document.body:null,n=e.offsetParent||null;n===t&&e.nextElementSibling;)n=(e=e.nextElementSibling).offsetParent;var i=n&&n.nodeName;return i&&"BODY"!==i&&"HTML"!==i?-1!==["TH","TD","TABLE"].indexOf(n.nodeName)&&"static"===ie(n,"position")?ce(n):n:e?e.ownerDocument.documentElement:document.documentElement}function ue(e){return null!==e.parentNode?ue(e.parentNode):e}function fe(e,t){if(!(e&&e.nodeType&&t&&t.nodeType))return document.documentElement;var n=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?e:t,r=n?t:e,o=document.createRange();o.setStart(i,0),o.setEnd(r,0);var s,a,l=o.commonAncestorContainer;if(e!==l&&t!==l||i.contains(r))return"BODY"===(a=(s=l).nodeName)||"HTML"!==a&&ce(s.firstElementChild)!==s?ce(l):l;var c=ue(e);return c.host?fe(c.host,t):fe(e,ue(t).host)}function he(e){var t="top"===(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"top")?"scrollTop":"scrollLeft",n=e.nodeName;if("BODY"!==n&&"HTML"!==n)return e[t];var i=e.ownerDocument.documentElement;return(e.ownerDocument.scrollingElement||i)[t]}function de(e,t){var n="x"===t?"Left":"Top",i="Left"===n?"Right":"Bottom";return parseFloat(e["border"+n+"Width"],10)+parseFloat(e["border"+i+"Width"],10)}function pe(e,t,n,i){return Math.max(t["offset"+e],t["scroll"+e],n["client"+e],n["offset"+e],n["scroll"+e],le(10)?parseInt(n["offset"+e])+parseInt(i["margin"+("Height"===e?"Top":"Left")])+parseInt(i["margin"+("Height"===e?"Bottom":"Right")]):0)}function ge(e){var t=e.body,n=e.documentElement,i=le(10)&&getComputedStyle(n);return{height:pe("Height",t,n,i),width:pe("Width",t,n,i)}}var me=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),ve=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e},ye=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e};function be(e){return ye({},e,{right:e.left+e.width,bottom:e.top+e.height})}function _e(e){var t={};try{if(le(10)){t=e.getBoundingClientRect();var n=he(e,"top"),i=he(e,"left");t.top+=n,t.left+=i,t.bottom+=n,t.right+=i}else t=e.getBoundingClientRect()}catch(e){}var r={left:t.left,top:t.top,width:t.right-t.left,height:t.bottom-t.top},o="HTML"===e.nodeName?ge(e.ownerDocument):{},s=o.width||e.clientWidth||r.right-r.left,a=o.height||e.clientHeight||r.bottom-r.top,l=e.offsetWidth-s,c=e.offsetHeight-a;if(l||c){var u=ie(e);l-=de(u,"x"),c-=de(u,"y"),r.width-=l,r.height-=c}return be(r)}function we(e,t){var n=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=le(10),r="HTML"===t.nodeName,o=_e(e),s=_e(t),a=oe(e),l=ie(t),c=parseFloat(l.borderTopWidth,10),u=parseFloat(l.borderLeftWidth,10);n&&r&&(s.top=Math.max(s.top,0),s.left=Math.max(s.left,0));var f=be({top:o.top-s.top-c,left:o.left-s.left-u,width:o.width,height:o.height});if(f.marginTop=0,f.marginLeft=0,!i&&r){var h=parseFloat(l.marginTop,10),d=parseFloat(l.marginLeft,10);f.top-=c-h,f.bottom-=c-h,f.left-=u-d,f.right-=u-d,f.marginTop=h,f.marginLeft=d}return(i&&!n?t.contains(a):t===a&&"BODY"!==a.nodeName)&&(f=function(e,t){var n=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=he(t,"top"),r=he(t,"left"),o=n?-1:1;return e.top+=i*o,e.bottom+=i*o,e.left+=r*o,e.right+=r*o,e}(f,t)),f}function Ee(e){if(!e||!e.parentElement||le())return document.documentElement;for(var t=e.parentElement;t&&"none"===ie(t,"transform");)t=t.parentElement;return t||document.documentElement}function xe(e,t,n,i){var r=4<arguments.length&&void 0!==arguments[4]&&arguments[4],o={top:0,left:0},s=r?Ee(e):fe(e,t);if("viewport"===i)o=function(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],n=e.ownerDocument.documentElement,i=we(e,n),r=Math.max(n.clientWidth,window.innerWidth||0),o=Math.max(n.clientHeight,window.innerHeight||0),s=t?0:he(n),a=t?0:he(n,"left");return be({top:s-i.top+i.marginTop,left:a-i.left+i.marginLeft,width:r,height:o})}(s,r);else{var a=void 0;"scrollParent"===i?"BODY"===(a=oe(re(t))).nodeName&&(a=e.ownerDocument.documentElement):a="window"===i?e.ownerDocument.documentElement:i;var l=we(a,s,r);if("HTML"!==a.nodeName||function e(t){var n=t.nodeName;if("BODY"===n||"HTML"===n)return!1;if("fixed"===ie(t,"position"))return!0;var i=re(t);return!!i&&e(i)}(s))o=l;else{var c=ge(e.ownerDocument),u=c.height,f=c.width;o.top+=l.top-l.marginTop,o.bottom=u+l.top,o.left+=l.left-l.marginLeft,o.right=f+l.left}}var h="number"==typeof(n=n||0);return o.left+=h?n:n.left||0,o.top+=h?n:n.top||0,o.right-=h?n:n.right||0,o.bottom-=h?n:n.bottom||0,o}function Te(e,t,n,i,r){var o=5<arguments.length&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf("auto"))return e;var s=xe(n,i,o,r),a={top:{width:s.width,height:t.top-s.top},right:{width:s.right-t.right,height:s.height},bottom:{width:s.width,height:s.bottom-t.bottom},left:{width:t.left-s.left,height:s.height}},l=Object.keys(a).map(function(e){return ye({key:e},a[e],{area:(t=a[e],t.width*t.height)});var t}).sort(function(e,t){return t.area-e.area}),c=l.filter(function(e){var t=e.width,i=e.height;return t>=n.clientWidth&&i>=n.clientHeight}),u=0<c.length?c[0].key:l[0].key,f=e.split("-")[1];return u+(f?"-"+f:"")}function Ce(e,t,n){var i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return we(n,i?Ee(t):fe(t,n),i)}function Se(e){var t=e.ownerDocument.defaultView.getComputedStyle(e),n=parseFloat(t.marginTop||0)+parseFloat(t.marginBottom||0),i=parseFloat(t.marginLeft||0)+parseFloat(t.marginRight||0);return{width:e.offsetWidth+i,height:e.offsetHeight+n}}function Ae(e){var t={left:"right",right:"left",bottom:"top",top:"bottom"};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function De(e,t,n){n=n.split("-")[0];var i=Se(e),r={width:i.width,height:i.height},o=-1!==["right","left"].indexOf(n),s=o?"top":"left",a=o?"left":"top",l=o?"height":"width",c=o?"width":"height";return r[s]=t[s]+t[l]/2-i[l]/2,r[a]=n===a?t[a]-i[c]:t[Ae(a)],r}function ke(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function Ne(e,t,n){return(void 0===n?e:e.slice(0,function(e,t,n){if(Array.prototype.findIndex)return e.findIndex(function(e){return e[t]===n});var i=ke(e,function(e){return e[t]===n});return e.indexOf(i)}(e,"name",n))).forEach(function(e){e.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=e.function||e.fn;e.enabled&&ne(n)&&(t.offsets.popper=be(t.offsets.popper),t.offsets.reference=be(t.offsets.reference),t=n(t,e))}),t}function Ie(e,t){return e.some(function(e){var n=e.name;return e.enabled&&n===t})}function Oe(e){for(var t=[!1,"ms","Webkit","Moz","O"],n=e.charAt(0).toUpperCase()+e.slice(1),i=0;i<t.length;i++){var r=t[i],o=r?""+r+n:e;if(void 0!==document.body.style[o])return o}return null}function je(e){var t=e.ownerDocument;return t?t.defaultView:window}function Le(e){return""!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function Pe(e,t){Object.keys(t).forEach(function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&Le(t[n])&&(i="px"),e.style[n]=t[n]+i})}var He=G&&/Firefox/i.test(navigator.userAgent);function Me(e,t,n){var i=ke(e,function(e){return e.name===t}),r=!!i&&e.some(function(e){return e.name===n&&e.enabled&&e.order<i.order});if(!r){var o="`"+t+"`",s="`"+n+"`";console.warn(s+" modifier is required by "+o+" modifier in order to work, be sure to include it before "+o+"!")}return r}var qe=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],Re=qe.slice(3);function Fe(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],n=Re.indexOf(e),i=Re.slice(n+1).concat(Re.slice(0,n));return t?i.reverse():i}var We={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(e){var t=e.placement,n=t.split("-")[0],i=t.split("-")[1];if(i){var r=e.offsets,o=r.reference,s=r.popper,a=-1!==["bottom","top"].indexOf(n),l=a?"left":"top",c=a?"width":"height",u={start:ve({},l,o[l]),end:ve({},l,o[l]+o[c]-s[c])};e.offsets.popper=ye({},s,u[i])}return e}},offset:{order:200,enabled:!0,fn:function(e,t){var n,i=t.offset,r=e.placement,o=e.offsets,s=o.popper,a=o.reference,l=r.split("-")[0];return n=Le(+i)?[+i,0]:function(e,t,n,i){var r=[0,0],o=-1!==["right","left"].indexOf(i),s=e.split(/(\+|\-)/).map(function(e){return e.trim()}),a=s.indexOf(ke(s,function(e){return-1!==e.search(/,|\s/)}));s[a]&&-1===s[a].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,c=-1!==a?[s.slice(0,a).concat([s[a].split(l)[0]]),[s[a].split(l)[1]].concat(s.slice(a+1))]:[s];return(c=c.map(function(e,i){var r=(1===i?!o:o)?"height":"width",s=!1;return e.reduce(function(e,t){return""===e[e.length-1]&&-1!==["+","-"].indexOf(t)?(e[e.length-1]=t,s=!0,e):s?(e[e.length-1]+=t,s=!1,e):e.concat(t)},[]).map(function(e){return function(e,t,n,i){var r=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),o=+r[1],s=r[2];if(!o)return e;if(0!==s.indexOf("%"))return"vh"!==s&&"vw"!==s?o:("vh"===s?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*o;var a=void 0;switch(s){case"%p":a=n;break;case"%":case"%r":default:a=i}return be(a)[t]/100*o}(e,r,t,n)})})).forEach(function(e,t){e.forEach(function(n,i){Le(n)&&(r[t]+=n*("-"===e[i-1]?-1:1))})}),r}(i,s,a,l),"left"===l?(s.top+=n[0],s.left-=n[1]):"right"===l?(s.top+=n[0],s.left+=n[1]):"top"===l?(s.left+=n[0],s.top-=n[1]):"bottom"===l&&(s.left+=n[0],s.top+=n[1]),e.popper=s,e},offset:0},preventOverflow:{order:300,enabled:!0,fn:function(e,t){var n=t.boundariesElement||ce(e.instance.popper);e.instance.reference===n&&(n=ce(n));var i=Oe("transform"),r=e.instance.popper.style,o=r.top,s=r.left,a=r[i];r.top="",r.left="",r[i]="";var l=xe(e.instance.popper,e.instance.reference,t.padding,n,e.positionFixed);r.top=o,r.left=s,r[i]=a,t.boundaries=l;var c=t.priority,u=e.offsets.popper,f={primary:function(e){var n=u[e];return u[e]<l[e]&&!t.escapeWithReference&&(n=Math.max(u[e],l[e])),ve({},e,n)},secondary:function(e){var n="right"===e?"left":"top",i=u[n];return u[e]>l[e]&&!t.escapeWithReference&&(i=Math.min(u[n],l[e]-("right"===e?u.width:u.height))),ve({},n,i)}};return c.forEach(function(e){var t=-1!==["left","top"].indexOf(e)?"primary":"secondary";u=ye({},u,f[t](e))}),e.offsets.popper=u,e},priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:function(e){var t=e.offsets,n=t.popper,i=t.reference,r=e.placement.split("-")[0],o=Math.floor,s=-1!==["top","bottom"].indexOf(r),a=s?"right":"bottom",l=s?"left":"top",c=s?"width":"height";return n[a]<o(i[l])&&(e.offsets.popper[l]=o(i[l])-n[c]),n[l]>o(i[a])&&(e.offsets.popper[l]=o(i[a])),e}},arrow:{order:500,enabled:!0,fn:function(e,t){var n;if(!Me(e.instance.modifiers,"arrow","keepTogether"))return e;var i=t.element;if("string"==typeof i){if(!(i=e.instance.popper.querySelector(i)))return e}else if(!e.instance.popper.contains(i))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),e;var r=e.placement.split("-")[0],o=e.offsets,s=o.popper,a=o.reference,l=-1!==["left","right"].indexOf(r),c=l?"height":"width",u=l?"Top":"Left",f=u.toLowerCase(),h=l?"left":"top",d=l?"bottom":"right",p=Se(i)[c];a[d]-p<s[f]&&(e.offsets.popper[f]-=s[f]-(a[d]-p)),a[f]+p>s[d]&&(e.offsets.popper[f]+=a[f]+p-s[d]),e.offsets.popper=be(e.offsets.popper);var g=a[f]+a[c]/2-p/2,m=ie(e.instance.popper),v=parseFloat(m["margin"+u],10),y=parseFloat(m["border"+u+"Width"],10),b=g-e.offsets.popper[f]-v-y;return b=Math.max(Math.min(s[c]-p,b),0),e.arrowElement=i,e.offsets.arrow=(ve(n={},f,Math.round(b)),ve(n,h,""),n),e},element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:function(e,t){if(Ie(e.instance.modifiers,"inner"))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var n=xe(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement,e.positionFixed),i=e.placement.split("-")[0],r=Ae(i),o=e.placement.split("-")[1]||"",s=[];switch(t.behavior){case"flip":s=[i,r];break;case"clockwise":s=Fe(i);break;case"counterclockwise":s=Fe(i,!0);break;default:s=t.behavior}return s.forEach(function(a,l){if(i!==a||s.length===l+1)return e;i=e.placement.split("-")[0],r=Ae(i);var c,u=e.offsets.popper,f=e.offsets.reference,h=Math.floor,d="left"===i&&h(u.right)>h(f.left)||"right"===i&&h(u.left)<h(f.right)||"top"===i&&h(u.bottom)>h(f.top)||"bottom"===i&&h(u.top)<h(f.bottom),p=h(u.left)<h(n.left),g=h(u.right)>h(n.right),m=h(u.top)<h(n.top),v=h(u.bottom)>h(n.bottom),y="left"===i&&p||"right"===i&&g||"top"===i&&m||"bottom"===i&&v,b=-1!==["top","bottom"].indexOf(i),_=!!t.flipVariations&&(b&&"start"===o&&p||b&&"end"===o&&g||!b&&"start"===o&&m||!b&&"end"===o&&v);(d||y||_)&&(e.flipped=!0,(d||y)&&(i=s[l+1]),_&&(o="end"===(c=o)?"start":"start"===c?"end":c),e.placement=i+(o?"-"+o:""),e.offsets.popper=ye({},e.offsets.popper,De(e.instance.popper,e.offsets.reference,e.placement)),e=Ne(e.instance.modifiers,e,"flip"))}),e},behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:function(e){var t=e.placement,n=t.split("-")[0],i=e.offsets,r=i.popper,o=i.reference,s=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return r[s?"left":"top"]=o[n]-(a?r[s?"width":"height"]:0),e.placement=Ae(t),e.offsets.popper=be(r),e}},hide:{order:800,enabled:!0,fn:function(e){if(!Me(e.instance.modifiers,"hide","preventOverflow"))return e;var t=e.offsets.reference,n=ke(e.instance.modifiers,function(e){return"preventOverflow"===e.name}).boundaries;if(t.bottom<n.top||t.left>n.right||t.top>n.bottom||t.right<n.left){if(!0===e.hide)return e;e.hide=!0,e.attributes["x-out-of-boundaries"]=""}else{if(!1===e.hide)return e;e.hide=!1,e.attributes["x-out-of-boundaries"]=!1}return e}},computeStyle:{order:850,enabled:!0,fn:function(e,t){var n=t.x,i=t.y,r=e.offsets.popper,o=ke(e.instance.modifiers,function(e){return"applyStyle"===e.name}).gpuAcceleration;void 0!==o&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var s,a,l,c,u,f,h,d,p,g,m,v,y,b,_,w,E=void 0!==o?o:t.gpuAcceleration,x=ce(e.instance.popper),T=_e(x),C={position:r.position},S=(s=e,a=window.devicePixelRatio<2||!He,c=(l=s.offsets).popper,u=l.reference,f=Math.round,h=Math.floor,d=function(e){return e},p=f(u.width),g=f(c.width),m=-1!==["left","right"].indexOf(s.placement),v=-1!==s.placement.indexOf("-"),b=a?f:d,{left:(y=a?m||v||p%2==g%2?f:h:d)(p%2==1&&g%2==1&&!v&&a?c.left-1:c.left),top:b(c.top),bottom:b(c.bottom),right:y(c.right)}),A="bottom"===n?"top":"bottom",D="right"===i?"left":"right",k=Oe("transform");if(w="bottom"===A?"HTML"===x.nodeName?-x.clientHeight+S.bottom:-T.height+S.bottom:S.top,_="right"===D?"HTML"===x.nodeName?-x.clientWidth+S.right:-T.width+S.right:S.left,E&&k)C[k]="translate3d("+_+"px, "+w+"px, 0)",C[A]=0,C[D]=0,C.willChange="transform";else{var N="bottom"===A?-1:1,I="right"===D?-1:1;C[A]=w*N,C[D]=_*I,C.willChange=A+", "+D}var O={"x-placement":e.placement};return e.attributes=ye({},O,e.attributes),e.styles=ye({},C,e.styles),e.arrowStyles=ye({},e.offsets.arrow,e.arrowStyles),e},gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:function(e){var t,n;return Pe(e.instance.popper,e.styles),t=e.instance.popper,n=e.attributes,Object.keys(n).forEach(function(e){!1!==n[e]?t.setAttribute(e,n[e]):t.removeAttribute(e)}),e.arrowElement&&Object.keys(e.arrowStyles).length&&Pe(e.arrowElement,e.arrowStyles),e},onLoad:function(e,t,n,i,r){var o=Ce(r,t,e,n.positionFixed),s=Te(n.placement,o,t,e,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return t.setAttribute("x-placement",s),Pe(t,{position:n.positionFixed?"fixed":"absolute"}),n},gpuAcceleration:void 0}}},Be=function(){function e(t,n){var i=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};!function(t,n){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=te(this.update.bind(this)),this.options=ye({},e.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=t&&t.jquery?t[0]:t,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(ye({},e.Defaults.modifiers,r.modifiers)).forEach(function(t){i.options.modifiers[t]=ye({},e.Defaults.modifiers[t]||{},r.modifiers?r.modifiers[t]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(e){return ye({name:e},i.options.modifiers[e])}).sort(function(e,t){return e.order-t.order}),this.modifiers.forEach(function(e){e.enabled&&ne(e.onLoad)&&e.onLoad(i.reference,i.popper,i.options,e,i.state)}),this.update();var o=this.options.eventsEnabled;o&&this.enableEventListeners(),this.state.eventsEnabled=o}return me(e,[{key:"update",value:function(){return function(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=Ce(this.state,this.popper,this.reference,this.options.positionFixed),e.placement=Te(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.positionFixed=this.options.positionFixed,e.offsets.popper=De(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",e=Ne(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}.call(this)}},{key:"destroy",value:function(){return function(){return this.state.isDestroyed=!0,Ie(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[Oe("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}.call(this)}},{key:"enableEventListeners",value:function(){return function(){this.state.eventsEnabled||(this.state=function(e,t,n,i){n.updateBound=i,je(e).addEventListener("resize",n.updateBound,{passive:!0});var r=oe(e);return function e(t,n,i,r){var o="BODY"===t.nodeName,s=o?t.ownerDocument.defaultView:t;s.addEventListener(n,i,{passive:!0}),o||e(oe(s.parentNode),n,i,r),r.push(s)}(r,"scroll",n.updateBound,n.scrollParents),n.scrollElement=r,n.eventsEnabled=!0,n}(this.reference,this.options,this.state,this.scheduleUpdate))}.call(this)}},{key:"disableEventListeners",value:function(){return function(){var e,t;this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=(e=this.reference,t=this.state,je(e).removeEventListener("resize",t.updateBound),t.scrollParents.forEach(function(e){e.removeEventListener("scroll",t.updateBound)}),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t))}.call(this)}}]),e}();Be.Utils=("undefined"!=typeof window?window:global).PopperUtils,Be.placements=qe,Be.Defaults=We;var Ue="dropdown",ze="bs.dropdown",Ve="."+ze,$e=".data-api",Qe=t.fn[Ue],Ye=new RegExp("38|40|27"),Ke={HIDE:"hide"+Ve,HIDDEN:"hidden"+Ve,SHOW:"show"+Ve,SHOWN:"shown"+Ve,CLICK:"click"+Ve,CLICK_DATA_API:"click"+Ve+$e,KEYDOWN_DATA_API:"keydown"+Ve+$e,KEYUP_DATA_API:"keyup"+Ve+$e},Xe="disabled",Ge="show",Je="dropdown-menu-right",Ze='[data-toggle="dropdown"]',et=".dropdown-menu",tt={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic"},nt={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string"},it=function(){function e(e,t){this._element=e,this._popper=null,this._config=this._getConfig(t),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var n=e.prototype;return n.toggle=function(){if(!this._element.disabled&&!t(this._element).hasClass(Xe)){var n=e._getParentFromElement(this._element),i=t(this._menu).hasClass(Ge);if(e._clearMenus(),!i){var r={relatedTarget:this._element},o=t.Event(Ke.SHOW,r);if(t(n).trigger(o),!o.isDefaultPrevented()){if(!this._inNavbar){if(void 0===Be)throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");var a=this._element;"parent"===this._config.reference?a=n:s.isElement(this._config.reference)&&(a=this._config.reference,void 0!==this._config.reference.jquery&&(a=this._config.reference[0])),"scrollParent"!==this._config.boundary&&t(n).addClass("position-static"),this._popper=new Be(a,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===t(n).closest(".navbar-nav").length&&t(document.body).children().on("mouseover",null,t.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),t(this._menu).toggleClass(Ge),t(n).toggleClass(Ge).trigger(t.Event(Ke.SHOWN,r))}}}},n.show=function(){if(!(this._element.disabled||t(this._element).hasClass(Xe)||t(this._menu).hasClass(Ge))){var n={relatedTarget:this._element},i=t.Event(Ke.SHOW,n),r=e._getParentFromElement(this._element);t(r).trigger(i),i.isDefaultPrevented()||(t(this._menu).toggleClass(Ge),t(r).toggleClass(Ge).trigger(t.Event(Ke.SHOWN,n)))}},n.hide=function(){if(!this._element.disabled&&!t(this._element).hasClass(Xe)&&t(this._menu).hasClass(Ge)){var n={relatedTarget:this._element},i=t.Event(Ke.HIDE,n),r=e._getParentFromElement(this._element);t(r).trigger(i),i.isDefaultPrevented()||(t(this._menu).toggleClass(Ge),t(r).toggleClass(Ge).trigger(t.Event(Ke.HIDDEN,n)))}},n.dispose=function(){t.removeData(this._element,ze),t(this._element).off(Ve),this._element=null,(this._menu=null)!==this._popper&&(this._popper.destroy(),this._popper=null)},n.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},n._addEventListeners=function(){var e=this;t(this._element).on(Ke.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},n._getConfig=function(e){return e=r({},this.constructor.Default,t(this._element).data(),e),s.typeCheckConfig(Ue,e,this.constructor.DefaultType),e},n._getMenuElement=function(){if(!this._menu){var t=e._getParentFromElement(this._element);t&&(this._menu=t.querySelector(et))}return this._menu},n._getPlacement=function(){var e=t(this._element.parentNode),n="bottom-start";return e.hasClass("dropup")?(n="top-start",t(this._menu).hasClass(Je)&&(n="top-end")):e.hasClass("dropright")?n="right-start":e.hasClass("dropleft")?n="left-start":t(this._menu).hasClass(Je)&&(n="bottom-end"),n},n._detectNavbar=function(){return 0<t(this._element).closest(".navbar").length},n._getOffset=function(){var e=this,t={};return"function"==typeof this._config.offset?t.fn=function(t){return t.offsets=r({},t.offsets,e._config.offset(t.offsets,e._element)||{}),t}:t.offset=this._config.offset,t},n._getPopperConfig=function(){var e={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return"static"===this._config.display&&(e.modifiers.applyStyle={enabled:!1}),e},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data(ze);if(i||(i=new e(this,"object"==typeof n?n:null),t(this).data(ze,i)),"string"==typeof n){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]()}})},e._clearMenus=function(n){if(!n||3!==n.which&&("keyup"!==n.type||9===n.which))for(var i=[].slice.call(document.querySelectorAll(Ze)),r=0,o=i.length;r<o;r++){var s=e._getParentFromElement(i[r]),a=t(i[r]).data(ze),l={relatedTarget:i[r]};if(n&&"click"===n.type&&(l.clickEvent=n),a){var c=a._menu;if(t(s).hasClass(Ge)&&!(n&&("click"===n.type&&/input|textarea/i.test(n.target.tagName)||"keyup"===n.type&&9===n.which)&&t.contains(s,n.target))){var u=t.Event(Ke.HIDE,l);t(s).trigger(u),u.isDefaultPrevented()||("ontouchstart"in document.documentElement&&t(document.body).children().off("mouseover",null,t.noop),i[r].setAttribute("aria-expanded","false"),t(c).removeClass(Ge),t(s).removeClass(Ge).trigger(t.Event(Ke.HIDDEN,l)))}}}},e._getParentFromElement=function(e){var t,n=s.getSelectorFromElement(e);return n&&(t=document.querySelector(n)),t||e.parentNode},e._dataApiKeydownHandler=function(n){if((/input|textarea/i.test(n.target.tagName)?!(32===n.which||27!==n.which&&(40!==n.which&&38!==n.which||t(n.target).closest(et).length)):Ye.test(n.which))&&(n.preventDefault(),n.stopPropagation(),!this.disabled&&!t(this).hasClass(Xe))){var i=e._getParentFromElement(this),r=t(i).hasClass(Ge);if(r&&(!r||27!==n.which&&32!==n.which)){var o=[].slice.call(i.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)"));if(0!==o.length){var s=o.indexOf(n.target);38===n.which&&0<s&&s--,40===n.which&&s<o.length-1&&s++,s<0&&(s=0),o[s].focus()}}else{if(27===n.which){var a=i.querySelector(Ze);t(a).trigger("focus")}t(this).trigger("click")}}},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return tt}},{key:"DefaultType",get:function(){return nt}}]),e}();t(document).on(Ke.KEYDOWN_DATA_API,Ze,it._dataApiKeydownHandler).on(Ke.KEYDOWN_DATA_API,et,it._dataApiKeydownHandler).on(Ke.CLICK_DATA_API+" "+Ke.KEYUP_DATA_API,it._clearMenus).on(Ke.CLICK_DATA_API,Ze,function(e){e.preventDefault(),e.stopPropagation(),it._jQueryInterface.call(t(this),"toggle")}).on(Ke.CLICK_DATA_API,".dropdown form",function(e){e.stopPropagation()}),t.fn[Ue]=it._jQueryInterface,t.fn[Ue].Constructor=it,t.fn[Ue].noConflict=function(){return t.fn[Ue]=Qe,it._jQueryInterface};var rt="modal",ot="bs.modal",st="."+ot,at=t.fn[rt],lt={backdrop:!0,keyboard:!0,focus:!0,show:!0},ct={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},ut={HIDE:"hide"+st,HIDDEN:"hidden"+st,SHOW:"show"+st,SHOWN:"shown"+st,FOCUSIN:"focusin"+st,RESIZE:"resize"+st,CLICK_DISMISS:"click.dismiss"+st,KEYDOWN_DISMISS:"keydown.dismiss"+st,MOUSEUP_DISMISS:"mouseup.dismiss"+st,MOUSEDOWN_DISMISS:"mousedown.dismiss"+st,CLICK_DATA_API:"click"+st+".data-api"},ft="modal-open",ht="fade",dt="show",pt=".modal-dialog",gt=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",mt=".sticky-top",vt=function(){function e(e,t){this._config=this._getConfig(t),this._element=e,this._dialog=e.querySelector(pt),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0}var n=e.prototype;return n.toggle=function(e){return this._isShown?this.hide():this.show(e)},n.show=function(e){var n=this;if(!this._isShown&&!this._isTransitioning){t(this._element).hasClass(ht)&&(this._isTransitioning=!0);var i=t.Event(ut.SHOW,{relatedTarget:e});t(this._element).trigger(i),this._isShown||i.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),t(this._element).on(ut.CLICK_DISMISS,'[data-dismiss="modal"]',function(e){return n.hide(e)}),t(this._dialog).on(ut.MOUSEDOWN_DISMISS,function(){t(n._element).one(ut.MOUSEUP_DISMISS,function(e){t(e.target).is(n._element)&&(n._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return n._showElement(e)}))}},n.hide=function(e){var n=this;if(e&&e.preventDefault(),this._isShown&&!this._isTransitioning){var i=t.Event(ut.HIDE);if(t(this._element).trigger(i),this._isShown&&!i.isDefaultPrevented()){this._isShown=!1;var r=t(this._element).hasClass(ht);if(r&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),t(document).off(ut.FOCUSIN),t(this._element).removeClass(dt),t(this._element).off(ut.CLICK_DISMISS),t(this._dialog).off(ut.MOUSEDOWN_DISMISS),r){var o=s.getTransitionDurationFromElement(this._element);t(this._element).one(s.TRANSITION_END,function(e){return n._hideModal(e)}).emulateTransitionEnd(o)}else this._hideModal()}}},n.dispose=function(){[window,this._element,this._dialog].forEach(function(e){return t(e).off(st)}),t(document).off(ut.FOCUSIN),t.removeData(this._element,ot),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null},n.handleUpdate=function(){this._adjustDialog()},n._getConfig=function(e){return e=r({},lt,e),s.typeCheckConfig(rt,e,ct),e},n._showElement=function(e){var n=this,i=t(this._element).hasClass(ht);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),t(this._dialog).hasClass("modal-dialog-scrollable")?this._dialog.querySelector(".modal-body").scrollTop=0:this._element.scrollTop=0,i&&s.reflow(this._element),t(this._element).addClass(dt),this._config.focus&&this._enforceFocus();var r=t.Event(ut.SHOWN,{relatedTarget:e}),o=function(){n._config.focus&&n._element.focus(),n._isTransitioning=!1,t(n._element).trigger(r)};if(i){var a=s.getTransitionDurationFromElement(this._dialog);t(this._dialog).one(s.TRANSITION_END,o).emulateTransitionEnd(a)}else o()},n._enforceFocus=function(){var e=this;t(document).off(ut.FOCUSIN).on(ut.FOCUSIN,function(n){document!==n.target&&e._element!==n.target&&0===t(e._element).has(n.target).length&&e._element.focus()})},n._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?t(this._element).on(ut.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||t(this._element).off(ut.KEYDOWN_DISMISS)},n._setResizeEvent=function(){var e=this;this._isShown?t(window).on(ut.RESIZE,function(t){return e.handleUpdate(t)}):t(window).off(ut.RESIZE)},n._hideModal=function(){var e=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._isTransitioning=!1,this._showBackdrop(function(){t(document.body).removeClass(ft),e._resetAdjustments(),e._resetScrollbar(),t(e._element).trigger(ut.HIDDEN)})},n._removeBackdrop=function(){this._backdrop&&(t(this._backdrop).remove(),this._backdrop=null)},n._showBackdrop=function(e){var n=this,i=t(this._element).hasClass(ht)?ht:"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className="modal-backdrop",i&&this._backdrop.classList.add(i),t(this._backdrop).appendTo(document.body),t(this._element).on(ut.CLICK_DISMISS,function(e){n._ignoreBackdropClick?n._ignoreBackdropClick=!1:e.target===e.currentTarget&&("static"===n._config.backdrop?n._element.focus():n.hide())}),i&&s.reflow(this._backdrop),t(this._backdrop).addClass(dt),!e)return;if(!i)return void e();var r=s.getTransitionDurationFromElement(this._backdrop);t(this._backdrop).one(s.TRANSITION_END,e).emulateTransitionEnd(r)}else if(!this._isShown&&this._backdrop){t(this._backdrop).removeClass(dt);var o=function(){n._removeBackdrop(),e&&e()};if(t(this._element).hasClass(ht)){var a=s.getTransitionDurationFromElement(this._backdrop);t(this._backdrop).one(s.TRANSITION_END,o).emulateTransitionEnd(a)}else o()}else e&&e()},n._adjustDialog=function(){var e=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&e&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!e&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},n._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},n._checkScrollbar=function(){var e=document.body.getBoundingClientRect();this._isBodyOverflowing=e.left+e.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},n._setScrollbar=function(){var e=this;if(this._isBodyOverflowing){var n=[].slice.call(document.querySelectorAll(gt)),i=[].slice.call(document.querySelectorAll(mt));t(n).each(function(n,i){var r=i.style.paddingRight,o=t(i).css("padding-right");t(i).data("padding-right",r).css("padding-right",parseFloat(o)+e._scrollbarWidth+"px")}),t(i).each(function(n,i){var r=i.style.marginRight,o=t(i).css("margin-right");t(i).data("margin-right",r).css("margin-right",parseFloat(o)-e._scrollbarWidth+"px")});var r=document.body.style.paddingRight,o=t(document.body).css("padding-right");t(document.body).data("padding-right",r).css("padding-right",parseFloat(o)+this._scrollbarWidth+"px")}t(document.body).addClass(ft)},n._resetScrollbar=function(){var e=[].slice.call(document.querySelectorAll(gt));t(e).each(function(e,n){var i=t(n).data("padding-right");t(n).removeData("padding-right"),n.style.paddingRight=i||""});var n=[].slice.call(document.querySelectorAll(""+mt));t(n).each(function(e,n){var i=t(n).data("margin-right");void 0!==i&&t(n).css("margin-right",i).removeData("margin-right")});var i=t(document.body).data("padding-right");t(document.body).removeData("padding-right"),document.body.style.paddingRight=i||""},n._getScrollbarWidth=function(){var e=document.createElement("div");e.className="modal-scrollbar-measure",document.body.appendChild(e);var t=e.getBoundingClientRect().width-e.clientWidth;return document.body.removeChild(e),t},e._jQueryInterface=function(n,i){return this.each(function(){var o=t(this).data(ot),s=r({},lt,t(this).data(),"object"==typeof n&&n?n:{});if(o||(o=new e(this,s),t(this).data(ot,o)),"string"==typeof n){if(void 0===o[n])throw new TypeError('No method named "'+n+'"');o[n](i)}else s.show&&o.show(i)})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return lt}}]),e}();t(document).on(ut.CLICK_DATA_API,'[data-toggle="modal"]',function(e){var n,i=this,o=s.getSelectorFromElement(this);o&&(n=document.querySelector(o));var a=t(n).data(ot)?"toggle":r({},t(n).data(),t(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||e.preventDefault();var l=t(n).one(ut.SHOW,function(e){e.isDefaultPrevented()||l.one(ut.HIDDEN,function(){t(i).is(":visible")&&i.focus()})});vt._jQueryInterface.call(t(n),a,this)}),t.fn[rt]=vt._jQueryInterface,t.fn[rt].Constructor=vt,t.fn[rt].noConflict=function(){return t.fn[rt]=at,vt._jQueryInterface};var yt=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],bt=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:\/?#]*(?:[\/?#]|$))/gi,_t=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;function wt(e,t,n){if(0===e.length)return e;if(n&&"function"==typeof n)return n(e);for(var i=(new window.DOMParser).parseFromString(e,"text/html"),r=Object.keys(t),o=[].slice.call(i.body.querySelectorAll("*")),s=function(e,n){var i=o[e],s=i.nodeName.toLowerCase();if(-1===r.indexOf(i.nodeName.toLowerCase()))return i.parentNode.removeChild(i),"continue";var a=[].slice.call(i.attributes),l=[].concat(t["*"]||[],t[s]||[]);a.forEach(function(e){(function(e,t){var n=e.nodeName.toLowerCase();if(-1!==t.indexOf(n))return-1===yt.indexOf(n)||Boolean(e.nodeValue.match(bt)||e.nodeValue.match(_t));for(var i=t.filter(function(e){return e instanceof RegExp}),r=0,o=i.length;r<o;r++)if(n.match(i[r]))return!0;return!1})(e,l)||i.removeAttribute(e.nodeName)})},a=0,l=o.length;a<l;a++)s(a);return i.body.innerHTML}var Et="tooltip",xt="bs.tooltip",Tt="."+xt,Ct=t.fn[Et],St="bs-tooltip",At=new RegExp("(^|\\s)"+St+"\\S+","g"),Dt=["sanitize","whiteList","sanitizeFn"],kt={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",sanitize:"boolean",sanitizeFn:"(null|function)",whiteList:"object"},Nt={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},It={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",sanitize:!0,sanitizeFn:null,whiteList:{"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]}},Ot="show",jt={HIDE:"hide"+Tt,HIDDEN:"hidden"+Tt,SHOW:"show"+Tt,SHOWN:"shown"+Tt,INSERTED:"inserted"+Tt,CLICK:"click"+Tt,FOCUSIN:"focusin"+Tt,FOCUSOUT:"focusout"+Tt,MOUSEENTER:"mouseenter"+Tt,MOUSELEAVE:"mouseleave"+Tt},Lt="fade",Pt="show",Ht="hover",Mt="focus",qt=function(){function e(e,t){if(void 0===Be)throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=e,this.config=this._getConfig(t),this.tip=null,this._setListeners()}var n=e.prototype;return n.enable=function(){this._isEnabled=!0},n.disable=function(){this._isEnabled=!1},n.toggleEnabled=function(){this._isEnabled=!this._isEnabled},n.toggle=function(e){if(this._isEnabled)if(e){var n=this.constructor.DATA_KEY,i=t(e.currentTarget).data(n);i||(i=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(n,i)),i._activeTrigger.click=!i._activeTrigger.click,i._isWithActiveTrigger()?i._enter(null,i):i._leave(null,i)}else{if(t(this.getTipElement()).hasClass(Pt))return void this._leave(null,this);this._enter(null,this)}},n.dispose=function(){clearTimeout(this._timeout),t.removeData(this.element,this.constructor.DATA_KEY),t(this.element).off(this.constructor.EVENT_KEY),t(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&t(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,(this._activeTrigger=null)!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},n.show=function(){var e=this;if("none"===t(this.element).css("display"))throw new Error("Please use show on visible elements");var n=t.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){t(this.element).trigger(n);var i=s.findShadowRoot(this.element),r=t.contains(null!==i?i:this.element.ownerDocument.documentElement,this.element);if(n.isDefaultPrevented()||!r)return;var o=this.getTipElement(),a=s.getUID(this.constructor.NAME);o.setAttribute("id",a),this.element.setAttribute("aria-describedby",a),this.setContent(),this.config.animation&&t(o).addClass(Lt);var l="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,c=this._getAttachment(l);this.addAttachmentClass(c);var u=this._getContainer();t(o).data(this.constructor.DATA_KEY,this),t.contains(this.element.ownerDocument.documentElement,this.tip)||t(o).appendTo(u),t(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new Be(this.element,o,{placement:c,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:".arrow"},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){return e._handlePopperPlacementChange(t)}}),t(o).addClass(Pt),"ontouchstart"in document.documentElement&&t(document.body).children().on("mouseover",null,t.noop);var f=function(){e.config.animation&&e._fixTransition();var n=e._hoverState;e._hoverState=null,t(e.element).trigger(e.constructor.Event.SHOWN),"out"===n&&e._leave(null,e)};if(t(this.tip).hasClass(Lt)){var h=s.getTransitionDurationFromElement(this.tip);t(this.tip).one(s.TRANSITION_END,f).emulateTransitionEnd(h)}else f()}},n.hide=function(e){var n=this,i=this.getTipElement(),r=t.Event(this.constructor.Event.HIDE),o=function(){n._hoverState!==Ot&&i.parentNode&&i.parentNode.removeChild(i),n._cleanTipClass(),n.element.removeAttribute("aria-describedby"),t(n.element).trigger(n.constructor.Event.HIDDEN),null!==n._popper&&n._popper.destroy(),e&&e()};if(t(this.element).trigger(r),!r.isDefaultPrevented()){if(t(i).removeClass(Pt),"ontouchstart"in document.documentElement&&t(document.body).children().off("mouseover",null,t.noop),this._activeTrigger.click=!1,this._activeTrigger[Mt]=!1,this._activeTrigger[Ht]=!1,t(this.tip).hasClass(Lt)){var a=s.getTransitionDurationFromElement(i);t(i).one(s.TRANSITION_END,o).emulateTransitionEnd(a)}else o();this._hoverState=""}},n.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},n.isWithContent=function(){return Boolean(this.getTitle())},n.addAttachmentClass=function(e){t(this.getTipElement()).addClass(St+"-"+e)},n.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0],this.tip},n.setContent=function(){var e=this.getTipElement();this.setElementContent(t(e.querySelectorAll(".tooltip-inner")),this.getTitle()),t(e).removeClass(Lt+" "+Pt)},n.setElementContent=function(e,n){"object"!=typeof n||!n.nodeType&&!n.jquery?this.config.html?(this.config.sanitize&&(n=wt(n,this.config.whiteList,this.config.sanitizeFn)),e.html(n)):e.text(n):this.config.html?t(n).parent().is(e)||e.empty().append(n):e.text(t(n).text())},n.getTitle=function(){var e=this.element.getAttribute("data-original-title");return e||(e="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),e},n._getOffset=function(){var e=this,t={};return"function"==typeof this.config.offset?t.fn=function(t){return t.offsets=r({},t.offsets,e.config.offset(t.offsets,e.element)||{}),t}:t.offset=this.config.offset,t},n._getContainer=function(){return!1===this.config.container?document.body:s.isElement(this.config.container)?t(this.config.container):t(document).find(this.config.container)},n._getAttachment=function(e){return Nt[e.toUpperCase()]},n._setListeners=function(){var e=this;this.config.trigger.split(" ").forEach(function(n){if("click"===n)t(e.element).on(e.constructor.Event.CLICK,e.config.selector,function(t){return e.toggle(t)});else if("manual"!==n){var i=n===Ht?e.constructor.Event.MOUSEENTER:e.constructor.Event.FOCUSIN,r=n===Ht?e.constructor.Event.MOUSELEAVE:e.constructor.Event.FOCUSOUT;t(e.element).on(i,e.config.selector,function(t){return e._enter(t)}).on(r,e.config.selector,function(t){return e._leave(t)})}}),t(this.element).closest(".modal").on("hide.bs.modal",function(){e.element&&e.hide()}),this.config.selector?this.config=r({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},n._fixTitle=function(){var e=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==e)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},n._enter=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusin"===e.type?Mt:Ht]=!0),t(n.getTipElement()).hasClass(Pt)||n._hoverState===Ot?n._hoverState=Ot:(clearTimeout(n._timeout),n._hoverState=Ot,n.config.delay&&n.config.delay.show?n._timeout=setTimeout(function(){n._hoverState===Ot&&n.show()},n.config.delay.show):n.show())},n._leave=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusout"===e.type?Mt:Ht]=!1),n._isWithActiveTrigger()||(clearTimeout(n._timeout),n._hoverState="out",n.config.delay&&n.config.delay.hide?n._timeout=setTimeout(function(){"out"===n._hoverState&&n.hide()},n.config.delay.hide):n.hide())},n._isWithActiveTrigger=function(){for(var e in this._activeTrigger)if(this._activeTrigger[e])return!0;return!1},n._getConfig=function(e){var n=t(this.element).data();return Object.keys(n).forEach(function(e){-1!==Dt.indexOf(e)&&delete n[e]}),"number"==typeof(e=r({},this.constructor.Default,n,"object"==typeof e&&e?e:{})).delay&&(e.delay={show:e.delay,hide:e.delay}),"number"==typeof e.title&&(e.title=e.title.toString()),"number"==typeof e.content&&(e.content=e.content.toString()),s.typeCheckConfig(Et,e,this.constructor.DefaultType),e.sanitize&&(e.template=wt(e.template,e.whiteList,e.sanitizeFn)),e},n._getDelegateConfig=function(){var e={};if(this.config)for(var t in this.config)this.constructor.Default[t]!==this.config[t]&&(e[t]=this.config[t]);return e},n._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(At);null!==n&&n.length&&e.removeClass(n.join(""))},n._handlePopperPlacementChange=function(e){var t=e.instance;this.tip=t.popper,this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(e.placement))},n._fixTransition=function(){var e=this.getTipElement(),n=this.config.animation;null===e.getAttribute("x-placement")&&(t(e).removeClass(Lt),this.config.animation=!1,this.hide(),this.show(),this.config.animation=n)},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data(xt),r="object"==typeof n&&n;if((i||!/dispose|hide/.test(n))&&(i||(i=new e(this,r),t(this).data(xt,i)),"string"==typeof n)){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]()}})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return It}},{key:"NAME",get:function(){return Et}},{key:"DATA_KEY",get:function(){return xt}},{key:"Event",get:function(){return jt}},{key:"EVENT_KEY",get:function(){return Tt}},{key:"DefaultType",get:function(){return kt}}]),e}();t.fn[Et]=qt._jQueryInterface,t.fn[Et].Constructor=qt,t.fn[Et].noConflict=function(){return t.fn[Et]=Ct,qt._jQueryInterface};var Rt="popover",Ft="bs.popover",Wt="."+Ft,Bt=t.fn[Rt],Ut="bs-popover",zt=new RegExp("(^|\\s)"+Ut+"\\S+","g"),Vt=r({},qt.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),$t=r({},qt.DefaultType,{content:"(string|element|function)"}),Qt={HIDE:"hide"+Wt,HIDDEN:"hidden"+Wt,SHOW:"show"+Wt,SHOWN:"shown"+Wt,INSERTED:"inserted"+Wt,CLICK:"click"+Wt,FOCUSIN:"focusin"+Wt,FOCUSOUT:"focusout"+Wt,MOUSEENTER:"mouseenter"+Wt,MOUSELEAVE:"mouseleave"+Wt},Yt=function(e){var n,r;function o(){return e.apply(this,arguments)||this}r=e,(n=o).prototype=Object.create(r.prototype),(n.prototype.constructor=n).__proto__=r;var s=o.prototype;return s.isWithContent=function(){return this.getTitle()||this._getContent()},s.addAttachmentClass=function(e){t(this.getTipElement()).addClass(Ut+"-"+e)},s.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0],this.tip},s.setContent=function(){var e=t(this.getTipElement());this.setElementContent(e.find(".popover-header"),this.getTitle());var n=this._getContent();"function"==typeof n&&(n=n.call(this.element)),this.setElementContent(e.find(".popover-body"),n),e.removeClass("fade show")},s._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},s._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(zt);null!==n&&0<n.length&&e.removeClass(n.join(""))},o._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(Ft),i="object"==typeof e?e:null;if((n||!/dispose|hide/.test(e))&&(n||(n=new o(this,i),t(this).data(Ft,n)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},i(o,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Vt}},{key:"NAME",get:function(){return Rt}},{key:"DATA_KEY",get:function(){return Ft}},{key:"Event",get:function(){return Qt}},{key:"EVENT_KEY",get:function(){return Wt}},{key:"DefaultType",get:function(){return $t}}]),o}(qt);t.fn[Rt]=Yt._jQueryInterface,t.fn[Rt].Constructor=Yt,t.fn[Rt].noConflict=function(){return t.fn[Rt]=Bt,Yt._jQueryInterface};var Kt="scrollspy",Xt="bs.scrollspy",Gt="."+Xt,Jt=t.fn[Kt],Zt={offset:10,method:"auto",target:""},en={offset:"number",method:"string",target:"(string|element)"},tn={ACTIVATE:"activate"+Gt,SCROLL:"scroll"+Gt,LOAD_DATA_API:"load"+Gt+".data-api"},nn="active",rn=".nav, .list-group",on=".nav-link",sn=".list-group-item",an=".dropdown-item",ln="position",cn=function(){function e(e,n){var i=this;this._element=e,this._scrollElement="BODY"===e.tagName?window:e,this._config=this._getConfig(n),this._selector=this._config.target+" "+on+","+this._config.target+" "+sn+","+this._config.target+" "+an,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,t(this._scrollElement).on(tn.SCROLL,function(e){return i._process(e)}),this.refresh(),this._process()}var n=e.prototype;return n.refresh=function(){var e=this,n=this._scrollElement===this._scrollElement.window?"offset":ln,i="auto"===this._config.method?n:this._config.method,r=i===ln?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),[].slice.call(document.querySelectorAll(this._selector)).map(function(e){var n,o=s.getSelectorFromElement(e);if(o&&(n=document.querySelector(o)),n){var a=n.getBoundingClientRect();if(a.width||a.height)return[t(n)[i]().top+r,o]}return null}).filter(function(e){return e}).sort(function(e,t){return e[0]-t[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},n.dispose=function(){t.removeData(this._element,Xt),t(this._scrollElement).off(Gt),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},n._getConfig=function(e){if("string"!=typeof(e=r({},Zt,"object"==typeof e&&e?e:{})).target){var n=t(e.target).attr("id");n||(n=s.getUID(Kt),t(e.target).attr("id",n)),e.target="#"+n}return s.typeCheckConfig(Kt,e,en),e},n._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},n._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},n._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},n._process=function(){var e=this._getScrollTop()+this._config.offset,t=this._getScrollHeight(),n=this._config.offset+t-this._getOffsetHeight();if(this._scrollHeight!==t&&this.refresh(),n<=e){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&e<this._offsets[0]&&0<this._offsets[0])return this._activeTarget=null,void this._clear();for(var r=this._offsets.length;r--;)this._activeTarget!==this._targets[r]&&e>=this._offsets[r]&&(void 0===this._offsets[r+1]||e<this._offsets[r+1])&&this._activate(this._targets[r])}},n._activate=function(e){this._activeTarget=e,this._clear();var n=this._selector.split(",").map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'}),i=t([].slice.call(document.querySelectorAll(n.join(","))));i.hasClass("dropdown-item")?(i.closest(".dropdown").find(".dropdown-toggle").addClass(nn),i.addClass(nn)):(i.addClass(nn),i.parents(rn).prev(on+", "+sn).addClass(nn),i.parents(rn).prev(".nav-item").children(on).addClass(nn)),t(this._scrollElement).trigger(tn.ACTIVATE,{relatedTarget:e})},n._clear=function(){[].slice.call(document.querySelectorAll(this._selector)).filter(function(e){return e.classList.contains(nn)}).forEach(function(e){return e.classList.remove(nn)})},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data(Xt);if(i||(i=new e(this,"object"==typeof n&&n),t(this).data(Xt,i)),"string"==typeof n){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]()}})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Zt}}]),e}();t(window).on(tn.LOAD_DATA_API,function(){for(var e=[].slice.call(document.querySelectorAll('[data-spy="scroll"]')),n=e.length;n--;){var i=t(e[n]);cn._jQueryInterface.call(i,i.data())}}),t.fn[Kt]=cn._jQueryInterface,t.fn[Kt].Constructor=cn,t.fn[Kt].noConflict=function(){return t.fn[Kt]=Jt,cn._jQueryInterface};var un="bs.tab",fn="."+un,hn=t.fn.tab,dn={HIDE:"hide"+fn,HIDDEN:"hidden"+fn,SHOW:"show"+fn,SHOWN:"shown"+fn,CLICK_DATA_API:"click"+fn+".data-api"},pn="active",gn=".active",mn="> li > .active",vn=function(){function e(e){this._element=e}var n=e.prototype;return n.show=function(){var e=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&t(this._element).hasClass(pn)||t(this._element).hasClass("disabled"))){var n,i,r=t(this._element).closest(".nav, .list-group")[0],o=s.getSelectorFromElement(this._element);if(r){var a="UL"===r.nodeName||"OL"===r.nodeName?mn:gn;i=(i=t.makeArray(t(r).find(a)))[i.length-1]}var l=t.Event(dn.HIDE,{relatedTarget:this._element}),c=t.Event(dn.SHOW,{relatedTarget:i});if(i&&t(i).trigger(l),t(this._element).trigger(c),!c.isDefaultPrevented()&&!l.isDefaultPrevented()){o&&(n=document.querySelector(o)),this._activate(this._element,r);var u=function(){var n=t.Event(dn.HIDDEN,{relatedTarget:e._element}),r=t.Event(dn.SHOWN,{relatedTarget:i});t(i).trigger(n),t(e._element).trigger(r)};n?this._activate(n,n.parentNode,u):u()}}},n.dispose=function(){t.removeData(this._element,un),this._element=null},n._activate=function(e,n,i){var r=this,o=(!n||"UL"!==n.nodeName&&"OL"!==n.nodeName?t(n).children(gn):t(n).find(mn))[0],a=i&&o&&t(o).hasClass("fade"),l=function(){return r._transitionComplete(e,o,i)};if(o&&a){var c=s.getTransitionDurationFromElement(o);t(o).removeClass("show").one(s.TRANSITION_END,l).emulateTransitionEnd(c)}else l()},n._transitionComplete=function(e,n,i){if(n){t(n).removeClass(pn);var r=t(n.parentNode).find("> .dropdown-menu .active")[0];r&&t(r).removeClass(pn),"tab"===n.getAttribute("role")&&n.setAttribute("aria-selected",!1)}if(t(e).addClass(pn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!0),s.reflow(e),e.classList.contains("fade")&&e.classList.add("show"),e.parentNode&&t(e.parentNode).hasClass("dropdown-menu")){var o=t(e).closest(".dropdown")[0];if(o){var a=[].slice.call(o.querySelectorAll(".dropdown-toggle"));t(a).addClass(pn)}e.setAttribute("aria-expanded",!0)}i&&i()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),r=i.data(un);if(r||(r=new e(this),i.data(un,r)),"string"==typeof n){if(void 0===r[n])throw new TypeError('No method named "'+n+'"');r[n]()}})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),e}();t(document).on(dn.CLICK_DATA_API,'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',function(e){e.preventDefault(),vn._jQueryInterface.call(t(this),"show")}),t.fn.tab=vn._jQueryInterface,t.fn.tab.Constructor=vn,t.fn.tab.noConflict=function(){return t.fn.tab=hn,vn._jQueryInterface};var yn="toast",bn="bs.toast",_n="."+bn,wn=t.fn[yn],En={CLICK_DISMISS:"click.dismiss"+_n,HIDE:"hide"+_n,HIDDEN:"hidden"+_n,SHOW:"show"+_n,SHOWN:"shown"+_n},xn="show",Tn="showing",Cn={animation:"boolean",autohide:"boolean",delay:"number"},Sn={animation:!0,autohide:!0,delay:500},An=function(){function e(e,t){this._element=e,this._config=this._getConfig(t),this._timeout=null,this._setListeners()}var n=e.prototype;return n.show=function(){var e=this;t(this._element).trigger(En.SHOW),this._config.animation&&this._element.classList.add("fade");var n=function(){e._element.classList.remove(Tn),e._element.classList.add(xn),t(e._element).trigger(En.SHOWN),e._config.autohide&&e.hide()};if(this._element.classList.remove("hide"),this._element.classList.add(Tn),this._config.animation){var i=s.getTransitionDurationFromElement(this._element);t(this._element).one(s.TRANSITION_END,n).emulateTransitionEnd(i)}else n()},n.hide=function(e){var n=this;this._element.classList.contains(xn)&&(t(this._element).trigger(En.HIDE),e?this._close():this._timeout=setTimeout(function(){n._close()},this._config.delay))},n.dispose=function(){clearTimeout(this._timeout),this._timeout=null,this._element.classList.contains(xn)&&this._element.classList.remove(xn),t(this._element).off(En.CLICK_DISMISS),t.removeData(this._element,bn),this._element=null,this._config=null},n._getConfig=function(e){return e=r({},Sn,t(this._element).data(),"object"==typeof e&&e?e:{}),s.typeCheckConfig(yn,e,this.constructor.DefaultType),e},n._setListeners=function(){var e=this;t(this._element).on(En.CLICK_DISMISS,'[data-dismiss="toast"]',function(){return e.hide(!0)})},n._close=function(){var e=this,n=function(){e._element.classList.add("hide"),t(e._element).trigger(En.HIDDEN)};if(this._element.classList.remove(xn),this._config.animation){var i=s.getTransitionDurationFromElement(this._element);t(this._element).one(s.TRANSITION_END,n).emulateTransitionEnd(i)}else n()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),r=i.data(bn);if(r||(r=new e(this,"object"==typeof n&&n),i.data(bn,r)),"string"==typeof n){if(void 0===r[n])throw new TypeError('No method named "'+n+'"');r[n](this)}})},i(e,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"DefaultType",get:function(){return Cn}},{key:"Default",get:function(){return Sn}}]),e}();t.fn[yn]=An._jQueryInterface,t.fn[yn].Constructor=An,t.fn[yn].noConflict=function(){return t.fn[yn]=wn,An._jQueryInterface},function(){if(void 0===t)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1===e[0]&&9===e[1]&&e[2]<1||4<=e[0])throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(),e.Util=s,e.Alert=h,e.Button=E,e.Carousel=M,e.Collapse=X,e.Dropdown=it,e.Modal=vt,e.Popover=Yt,e.Scrollspy=cn,e.Tab=vn,e.Toast=An,e.Tooltip=qt,Object.defineProperty(e,"__esModule",{value:!0})}),function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.inView=t():e.inView=t()}(this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return e[i].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";var i=function(e){return e&&e.__esModule?e:{default:e}}(n(2));e.exports=i.default},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=i(n(9)),o=i(n(3)),s=n(4);t.default=function(){if("undefined"!=typeof window){var e={history:[]},t={offset:{},threshold:0,test:s.inViewport},n=(0,r.default)(function(){e.history.forEach(function(t){e[t].check()})},100);["scroll","resize","load"].forEach(function(e){return addEventListener(e,n)}),window.MutationObserver&&addEventListener("DOMContentLoaded",function(){new MutationObserver(n).observe(document.body,{attributes:!0,childList:!0,subtree:!0})});var i=function(n){if("string"==typeof n){var i=[].slice.call(document.querySelectorAll(n));return e.history.indexOf(n)>-1?e[n].elements=i:(e[n]=(0,o.default)(i,t),e.history.push(n)),e[n]}};return i.offset=function(e){if(void 0===e)return t.offset;var n=function(e){return"number"==typeof e};return["top","right","bottom","left"].forEach(n(e)?function(n){return t.offset[n]=e}:function(i){return n(e[i])?t.offset[i]=e[i]:null}),t.offset},i.threshold=function(e){return"number"==typeof e&&e>=0&&e<=1?t.threshold=e:t.threshold},i.test=function(e){return"function"==typeof e?t.test=e:t.test},i.is=function(e){return t.test(e,t)},i.offset(0),i}}()},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),i=function(){function e(t,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),this.options=n,this.elements=t,this.current=[],this.handlers={enter:[],exit:[]},this.singles={enter:[],exit:[]}}return n(e,[{key:"check",value:function(){var e=this;return this.elements.forEach(function(t){var n=e.options.test(t,e.options),i=e.current.indexOf(t),r=i>-1,o=!n&&r;n&&!r&&(e.current.push(t),e.emit("enter",t)),o&&(e.current.splice(i,1),e.emit("exit",t))}),this}},{key:"on",value:function(e,t){return this.handlers[e].push(t),this}},{key:"once",value:function(e,t){return this.singles[e].unshift(t),this}},{key:"emit",value:function(e,t){for(;this.singles[e].length;)this.singles[e].pop()(t);for(var n=this.handlers[e].length;--n>-1;)this.handlers[e][n](t);return this}}]),e}();t.default=function(e,t){return new i(e,t)}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.inViewport=function(e,t){var n=e.getBoundingClientRect(),i=n.top,r=n.right,o=n.bottom,s=n.left,a=n.width,l=n.height,c=o,u=window.innerWidth-s,f=window.innerHeight-i,h=r,d=t.threshold*a,p=t.threshold*l;return c>t.offset.top+p&&u>t.offset.right+d&&f>t.offset.bottom+p&&h>t.offset.left+d}},function(e,t){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,function(){return this}())},function(e,t,n){var i=n(5),r="object"==typeof self&&self&&self.Object===Object&&self,o=i||r||Function("return this")();e.exports=o},function(e,t,n){var i=n(1),r=n(8),o=n(10),s="Expected a function",a=Math.max,l=Math.min;e.exports=function(e,t,n){function c(t){var n=p,i=g;return p=g=void 0,_=t,v=e.apply(i,n)}function u(e){var n=e-b;return void 0===b||n>=t||n<0||E&&e-_>=m}function f(){var e=r();return u(e)?h(e):void(y=setTimeout(f,function(e){var n=t-(e-b);return E?l(n,m-(e-_)):n}(e)))}function h(e){return y=void 0,x&&p?c(e):(p=g=void 0,v)}function d(){var e=r(),n=u(e);if(p=arguments,g=this,b=e,n){if(void 0===y)return function(e){return _=e,y=setTimeout(f,t),w?c(e):v}(b);if(E)return y=setTimeout(f,t),c(b)}return void 0===y&&(y=setTimeout(f,t)),v}var p,g,m,v,y,b,_=0,w=!1,E=!1,x=!0;if("function"!=typeof e)throw new TypeError(s);return t=o(t)||0,i(n)&&(w=!!n.leading,m=(E="maxWait"in n)?a(o(n.maxWait)||0,t):m,x="trailing"in n?!!n.trailing:x),d.cancel=function(){void 0!==y&&clearTimeout(y),_=0,p=b=g=y=void 0},d.flush=function(){return void 0===y?v:h(r())},d}},function(e,t,n){var i=n(6);e.exports=function(){return i.Date.now()}},function(e,t,n){var i=n(7),r=n(1),o="Expected a function";e.exports=function(e,t,n){var s=!0,a=!0;if("function"!=typeof e)throw new TypeError(o);return r(n)&&(s="leading"in n?!!n.leading:s,a="trailing"in n?!!n.trailing:a),i(e,t,{leading:s,maxWait:t,trailing:a})}},function(e,t){e.exports=function(e){return e}}])}),function(){var e,t;e=this.jQuery||window.jQuery,t=e(window),e.fn.stick_in_parent=function(n){var i,r,o,s,a,l,c,u,f,h,d,p;for(null==n&&(n={}),f=n.sticky_class,o=n.inner_scrolling,u=n.recalc_every,c=n.parent,a=n.offset_top,s=n.spacer,r=n.bottoming,null==a&&(a=0),null==c&&(c=void 0),null==o&&(o=!0),null==f&&(f="is_stuck"),i=e(document),null==r&&(r=!0),l=function(e){var t;return window.getComputedStyle?(e=window.getComputedStyle(e[0]),t=parseFloat(e.getPropertyValue("width"))+parseFloat(e.getPropertyValue("margin-left"))+parseFloat(e.getPropertyValue("margin-right")),"border-box"!==e.getPropertyValue("box-sizing")&&(t+=parseFloat(e.getPropertyValue("border-left-width"))+parseFloat(e.getPropertyValue("border-right-width"))+parseFloat(e.getPropertyValue("padding-left"))+parseFloat(e.getPropertyValue("padding-right"))),t):e.outerWidth(!0)},h=function(n,h,d,p,g,m,v,y){var b,_,w,E,x,T,C,S,A,D,k,N;if(!n.data("sticky_kit")){if(n.data("sticky_kit",!0),x=i.height(),C=n.parent(),null!=c&&(C=C.closest(c)),!C.length)throw"failed to find stick parent";if(b=w=!1,(k=null!=s?s&&n.closest(s):e("<div />"))&&k.css("position",n.css("position")),(S=function(){var e,t,r;if(!y&&(x=i.height(),e=parseInt(C.css("border-top-width"),10),t=parseInt(C.css("padding-top"),10),h=parseInt(C.css("padding-bottom"),10),d=C.offset().top+e+t,p=C.height(),w&&(b=w=!1,null==s&&(n.insertAfter(k),k.detach()),n.css({position:"",top:"",width:"",bottom:""}).removeClass(f),r=!0),g=n.offset().top-(parseInt(n.css("margin-top"),10)||0)-a,m=n.outerHeight(!0),v=n.css("float"),k&&k.css({width:l(n),height:m,display:n.css("display"),"vertical-align":n.css("vertical-align"),float:v}),r))return N()})(),m!==p)return E=void 0,T=a,D=u,N=function(){var e,l,c,_;if(!y&&(c=!1,null!=D&&(0>=--D&&(D=u,S(),c=!0)),c||i.height()===x||S(),c=t.scrollTop(),null!=E&&(l=c-E),E=c,w?(r&&(_=c+m+T>p+d,b&&!_&&(b=!1,n.css({position:"fixed",bottom:"",top:T}).trigger("sticky_kit:unbottom"))),c<g&&(w=!1,T=a,null==s&&("left"!==v&&"right"!==v||n.insertAfter(k),k.detach()),e={position:"",width:"",top:""},n.css(e).removeClass(f).trigger("sticky_kit:unstick")),o&&(e=t.height(),m+a>e&&!b&&(T-=l,T=Math.max(e-m,T),T=Math.min(a,T),w&&n.css({top:T+"px"})))):c>g&&(w=!0,(e={position:"fixed",top:T}).width="border-box"===n.css("box-sizing")?n.outerWidth()+"px":n.width()+"px",n.css(e).addClass(f),null==s&&(n.after(k),"left"!==v&&"right"!==v||k.append(n)),n.trigger("sticky_kit:stick")),w&&r&&(null==_&&(_=c+m+T>p+d),!b&&_)))return b=!0,"static"===C.css("position")&&C.css({position:"relative"}),n.css({position:"absolute",bottom:h,top:"auto"}).trigger("sticky_kit:bottom")},A=function(){return S(),N()},_=function(){if(y=!0,t.off("touchmove",N),t.off("scroll",N),t.off("resize",A),e(document.body).off("sticky_kit:recalc",A),n.off("sticky_kit:detach",_),n.removeData("sticky_kit"),n.css({position:"",bottom:"",top:"",width:""}),C.position("position",""),w)return null==s&&("left"!==v&&"right"!==v||n.insertAfter(k),k.remove()),n.removeClass(f)},t.on("touchmove",N),t.on("scroll",N),t.on("resize",A),e(document.body).on("sticky_kit:recalc",A),n.on("sticky_kit:detach",_),setTimeout(N,0)}},d=0,p=this.length;d<p;d++)n=this[d],h(e(n));return this}}.call(this),function(e,t){"use strict";var n="file:"===e.location.protocol,i=t.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),r=Array.prototype.forEach||function(e,t){if(null==this||"function"!=typeof e)throw new TypeError;var n,i=this.length>>>0;for(n=0;i>n;++n)n in this&&e.call(t,this[n],n,this)},o={},s=0,a=[],l=[],c={},u=function(e){return e.cloneNode(!0)},f=function(e,t){l[e]=l[e]||[],l[e].push(t)},h=function(t,i){if(void 0!==o[t])o[t]instanceof SVGSVGElement?i(u(o[t])):f(t,i);else{if(!e.XMLHttpRequest)return i("Browser does not support XMLHttpRequest"),!1;o[t]={},f(t,i);var r=new XMLHttpRequest;r.onreadystatechange=function(){if(4===r.readyState){if(404===r.status||null===r.responseXML)return i("Unable to load SVG file: "+t),n&&i("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."),i(),!1;if(!(200===r.status||n&&0===r.status))return i("There was a problem injecting the SVG: "+r.status+" "+r.statusText),!1;if(r.responseXML instanceof Document)o[t]=r.responseXML.documentElement;else if(DOMParser&&DOMParser instanceof Function){var e;try{e=(new DOMParser).parseFromString(r.responseText,"text/xml")}catch(t){e=void 0}if(!e||e.getElementsByTagName("parsererror").length)return i("Unable to parse SVG file: "+t),!1;o[t]=e.documentElement}!function(e){for(var t=0,n=l[e].length;n>t;t++)!function(t){setTimeout(function(){l[e][t](u(o[e]))},0)}(t)}(t)}},r.open("GET",t),r.overrideMimeType&&r.overrideMimeType("text/xml"),r.send()}},d=function(t,n,o,l){var u=t.getAttribute("data-src")||t.getAttribute("src");if(/\.svg/i.test(u))if(i)-1===a.indexOf(t)&&(a.push(t),t.setAttribute("src",""),h(u,function(i){if(void 0===i||"string"==typeof i)return l(i),!1;var o=t.getAttribute("id");o&&i.setAttribute("id",o);var f=t.getAttribute("title");f&&i.setAttribute("title",f);var h=[].concat(i.getAttribute("class")||[],"injected-svg",t.getAttribute("class")||[]).join(" ");i.setAttribute("class",function(e){for(var t={},n=(e=e.split(" ")).length,i=[];n--;)t.hasOwnProperty(e[n])||(t[e[n]]=1,i.unshift(e[n]));return i.join(" ")}(h));var d=t.getAttribute("style");d&&i.setAttribute("style",d);var p=[].filter.call(t.attributes,function(e){return/^data-\w[\w\-]*$/.test(e.name)});r.call(p,function(e){e.name&&e.value&&i.setAttribute(e.name,e.value)});var g,m,v,y,b,_={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(_).forEach(function(e){g=e,v=_[e];for(var t=0,n=(m=i.querySelectorAll("defs "+g+"[id]")).length;n>t;t++){var o;y=m[t].id,b=y+"-"+s,r.call(v,function(e){for(var t=0,n=(o=i.querySelectorAll("["+e+'*="'+y+'"]')).length;n>t;t++)o[t].setAttribute(e,"url(#"+b+")")}),m[t].id=b}}),i.removeAttribute("xmlns:a");for(var w,E,x=i.querySelectorAll("script"),T=[],C=0,S=x.length;S>C;C++)(E=x[C].getAttribute("type"))&&"application/ecmascript"!==E&&"application/javascript"!==E||(w=x[C].innerText||x[C].textContent,T.push(w),i.removeChild(x[C]));if(T.length>0&&("always"===n||"once"===n&&!c[u])){for(var A=0,D=T.length;D>A;A++)new Function(T[A])(e);c[u]=!0}var k=i.querySelectorAll("style");r.call(k,function(e){e.textContent+=""}),t.parentNode.replaceChild(i,t),delete a[a.indexOf(t)],t=null,s++,l(i)}));else{var f=t.getAttribute("data-fallback")||t.getAttribute("data-png");f?(t.setAttribute("src",f),l(null)):o?(t.setAttribute("src",o+"/"+u.split("/").pop().replace(".svg",".png")),l(null)):l("This browser does not support SVG and no PNG fallback was defined.")}else l("Attempted to inject a file with a non-svg extension: "+u)},p=function(e,t,n){var i=(t=t||{}).evalScripts||"always",o=t.pngFallback||!1,s=t.each;if(void 0!==e.length){var a=0;r.call(e,function(t){d(t,i,o,function(t){s&&"function"==typeof s&&s(t),n&&e.length===++a&&n(a)})})}else e?d(e,i,o,function(t){s&&"function"==typeof s&&s(t),n&&n(1),e=null}):n&&n(0)};"object"==typeof module&&"object"==typeof module.exports?module.exports=exports=p:"function"==typeof define&&define.amd?define(function(){return p}):"object"==typeof e&&(e.SVGInjector=p)}(window,document),function(e,t){"function"==typeof define&&define.amd?define(["jquery"],t):t("undefined"!=typeof exports?require("jquery"):e.jQuery)}(this,function(e){"use strict";function t(t){if(i.webkit&&!t)return{height:0,width:0};if(!i.data.outer){var n={border:"none","box-sizing":"content-box",height:"200px",margin:"0",padding:"0",width:"200px"};i.data.inner=e("<div>").css(e.extend({},n)),i.data.outer=e("<div>").css(e.extend({left:"-1000px",overflow:"scroll",position:"absolute",top:"-1000px"},n)).append(i.data.inner).appendTo("body")}return i.data.outer.scrollLeft(1e3).scrollTop(1e3),{height:Math.ceil(i.data.outer.offset().top-i.data.inner.offset().top||0),width:Math.ceil(i.data.outer.offset().left-i.data.inner.offset().left||0)}}function n(e){var t=e.originalEvent;return!(t.axis&&t.axis===t.HORIZONTAL_AXIS||t.wheelDeltaX)}var i={data:{index:0,name:"scrollbar"},firefox:/firefox/i.test(navigator.userAgent),macosx:/mac/i.test(navigator.platform),msedge:/edge\/\d+/i.test(navigator.userAgent),msie:/(msie|trident)/i.test(navigator.userAgent),mobile:/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent),overlay:null,scroll:null,scrolls:[],webkit:/webkit/i.test(navigator.userAgent)&&!/edge\/\d+/i.test(navigator.userAgent)};i.scrolls.add=function(e){this.remove(e).push(e)},i.scrolls.remove=function(t){for(;e.inArray(t,this)>=0;)this.splice(e.inArray(t,this),1);return this};var r={autoScrollSize:!0,autoUpdate:!0,debug:!1,disableBodyScroll:!1,duration:200,ignoreMobile:!1,ignoreOverlay:!1,isRtl:!1,scrollStep:30,showArrows:!1,stepScrolling:!0,scrollx:null,scrolly:null,onDestroy:null,onFallback:null,onInit:null,onScroll:null,onUpdate:null},o=function(n){i.scroll||(i.overlay=function(){var e=t(!0);return!(e.height||e.width)}(),i.scroll=t(),a(),e(window).resize(function(){var e=!1;if(i.scroll&&(i.scroll.height||i.scroll.width)){var n=t();n.height===i.scroll.height&&n.width===i.scroll.width||(i.scroll=n,e=!0)}a(e)})),this.container=n,this.namespace=".scrollbar_"+i.data.index++,this.options=e.extend({},r,window.jQueryScrollbarOptions||{}),this.scrollTo=null,this.scrollx={},this.scrolly={},n.data(i.data.name,this),i.scrolls.add(this)};o.prototype={destroy:function(){if(this.wrapper){this.container.removeData(i.data.name),i.scrolls.remove(this);var t=this.container.scrollLeft(),n=this.container.scrollTop();this.container.insertBefore(this.wrapper).css({height:"",margin:"","max-height":""}).removeClass("scroll-content scroll-scrollx_visible scroll-scrolly_visible").off(this.namespace).scrollLeft(t).scrollTop(n),this.scrollx.scroll.removeClass("scroll-scrollx_visible").find("div").addBack().off(this.namespace),this.scrolly.scroll.removeClass("scroll-scrolly_visible").find("div").addBack().off(this.namespace),this.wrapper.remove(),e(document).add("body").off(this.namespace),e.isFunction(this.options.onDestroy)&&this.options.onDestroy.apply(this,[this.container])}},init:function(t){var r=this,o=this.container,s=this.containerWrapper||o,a=this.namespace,l=e.extend(this.options,t||{}),c={x:this.scrollx,y:this.scrolly},u=this.wrapper,f={},h={scrollLeft:o.scrollLeft(),scrollTop:o.scrollTop()};if(i.mobile&&l.ignoreMobile||i.overlay&&l.ignoreOverlay||i.macosx&&!i.webkit)return e.isFunction(l.onFallback)&&l.onFallback.apply(this,[o]),!1;if(u)(f={height:"auto","margin-bottom":-1*i.scroll.height+"px","max-height":""})[l.isRtl?"margin-left":"margin-right"]=-1*i.scroll.width+"px",s.css(f);else{if(this.wrapper=u=e("<div>").addClass("scroll-wrapper").addClass(o.attr("class")).css("position","absolute"===o.css("position")?"absolute":"relative").insertBefore(o).append(o),l.isRtl&&u.addClass("scroll--rtl"),o.is("textarea")&&(this.containerWrapper=s=e("<div>").insertBefore(o).append(o),u.addClass("scroll-textarea")),(f={height:"auto","margin-bottom":-1*i.scroll.height+"px","max-height":""})[l.isRtl?"margin-left":"margin-right"]=-1*i.scroll.width+"px",s.addClass("scroll-content").css(f),o.on("scroll"+a,function(t){var n=o.scrollLeft(),s=o.scrollTop();if(l.isRtl)switch(!0){case i.firefox:n=Math.abs(n);case i.msedge||i.msie:n=o[0].scrollWidth-o[0].clientWidth-n}e.isFunction(l.onScroll)&&l.onScroll.call(r,{maxScroll:c.y.maxScrollOffset,scroll:s,size:c.y.size,visible:c.y.visible},{maxScroll:c.x.maxScrollOffset,scroll:n,size:c.x.size,visible:c.x.visible}),c.x.isVisible&&c.x.scroll.bar.css("left",n*c.x.kx+"px"),c.y.isVisible&&c.y.scroll.bar.css("top",s*c.y.kx+"px")}),u.on("scroll"+a,function(){u.scrollTop(0).scrollLeft(0)}),l.disableBodyScroll){var d=function(e){n(e)?c.y.isVisible&&c.y.mousewheel(e):c.x.isVisible&&c.x.mousewheel(e)};u.on("MozMousePixelScroll"+a,d),u.on("mousewheel"+a,d),i.mobile&&u.on("touchstart"+a,function(t){var n=t.originalEvent.touches&&t.originalEvent.touches[0]||t,i=n.pageX,r=n.pageY,s=o.scrollLeft(),l=o.scrollTop();e(document).on("touchmove"+a,function(e){var t=e.originalEvent.targetTouches&&e.originalEvent.targetTouches[0]||e;o.scrollLeft(s+i-t.pageX),o.scrollTop(l+r-t.pageY),e.preventDefault()}),e(document).on("touchend"+a,function(){e(document).off(a)})})}e.isFunction(l.onInit)&&l.onInit.apply(this,[o])}e.each(c,function(t,s){var u=null,f=1,h="x"===t?"scrollLeft":"scrollTop",d=l.scrollStep,p=function(){var e=o[h]();o[h](e+d),1==f&&e+d>=g&&(e=o[h]()),-1==f&&e+d<=g&&(e=o[h]()),o[h]()==e&&u&&u()},g=0;s.scroll||(s.scroll=r._getScroll(l["scroll"+t]).addClass("scroll-"+t),l.showArrows&&s.scroll.addClass("scroll-element_arrows_visible"),s.mousewheel=function(e){if(!s.isVisible||"x"===t&&n(e))return!0;if("y"===t&&!n(e))return c.x.mousewheel(e),!0;var i=-1*e.originalEvent.wheelDelta||e.originalEvent.detail,a=s.size-s.visible-s.offset;return i||("x"===t&&e.originalEvent.deltaX?i=40*e.originalEvent.deltaX:"y"===t&&e.originalEvent.deltaY&&(i=40*e.originalEvent.deltaY)),(i>0&&g<a||i<0&&g>0)&&((g+=i)<0&&(g=0),g>a&&(g=a),r.scrollTo=r.scrollTo||{},r.scrollTo[h]=g,setTimeout(function(){r.scrollTo&&(o.stop().animate(r.scrollTo,240,"linear",function(){g=o[h]()}),r.scrollTo=null)},1)),e.preventDefault(),!1},s.scroll.on("MozMousePixelScroll"+a,s.mousewheel).on("mousewheel"+a,s.mousewheel).on("mouseenter"+a,function(){g=o[h]()}),s.scroll.find(".scroll-arrow, .scroll-element_track").on("mousedown"+a,function(n){if(1!=n.which)return!0;f=1;var a={eventOffset:n["x"===t?"pageX":"pageY"],maxScrollValue:s.size-s.visible-s.offset,scrollbarOffset:s.scroll.bar.offset()["x"===t?"left":"top"],scrollbarSize:s.scroll.bar["x"===t?"outerWidth":"outerHeight"]()},c=0,m=0;if(e(this).hasClass("scroll-arrow")){if(f=e(this).hasClass("scroll-arrow_more")?1:-1,d=l.scrollStep*f,g=f>0?a.maxScrollValue:0,l.isRtl)switch(!0){case i.firefox:g=f>0?0:-1*a.maxScrollValue;break;case i.msie||i.msedge:}}else f=a.eventOffset>a.scrollbarOffset+a.scrollbarSize?1:a.eventOffset<a.scrollbarOffset?-1:0,"x"===t&&l.isRtl&&(i.msie||i.msedge)&&(f*=-1),d=Math.round(.75*s.visible)*f,g=a.eventOffset-a.scrollbarOffset-(l.stepScrolling?1==f?a.scrollbarSize:0:Math.round(a.scrollbarSize/2)),g=o[h]()+g/s.kx;return r.scrollTo=r.scrollTo||{},r.scrollTo[h]=l.stepScrolling?o[h]()+d:g,l.stepScrolling&&(u=function(){g=o[h](),clearInterval(m),clearTimeout(c),c=0,m=0},c=setTimeout(function(){m=setInterval(p,40)},l.duration+100)),setTimeout(function(){r.scrollTo&&(o.animate(r.scrollTo,l.duration),r.scrollTo=null)},1),r._handleMouseDown(u,n)}),s.scroll.bar.on("mousedown"+a,function(n){if(1!=n.which)return!0;var c=n["x"===t?"pageX":"pageY"],u=o[h]();return s.scroll.addClass("scroll-draggable"),e(document).on("mousemove"+a,function(e){var n=parseInt((e["x"===t?"pageX":"pageY"]-c)/s.kx,10);"x"===t&&l.isRtl&&(i.msie||i.msedge)&&(n*=-1),o[h](u+n)}),r._handleMouseDown(function(){s.scroll.removeClass("scroll-draggable"),g=o[h]()},n)}))}),e.each(c,function(e,t){var n="scroll-scroll"+e+"_visible",i="x"==e?c.y:c.x;t.scroll.removeClass(n),i.scroll.removeClass(n),s.removeClass(n)}),e.each(c,function(t,n){e.extend(n,"x"==t?{offset:parseInt(o.css("left"),10)||0,size:o.prop("scrollWidth"),visible:u.width()}:{offset:parseInt(o.css("top"),10)||0,size:o.prop("scrollHeight"),visible:u.height()})}),this._updateScroll("x",this.scrollx),this._updateScroll("y",this.scrolly),e.isFunction(l.onUpdate)&&l.onUpdate.apply(this,[o]),e.each(c,function(e,t){var n="x"===e?"left":"top",i="x"===e?"outerWidth":"outerHeight",r="x"===e?"width":"height",s=parseInt(o.css(n),10)||0,a=t.size,c=t.visible+s,u=t.scroll.size[i]()+(parseInt(t.scroll.size.css(n),10)||0);l.autoScrollSize&&(t.scrollbarSize=parseInt(u*c/a,10),t.scroll.bar.css(r,t.scrollbarSize+"px")),t.scrollbarSize=t.scroll.bar[i](),t.kx=(u-t.scrollbarSize)/(a-c)||1,t.maxScrollOffset=a-c}),o.scrollLeft(h.scrollLeft).scrollTop(h.scrollTop).trigger("scroll")},_getScroll:function(t){var n={advanced:['<div class="scroll-element">','<div class="scroll-element_corner"></div>','<div class="scroll-arrow scroll-arrow_less"></div>','<div class="scroll-arrow scroll-arrow_more"></div>','<div class="scroll-element_outer">','<div class="scroll-element_size"></div>','<div class="scroll-element_inner-wrapper">','<div class="scroll-element_inner scroll-element_track">','<div class="scroll-element_inner-bottom"></div>',"</div>","</div>",'<div class="scroll-bar">','<div class="scroll-bar_body">','<div class="scroll-bar_body-inner"></div>',"</div>",'<div class="scroll-bar_bottom"></div>','<div class="scroll-bar_center"></div>',"</div>","</div>","</div>"].join(""),simple:['<div class="scroll-element">','<div class="scroll-element_outer">','<div class="scroll-element_size"></div>','<div class="scroll-element_track"></div>','<div class="scroll-bar"></div>',"</div>","</div>"].join("")};return n[t]&&(t=n[t]),t||(t=n.simple),t="string"==typeof t?e(t).appendTo(this.wrapper):e(t),e.extend(t,{bar:t.find(".scroll-bar"),size:t.find(".scroll-element_size"),track:t.find(".scroll-element_track")}),t},_handleMouseDown:function(t,n){var i=this.namespace;return e(document).on("blur"+i,function(){e(document).add("body").off(i),t&&t()}),e(document).on("dragstart"+i,function(e){return e.preventDefault(),!1}),e(document).on("mouseup"+i,function(){e(document).add("body").off(i),t&&t()}),e("body").on("selectstart"+i,function(e){return e.preventDefault(),!1}),n&&n.preventDefault(),!1},_updateScroll:function(t,n){var r=this.container,o=this.containerWrapper||r,s="scroll-scroll"+t+"_visible",a="x"===t?this.scrolly:this.scrollx,l=parseInt(this.container.css("x"===t?"left":"top"),10)||0,c=this.wrapper,u=n.size,f=n.visible+l;n.isVisible=u-f>1,n.isVisible?(n.scroll.addClass(s),a.scroll.addClass(s),o.addClass(s)):(n.scroll.removeClass(s),a.scroll.removeClass(s),o.removeClass(s)),"y"===t&&(r.is("textarea")||u<f?o.css({height:f+i.scroll.height+"px","max-height":"none"}):o.css({"max-height":f+i.scroll.height+"px"})),n.size==r.prop("scrollWidth")&&a.size==r.prop("scrollHeight")&&n.visible==c.width()&&a.visible==c.height()&&n.offset==(parseInt(r.css("left"),10)||0)&&a.offset==(parseInt(r.css("top"),10)||0)||(e.extend(this.scrollx,{offset:parseInt(r.css("left"),10)||0,size:r.prop("scrollWidth"),visible:c.width()}),e.extend(this.scrolly,{offset:parseInt(r.css("top"),10)||0,size:this.container.prop("scrollHeight"),visible:c.height()}),this._updateScroll("x"===t?"y":"x",a))}};var s=o;e.fn.scrollbar=function(t,n){return"string"!=typeof t&&(n=t,t="init"),void 0===n&&(n=[]),e.isArray(n)||(n=[n]),this.not("body, .scroll-wrapper").each(function(){var r=e(this),o=r.data(i.data.name);(o||"init"===t)&&(o||(o=new s(r)),o[t]&&o[t].apply(o,n))}),this},e.fn.scrollbar.options=r;var a=function(){var e=0;return function(t){var n,r,o,s,l,c,u;for(n=0;n<i.scrolls.length;n++)r=(s=i.scrolls[n]).container,o=s.options,l=s.wrapper,c=s.scrollx,u=s.scrolly,(t||o.autoUpdate&&l&&l.is(":visible")&&(r.prop("scrollWidth")!=c.size||r.prop("scrollHeight")!=u.size||l.width()!=c.visible||l.height()!=u.visible))&&(s.init(),o.debug&&(window.console&&console.log({scrollHeight:r.prop("scrollHeight")+":"+s.scrolly.size,scrollWidth:r.prop("scrollWidth")+":"+s.scrollx.size,visibleHeight:l.height()+":"+s.scrolly.visible,visibleWidth:l.width()+":"+s.scrollx.visible},!0),0));clearTimeout(e),e=setTimeout(a,300)}}();window.angular&&function(e){e.module("jQueryScrollbar",[]).provider("jQueryScrollbar",function(){var t=r;return{setOptions:function(n){e.extend(t,n)},$get:function(){return{options:e.copy(t)}}}}).directive("jqueryScrollbar",["jQueryScrollbar","$parse",function(e,t){return{restrict:"AC",link:function(n,i,r){var o=t(r.jqueryScrollbar)(n);i.scrollbar(o||e.options).on("$destroy",function(){i.scrollbar("destroy")})}}}])}(window.angular)}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e){"use strict";var t,n=32,i=33,r=34,o=35,s=36,a=38,l=40,c=function(t,n){var i,r,o=n.scrollTop(),s=n.prop("scrollHeight"),a=n.prop("clientHeight"),l=t.originalEvent.wheelDelta||-1*t.originalEvent.detail||-1*t.originalEvent.deltaY,c=0;return"wheel"===t.type?(i=n.height()/e(window).height(),c=t.originalEvent.deltaY*i):this.options.touch&&"touchmove"===t.type&&(l=t.originalEvent.changedTouches[0].clientY-this.startClientY),{prevent:(r=l>0&&o+c<=0)||l<0&&o+c>=s-a,top:r,scrollTop:o,deltaY:c}},u=function(e,t){var c,u,f=t.scrollTop(),h={top:!1,bottom:!1};return h.top=0===f&&(e.keyCode===i||e.keyCode===s||e.keyCode===a),h.top||(c=t.prop("scrollHeight"),u=t.prop("clientHeight"),h.bottom=c===f+u&&(e.keyCode===n||e.keyCode===r||e.keyCode===o||e.keyCode===l)),h},f=function(t,n){this.$element=t,this.options=e.extend({},f.DEFAULTS,this.$element.data(),n),this.enabled=!0,this.startClientY=0,this.options.unblock&&this.$element.on(f.CORE.wheelEventName+f.NAMESPACE,this.options.unblock,e.proxy(f.CORE.unblockHandler,this)),this.$element.on(f.CORE.wheelEventName+f.NAMESPACE,this.options.selector,e.proxy(f.CORE.handler,this)),this.options.touch&&(this.$element.on("touchstart"+f.NAMESPACE,this.options.selector,e.proxy(f.CORE.touchHandler,this)),this.$element.on("touchmove"+f.NAMESPACE,this.options.selector,e.proxy(f.CORE.handler,this)),this.options.unblock&&this.$element.on("touchmove"+f.NAMESPACE,this.options.unblock,e.proxy(f.CORE.unblockHandler,this))),this.options.keyboard&&(this.$element.attr("tabindex",this.options.keyboard.tabindex||0),this.$element.on("keydown"+f.NAMESPACE,this.options.selector,e.proxy(f.CORE.keyboardHandler,this)),this.options.unblock&&this.$element.on("keydown"+f.NAMESPACE,this.options.unblock,e.proxy(f.CORE.unblockHandler,this)))};f.NAME="ScrollLock",f.VERSION="3.1.2",f.NAMESPACE=".scrollLock",f.ANIMATION_NAMESPACE=f.NAMESPACE+".effect",f.DEFAULTS={strict:!1,strictFn:function(e){return e.prop("scrollHeight")>e.prop("clientHeight")},selector:!1,animation:!1,touch:"ontouchstart"in window,keyboard:!1,unblock:!1},f.CORE={wheelEventName:"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll",animationEventName:["webkitAnimationEnd","mozAnimationEnd","MSAnimationEnd","oanimationend","animationend"].join(f.ANIMATION_NAMESPACE+" ")+f.ANIMATION_NAMESPACE,unblockHandler:function(e){e.__currentTarget=e.currentTarget},handler:function(t){var n,i,r;this.enabled&&!t.ctrlKey&&(n=e(t.currentTarget),(!0!==this.options.strict||this.options.strictFn(n))&&(t.stopPropagation(),i=e.proxy(c,this)(t,n),t.__currentTarget&&(i.prevent&=e.proxy(c,this)(t,e(t.__currentTarget)).prevent),i.prevent&&(t.preventDefault(),i.deltaY&&n.scrollTop(i.scrollTop+i.deltaY),r=i.top?"top":"bottom",this.options.animation&&setTimeout(f.CORE.animationHandler.bind(this,n,r),0),n.trigger(e.Event(r+f.NAMESPACE)))))},touchHandler:function(e){this.startClientY=e.originalEvent.touches[0].clientY},animationHandler:function(e,t){var n=this.options.animation[t],i=this.options.animation.top+" "+this.options.animation.bottom;e.off(f.ANIMATION_NAMESPACE).removeClass(i).addClass(n).one(f.CORE.animationEventName,function(){e.removeClass(n)})},keyboardHandler:function(t){var n,i=e(t.currentTarget),r=(i.scrollTop(),u(t,i));return t.__currentTarget&&(n=u(t,e(t.__currentTarget)),r.top&=n.top,r.bottom&=n.bottom),r.top?(i.trigger(e.Event("top"+f.NAMESPACE)),this.options.animation&&setTimeout(f.CORE.animationHandler.bind(this,i,"top"),0),!1):r.bottom?(i.trigger(e.Event("bottom"+f.NAMESPACE)),this.options.animation&&setTimeout(f.CORE.animationHandler.bind(this,i,"bottom"),0),!1):void 0}},f.prototype.toggleStrict=function(){this.options.strict=!this.options.strict},f.prototype.enable=function(){this.enabled=!0},f.prototype.disable=function(){this.enabled=!1},f.prototype.destroy=function(){this.disable(),this.$element.off(f.NAMESPACE),this.$element=null,this.options=null},t=e.fn.scrollLock,e.fn.scrollLock=function(t){return this.each(function(){var n=e(this),i="object"==typeof t&&t,r=n.data(f.NAME);(r||"destroy"!==t)&&(r||n.data(f.NAME,r=new f(n,i)),"string"==typeof t&&r[t]())})},e.fn.scrollLock.defaults=f.DEFAULTS,e.fn.scrollLock.noConflict=function(){return e.fn.scrollLock=t,this}}),function(e,t){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",t):"object"==typeof module&&module.exports?module.exports=t():e.EvEmitter=t()}("undefined"!=typeof window?window:this,function(){function e(){}var t=e.prototype;return t.on=function(e,t){if(e&&t){var n=this._events=this._events||{},i=n[e]=n[e]||[];return-1==i.indexOf(t)&&i.push(t),this}},t.once=function(e,t){if(e&&t){this.on(e,t);var n=this._onceEvents=this._onceEvents||{};return(n[e]=n[e]||{})[t]=!0,this}},t.off=function(e,t){var n=this._events&&this._events[e];if(n&&n.length){var i=n.indexOf(t);return-1!=i&&n.splice(i,1),this}},t.emitEvent=function(e,t){var n=this._events&&this._events[e];if(n&&n.length){n=n.slice(0),t=t||[];for(var i=this._onceEvents&&this._onceEvents[e],r=0;r<n.length;r++){var o=n[r];i&&i[o]&&(this.off(e,o),delete i[o]),o.apply(this,t)}return this}},t.allOff=function(){delete this._events,delete this._onceEvents},e}),function(e,t){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(n){return t(e,n)}):"object"==typeof module&&module.exports?module.exports=t(e,require("ev-emitter")):e.imagesLoaded=t(e,e.EvEmitter)}("undefined"!=typeof window?window:this,function(e,t){function n(e,t){for(var n in t)e[n]=t[n];return e}function i(e,t,r){if(!(this instanceof i))return new i(e,t,r);var o=e;return"string"==typeof e&&(o=document.querySelectorAll(e)),o?(this.elements=function(e){return Array.isArray(e)?e:"object"==typeof e&&"number"==typeof e.length?l.call(e):[e]}(o),this.options=n({},this.options),"function"==typeof t?r=t:n(this.options,t),r&&this.on("always",r),this.getImages(),s&&(this.jqDeferred=new s.Deferred),void setTimeout(this.check.bind(this))):void a.error("Bad element for imagesLoaded "+(o||e))}function r(e){this.img=e}function o(e,t){this.url=e,this.element=t,this.img=new Image}var s=e.jQuery,a=e.console,l=Array.prototype.slice;i.prototype=Object.create(t.prototype),i.prototype.options={},i.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},i.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),!0===this.options.background&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&c[t]){for(var n=e.querySelectorAll("img"),i=0;i<n.length;i++){var r=n[i];this.addImage(r)}if("string"==typeof this.options.background){var o=e.querySelectorAll(this.options.background);for(i=0;i<o.length;i++){var s=o[i];this.addElementBackgroundImages(s)}}}};var c={1:!0,9:!0,11:!0};return i.prototype.addElementBackgroundImages=function(e){var t=getComputedStyle(e);if(t)for(var n=/url\((['"])?(.*?)\1\)/gi,i=n.exec(t.backgroundImage);null!==i;){var r=i&&i[2];r&&this.addBackground(r,e),i=n.exec(t.backgroundImage)}},i.prototype.addImage=function(e){var t=new r(e);this.images.push(t)},i.prototype.addBackground=function(e,t){var n=new o(e,t);this.images.push(n)},i.prototype.check=function(){function e(e,n,i){setTimeout(function(){t.progress(e,n,i)})}var t=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(t){t.once("progress",e),t.check()}):void this.complete()},i.prototype.progress=function(e,t,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emitEvent("progress",[this,e,t]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+n,e,t)},i.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(e,[this]),this.emitEvent("always",[this]),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},r.prototype=Object.create(t.prototype),r.prototype.check=function(){return this.getIsImageComplete()?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},r.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.img,t])},r.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},o.prototype=Object.create(r.prototype),o.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},o.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},o.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.element,t])},i.makeJQueryPlugin=function(t){(t=t||e.jQuery)&&((s=t).fn.imagesLoaded=function(e,t){return new i(this,e,t).jqDeferred.promise(s(this))})},i.makeJQueryPlugin(),i});
"use strict";
var Layout = function() {
        function e(e) {
            $(".sidenav-toggler").addClass("active"), $(".sidenav-toggler").data("action", "sidenav-unpin"), $("body").addClass("sidenav-pinned ready"), $("body").find(".main-content").append('<div class="sidenav-mask mask-body d-xl-none" data-action="sidenav-unpin" data-target=' + e.data("target") + " />"), $(e.data("target")).addClass("show"), localStorage.setItem("sidenav-state", "pinned")
        }

        function t(e) {
            $(".sidenav-toggler").removeClass("active"), $(".sidenav-toggler").data("action", "sidenav-pin"), $("body").removeClass("sidenav-pinned"), $("body").addClass("ready"), $("body").find(".sidenav-mask").remove(), $(e.data("target")).removeClass("show"), localStorage.setItem("sidenav-state", "unpinned")
        }
        var a = localStorage.getItem("sidenav-state") ? localStorage.getItem("sidenav-state") : "pinned";
        if ($(window).on({
                "load resize": function() {
                    $(window).width() < 1200 ? t($(".sidenav-toggler")) : "pinned" == a ? e($(".sidenav-toggler")) : "unpinned" == a && t($(".sidenav-toggler"))
                }
            }), $("body").on("click", "[data-action]", function(a) {
                a.preventDefault();
                var n = $(this),
                    o = n.data("action"),
                    i = n.data("target");
                switch (o) {
                    case "offcanvas-open":
                        i = n.data("target"), $(i).addClass("open"), $("body").append('<div class="body-backdrop" data-action="offcanvas-close" data-target=' + i + " />");
                        break;
                    case "offcanvas-close":
                        i = n.data("target"), $(i).removeClass("open"), $("body").find(".body-backdrop").remove();
                        break;
                    case "aside-open":
                        i = n.data("target"), n.addClass("active"), $(i).addClass("show"), $("body").append('<div class="mask-body mask-body-light" data-action="aside-close" data-target=' + i + " />");
                        break;
                    case "aside-close":
                        i = n.data("target"), n.removeClass("active"), $(i).removeClass("show"), $("body").find(".body-backdrop").remove();
                        break;
                    case "omnisearch-open":
                        i = n.data("target"), n.addClass("active"), $(i).addClass("show"), $(i).find(".form-control").focus(), $("body").addClass("omnisearch-open").append('<div class="mask-body mask-body-dark" data-action="omnisearch-close" data-target="' + i + '" />');
                        break;
                    case "omnisearch-close":
                        i = n.data("target"), $('[data-action="search-open"]').removeClass("active"), $(i).removeClass("show"), $("body").removeClass("omnisearch-open").find(".mask-body").remove();
                        break;
                    case "search-open":
                        i = n.data("target"), n.addClass("active"), $(i).addClass("show"), $(i).find(".form-control").focus();
                        break;
                    case "search-close":
                        i = n.data("target"), $('[data-action="search-open"]').removeClass("active"), $(i).removeClass("show");
                        break;
                    case "sidenav-pin":
                        e(n);
                        break;
                    case "sidenav-unpin":
                        t(n)
                }
            }), $("[data-offset-top]").length) {
            var n = $("[data-offset-top]"),
                o = $(n.data("offset-top")).height();
            n.css({
                "padding-top": o + "px"
            })
        }
    }(),
    Popover = function() {
        var e = $('[data-toggle="popover"]');
        e.length && e.each(function() {
            ! function(e) {
                var t = "";
                e.data("color") && (t = " popover-" + e.data("color"));
                var a = {
                    trigger: "focus",
                    template: '<div class="popover' + t + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
                };
                e.popover(a)
            }($(this))
        })
    }(),
    PurposeStyle = function() {
        var e = getComputedStyle(document.body);
        return {
            colors: {
                gray: {
                    100: "#f6f9fc",
                    200: "#e9ecef",
                    300: "#dee2e6",
                    400: "#ced4da",
                    500: "#adb5bd",
                    600: "#8898aa",
                    700: "#525f7f",
                    800: "#32325d",
                    900: "#212529"
                },
                theme: {
                    primary: e.getPropertyValue("--primary") ? e.getPropertyValue("--primary").replace(" ", "") : "#6e00ff",
                    info: e.getPropertyValue("--info") ? e.getPropertyValue("--info").replace(" ", "") : "#00B8D9",
                    success: e.getPropertyValue("--success") ? e.getPropertyValue("--success").replace(" ", "") : "#36B37E",
                    danger: e.getPropertyValue("--danger") ? e.getPropertyValue("--danger").replace(" ", "") : "#FF5630",
                    warning: e.getPropertyValue("--warning") ? e.getPropertyValue("--warning").replace(" ", "") : "#FFAB00",
                    dark: e.getPropertyValue("--dark") ? e.getPropertyValue("--dark").replace(" ", "") : "#212529"
                },
                transparent: "transparent"
            },
            fonts: {
                base: "Nunito"
            }
        }
    }(),
    Tooltip = function() {
        var e = $('[data-toggle="tooltip"]');
        e.length && e.tooltip()
    }(),
    BgImgHolder = function() {
        var e = $(".bg-img-holder");
        e.length && e.each(function() {
            var e, t, a, n, o;
            e = $(this), t = e.children("img").attr("src"), a = e.data("bg-position") ? e.data("bg-position") : "initial", n = e.data("bg-size") ? e.data("bg-size") : "auto", o = e.data("bg-height") ? e.data("bg-height") : "100%", e.css("background-image", 'url("' + t + '")').css("background-position", a).css("background-size", n).css("opacity", "1").css("height", o)
        })
    }(),
    CardActions = function() {
        var e = $(".card"),
            t = ".card-product-actions";
        e.length && $(t).length && (e.on({
            mouseenter: function() {
                var e, a, n;
                e = $(this), a = e.find(t), n = a.data("animation-in"), a.length && (a.addClass("in animated " + n), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    a.removeClass("animated " + n)
                }))
            }
        }), e.on({
            mouseleave: function() {
                var e, a, n;
                e = $(this), a = e.find(t), n = a.data("animation-out"), a.length && (a.addClass("animated " + n), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    a.removeClass("in animated " + n)
                }))
            }
        }))
    }(),
    Dropdown = function() {
        var e = $(".dropdown-animate"),
            t = $('.dropdown-submenu [data-toggle="dropdown"]');
        e.length && e.on({
            "hide.bs.dropdown": function() {}
        }), t.length && t.on("click", function(e) {
            return function(e) {
                e.next().hasClass("show") || e.parents(".dropdown-menu").first().find(".show").removeClass("show");
                var t = e.next(".dropdown-menu");
                t.toggleClass("show"), t.parent().toggleClass("show"), e.parents(".nav-item.dropdown.show").on("hidden.bs.dropdown", function(e) {
                    $(".dropdown-submenu .show").removeClass("show")
                })
            }($(this)), !1
        })
    }(),
    FormControl = function() {
        var e = $(".form-control"),
            t = $('[data-toggle="indeterminate"]');
        e.length && e.on("focus blur", function(e) {
            $(this).parents(".form-group").toggleClass("focused", "focus" === e.type)
        }).trigger("blur"), t.length && t.each(function() {
            $(this).prop("indeterminate", !0)
        })
    }(),
    CustomInputFile = function() {
        var e = $(".custom-input-file");
        e.length && e.each(function() {
            var e = $(this);
            e.on("change", function(t) {
                ! function(e, t, a) {
                    var n, o = e.next("label"),
                        i = o.html();
                    t && t.files.length > 1 ? n = (t.getAttribute("data-multiple-caption") || "").replace("{count}", t.files.length) : a.target.value && (n = a.target.value.split("\\").pop()), n ? o.find("span").html(n) : o.html(i)
                }(e, this, t)
            }), e.on("focus", function() {
                ! function(e) {
                    e.addClass("has-focus")
                }(e)
            }).on("blur", function() {
                ! function(e) {
                    e.removeClass("has-focus")
                }(e)
            })
        })
    }(),
    NavbarVertical = function() {
        var e = $(".navbar-vertical .navbar-nav, .navbar-vertical .navbar-nav .nav"),
            t = $(".navbar-vertical .collapse"),
            a = $(".navbar-vertical .dropdown");
        t.on({
            "show.bs.collapse": function() {
                var a;
                (a = $(this)).closest(e).find(t).not(a).collapse("hide")
            }
        }), a.on({
            "hide.bs.dropdown": function() {
                var e, t;
                e = $(this), (t = e.find(".dropdown-menu")).addClass("close"), setTimeout(function() {
                    t.removeClass("close")
                }, 200)
            }
        })
    }(),
    NavbarCollapse = function() {
        var e = $("#navbar-main"),
            t = $("#navbar-main-collapse"),
            a = $("#navbar-top-main");
        t.length && (t.on({
            "show.bs.collapse": function() {
                e.addClass("navbar-collapsed"), a.addClass("navbar-collapsed"), $("#header-main").addClass("header-collapse-show"), $("body").addClass("modal-open")
            }
        }), t.on({
            "hide.bs.collapse": function() {
                t.removeClass("collapsing").addClass("collapsing-out"), e.removeClass("navbar-collapsed").addClass("navbar-collapsed-out"), a.removeClass("navbar-collapsed").addClass("navbar-collapsed-out")
            }
        }), t.on({
            "hidden.bs.collapse": function() {
                t.removeClass("collapsing-out"), e.removeClass("navbar-collapsed-out"), a.removeClass("navbar-collapsed-out"), $("#header-main").removeClass("header-collapse-show"), $("body").removeClass("modal-open")
            }
        }))
    }(),
    NavbarSticky = function() {
        var e = $(".navbar-sticky");

        function t(e) {
            $(window).scrollTop() > a + 200 ? e.addClass("sticky") : e.removeClass("sticky")
        }
        if (e.length) {
            var a = e.offset().top;
            t(e), $(window).on({
                scroll: function() {
                    t(e)
                }
            })
        }
    }(),
    NegativeMargin = function() {
        var e = $("[data-negative-margin]");
        $(window).on({
            "load resize": function() {
                e.length && e.each(function() {
                    var e, t;
                    e = $(this), t = e.find($(e.data("negative-margin"))).height(), console.log(t), $(window).width() > 991 ? e.css({
                        "margin-top": "-" + t + "px"
                    }) : e.css({
                        "margin-top": "0"
                    })
                })
            }
        })
    }(),
    PasswordText = function() {
        var e = $('[data-toggle="password-text"]');
        e.length && e.on("click", function(e) {
            var t, a;
            t = $(this), "password" == (a = $(t.data("target"))).attr("type") ? a.attr("type", "text") : a.attr("type", "password")
        })
    }(),
    Pricing = function() {
        var e = $(".pricing-container"),
            t = $(".pricing-container button[data-pricing]");
        e.length && t.on({
            click: function() {
                ! function(e) {
                    e.data("pricing");
                    var t = e.parents(".pricing-container"),
                        a = $("." + t.attr("class") + " [data-pricing-value]");
                    e.hasClass("active") || ($("." + t.attr("class") + " button[data-pricing]").removeClass("active"), e.addClass("active"), a.each(function() {
                        var e = $(this).data("pricing-value"),
                            t = $(this).find("span.price").text();
                        $(this).find("span.price").text(e), $(this).data("pricing-value", t)
                    }))
                }($(this))
            }
        })
    }(),
    ScrollTo = function() {
        var e = $(".scroll-me, [data-scroll-to], .toc-entry a"),
            t = window.location.hash;

        function a(e) {
            var t = e.attr("href"),
                a = e.data("scroll-to-offset") ? e.data("scroll-to-offset") : 0,
                n = {
                    scrollTop: $(t).offset().top - a
                };
            $("html, body").stop(!0, !0).animate(n, 300), event.preventDefault()
        }
        e.length && e.on("click", function(e) {
            a($(this))
        }), $(window).on("load", function() {
            var e;
            t && "#!" != t && $(t).length && (e = t, $("html, body").animate({
                scrollTop: $(e).offset().top
            }, "slow"))
        })
    }(),
    SendEmail = function() {
        var e = $("#form-contact");

        function t(e, t, a, n, o, i) {
            $.notify({
                icon: a,
                title: " Bootstrap Notify",
                message: "Turning standard Bootstrap alerts into awesome notifications",
                url: ""
            }, {
                element: "body",
                type: n,
                allow_dismiss: !0,
                placement: {
                    from: e,
                    align: t
                },
                offset: {
                    x: 15,
                    y: 15
                },
                spacing: 10,
                z_index: 1080,
                delay: 2500,
                timer: 25e3,
                url_target: "_blank",
                mouse_over: !1,
                animate: {
                    enter: o,
                    exit: i
                },
                template: '<div class="alert alert-{0} alert-icon alert-group alert-notify" data-notify="container" role="alert"><div class="alert-group-prepend align-self-start"><span class="alert-group-icon"><i data-notify="icon"></i></span></div><div class="alert-content"><strong data-notify="title">{1}</strong><div data-notify="message">{2}</div></div><button type="button" class="close" data-notify="dismiss" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            })
        }
        e.length && e.on("submit", function(e) {
            return function(e, a) {
                var n = e.find('button[type="submit"]').text();
                if (a.isDefaultPrevented());
                else {
                    var o = e.serialize();
                    console.log(o);
                    var i = $.ajax({
                        type: "POST",
                        url: e.data("process"),
                        data: o,
                        dataType: "json"
                    });
                    e.find('button[type="submit"]').text("Sending..."), i.done(function(a, o) {
                        var i = a.status;
                        t(a.notify_title, a.notify_message, a.notify_type), "success" == i && (e.find(".btn-reset").trigger("click"), grecaptcha.reset()), e.find('button[type="submit"]').text("Message sent!"), setTimeout(function() {
                            e.find('button[type="submit"]').text(n)
                        }, 3e3)
                    }), i.fail(function(a, o) {
                        a.status, t(a.notify_title, a.responseText, "danger"), e.find('button[type="submit"]').text("Error!"), setTimeout(function() {
                            e.find('button[type="submit"]').text(n)
                        }, 3e3)
                    })
                }
            }($(this), e), !1
        })
    }(),
    Shape = function() {
        var e = $(".shape-container");
        $(window).on({
            "load resize": function() {
                e.length && e.each(function() {
                    var e, t;
                    e = $(this), t = e.find("svg").height(), e.css({
                        height: t + "px"
                    })
                })
            }
        })
    }(),
    Spotlight = function() {
        var e = $("[data-spotlight]");
        $(window).on({
            "load resize": function() {
                e.length && e.each(function() {
                    ! function(e) {
                        var t;
                        if ("fullscreen" == e.data("spotlight")) {
                            if (e.data("spotlight-offset")) {
                                var a = $("body").find(e.data("spotlight-offset")).height();
                                t = $(window).height() - a
                            } else t = $(window).height();
                            $(window).width() > 991 ? e.find(".spotlight-holder").css({
                                height: t + "px"
                            }) : e.find(".spotlight-holder").css({
                                height: "auto"
                            })
                        }
                        e.imagesLoaded().done(function(t) {
                            e.find(".animated").each(function() {
                                var e = $(this);
                                if (!e.hasClass("animation-ended")) {
                                    var t = e.data("animation-in"),
                                        a = (e.data("animation-out"), e.data("animation-delay"));
                                    setTimeout(function() {
                                        e.addClass("animation-ended " + t, 100).on("webkitAnimationEnd animationend", function() {
                                            e.removeClass(t)
                                        })
                                    }, a)
                                }
                            })
                        })
                    }($(this))
                })
            }
        })
    }(),
    GoogleMapCustom = function() {
        var e, t, a, n = document.getElementById("map-custom");
        void 0 !== n && null != n && google.maps.event.addDomListener(window, "load", function(n) {
            e = n.getAttribute("data-lat"), t = n.getAttribute("data-lng"), a = n.getAttribute("data-color");
            var o = new google.maps.LatLng(e, t),
                i = {
                    zoom: 12,
                    scrollwheel: !1,
                    center: o,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: [{
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#444444"
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "all",
                        stylers: [{
                            color: "#f2f2f2"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "all",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 45
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "all",
                        stylers: [{
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "all",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "all",
                        stylers: [{
                            color: a
                        }, {
                            visibility: "on"
                        }]
                    }]
                };
            n = new google.maps.Map(n, i);
            var s = new google.maps.Marker({
                    position: o,
                    map: n,
                    animation: google.maps.Animation.DROP,
                    title: "Hello World!"
                }),
                r = new google.maps.InfoWindow({
                    content: '<div class="info-window-content"><h2>{{ site.product.name }} {{ site.product.name_long }}</h2><p>{{ site.product.description }}</p></div>'
                });
            google.maps.event.addListener(s, "click", function() {
                r.open(n, s)
            })
        }(n))
    }(),
    GoogleMap = function() {
        var e, t, a = document.getElementById("map-default");
        void 0 !== a && null != a && google.maps.event.addDomListener(window, "load", function(a) {
            e = a.getAttribute("data-lat"), t = a.getAttribute("data-lng");
            var n = new google.maps.LatLng(e, t),
                o = {
                    zoom: 12,
                    scrollwheel: !1,
                    center: n,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
            a = new google.maps.Map(a, o);
            var i = new google.maps.Marker({
                    position: n,
                    map: a,
                    animation: google.maps.Animation.DROP,
                    title: "Hello World!"
                }),
                s = new google.maps.InfoWindow({
                    content: '<div class="info-window-content"><h2>{{ site.product.name }} {{ site.product.name_long }}</h2><p>{{ site.product.description }}</p></div>'
                });
            google.maps.event.addListener(i, "click", function() {
                s.open(a, i)
            })
        }(a))
    }(),
    TextareaAutosize = function() {
        var e = $('[data-toggle="autosize"]');
        e.length && autosize(e)
    }();
if ($('[data-toggle="widget-calendar"]')[0]) {
    $('[data-toggle="widget-calendar"]').fullCalendar({
        contentHeight: "auto",
        theme: !1,
        buttonIcons: {
            prev: " fas fa-angle-left",
            next: " fas fa-angle-right"
        },
        header: {
            right: "next",
            center: "title, ",
            left: "prev"
        },
        defaultDate: "2018-12-01",
        editable: !0,
        events: [{
            title: "Call with Dave",
            start: "2018-11-18",
            end: "2018-11-18",
            className: "bg-danger"
        }, {
            title: "Lunch meeting",
            start: "2018-11-21",
            end: "2018-11-22",
            className: "bg-warning"
        }, {
            title: "All day conference",
            start: "2018-11-29",
            end: "2018-11-29",
            className: "bg-success"
        }, {
            title: "Meeting with Mary",
            start: "2018-12-01",
            end: "2018-12-01",
            className: "bg-info"
        }, {
            title: "Winter Hackaton",
            start: "2018-12-03",
            end: "2018-12-03",
            className: "bg-danger"
        }, {
            title: "Digital event",
            start: "2018-12-07",
            end: "2018-12-09",
            className: "bg-warning"
        }, {
            title: "Marketing event",
            start: "2018-12-10",
            end: "2018-12-10",
            className: "bg-primary"
        }, {
            title: "Dinner with Family",
            start: "2018-12-19",
            end: "2018-12-19",
            className: "bg-danger"
        }, {
            title: "Black Friday",
            start: "2018-12-23",
            end: "2018-12-23",
            className: "bg-info"
        }, {
            title: "Cyber Week",
            start: "2018-12-02",
            end: "2018-12-02",
            className: "bg-warning"
        }]
    });
    var mYear = moment().format("YYYY"),
        mDay = moment().format("dddd, MMM D");
    $(".widget-calendar-year").html(mYear), $(".widget-calendar-day").html(mDay)
}
var Countdown = function() {
    var e = $(".countdown");
    e.length && e.each(function() {
        var e, t;
        e = $(this), t = e.data("countdown-date"), e.countdown(t).on("update.countdown", function(e) {
            $(this).html(e.strftime('<div class="countdown-item"><span class="countdown-digit">%-D</span><span class="countdown-label countdown-days">day%!D</span></div><div class="countdown-item"><span class="countdown-digit">%H</span><span class="countdown-separator">:</span><span class="countdown-label">hours</span></div><div class="countdown-item"><span class="countdown-digit">%M</span><span class="countdown-separator">:</span><span class="countdown-label">minutes</span></div><div class="countdown-item"><span class="countdown-digit">%S</span><span class="countdown-label">seconds</span></div>'))
        })
    })
}();
! function(e) {
    e.fn.countTo = function(t) {
        return t = t || {}, e(this).each(function() {
            var a = e.extend({}, e.fn.countTo.defaults, {
                    from: e(this).data("from"),
                    to: e(this).data("to"),
                    speed: e(this).data("speed"),
                    refreshInterval: e(this).data("refresh-interval"),
                    decimals: e(this).data("decimals")
                }, t),
                n = Math.ceil(a.speed / a.refreshInterval),
                o = (a.to - a.from) / n,
                i = this,
                s = e(this),
                r = 0,
                l = a.from,
                d = s.data("countTo") || {};

            function c(e) {
                var t = a.formatter.call(i, e, a);
                s.text(t)
            }
            s.data("countTo", d), d.interval && clearInterval(d.interval), d.interval = setInterval(function() {
                r++, c(l += o), "function" == typeof a.onUpdate && a.onUpdate.call(i, l), r >= n && (s.removeData("countTo"), clearInterval(d.interval), l = a.to, "function" == typeof a.onComplete && a.onComplete.call(i, l))
            }, a.refreshInterval), c(l)
        })
    }, e.fn.countTo.defaults = {
        from: 0,
        to: 0,
        speed: 1e3,
        refreshInterval: 100,
        decimals: 0,
        formatter: function(e, t) {
            return e.toFixed(t.decimals)
        },
        onUpdate: null,
        onComplete: null
    }
}(jQuery);
var Counter = function() {
        var e, t = ".counter",
            a = $(t);
        a.length && (e = a, inView(t).on("enter", function() {
            e.hasClass("counting-finished") || e.countTo({
                formatter: function(e, t) {
                    return e.toFixed(t.decimals)
                },
                onUpdate: function(e) {},
                onComplete: function(e) {
                    $(this).addClass("counting-finished")
                }
            })
        }))
    }(),
    Datepicker = function() {
        var e = $('[data-toggle="date"]'),
            t = $('[data-toggle="datetime"]'),
            a = $('[data-toggle="time"]');
        e.length && e.each(function() {
            $(this).flatpickr({
                enableTime: !1,
                allowInput: !0
            })
        }), t.length && t.each(function() {
            $(this).flatpickr({
                enableTime: !0,
                allowInput: !0
            })
        }), a.length && a.each(function() {
            $(this).flatpickr({
                noCalendar: !0,
                enableTime: !0,
                allowInput: !0
            })
        })
    }();
! function(e) {
    var t = function() {
        this.$body = e("body")
    };
    t.prototype.init = function() {
        e('[data-toggle="dragula"]').each(function() {
            var t = e(this).data("containers"),
                a = [];
            if (t)
                for (var n = 0; n < t.length; n++) a.push(e("#" + t[n])[0]);
            else a = [e(this)[0]];
            var o = e(this).data("handle-class");
            o ? dragula(a, {
                moves: function(e, t, a) {
                    return a.classList.contains(o)
                }
            }) : dragula(a)
        })
    }, e.Dragula = new t, e.Dragula.Constructor = t
}(window.jQuery), window.jQuery.Dragula.init();
var Dropzones = function() {
        var e = $('[data-toggle="dropzone"]'),
            t = $(".dz-preview");
        e.length && (Dropzone.autoDiscover = !1, e.each(function() {
            var e, a, n, o, i;
            e = $(this), a = void 0 !== e.data("dropzone-multiple"), n = e.find(t), o = void 0, i = {
                url: e.data("dropzone-url"),
                thumbnailWidth: null,
                thumbnailHeight: null,
                previewsContainer: n.get(0),
                previewTemplate: n.html(),
                maxFiles: a ? null : 1,
                acceptedFiles: a ? null : "image/*",
                init: function() {
                    this.on("addedfile", function(e) {
                        !a && o && this.removeFile(o), o = e
                    })
                }
            }, n.html(""), e.dropzone(i)
        }))
    }(),
    Fullcalendar = function() {
        var e, t, a = $('[data-toggle="calendar"]');
        a.length && (t = {
            header: {
                right: "",
                center: "",
                left: ""
            },
            buttonIcons: {
                prev: "calendar--prev",
                next: "calendar--next"
            },
            theme: !1,
            selectable: !0,
            selectHelper: !0,
            editable: !0,
            events: [{
                id: 1,
                title: "Call with Dave",
                start: "2019-04-18",
                allDay: !0,
                className: "bg-danger",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 2,
                title: "Lunch meeting",
                start: "2019-04-21",
                allDay: !0,
                className: "bg-warning",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 3,
                title: "All day conference",
                start: "2019-04-29",
                allDay: !0,
                className: "bg-success",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 4,
                title: "Meeting with Mary",
                start: "2019-05-01",
                allDay: !0,
                className: "bg-info",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 5,
                title: "Winter Hackaton",
                start: "2019-05-03",
                allDay: !0,
                className: "bg-danger",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 6,
                title: "Digital event",
                start: "2019-05-07",
                allDay: !0,
                className: "bg-warning",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 7,
                title: "Marketing event",
                start: "2019-05-10",
                allDay: !0,
                className: "bg-primary",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 8,
                title: "Dinner with Family",
                start: "2019-05-19",
                allDay: !0,
                className: "bg-danger",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 9,
                title: "Black Friday",
                start: "2019-05-23",
                allDay: !0,
                className: "bg-info",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }, {
                id: 10,
                title: "Cyber Week",
                start: "2019-05-02",
                allDay: !0,
                className: "bg-yellow",
                description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
            }],
            dayClick: function(e) {
                var t = moment(e).toISOString();
                $("#new-event").modal("show"), $(".new-event--title").val(""), $(".new-event--start").val(t), $(".new-event--end").val(t)
            },
            viewRender: function(t) {
                e.fullCalendar("getDate").month(), $(".fullcalendar-title").html(t.title)
            },
            eventClick: function(e, t) {
                $("#edit-event input[value=" + e.className + "]").prop("checked", !0), $("#edit-event").modal("show"), $(".edit-event--id").val(e.id), $(".edit-event--title").val(e.title), $(".edit-event--description").val(e.description)
            }
        }, (e = a).fullCalendar(t), $("body").on("click", ".new-event--add", function() {
            var t = $(".new-event--title").val(),
                a = {
                    Stored: [],
                    Job: function() {
                        var e = Date.now().toString().substr(6);
                        return this.Check(e) ? this.Job() : (this.Stored.push(e), e)
                    },
                    Check: function(e) {
                        for (var t = 0; t < this.Stored.length; t++)
                            if (this.Stored[t] == e) return !0;
                        return !1
                    }
                };
            "" != t ? (e.fullCalendar("renderEvent", {
                id: a.Job(),
                title: t,
                start: $(".new-event--start").val(),
                end: $(".new-event--end").val(),
                allDay: !0,
                className: $(".event-tag input:checked").val()
            }, !0), $(".new-event--form")[0].reset(), $(".new-event--title").closest(".form-group").removeClass("has-danger"), $("#new-event").modal("hide")) : ($(".new-event--title").closest(".form-group").addClass("has-danger"), $(".new-event--title").focus())
        }), $("body").on("click", "[data-calendar]", function() {
            var t = $(this).data("calendar"),
                a = $(".edit-event--id").val(),
                n = $(".edit-event--title").val(),
                o = $(".edit-event--description").val(),
                i = $("#edit-event .event-tag input:checked").val(),
                s = e.fullCalendar("clientEvents", a);
            "update" === t && ("" != n ? (s[0].title = n, s[0].description = o, s[0].className = [i], console.log(i), e.fullCalendar("updateEvent", s[0]), $("#edit-event").modal("hide")) : ($(".edit-event--title").closest(".form-group").addClass("has-error"), $(".edit-event--title").focus())), "delete" === t && ($("#edit-event").modal("hide"), setTimeout(function() {
                swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    type: "warning",
                    showCancelButton: !0,
                    buttonsStyling: !1,
                    confirmButtonClass: "btn btn-danger",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonClass: "btn btn-secondary"
                }).then(function(t) {
                    t.value && (e.fullCalendar("removeEvents", a), swal({
                        title: "Deleted!",
                        text: "The event has been deleted.",
                        type: "success",
                        buttonsStyling: !1,
                        confirmButtonClass: "btn btn-primary"
                    }))
                })
            }, 200))
        }), $("body").on("click", "[data-calendar-view]", function(t) {
            t.preventDefault(), $("[data-calendar-view]").removeClass("active"), $(this).addClass("active");
            var a = $(this).attr("data-calendar-view");
            e.fullCalendar("changeView", a)
        }), $("body").on("click", ".fullcalendar-btn-next", function(t) {
            t.preventDefault(), e.fullCalendar("next")
        }), $("body").on("click", ".fullcalendar-btn-prev", function(t) {
            t.preventDefault(), e.fullCalendar("prev")
        }))
    }(),
    Highlight = function() {
        $(".highlight").each(function(e, t) {
            ! function(e, t) {
                $(t).before('<button class="action-item btn-clipboard" title="Copy to clipboard"><i class="far fa-copy mr-2"></i>Copy</button>'), $(".btn-clipboard").tooltip().on("mouseleave", function() {
                    $(this).tooltip("hide")
                });
                var a = new ClipboardJS(".btn-clipboard", {
                    target: function(e) {
                        return e.nextElementSibling
                    }
                });
                a.on("success", function(e) {
                    $(e.trigger).attr("title", "Copied!").tooltip("_fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("_fixTitle"), e.clearSelection()
                }), a.on("error", function(e) {
                    var t = "Press " + (/Mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl-") + "C to copy";
                    $(e.trigger).attr("title", t).tooltip("_fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("_fixTitle")
                }), hljs.highlightBlock(t)
            }(0, t)
        })
    }(),
    SortList = function() {
        var e = $('[data-toggle="list"]'),
            t = $("[data-sort]");
        e.length && e.each(function() {
            var e;
            e = $(this), new List(e.get(0), function(e) {
                return {
                    valueNames: e.data("list-values"),
                    listClass: e.data("list-class") ? e.data("list-class") : "list"
                }
            }(e))
        }), t.on("click", function() {
            return !1
        })
    }(),
    Masonry = function() {
        var e = $(".masonry-container");
        e.length && e.each(function() {
            var e, t, a, n, o, i;
            e = $(this), t = e.find(".masonry"), a = e.find(".masonry-filter-menu"), n = a.find(".active"), o = n.data("filter"), i = t.imagesLoaded(function() {
                null != o && "" != o && ("*" != o && (o = "." + o), n.addClass("active"));
                var e = {
                    itemSelector: ".masonry-item",
                    filter: o
                };
                i.isotope(e)
            }), a.on("click", "a", function(e) {
                e.preventDefault();
                var t = $(this),
                    n = $(this).attr("data-filter");
                n = "*" == n ? "" : "." + n, i.isotope({
                    filter: n
                }).on("arrangeComplete", function() {
                    a.find("[data-filter]").removeClass("active"), t.addClass("active")
                })
            })
        })
    }(),
    Notify = function() {
        var e = $('[data-toggle="notify"]');
        e.length && e.on("click", function(e) {
            e.preventDefault(),
                function(e, t, a, n, o, i) {
                    $.notify({
                        icon: a,
                        title: " Bootstrap Notify",
                        message: "Turning standard Bootstrap alerts into awesome notifications",
                        url: ""
                    }, {
                        element: "body",
                        type: n,
                        allow_dismiss: !0,
                        placement: {
                            from: e,
                            align: t
                        },
                        offset: {
                            x: 15,
                            y: 15
                        },
                        spacing: 10,
                        z_index: 1080,
                        delay: 2500,
                        timer: 25e3,
                        url_target: "_blank",
                        mouse_over: !1,
                        animate: {
                            enter: o,
                            exit: i
                        },
                        template: '<div class="alert alert-{0} alert-icon alert-group alert-notify" data-notify="container" role="alert"><div class="alert-group-prepend align-self-start"><span class="alert-group-icon"><i data-notify="icon"></i></span></div><div class="alert-content"><strong data-notify="title">{1}</strong><div data-notify="message">{2}</div></div><button type="button" class="close" data-notify="dismiss" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
                    })
                }($(this).attr("data-placement"), $(this).attr("data-align"), $(this).attr("data-icon"), $(this).attr("data-type"), $(this).attr("data-animation-in"), $(this).attr("data-animation-out"))
        })
    }(),
    SingleSlider = function() {
        var e = $(".input-slider-container");
        e.length && e.each(function() {
            var e, t, a, n, o, i, s, r, l, d, c;
            e = $(this), t = e.find(".input-slider"), a = t.attr("id"), n = t.data("range-value-min"), o = t.data("range-value-max"), i = e.find(".range-slider-value"), s = i.attr("id"), r = i.data("range-value-low"), l = document.getElementById(a), d = document.getElementById(s), c = {
                start: [parseInt(r)],
                connect: [!0, !1],
                range: {
                    min: [parseInt(n)],
                    max: [parseInt(o)]
                }
            }, noUiSlider.create(l, c), l.noUiSlider.on("update", function(e, t) {
                d.textContent = e[t]
            })
        })
    }(),
    RangeSlider = function() {
        var e = $("#input-slider-range");
        e.length && e.each(function() {
            var e, t, a, n;
            $(this), e = document.getElementById("input-slider-range"), t = document.getElementById("input-slider-range-value-low"), a = document.getElementById("input-slider-range-value-high"), n = [t, a], noUiSlider.create(e, {
                start: [parseInt(t.getAttribute("data-range-value-low")), parseInt(a.getAttribute("data-range-value-high"))],
                connect: !0,
                range: {
                    min: parseInt(e.getAttribute("data-range-value-min")),
                    max: parseInt(e.getAttribute("data-range-value-max"))
                }
            }), e.noUiSlider.on("update", function(e, t) {
                n[t].textContent = e[t]
            })
        })
    }(),
    ProgressCircle = (Popover = function() {
        var e = $('[data-toggle="popover"]'),
            t = "";
        e.length && e.each(function() {
            ! function(e) {
                e.data("color") && (t = "popover-" + e.data("color"));
                var a = {
                    template: '<div class="popover ' + t + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
                };
                e.popover(a)
            }($(this))
        })
    }(), function() {
        var e = $(".progress-circle");
        e.length && e.each(function() {
            var e, t, a, n, o, i;
            e = $(this), t = e.data().progress, a = e.data().text ? e.data().text : "", n = e.data().textclass ? e.data().textclass : "progressbar-text", o = e.data().color ? e.data().color : "primary", i = {
                color: PurposeStyle.colors.theme[o],
                strokeWidth: 7,
                trailWidth: 2,
                text: {
                    value: a,
                    className: n
                },
                svgStyle: {
                    display: "block"
                },
                duration: 1500,
                easing: "easeInOut"
            }, new ProgressBar.Circle(e[0], i).animate(t / 100)
        })
    }()),
    QuillEditor = function() {
        var e = $('[data-toggle="quill"]');
        e.length && e.each(function() {
            var e, t;
            e = $(this), t = e.data("quill-placeholder"), new Quill(e.get(0), {
                modules: {
                    toolbar: [
                        ["bold", "italic"],
                        ["link", "blockquote", "code", "image"],
                        [{
                            list: "ordered"
                        }, {
                            list: "bullet"
                        }]
                    ]
                },
                placeholder: t,
                theme: "snow"
            })
        })
    }(),
    Scrollbar = function() {
        var e = $(".scrollbar-inner");
        e.length && e.scrollbar().scrollLock()
    }(),
    Select = function() {
        var e = $('[data-toggle="select"]');
        e.length && e.each(function() {
            $(this).select2({})
        })
    }(),
    Sticky = function() {
        var e = $('[data-toggle="sticky"]');
        $(window).on("load resize", function() {
            e.length && e.each(function() {
                var e, t;
                e = $(this), t = {
                    offset_top: e.data("sticky-offset") ? e.data("sticky-offset") : 0
                }, $(window).width() > 1e3 ? e.stick_in_parent(t) : e.trigger("sticky_kit:detach")
            })
        })
    }(),
    SvgInjector = function() {
        var e = document.querySelectorAll("img.svg-inject");
        e.length && SVGInjector(e)
    }(),
    WpxSwiper = function() {
        var e = $(".swiper-js-container");
        $(document).ready(function() {
            e.length && e.each(function(e, t) {
                var a, n, o, i, s, r, l, d, c, u, p, g, f, h, m, v, y, b, w, C, k, x;
                a = $(t), n = a.find(".swiper-container"), o = a.find(".swiper-pagination"), i = a.find(".swiper-button-next"), s = a.find(".swiper-button-prev"), r = n.data("swiper-effect") ? n.data("swiper-effect") : "slide", l = n.data("swiper-direction") ? n.data("swiper-direction") : "horizontal", d = n.data("swiper-initial-slide") ? n.data("swiper-initial-slide") : 0, c = !!n.data("swiper-autoheight") && n.data("swiper-autoheight"), u = !!n.data("swiper-autoplay") && n.data("swiper-autoplay"), p = !!n.data("swiper-centered-slides") && n.data("swiper-centered-slides"), g = n.data("swiper-pagination-type") ? n.data("swiper-pagination-type") : "bullets", f = n.data("swiper-items"), h = n.data("swiper-sm-items"), m = n.data("swiper-md-items"), v = n.data("swiper-lg-items"), y = n.data("swiper-xl-items"), b = n.data("swiper-space-between"), w = n.data("swiper-sm-space-between"), C = n.data("swiper-md-space-between"), k = n.data("swiper-lg-space-between"), x = n.data("swiper-xl-space-between"), f = f || 1, h = h || f, m = m || h, v = v || m, y = y || v, b = b || 0, w = w || b, C = C || w, k = k || C, x = x || k, new Swiper(n, {
                    pagination: {
                        el: o,
                        clickable: !0,
                        type: g
                    },
                    navigation: {
                        nextEl: i,
                        prevEl: s
                    },
                    slidesPerView: f,
                    spaceBetween: b,
                    initialSlide: d,
                    autoHeight: c,
                    centeredSlides: p,
                    mousewheel: !1,
                    keyboard: {
                        enabled: !0,
                        onlyInViewport: !1
                    },
                    grabCursor: !0,
                    autoplay: u,
                    effect: r,
                    coverflowEffect: {
                        rotate: 10,
                        stretch: 0,
                        depth: 50,
                        modifier: 3,
                        slideShadows: !1
                    },
                    speed: 800,
                    direction: l,
                    preventClicks: !0,
                    preventClicksPropagation: !0,
                    observer: !0,
                    observeParents: !0,
                    breakpointsInverse: !0,
                    breakpoints: {
                        575: {
                            slidesPerView: h,
                            spaceBetweenSlides: w
                        },
                        767: {
                            slidesPerView: m,
                            spaceBetweenSlides: C
                        },
                        991: {
                            slidesPerView: v,
                            spaceBetweenSlides: k
                        },
                        1199: {
                            slidesPerView: y,
                            spaceBetweenSlides: x
                        }
                    }
                })
            })
        })
    }(),
    Tags = function() {
        var e = $('[data-toggle="tags"]');
        e.length && e.each(function() {
            $(this).tagsinput({
                tagClass: "badge badge-primary"
            })
        })
    }(),
    Typed = function() {
        var e = $(".typed");
        e.length && e.each(function() {
            var e, t, a, n;
            e = $(this), t = "#" + e.attr("id"), a = (a = e.data("type-this")).split(","), n = new Typed(t, {
                strings: a,
                typeSpeed: 100,
                backSpeed: 70,
                loop: !0
            }), inView(t).on("enter", function() {
                n.start()
            }).on("exit", function() {
                n.stop()
            })
        })
    }(),
    Wavify = function() {
        var e = $('[data-toggle="wavify"]');
        e.length && e.each(function() {
            $(this).find("path").wavify({
                height: 50,
                bones: 5,
                amplitude: 40,
                speed: .15
            })
        })
    }(),
    EngagementChart = function() {
        var e = $("#apex-engagement");
        e.length && e.each(function() {
            ! function(e) {
                var t = {
                        chart: {
                            width: "100%",
                            zoom: {
                                enabled: !1
                            },
                            toolbar: {
                                show: !1
                            },
                            shadow: {
                                enabled: !1
                            }
                        },
                        stroke: {
                            width: 7,
                            curve: "smooth"
                        },
                        series: [{
                            name: "Likes",
                            data: [4, 3, 10, 9, 29, 19, 22, 9]
                        }],
                        xaxis: {
                            labels: {
                                format: "MMM",
                                style: {
                                    colors: PurposeStyle.colors.gray[600],
                                    fontSize: "14px",
                                    fontFamily: PurposeStyle.fonts.base,
                                    cssClass: "apexcharts-xaxis-label"
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            },
                            type: "datetime",
                            categories: ["1/11/2000", "2/11/2000", "3/11/2000", "4/11/2000", "5/11/2000", "6/11/2000", "7/11/2000", "8/11/2000"]
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    color: PurposeStyle.colors.gray[600],
                                    fontSize: "12px",
                                    fontFamily: PurposeStyle.fonts.base
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            }
                        },
                        fill: {
                            type: "solid"
                        },
                        markers: {
                            size: 4,
                            opacity: .7,
                            strokeColor: "#fff",
                            strokeWidth: 3,
                            hover: {
                                size: 7
                            }
                        },
                        grid: {
                            borderColor: PurposeStyle.colors.gray[300],
                            strokeDashArray: 5
                        },
                        dataLabels: {
                            enabled: !1
                        }
                    },
                    a = (e.data().dataset, e.data().labels, e.data().color),
                    n = e.data().height,
                    o = e.data().type;
                t.colors = [PurposeStyle.colors.theme[a]], t.markers.colors = [PurposeStyle.colors.theme[a]], t.chart.height = n || 350, t.chart.type = o || "line";
                var i = new ApexCharts(e[0], t);
                setTimeout(function() {
                    i.render()
                }, 300)
            }($(this))
        })
    }(),
    LineChart = function() {
        var e = $("#apex-line");
        e.length && e.each(function() {
            ! function(e) {
                var t = {
                        chart: {
                            zoom: {
                                enabled: !1
                            },
                            toolbar: {
                                show: !1
                            },
                            shadow: {
                                enabled: !1
                            }
                        },
                        stroke: {
                            width: 7,
                            curve: "smooth"
                        },
                        series: [{
                            name: "Likes",
                            data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9]
                        }],
                        xaxis: {
                            labels: {
                                format: "MMM",
                                style: {
                                    colors: PurposeStyle.colors.gray[600],
                                    fontSize: "14px",
                                    fontFamily: PurposeStyle.fonts.base,
                                    cssClass: "apexcharts-xaxis-label"
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            },
                            type: "datetime",
                            categories: ["1/11/2000", "2/11/2000", "3/11/2000", "4/11/2000", "5/11/2000", "6/11/2000", "7/11/2000", "8/11/2000", "9/11/2000", "10/11/2000", "11/11/2000", "12/11/2000", "1/11/2001", "2/11/2001"]
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    color: PurposeStyle.colors.gray[600],
                                    fontSize: "12px",
                                    fontFamily: PurposeStyle.fonts.base
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            }
                        },
                        fill: {
                            type: "solid"
                        },
                        markers: {
                            size: 4,
                            opacity: .7,
                            strokeColor: "#fff",
                            strokeWidth: 3,
                            hover: {
                                size: 7
                            }
                        },
                        grid: {
                            borderColor: PurposeStyle.colors.gray[300],
                            strokeDashArray: 5
                        },
                        dataLabels: {
                            enabled: !1
                        }
                    },
                    a = (e.data().dataset, e.data().labels, e.data().color),
                    n = e.data().height,
                    o = e.data().type;
                t.colors = [PurposeStyle.colors.theme[a]], t.markers.colors = [PurposeStyle.colors.theme[a]], t.chart.height = n || 350, t.chart.type = o || "line";
                var i = new ApexCharts(e[0], t);
                setTimeout(function() {
                    i.render()
                }, 300)
            }($(this))
        })
    }(),
    SparkChart = function() {
        var e = $('[data-toggle="spark-chart"]');
        e.length && e.each(function() {
            ! function(e) {
                var t = {
                        chart: {
                            width: "100%",
                            sparkline: {
                                enabled: !0
                            }
                        },
                        series: [],
                        labels: [],
                        stroke: {
                            width: 2,
                            curve: "smooth"
                        },
                        markers: {
                            size: 0
                        },
                        colors: [],
                        tooltip: {
                            fixed: {
                                enabled: !1
                            },
                            x: {
                                show: !1
                            },
                            y: {
                                title: {
                                    formatter: function(e) {
                                        return ""
                                    }
                                }
                            },
                            marker: {
                                show: !1
                            }
                        }
                    },
                    a = e.data().dataset,
                    n = e.data().labels,
                    o = e.data().color,
                    i = e.data().height,
                    s = e.data().type;
                t.series = [{
                    data: a
                }], n && (t.labels = [n]), t.colors = [PurposeStyle.colors.theme[o]], t.chart.height = i || 35, t.chart.type = s || "line";
                var r = new ApexCharts(e[0], t);
                setTimeout(function() {
                    r.render()
                }, 300)
            }($(this))
        })
    }(),
    WorkedHoursChart = function() {
        var e = $("#apex-worked-hours");
        e.length && e.each(function() {
            ! function(e) {
                var t = {
                        chart: {
                            width: "100%",
                            type: "bar",
                            zoom: {
                                enabled: !1
                            },
                            toolbar: {
                                show: !1
                            },
                            shadow: {
                                enabled: !1
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: !1,
                                columnWidth: "30%",
                                endingShape: "rounded"
                            }
                        },
                        stroke: {
                            show: !0,
                            width: 2,
                            colors: ["transparent"]
                        },
                        series: [{
                            name: "Worked hours",
                            data: [40, 30, 100, 90, 20]
                        }],
                        xaxis: {
                            labels: {
                                format: "MMM",
                                style: {
                                    colors: PurposeStyle.colors.gray[600],
                                    fontSize: "14px",
                                    fontFamily: PurposeStyle.fonts.base,
                                    cssClass: "apexcharts-xaxis-label"
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            },
                            type: "datetime",
                            categories: ["1/11/2000", "2/11/2000", "3/11/2000", "4/11/2000", "5/11/2000"]
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    color: PurposeStyle.colors.gray[600],
                                    fontSize: "12px",
                                    fontFamily: PurposeStyle.fonts.base
                                }
                            },
                            axisBorder: {
                                show: !1
                            },
                            axisTicks: {
                                show: !0,
                                borderType: "solid",
                                color: PurposeStyle.colors.gray[300],
                                height: 6,
                                offsetX: 0,
                                offsetY: 0
                            }
                        },
                        fill: {
                            type: "solid"
                        },
                        markers: {
                            size: 4,
                            opacity: .7,
                            strokeColor: "#fff",
                            strokeWidth: 3,
                            hover: {
                                size: 7
                            }
                        },
                        grid: {
                            borderColor: PurposeStyle.colors.gray[300],
                            strokeDashArray: 5
                        },
                        dataLabels: {
                            enabled: !1
                        }
                    },
                    a = (e.data().dataset, e.data().labels, e.data().color),
                    n = e.data().height;
                e.data().type, t.colors = [PurposeStyle.colors.theme[a]], t.markers.colors = [PurposeStyle.colors.theme[a]], t.chart.height = n || 350;
                var o = new ApexCharts(e[0], t);
                setTimeout(function() {
                    o.render()
                }, 300)
            }($(this))
        })
    }();
/*! Select2 4.0.7-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return v.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o=b&&b.split("/"),p=t.map,q=p&&p["*"]||{};if(a){for(a=a.split("/"),g=a.length-1,t.nodeIdCompat&&x.test(a[g])&&(a[g]=a[g].replace(x,"")),"."===a[0].charAt(0)&&o&&(n=o.slice(0,o.length-1),a=n.concat(a)),k=0;k<a.length;k++)if("."===(m=a[k]))a.splice(k,1),k-=1;else if(".."===m){if(0===k||1===k&&".."===a[2]||".."===a[k-1])continue;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}if((o||q)&&p){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),o)for(l=o.length;l>0;l-=1)if((e=p[o.slice(0,l).join("/")])&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&q&&q[d]&&(i=q[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=w.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),o.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){r[a]=b}}function j(a){if(e(s,a)){var c=s[a];delete s[a],u[a]=!0,n.apply(b,c)}if(!e(r,a)&&!e(u,a))throw new Error("No "+a);return r[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return a?k(a):[]}function m(a){return function(){return t&&t.config&&t.config[a]||{}}}var n,o,p,q,r={},s={},t={},u={},v=Object.prototype.hasOwnProperty,w=[].slice,x=/\.js$/;p=function(a,b){var c,d=k(a),e=d[0],g=b[1];return a=d[1],e&&(e=f(e,g),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(g)):f(a,g):(a=f(a,g),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},q={require:function(a){return g(a)},exports:function(a){var b=r[a];return void 0!==b?b:r[a]={}},module:function(a){return{id:a,uri:"",exports:r[a],config:m(a)}}},n=function(a,c,d,f){var h,k,m,n,o,t,v,w=[],x=typeof d;if(f=f||a,t=l(f),"undefined"===x||"function"===x){for(c=!c.length&&d.length?["require","exports","module"]:c,o=0;o<c.length;o+=1)if(n=p(c[o],t),"require"===(k=n.f))w[o]=q.require(a);else if("exports"===k)w[o]=q.exports(a),v=!0;else if("module"===k)h=w[o]=q.module(a);else if(e(r,k)||e(s,k)||e(u,k))w[o]=j(k);else{if(!n.p)throw new Error(a+" missing "+k);n.p.load(n.n,g(f,!0),i(k),{}),w[o]=r[k]}m=d?d.apply(r[a],w):void 0,a&&(h&&h.exports!==b&&h.exports!==r[a]?r[a]=h.exports:m===b&&v||(r[a]=m))}else a&&(r[a]=d)},a=c=o=function(a,c,d,e,f){if("string"==typeof a)return q[a]?q[a](c):j(p(a,l(c)).f);if(!a.splice){if(t=a,t.deps&&o(t.deps,t.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?n(b,a,c,d):setTimeout(function(){n(b,a,c,d)},4),o},o.config=function(a){return o(a)},a._defined=r,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(r,a)||e(s,a)||(s[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){"function"==typeof b[d]&&("constructor"!==d&&c.push(d))}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){return Array.prototype.unshift.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;c<d;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;c<a;c++){b+=Math.floor(36*Math.random()).toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return(e!==f||"hidden"!==f&&"visible"!==f)&&("scroll"===e||"scroll"===f||(d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth))},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c.__cache={};var e=0;return c.GetUniqueElementId=function(a){var b=a.getAttribute("data-select2-id");return null==b&&(a.id?(b=a.id,a.setAttribute("data-select2-id",b)):(a.setAttribute("data-select2-id",++e),b=e.toString())),b},c.StoreData=function(a,b,d){var e=c.GetUniqueElementId(a);c.__cache[e]||(c.__cache[e]={}),c.__cache[e][b]=d},c.GetData=function(b,d){var e=c.GetUniqueElementId(b);return d?c.__cache[e]&&null!=c.__cache[e][d]?c.__cache[e][d]:a(b).data(d):c.__cache[e]},c.RemoveData=function(a){var b=c.GetUniqueElementId(a);null!=c.__cache[b]&&delete c.__cache[b]},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){b.find(".select2-results").append(a)},c.prototype.sort=function(a){return this.options.get("sorter")(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var c=this;this.data.current(function(d){var e=a.map(d,function(a){return a.id.toString()});c.$results.find(".select2-results__option[aria-selected]").each(function(){var c=a(this),d=b.GetData(this,"data"),f=""+d.id;null!=d.element&&d.element.selected||null==d.element&&a.inArray(f,e)>-1?c.attr("aria-selected","true"):c.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(c){var d=document.createElement("li");d.className="select2-results__option";var e={role:"treeitem","aria-selected":"false"};c.disabled&&(delete e["aria-selected"],e["aria-disabled"]="true"),null==c.id&&delete e["aria-selected"],null!=c._resultId&&(d.id=c._resultId),c.title&&(d.title=c.title),c.children&&(e.role="group",e["aria-label"]=c.text,delete e["aria-selected"]);for(var f in e){var g=e[f];d.setAttribute(f,g)}if(c.children){var h=a(d),i=document.createElement("strong");i.className="select2-results__group";a(i);this.template(c,i);for(var j=[],k=0;k<c.children.length;k++){var l=c.children[k],m=this.option(l);j.push(m)}var n=a("<ul></ul>",{class:"select2-results__options select2-results__options--nested"});n.append(j),h.append(i),h.append(n)}else this.template(c,d);return b.StoreData(d,"data",c),d},c.prototype.bind=function(c,d){var e=this,f=c.id+"-results";this.$results.attr("id",f),c.on("results:all",function(a){e.clear(),e.append(a.data),c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("results:append",function(a){e.append(a.data),c.isOpen()&&e.setClasses()}),c.on("query",function(a){e.hideMessages(),e.showLoading(a)}),c.on("select",function(){c.isOpen()&&(e.setClasses(),e.options.get("scrollAfterSelect")&&e.highlightFirstItem())}),c.on("unselect",function(){c.isOpen()&&(e.setClasses(),e.options.get("scrollAfterSelect")&&e.highlightFirstItem())}),c.on("open",function(){e.$results.attr("aria-expanded","true"),e.$results.attr("aria-hidden","false"),e.setClasses(),e.ensureHighlightVisible()}),c.on("close",function(){e.$results.attr("aria-expanded","false"),e.$results.attr("aria-hidden","true"),e.$results.removeAttr("aria-activedescendant")}),c.on("results:toggle",function(){var a=e.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),c.on("results:select",function(){var a=e.getHighlightedResults();if(0!==a.length){var c=b.GetData(a[0],"data");"true"==a.attr("aria-selected")?e.trigger("close",{}):e.trigger("select",{data:c})}}),c.on("results:previous",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a);if(!(c<=0)){var d=c-1;0===a.length&&(d=0);var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top,h=f.offset().top,i=e.$results.scrollTop()+(h-g);0===d?e.$results.scrollTop(0):h-g<0&&e.$results.scrollTop(i)}}),c.on("results:next",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a),d=c+1;if(!(d>=b.length)){var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top+e.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=e.$results.scrollTop()+h-g;0===d?e.$results.scrollTop(0):h>g&&e.$results.scrollTop(i)}}),c.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),c.on("results:message",function(a){e.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=e.$results.scrollTop(),c=e.$results.get(0).scrollHeight-b+a.deltaY,d=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=e.$results.height();d?(e.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(e.$results.scrollTop(e.$results.get(0).scrollHeight-e.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(c){var d=a(this),f=b.GetData(this,"data");if("true"===d.attr("aria-selected"))return void(e.options.get("multiple")?e.trigger("unselect",{originalEvent:c,data:f}):e.trigger("close",{}));e.trigger("select",{originalEvent:c,data:f})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(c){var d=b.GetData(this,"data");e.getHighlightedResults().removeClass("select2-results__option--highlighted"),e.trigger("results:focus",{data:d,element:a(this)})})},c.prototype.getHighlightedResults=function(){return this.$results.find(".select2-results__option--highlighted")},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),c<=2?this.$results.scrollTop(0):(g>this.$results.outerHeight()||g<0)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){return{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46}}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var c=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=b.GetData(this.$element[0],"old-tabindex")?this._tabindex=b.GetData(this.$element[0],"old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),c.attr("title",this.$element.attr("title")),c.attr("tabindex",this._tabindex),this.$selection=c,c},d.prototype.bind=function(a,b){var d=this,e=(a.id,a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),window.setTimeout(function(){d.$selection.focus()},0),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(c){a(document.body).on("mousedown.select2."+c.id,function(c){var d=a(c.target),e=d.closest(".select2");a(".select2.select2-container--open").each(function(){a(this),this!=e[0]&&b.GetData(this,"element").select2("close")})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){b.find(".selection").append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d).attr("role","textbox").attr("aria-readonly","true"),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()})},e.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},e.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.attr("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,e){var f=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){f.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!f.options.get("disabled")){var d=a(this),e=d.parent(),g=c.GetData(e[0],"data");f.trigger("unselect",{originalEvent:b,data:g})}})},d.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},d.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},d.prototype.selectionContainer=function(){return a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.attr("title",e.title||e.text),c.StoreData(f[0],"data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id;if(b.length>1||c)return a.call(this,b);this.clear();var d=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(d)},b}),b.define("select2/selection/allowClear",["jquery","../keys","../utils"],function(a,b,c){function d(){}return d.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},d.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var d=this.$selection.find(".select2-selection__clear");if(0!==d.length){b.stopPropagation();var e=c.GetData(d[0],"data"),f=this.$element.val();this.$element.val(this.placeholder.id);var g={data:e};if(this.trigger("clear",g),g.prevented)return void this.$element.val(f);for(var h=0;h<e.length;h++)if(g={data:e[h]},this.trigger("unselect",g),g.prevented)return void this.$element.val(f);this.$element.trigger("change"),this.trigger("toggle",{})}}},d.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||c.which!=b.DELETE&&c.which!=b.BACKSPACE||this._handleClear(c)},d.prototype.update=function(b,d){if(b.call(this,d),!(this.$selection.find(".select2-selection__placeholder").length>0||0===d.length)){var e=this.options.get("translations").get("removeAllItems"),f=a('<span class="select2-selection__clear" title="'+e()+'">&times;</span>');c.StoreData(f[0],"data",d),this.$selection.find(".select2-selection__rendered").prepend(f)}},d}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,d,e){var f=this;a.call(this,d,e),d.on("open",function(){f.$search.trigger("focus")}),d.on("close",function(){f.$search.val(""),f.$search.removeAttr("aria-activedescendant"),f.$search.trigger("focus")}),d.on("enable",function(){f.$search.prop("disabled",!1),f._transferTabIndex()}),d.on("disable",function(){f.$search.prop("disabled",!0)}),d.on("focus",function(a){f.$search.trigger("focus")}),d.on("results:focus",function(a){f.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){f.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){f._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){if(a.stopPropagation(),f.trigger("keypress",a),f._keyUpPrevented=a.isDefaultPrevented(),a.which===c.BACKSPACE&&""===f.$search.val()){var d=f.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var e=b.GetData(d[0],"data");f.searchRemoveChoice(e),a.preventDefault()}}});var g=document.documentMode,h=g&&g<=11;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){if(h)return void f.$selection.off("input.search input.searchcheck");f.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(h&&"input"===a.type)return void f.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&f.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;if(this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c){this.$element.find("[data-select2-tag]").length?this.$element.focus():this.$search.focus()}},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{a=.75*(this.$search.val().length+1)+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting","clear","clearing"],g=["opening","closing","selecting","unselecting","clearing"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){return{"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Œ":"OE","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","œ":"oe","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ώ":"ω","ς":"σ","’":"'"}}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),null!=c.id?d+="-"+c.id.toString():d+="-"+a.generateChars(4),d},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple")){if(a.selected=!1,c(a.element).is("option"))return a.element.selected=!1,void this.$element.trigger("change");this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})}},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){b.RemoveData(this)})},d.prototype.query=function(a,b){var d=[],e=this;this.$element.children().each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var d;a.children?(d=document.createElement("optgroup"),d.label=a.text):(d=document.createElement("option"),void 0!==d.textContent?d.textContent=a.text:d.innerText=a.text),void 0!==a.id&&(d.value=a.id),a.disabled&&(d.disabled=!0),a.selected&&(d.selected=!0),a.title&&(d.title=a.title);var e=c(d),f=this._normalizeItem(a);return f.element=d,b.StoreData(d,"data",f),e},d.prototype.item=function(a){var d={};if(null!=(d=b.GetData(a[0],"data")))return d;if(a.is("option"))d={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){d={text:a.prop("label"),children:[],title:a.prop("title")};for(var e=a.children("option"),f=[],g=0;g<e.length;g++){var h=c(e[g]),i=this.item(h);f.push(i)}d.children=f}return d=this._normalizeItem(d),d.element=a[0],b.StoreData(a[0],"data",d),d},d.prototype._normalizeItem=function(a){a!==Object(a)&&(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){return this.options.get("matcher")(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){"status"in d&&(0===d.status||"0"===d.status)||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0);if((i.text||"").toUpperCase()===(b.term||"").toUpperCase()||j)return!f&&(a.data=g,void c(a))}if(f)return!0;var k=e.createTag(b);if(null!=k){var l=e.option(k);l.attr("data-select2-tag",!0),e.addOptions([l]),e.insertTag(g,k)}a.results=g,c(a)}var e=this;if(this._removeOldTags(),null==b.term||null!=b.page)return void a.call(this,b,c);a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){this._lastTag;this.$element.find("option[data-select2-tag]").each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b);if(!g.$element.find("option").filter(function(){return a(this).val()===c.id}).length){var d=g.option(c);d.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([d])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",b.term.length<this.minimumInputLength)return void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength)return void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;if(d.maximumSelectionLength>0&&f>=d.maximumSelectionLength)return void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}});a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val(""),e.$search.blur()}),c.on("focus",function(){c.isOpen()||e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){e.showSearch(a)?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){e.$results.offset().top+e.$results.outerHeight(!1)+50>=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1)&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){b.StoreData(this,"select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(c){var d=b.GetData(this,"select2-scroll-position");a(this).scrollTop(d.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id;this.$container.parents().filter(b.hasScroll).off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return!(a(c.data.results)<this.minimumResultsForSearch)&&b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",["../utils"],function(a){function b(){}return b.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},b.prototype._handleSelectOnClose=function(b,c){if(c&&null!=c.originalSelect2Event){var d=c.originalSelect2Event;if("select"===d._type||"unselect"===d._type)return}var e=this.getHighlightedResults();if(!(e.length<1)){var f=a.GetData(e[0],"data");null!=f.element&&f.element.selected||null==f.element&&f.selected||this.trigger("select",{data:f})}},b}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&(c.ctrlKey||c.metaKey)||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){return"Please enter "+(a.minimum-a.input.length)+" or more characters"},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"},removeAllItems:function(){return"Remove all items"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}return D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),null==l.tokenSeparators&&null==l.tokenizer||(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(a){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(a){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var O=k.loadPath(this.defaults.amdLanguageBase+"en"),P=new k(l.language);P.extend(O),l.translations=P}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){null==c(d,e.children[g])&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var h=b(e.text).toUpperCase(),i=b(d.term).toUpperCase();return h.indexOf(i)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,scrollAfterSelect:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(!0,this.defaults,f)},new D}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){function c(a,b){return b.toUpperCase()}var e=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),d.GetData(a[0],"select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),d.StoreData(a[0],"data",d.GetData(a[0],"select2Tags")),d.StoreData(a[0],"tags",!0)),d.GetData(a[0],"ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",d.GetData(a[0],"ajaxUrl")),d.StoreData(a[0],"ajax-Url",d.GetData(a[0],"ajaxUrl")));for(var f={},g=0;g<a[0].attributes.length;g++){var h=a[0].attributes[g].name,i="data-";if(h.substr(0,i.length)==i){var j=h.substring(i.length),k=d.GetData(a[0],j);f[j.replace(/-([a-z])/g,c)]=k}}b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset&&(f=b.extend(!0,{},a[0].dataset,f));var l=b.extend(!0,{},d.GetData(a[0]),f);l=d._convertData(l);for(var m in l)b.inArray(m,e)>-1||(b.isPlainObject(this.options[m])?b.extend(this.options[m],l[m]):this.options[m]=l[m]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,d){null!=c.GetData(a[0],"select2")&&c.GetData(a[0],"select2").destroy(),this.$element=a,this.id=this._generateId(a),d=d||{},this.options=new b(d,a),e.__super__.constructor.call(this);var f=a.attr("tabindex")||0;c.StoreData(a[0],"old-tabindex",f),a.attr("tabindex","-1");var g=this.options.get("dataAdapter");this.dataAdapter=new g(a,this.options);var h=this.render();this._placeContainer(h);var i=this.options.get("selectionAdapter");this.selection=new i(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,h);var j=this.options.get("dropdownAdapter");this.dropdown=new j(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,h);var k=this.options.get("resultsAdapter");this.results=new k(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var l=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){l.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),c.StoreData(a[0],"select2",this),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return e<=0?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;h<i;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting",clear:"clearing"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),null!=a&&0!==a.length||(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",c.GetData(this.$element[0],"old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),c.RemoveData(this.$element[0]),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),c.StoreData(b[0],"element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults","./select2/utils"],function(a,b,c,d,e){if(null==a.fn.select2){var f=["open","close","destroy"];a.fn.select2=function(b){if("object"==typeof(b=b||{}))return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,g=Array.prototype.slice.call(arguments,1);return this.each(function(){var a=e.GetData(this,"select2");null==a&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=a[b].apply(a,g)}),a.inArray(b,f)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
