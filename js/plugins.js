// Place any jQuery/helper plugins in here.
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function($) {
  $.transit = {
    version: "0.9.9",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    if (prop in div.style) { return prop; }

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.transform3d     = checkTransform3dSupport();

  var eventNames = {
    'transition':       'transitionEnd',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default':       'ease',
    'in':             'ease-in',
    'out':            'ease-out',
    'in-out':         'ease-in-out',
    'snap':           'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
        if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      fn();
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof properties.easing !== 'undefined') {
      easing = properties.easing;
      delete properties.easing;
    }

    if (typeof properties.duration !== 'undefined') {
      duration = properties.duration;
      delete properties.duration;
    }

    if (typeof properties.complete !== 'undefined') {
      callback = properties.complete;
      delete properties.complete;
    }

    if (typeof properties.queue !== 'undefined') {
      queue = properties.queue;
      delete properties.queue;
    }

    if (typeof properties.delay !== 'undefined') {
      delay = properties.delay;
      delete properties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(properties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(properties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(properties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({ 'transit:transform': t });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  //     toMS('fast')   //=> '400ms'
  //     toMS(10)       //=> '10ms'
  //
  function toMS(duration) {
    var i = duration;

    // Allow for string durations like 'fast'.
    if ($.fx.speeds[i]) { i = $.fx.speeds[i]; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;
})(jQuery);

(function(b){function P(a,j){function e(a){return b.isArray(f.readonly)?(a=b(".dwwl",l).index(a),f.readonly[a]):f.readonly}function k(b){var a='<div class="dw-bf">',f=1,d;for(d in X[b])0==f%20&&(a+='</div><div class="dw-bf">'),a+='<div class="dw-li dw-v" data-val="'+d+'" style="height:'+y+"px;line-height:"+y+'px;"><div class="dw-i">'+X[b][d]+"</div></div>",f++;return a+"</div>"}function g(a){t=b(".dw-li",a).index(b(".dw-v",a).eq(0));v=b(".dw-li",a).index(b(".dw-v",a).eq(-1));p=b(".dw-ul",l).index(a);
h=y;F=d}function s(a){var b=f.headerText;return b?"function"==typeof b?b.call(J,a):b.replace(/\{value\}/i,a):""}function ga(){d.temp=U&&null!==d.val&&d.val!=q.val()||null===d.values?f.parseValue(q.val()||"",d):d.values.slice(0);d.setValue(!0)}function T(a,f,j,e,r){!1!==G("validate",[l,f,a])&&(b(".dw-ul",l).each(function(j){var W=b(this),c=b('.dw-li[data-val="'+d.temp[j]+'"]',W),l=b(".dw-li",W),i=l.index(c),k=l.length,I=j==f||void 0===f;if(!c.hasClass("dw-v")){for(var g=c,m=0,h=0;0<=i-m&&!g.hasClass("dw-v");)m++,
g=l.eq(i-m);for(;i+h<k&&!c.hasClass("dw-v");)h++,c=l.eq(i+h);(h<m&&h&&2!==e||!m||0>i-m||1==e)&&c.hasClass("dw-v")?i+=h:(c=g,i-=m)}if(!c.hasClass("dw-sel")||I)d.temp[j]=c.attr("data-val"),b(".dw-sel",W).removeClass("dw-sel"),c.addClass("dw-sel"),d.scroll(W,j,i,I?a:0.1,I?r:void 0)}),d.change(j))}function z(a){if(!("inline"==f.display||K===b(window).width()&&ba===b(window).height()&&a)){var d,j,c,i,e,m,I,g,k,h=0,p=0,a=b(window).scrollTop();i=b(".dwwr",l);var n=b(".dw",l),o={};e=void 0===f.anchor?q:f.anchor;
K=b(window).width();ba=b(window).height();A=(A=window.innerHeight)||ba;/modal|bubble/.test(f.display)&&(b(".dwc",l).each(function(){d=b(this).outerWidth(!0);h+=d;p=d>p?d:p}),d=h>K?p:h,i.width(d));Q=n.outerWidth();B=n.outerHeight(!0);"modal"==f.display?(j=(K-Q)/2,c=a+(A-B)/2):"bubble"==f.display?(k=!0,g=b(".dw-arrw-i",l),j=e.offset(),m=j.top,I=j.left,i=e.outerWidth(),e=e.outerHeight(),j=I-(n.outerWidth(!0)-i)/2,j=j>K-Q?K-(Q+20):j,j=0<=j?j:20,c=m-B,c<a||m>a+A?(n.removeClass("dw-bubble-top").addClass("dw-bubble-bottom"),
c=m+e):n.removeClass("dw-bubble-bottom").addClass("dw-bubble-top"),g=g.outerWidth(),i=I+i/2-(j+(Q-g)/2),b(".dw-arr",l).css({left:i>g?g:i})):(o.width="100%","top"==f.display?c=a:"bottom"==f.display&&(c=a+A-B));o.top=0>c?0:c;o.left=j;n.css(o);b(".dw-persp",l).height(0).height(c+B>b(document).height()?c+B:b(document).height());k&&(c+B>a+A||m>a+A)&&b(window).scrollTop(c+B-A)}}function P(a){if("touchstart"===a.type)Y=!0,setTimeout(function(){Y=!1},500);else if(Y)return Y=!1;return!0}function G(a,f){var c;
f.push(d);b.each([Z,j],function(b,d){d[a]&&(c=d[a].apply(J,f))});return c}function oa(a){var b=+a.data("pos")+1;c(a,b>v?t:b,1)}function pa(a){var b=+a.data("pos")-1;c(a,b<t?v:b,2)}var ha,y,H,l,K,A,ba,Q,B,L,ia,d=this,ca=b.mobiscroll,J=a,q=b(J),da,ja,f=C({},ka),Z={},X=[],V={},ea={},U=q.is("input"),R=!1;d.enable=function(){f.disabled=!1;U&&q.prop("disabled",!1)};d.disable=function(){f.disabled=!0;U&&q.prop("disabled",!0)};d.scroll=function(a,b,f,d,j){function c(){clearInterval(V[b]);delete V[b];a.data("pos",
f).closest(".dwwl").removeClass("dwa")}var i=(ha-f)*y,e;i!=ea[b]&&(ea[b]=i,a.attr("style",la+"-transition:all "+(d?d.toFixed(3):0)+"s ease-out;"+(M?la+"-transform:translate3d(0,"+i+"px,0);":"top:"+i+"px;")),V[b]&&c(),d&&void 0!==j?(e=0,a.closest(".dwwl").addClass("dwa"),V[b]=setInterval(function(){e+=0.1;a.data("pos",Math.round((f-j)*Math.sin(e/d*(Math.PI/2))+j));e>=d&&c()},100)):a.data("pos",f))};d.setValue=function(a,j,c,i){b.isArray(d.temp)||(d.temp=f.parseValue(d.temp+"",d));R&&a&&T(c);i||(d.values=
d.temp.slice(0));j&&(H=f.formatResult(d.temp),d.val=H,U&&q.val(H).trigger("change"))};d.validate=function(a,b,f,d){T(f,a,!0,b,d)};d.change=function(a){H=f.formatResult(d.temp);"inline"==f.display?d.setValue(!1,a):b(".dwv",l).html(s(H));a&&G("onChange",[H])};d.changeWheel=function(a,d){if(l){var j=0,c,i,e=a.length;for(c in f.wheels)for(i in f.wheels[c]){if(-1<b.inArray(j,a)&&(X[j]=f.wheels[c][i],b(".dw-ul",l).eq(j).html(k(j)),e--,!e)){z();T(d,void 0,!0);return}j++}}};d.isVisible=function(){return R};
d.tap=function(a,b){var d,j;f.tap&&a.bind("touchstart",function(a){a.preventDefault();d=u(a,"X");j=u(a,"Y")}).bind("touchend",function(a){20>Math.abs(u(a,"X")-d)&&20>Math.abs(u(a,"Y")-j)&&b.call(this,a);$=!0;setTimeout(function(){$=!1},300)});a.bind("click",function(a){$||b.call(this,a)})};d.show=function(a){if(f.disabled||R)return!1;"top"==f.display&&(L="slidedown");"bottom"==f.display&&(L="slideup");ga();G("onBeforeShow",[l]);var j=0,h,M="";L&&!a&&(M="dw-"+L+" dw-in");for(var r='<div class="dw-trans '+
f.theme+" dw-"+f.display+'">'+("inline"==f.display?'<div class="dw dwbg dwi"><div class="dwwr">':'<div class="dw-persp"><div class="dwo"></div><div class="dw dwbg '+M+'"><div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div><div class="dwwr">'+(f.headerText?'<div class="dwv"></div>':"")),a=0;a<f.wheels.length;a++){r+='<div class="dwc'+("scroller"!=f.mode?" dwpm":" dwsc")+(f.showLabel?"":" dwhl")+'"><div class="dwwc dwrc"><table cellpadding="0" cellspacing="0"><tr>';for(h in f.wheels[a])X[j]=
f.wheels[a][h],r+='<td><div class="dwwl dwrc dwwl'+j+'">'+("scroller"!=f.mode?'<div class="dwwb dwwbp" style="height:'+y+"px;line-height:"+y+'px;"><span>+</span></div><div class="dwwb dwwbm" style="height:'+y+"px;line-height:"+y+'px;"><span>&ndash;</span></div>':"")+'<div class="dwl">'+h+'</div><div class="dww" style="height:'+f.rows*y+"px;min-width:"+f.width+'px;"><div class="dw-ul">',r+=k(j),r+='</div><div class="dwwo"></div></div><div class="dwwol"></div></div></td>',j++;r+="</tr></table></div></div>"}r+=
("inline"!=f.display?'<div class="dwbc'+(f.button3?" dwbc-p":"")+'"><span class="dwbw dwb-s"><span class="dwb">'+f.setText+"</span></span>"+(f.button3?'<span class="dwbw dwb-n"><span class="dwb">'+f.button3Text+"</span></span>":"")+'<span class="dwbw dwb-c"><span class="dwb">'+f.cancelText+"</span></span></div></div>":'<div class="dwcc"></div>')+"</div></div></div>";l=b(r);T();G("onMarkupReady",[l]);"inline"!=f.display?(l.appendTo("body"),setTimeout(function(){l.removeClass("dw-trans").find(".dw").removeClass(M)},
350)):q.is("div")?q.html(l):l.insertAfter(q);R=!0;da.init(l,d);"inline"!=f.display&&(d.tap(b(".dwb-s span",l),function(){if(d.hide(false,"set")!==false){d.setValue(false,true);G("onSelect",[d.val])}}),d.tap(b(".dwb-c span",l),function(){d.cancel()}),f.button3&&d.tap(b(".dwb-n span",l),f.button3),f.scrollLock&&l.bind("touchmove",function(a){B<=A&&Q<=K&&a.preventDefault()}),b("input,select,button").each(function(){b(this).prop("disabled")||b(this).addClass("dwtd").prop("disabled",true)}),z(),b(window).bind("resize.dw",
function(){clearTimeout(ia);ia=setTimeout(function(){z(true)},100)}));l.delegate(".dwwl","DOMMouseScroll mousewheel",function(a){if(!e(this)){a.preventDefault();var a=a.originalEvent,a=a.wheelDelta?a.wheelDelta/120:a.detail?-a.detail/3:0,d=b(".dw-ul",this),j=+d.data("pos"),j=Math.round(j-a);g(d);c(d,j,a<0?1:2)}}).delegate(".dwb, .dwwb",fa,function(){b(this).addClass("dwb-a")}).delegate(".dwwb",fa,function(a){a.stopPropagation();a.preventDefault();var d=b(this).closest(".dwwl");if(P(a)&&!e(d)&&!d.hasClass("dwa")){D=
true;var j=d.find(".dw-ul"),c=b(this).hasClass("dwwbp")?oa:pa;g(j);clearInterval(n);n=setInterval(function(){c(j)},f.delay);c(j)}}).delegate(".dwwl",fa,function(a){a.preventDefault();if(P(a)&&!N&&!e(this)&&!D&&f.mode!="clickpick"){N=true;b(document).bind(ma,na);o=b(".dw-ul",this);o.closest(".dwwl").addClass("dwa");i=+o.data("pos");g(o);m=V[p]!==void 0;w=u(a,"Y");E=new Date;x=w;d.scroll(o,p,i,0.001)}});G("onShow",[l,H])};d.hide=function(a,d){if(!1===G("onClose",[H,d]))return!1;b(".dwtd").prop("disabled",
!1).removeClass("dwtd");q.blur();l&&("inline"!=f.display&&L&&!a?(b(".dw",l).addClass("dw-"+L+" dw-out"),setTimeout(function(){l.remove();l=null},350)):(l.remove(),l=null),R=!1,ea={},b(window).unbind(".dw"))};d.cancel=function(){!1!==d.hide(!1,"cancel")&&G("onCancel",[d.val])};d.init=function(a){da=C({defaults:{},init:O},ca.themes[a.theme||f.theme]);ja=ca.i18n[a.lang||f.lang];C(j,a);C(f,da.defaults,ja,j);d.settings=f;q.unbind(".dw");if(a=ca.presets[f.preset])Z=a.call(J,d),C(f,Z,j),C(aa,Z.methods);
ha=Math.floor(f.rows/2);y=f.height;L=f.animate;void 0!==q.data("dwro")&&(J.readOnly=S(q.data("dwro")));R&&d.hide();"inline"==f.display?d.show():(ga(),U&&f.showOnFocus&&(q.data("dwro",J.readOnly),J.readOnly=!0,q.bind("focus.dw",function(){d.show()})))};d.values=null;d.val=null;d.temp=null;d.init(j)}function g(a){for(var b in a)if(void 0!==T[a[b]])return!0;return!1}function u(a,b){var c=a.originalEvent,i=a.changedTouches;return i||c&&c.changedTouches?c?c.changedTouches[0]["page"+b]:i[0]["page"+b]:a["page"+
b]}function S(a){return!0===a||"true"==a}function s(a,b,c){a=a>c?c:a;return a<b?b:a}function c(a,c,i,e,m){var c=s(c,t,v),g=b(".dw-li",a).eq(c),h=p,k=e?c==m?0.1:Math.abs(0.1*(c-m)):0;F.temp[h]=g.attr("data-val");F.scroll(a,h,c,k,m);setTimeout(function(){F.validate(h,i,k,m)},10)}function k(a,b,c){return aa[b]?aa[b].apply(a,Array.prototype.slice.call(c,1)):"object"===typeof b?aa.init.call(a,b):a}var e={},n,O=function(){},h,t,v,F,z=(new Date).getTime(),N,D,o,p,w,x,E,i,m,T=document.createElement("modernizr").style,
M=g(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),la=function(){var a=["Webkit","Moz","O","ms"],b;for(b in a)if(g([a[b]+"Transform"]))return"-"+a[b].toLowerCase();return""}(),C=b.extend,$,Y,fa="touchstart mousedown",ma="touchmove mousemove",na=function(a){a.preventDefault();x=u(a,"Y");F.scroll(o,p,s(i+(w-x)/h,t-1,v+1));m=!0},ka={width:70,height:40,rows:3,delay:300,disabled:!1,readonly:!1,showOnFocus:!0,showLabel:!0,wheels:[],theme:"",headerText:"{value}",
display:"modal",mode:"scroller",preset:"",lang:"en-US",setText:"Set",cancelText:"Cancel",scrollLock:!0,tap:!0,formatResult:function(a){return a.join(" ")},parseValue:function(a,b){var c=b.settings.wheels,i=a.split(" "),e=[],m=0,g,h,k;for(g=0;g<c.length;g++)for(h in c[g]){if(void 0!==c[g][h][i[m]])e.push(i[m]);else for(k in c[g][h]){e.push(k);break}m++}return e}},aa={init:function(a){void 0===a&&(a={});return this.each(function(){this.id||(z+=1,this.id="scoller"+z);e[this.id]=new P(this,a)})},enable:function(){return this.each(function(){var a=
e[this.id];a&&a.enable()})},disable:function(){return this.each(function(){var a=e[this.id];a&&a.disable()})},isDisabled:function(){var a=e[this[0].id];if(a)return a.settings.disabled},isVisible:function(){var a=e[this[0].id];if(a)return a.isVisible()},option:function(a,b){return this.each(function(){var c=e[this.id];if(c){var i={};"object"===typeof a?i=a:i[a]=b;c.init(i)}})},setValue:function(a,b,c,i){return this.each(function(){var m=e[this.id];m&&(m.temp=a,m.setValue(!0,b,c,i))})},getInst:function(){return e[this[0].id]},
getValue:function(){var a=e[this[0].id];if(a)return a.values},show:function(){var a=e[this[0].id];if(a)return a.show()},hide:function(){return this.each(function(){var a=e[this.id];a&&a.hide()})},destroy:function(){return this.each(function(){var a=e[this.id];a&&(a.hide(),b(this).unbind(".dw"),delete e[this.id],b(this).is("input")&&(this.readOnly=S(b(this).data("dwro"))))})}};b(document).bind("touchend mouseup",function(){if(N){var a=new Date-E,e=s(i+(w-x)/h,t-1,v+1),g;g=o.offset().top;300>a?(a=(x-
w)/a,a=a*a/0.0012,0>x-w&&(a=-a)):a=x-w;if(!a&&!m){g=Math.floor((x-g)/h);var k=b(".dw-li",o).eq(g);k.addClass("dw-hl");setTimeout(function(){k.removeClass("dw-hl")},200)}else g=Math.round(i-a/h);c(o,g,0,!0,Math.round(e));N=!1;o=null;b(document).unbind(ma,na)}D&&(clearInterval(n),D=!1);b(".dwb-a").removeClass("dwb-a")}).bind("mouseover mouseup mousedown click",function(a){if($)return a.stopPropagation(),a.preventDefault(),!1});b.fn.mobiscroll=function(a){C(this,b.mobiscroll.shorts);return k(this,a,
arguments)};b.mobiscroll=b.mobiscroll||{setDefaults:function(a){C(ka,a)},presetShort:function(a){this.shorts[a]=function(b){return k(this,C(b,{preset:a}),arguments)}},shorts:{},presets:{},themes:{},i18n:{}};b.scroller=b.scroller||b.mobiscroll;b.fn.scroller=b.fn.scroller||b.fn.mobiscroll})(jQuery);(function(b){var P={inputClass:"",invalid:[],rtl:!1,group:!1,groupLabel:"Groups"};b.mobiscroll.presetShort("select");b.mobiscroll.presets.select=function(g){function u(b){return b?b.replace(/_/,""):""}function S(){var i,e=0,g={},h=[{}];c.group?(c.rtl&&(e=1),b("optgroup",k).each(function(c){g["_"+c]=b(this).attr("label")}),h[e]={},h[e][c.groupLabel]=g,i=n,e+=c.rtl?-1:1):i=k;h[e]={};h[e][z]={};b("option",i).each(function(){var c=b(this).attr("value");h[e][z]["_"+c]=b(this).text();b(this).prop("disabled")&&
N.push(c)});return h}var s=g.settings,c=b.extend({},P,s),k=b(this),e=k.val(),n=k.find('option[value="'+k.val()+'"]').parent(),O=n.index()+"",h=O,t,v=this.id+"_dummy";b('label[for="'+this.id+'"]').attr("for",v);var F=b('label[for="'+v+'"]'),z=void 0!==c.label?c.label:F.length?F.text():k.attr("name"),N=[],D={},o,p,w,x=s.readonly;c.group&&!b("optgroup",k).length&&(c.group=!1);c.invalid.length||(c.invalid=N);c.group?c.rtl?(o=1,p=0):(o=0,p=1):(o=-1,p=0);b("#"+v).remove();b("option",k).each(function(){D[b(this).attr("value")]=
b(this).text()});var E=b('<input type="text" id="'+v+'" value="'+D[k.val()]+'" class="'+c.inputClass+'" readonly />').insertBefore(k);c.showOnFocus&&E.focus(function(){g.show()});k.bind("change",function(){!t&&e!=k.val()&&g.setSelectVal([k.val()],true);t=false}).hide().closest(".ui-field-contain").trigger("create");g.setSelectVal=function(b,m,o){e=b[0];if(c.group){n=k.find('option[value="'+e+'"]').parent();h=n.index();g.temp=c.rtl?["_"+e,"_"+n.index()]:["_"+n.index(),"_"+e];if(h!==O){s.wheels=S();
g.changeWheel([p]);O=h+""}}else g.temp=["_"+e];g.setValue(true,m,o);if(m){E.val(D[e]);b=e!==k.val();k.val(e);b&&k.trigger("change")}};g.getSelectVal=function(b){return u((b?g.temp:g.values)[p])};return{width:50,wheels:void 0,headerText:!1,anchor:E,formatResult:function(b){return D[u(b[p])]},parseValue:function(){e=k.val();n=k.find('option[value="'+e+'"]').parent();h=n.index();return c.group&&c.rtl?["_"+e,"_"+h]:c.group?["_"+h,"_"+e]:["_"+e]},validate:function(i,m,t){if(m===o){h=u(g.temp[o]);if(h!==
O){n=k.find("optgroup").eq(h);h=n.index();e=(e=n.find("option").eq(0).val())||k.val();s.wheels=S();if(c.group){g.temp=c.rtl?["_"+e,"_"+h]:["_"+h,"_"+e];s.readonly=[c.rtl,!c.rtl];clearTimeout(w);w=setTimeout(function(){g.changeWheel([p]);s.readonly=x},t*1E3);O=h+"";return false}}else s.readonly=x}else e=u(g.temp[p]);var M=b(".dw-ul",i).eq(p);b.each(c.invalid,function(c,e){b('.dw-li[data-val="_'+e+'"]',M).removeClass("dw-v")})},onBeforeShow:function(){s.wheels=S();if(c.group)g.temp=c.rtl?["_"+e,"_"+
n.index()]:["_"+n.index(),"_"+e]},onShow:function(c){b(".dwwl"+o,c).bind("mousedown touchstart",function(){clearTimeout(w)})},onSelect:function(b){E.val(b);t=true;k.val(u(g.values[p])).trigger("change");if(c.group)g.values=null},onCancel:function(){if(c.group)g.values=null},onChange:function(b){if(c.display=="inline"){E.val(b);t=true;k.val(u(g.temp[p])).trigger("change")}},onClose:function(){E.blur()},methods:{setValue:function(c,e,g){return this.each(function(){var h=b(this).mobiscroll("getInst");
if(h)if(h.setSelectVal)h.setSelectVal(c,e,g);else{h.temp=c;h.setValue(true,e,g)}})},getValue:function(c){var e=b(this).mobiscroll("getInst");if(e)return e.getSelectVal?e.getSelectVal(c):e.values}}}}})(jQuery);

/*
 * jquery.animateNumber.js - jquery number animation plugin
 * Copyright (C) 2013, Robert Kajic (robert@kajic.com)
 * http://kajic.com
 *
 * Used on elements that have a number as content (integer or float)
 * to animate the number to a new value over a short period of time.
 * 
 * Licensed under the MIT License.
 *
 * Date: 2013-01-08
 * Version: 0.1
 */

(function ($, undefined) {

var defaults = {
    duration : 5000,
    easing: "swing",
    animateOpacity: true,
    intStepDecimals: 0,
    intEndDecimals: 0,
    floatStepDecimals: 4,
    floatEndDecimals: 1,
    callback: function() {}
};
    
function round(number, decimals) {
    return Math.round(number*Math.pow(10,decimals))/Math.pow(10,decimals) + "";
}

function isInt(number) {
    return /^-?[\d]+$/.test(number);
}

$.fn.animateNumber = function(value, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    options = $.extend({}, defaults, options);
    
    return this.each(function () {
        var container = $(this);
        var initialValue = parseFloat($(this).text().replace(/,/g, ""), 10);
        if (round(value, options.floatEndDecimals) == round(initialValue, options.floatEndDecimals)) {
            return;
        }
        var type = container.data("type") || (isInt($(this).text()) ? "int" : "float"),
            stepDecimals, endDecimals, 
            defaultStepDecimals, defaultEndDecimals;
        if (type == "int") {
            defaultStepDecimals = options.intStepDecimals;
            defaultEndDecimals = options.intEndDecimals;
        } else {
            defaultStepDecimals = options.floatStepDecimals;
            defaultEndDecimals = options.floatEndDecimals;
        }
        stepDecimals = container.data("stepDecimals") || defaultStepDecimals;
        endDecimals = container.data("endDecimals") || defaultEndDecimals;
        
        // animate opacity
        if (options.animateOpacity) {
            container.animate({opacity: 0.2}, {
                duration: options.duration/2, 
                easing: options.easing, 
                complete: function() {
                    container.animate({opacity: 1}, {
                        duration: options.duration/2,
                        easing: options.easing
                    });
                }
            });
        }
        // animate number
        $({number: initialValue}).animate({number: value}, {
            duration: options.duration,
            easing: options.easing, 
            step: function() {
                container.text(round(this.number, stepDecimals).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            },
            complete: function() {
                container.text(round(this.number, endDecimals).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                if (typeof options.callback === "function") {
                    options.callback.call(container);
                }
            }
        });
    });
};

})( jQuery );

/*!
 * jQuery Color Animations v@VERSION
 * http://jquery.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function( jQuery, undefined ) {

  var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

  // plusequals test for += 100 -= 100
  rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
  // a set of RE's that can match strings and generate color tuples.
  stringParsers = [{
      re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ],
          execResult[ 3 ],
          execResult[ 4 ]
        ];
      }
    }, {
      re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ] * 2.55,
          execResult[ 2 ] * 2.55,
          execResult[ 3 ] * 2.55,
          execResult[ 4 ]
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ], 16 )
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
        ];
      }
    }, {
      re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
      space: "hsla",
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ] / 100,
          execResult[ 3 ] / 100,
          execResult[ 4 ]
        ];
      }
    }],

  // jQuery.Color( )
  color = jQuery.Color = function( color, green, blue, alpha ) {
    return new jQuery.Color.fn.parse( color, green, blue, alpha );
  },
  spaces = {
    rgba: {
      props: {
        red: {
          idx: 0,
          type: "byte"
        },
        green: {
          idx: 1,
          type: "byte"
        },
        blue: {
          idx: 2,
          type: "byte"
        }
      }
    },

    hsla: {
      props: {
        hue: {
          idx: 0,
          type: "degrees"
        },
        saturation: {
          idx: 1,
          type: "percent"
        },
        lightness: {
          idx: 2,
          type: "percent"
        }
      }
    }
  },
  propTypes = {
    "byte": {
      floor: true,
      max: 255
    },
    "percent": {
      max: 1
    },
    "degrees": {
      mod: 360,
      floor: true
    }
  },
  support = color.support = {},

  // element for support tests
  supportElem = jQuery( "<p>" )[ 0 ],

  // colors = jQuery.Color.names
  colors,

  // local aliases of functions called often
  each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
  space.cache = "_" + spaceName;
  space.props.alpha = {
    idx: 3,
    type: "percent",
    def: 1
  };
});

function clamp( value, prop, allowEmpty ) {
  var type = propTypes[ prop.type ] || {};

  if ( value == null ) {
    return (allowEmpty || !prop.def) ? null : prop.def;
  }

  // ~~ is an short way of doing floor for positive numbers
  value = type.floor ? ~~value : parseFloat( value );

  // IE will pass in empty strings as value for alpha,
  // which will hit this case
  if ( isNaN( value ) ) {
    return prop.def;
  }

  if ( type.mod ) {
    // we add mod before modding to make sure that negatives values
    // get converted properly: -10 -> 350
    return (value + type.mod) % type.mod;
  }

  // for now all property types without mod have min and max
  return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
  var inst = color(),
    rgba = inst._rgba = [];

  string = string.toLowerCase();

  each( stringParsers, function( i, parser ) {
    var parsed,
      match = parser.re.exec( string ),
      values = match && parser.parse( match ),
      spaceName = parser.space || "rgba";

    if ( values ) {
      parsed = inst[ spaceName ]( values );

      // if this was an rgba parse the assignment might happen twice
      // oh well....
      inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
      rgba = inst._rgba = parsed._rgba;

      // exit each( stringParsers ) here because we matched
      return false;
    }
  });

  // Found a stringParser that handled it
  if ( rgba.length ) {

    // if this came from a parsed string, force "transparent" when alpha is 0
    // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
    if ( rgba.join() === "0,0,0,0" ) {
      jQuery.extend( rgba, colors.transparent );
    }
    return inst;
  }

  // named colors
  return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
  parse: function( red, green, blue, alpha ) {
    if ( red === undefined ) {
      this._rgba = [ null, null, null, null ];
      return this;
    }
    if ( red.jquery || red.nodeType ) {
      red = jQuery( red ).css( green );
      green = undefined;
    }

    var inst = this,
      type = jQuery.type( red ),
      rgba = this._rgba = [],
      source;

    // more than 1 argument specified - assume ( red, green, blue, alpha )
    if ( green !== undefined ) {
      red = [ red, green, blue, alpha ];
      type = "array";
    }

    if ( type === "string" ) {
      return this.parse( stringParse( red ) || colors._default );
    }

    if ( type === "array" ) {
      each( spaces.rgba.props, function( key, prop ) {
        rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
      });
      return this;
    }

    if ( type === "object" ) {
      if ( red instanceof color ) {
        each( spaces, function( spaceName, space ) {
          if ( red[ space.cache ] ) {
            inst[ space.cache ] = red[ space.cache ].slice();
          }
        });
      } else {
        each( spaces, function( spaceName, space ) {
          var cache = space.cache;
          each( space.props, function( key, prop ) {

            // if the cache doesn't exist, and we know how to convert
            if ( !inst[ cache ] && space.to ) {

              // if the value was null, we don't need to copy it
              // if the key was alpha, we don't need to copy it either
              if ( key === "alpha" || red[ key ] == null ) {
                return;
              }
              inst[ cache ] = space.to( inst._rgba );
            }

            // this is the only case where we allow nulls for ALL properties.
            // call clamp with alwaysAllowEmpty
            inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
          });

          // everything defined but alpha?
          if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
            // use the default of 1
            inst[ cache ][ 3 ] = 1;
            if ( space.from ) {
              inst._rgba = space.from( inst[ cache ] );
            }
          }
        });
      }
      return this;
    }
  },
  is: function( compare ) {
    var is = color( compare ),
      same = true,
      inst = this;

    each( spaces, function( _, space ) {
      var localCache,
        isCache = is[ space.cache ];
      if (isCache) {
        localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
        each( space.props, function( _, prop ) {
          if ( isCache[ prop.idx ] != null ) {
            same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
            return same;
          }
        });
      }
      return same;
    });
    return same;
  },
  _space: function() {
    var used = [],
      inst = this;
    each( spaces, function( spaceName, space ) {
      if ( inst[ space.cache ] ) {
        used.push( spaceName );
      }
    });
    return used.pop();
  },
  transition: function( other, distance ) {
    var end = color( other ),
      spaceName = end._space(),
      space = spaces[ spaceName ],
      startColor = this.alpha() === 0 ? color( "transparent" ) : this,
      start = startColor[ space.cache ] || space.to( startColor._rgba ),
      result = start.slice();

    end = end[ space.cache ];
    each( space.props, function( key, prop ) {
      var index = prop.idx,
        startValue = start[ index ],
        endValue = end[ index ],
        type = propTypes[ prop.type ] || {};

      // if null, don't override start value
      if ( endValue === null ) {
        return;
      }
      // if null - use end
      if ( startValue === null ) {
        result[ index ] = endValue;
      } else {
        if ( type.mod ) {
          if ( endValue - startValue > type.mod / 2 ) {
            startValue += type.mod;
          } else if ( startValue - endValue > type.mod / 2 ) {
            startValue -= type.mod;
          }
        }
        result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
      }
    });
    return this[ spaceName ]( result );
  },
  blend: function( opaque ) {
    // if we are already opaque - return ourself
    if ( this._rgba[ 3 ] === 1 ) {
      return this;
    }

    var rgb = this._rgba.slice(),
      a = rgb.pop(),
      blend = color( opaque )._rgba;

    return color( jQuery.map( rgb, function( v, i ) {
      return ( 1 - a ) * blend[ i ] + a * v;
    }));
  },
  toRgbaString: function() {
    var prefix = "rgba(",
      rgba = jQuery.map( this._rgba, function( v, i ) {
        return v == null ? ( i > 2 ? 1 : 0 ) : v;
      });

    if ( rgba[ 3 ] === 1 ) {
      rgba.pop();
      prefix = "rgb(";
    }

    return prefix + rgba.join() + ")";
  },
  toHslaString: function() {
    var prefix = "hsla(",
      hsla = jQuery.map( this.hsla(), function( v, i ) {
        if ( v == null ) {
          v = i > 2 ? 1 : 0;
        }

        // catch 1 and 2
        if ( i && i < 3 ) {
          v = Math.round( v * 100 ) + "%";
        }
        return v;
      });

    if ( hsla[ 3 ] === 1 ) {
      hsla.pop();
      prefix = "hsl(";
    }
    return prefix + hsla.join() + ")";
  },
  toHexString: function( includeAlpha ) {
    var rgba = this._rgba.slice(),
      alpha = rgba.pop();

    if ( includeAlpha ) {
      rgba.push( ~~( alpha * 255 ) );
    }

    return "#" + jQuery.map( rgba, function( v, i ) {

      // default to 0 when nulls exist
      v = ( v || 0 ).toString( 16 );
      return v.length === 1 ? "0" + v : v;
    }).join("");
  },
  toString: function() {
    return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
  }
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
  h = ( h + 1 ) % 1;
  if ( h * 6 < 1 ) {
    return p + (q - p) * h * 6;
  }
  if ( h * 2 < 1) {
    return q;
  }
  if ( h * 3 < 2 ) {
    return p + (q - p) * ((2/3) - h) * 6;
  }
  return p;
}

spaces.hsla.to = function ( rgba ) {
  if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
    return [ null, null, null, rgba[ 3 ] ];
  }
  var r = rgba[ 0 ] / 255,
    g = rgba[ 1 ] / 255,
    b = rgba[ 2 ] / 255,
    a = rgba[ 3 ],
    max = Math.max( r, g, b ),
    min = Math.min( r, g, b ),
    diff = max - min,
    add = max + min,
    l = add * 0.5,
    h, s;

  if ( min === max ) {
    h = 0;
  } else if ( r === max ) {
    h = ( 60 * ( g - b ) / diff ) + 360;
  } else if ( g === max ) {
    h = ( 60 * ( b - r ) / diff ) + 120;
  } else {
    h = ( 60 * ( r - g ) / diff ) + 240;
  }

  if ( l === 0 || l === 1 ) {
    s = l;
  } else if ( l <= 0.5 ) {
    s = diff / add;
  } else {
    s = diff / ( 2 - add );
  }
  return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
  if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
    return [ null, null, null, hsla[ 3 ] ];
  }
  var h = hsla[ 0 ] / 360,
    s = hsla[ 1 ],
    l = hsla[ 2 ],
    a = hsla[ 3 ],
    q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
    p = 2 * l - q,
    r, g, b;

  return [
    Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
    Math.round( hue2rgb( p, q, h ) * 255 ),
    Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
    a
  ];
};


each( spaces, function( spaceName, space ) {
  var props = space.props,
    cache = space.cache,
    to = space.to,
    from = space.from;

  // makes rgba() and hsla()
  color.fn[ spaceName ] = function( value ) {

    // generate a cache for this space if it doesn't exist
    if ( to && !this[ cache ] ) {
      this[ cache ] = to( this._rgba );
    }
    if ( value === undefined ) {
      return this[ cache ].slice();
    }

    var ret,
      type = jQuery.type( value ),
      arr = ( type === "array" || type === "object" ) ? value : arguments,
      local = this[ cache ].slice();

    each( props, function( key, prop ) {
      var val = arr[ type === "object" ? key : prop.idx ];
      if ( val == null ) {
        val = local[ prop.idx ];
      }
      local[ prop.idx ] = clamp( val, prop );
    });

    if ( from ) {
      ret = color( from( local ) );
      ret[ cache ] = local;
      return ret;
    } else {
      return color( local );
    }
  };

  // makes red() green() blue() alpha() hue() saturation() lightness()
  each( props, function( key, prop ) {
    // alpha is included in more than one space
    if ( color.fn[ key ] ) {
      return;
    }
    color.fn[ key ] = function( value ) {
      var vtype = jQuery.type( value ),
        fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
        local = this[ fn ](),
        cur = local[ prop.idx ],
        match;

      if ( vtype === "undefined" ) {
        return cur;
      }

      if ( vtype === "function" ) {
        value = value.call( this, cur );
        vtype = jQuery.type( value );
      }
      if ( value == null && prop.empty ) {
        return this;
      }
      if ( vtype === "string" ) {
        match = rplusequals.exec( value );
        if ( match ) {
          value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
        }
      }
      local[ prop.idx ] = value;
      return this[ fn ]( local );
    };
  });
});

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
  var hooks = hook.split( " " );
  each( hooks, function( i, hook ) {
    jQuery.cssHooks[ hook ] = {
      set: function( elem, value ) {
        var parsed, curElem,
          backgroundColor = "";

        if ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) {
          value = color( parsed || value );
          if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
            curElem = hook === "backgroundColor" ? elem.parentNode : elem;
            while (
              (backgroundColor === "" || backgroundColor === "transparent") &&
              curElem && curElem.style
            ) {
              try {
                backgroundColor = jQuery.css( curElem, "backgroundColor" );
                curElem = curElem.parentNode;
              } catch ( e ) {
              }
            }

            value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
              backgroundColor :
              "_default" );
          }

          value = value.toRgbaString();
        }
        try {
          elem.style[ hook ] = value;
        } catch( value ) {
          // wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
        }
      }
    };
    jQuery.fx.step[ hook ] = function( fx ) {
      if ( !fx.colorInit ) {
        fx.start = color( fx.elem, hook );
        fx.end = color( fx.end );
        fx.colorInit = true;
      }
      jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
    };
  });

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
  expand: function( value ) {
    var expanded = {};

    each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
      expanded[ "border" + part + "Color" ] = value;
    });
    return expanded;
  }
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
  // 4.1. Basic color keywords
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00",

  // 4.2.3. ‘transparent’ color keyword
  transparent: [ null, null, null, 0 ],

  _default: "#ffffff"
};

})( jQuery );

/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.5.2
*/
(function($){var current=null;$.modal=function(el,options){$.modal.close();var remove,target;this.$body=$('body');this.options=$.extend({},$.modal.defaults,options);if(el.is('a')){target=el.attr('href');if(/^#/.test(target)){this.$elm=$(target);if(this.$elm.length!==1)return null;this.open()}else{this.$elm=$('<div>');this.$body.append(this.$elm);remove=function(event,modal){modal.elm.remove()};this.showSpinner();el.trigger($.modal.AJAX_SEND);$.get(target).done(function(html){if(!current)return;el.trigger($.modal.AJAX_SUCCESS);current.$elm.empty().append(html).on($.modal.CLOSE,remove);current.hideSpinner();current.open();el.trigger($.modal.AJAX_COMPLETE)}).fail(function(){el.trigger($.modal.AJAX_FAIL);current.hideSpinner();el.trigger($.modal.AJAX_COMPLETE)})}}else{this.$elm=el;this.open()}};$.modal.prototype={constructor:$.modal,open:function(){this.block();this.show();if(this.options.escapeClose){$(document).on('keydown.modal',function(event){if(event.which==27)$.modal.close()})}if(this.options.clickClose)this.blocker.click($.modal.close)},close:function(){this.unblock();this.hide();$(document).off('keydown.modal')},block:function(){this.$elm.trigger($.modal.BEFORE_BLOCK,[this._ctx()]);this.blocker=$('<div class="jquery-modal blocker"></div>').css({top:0,right:0,bottom:0,left:0,width:"100%",height:"100%",position:"fixed",zIndex:this.options.zIndex,background:this.options.overlay,opacity:this.options.opacity});this.$body.append(this.blocker);this.$elm.trigger($.modal.BLOCK,[this._ctx()])},unblock:function(){this.blocker.remove()},show:function(){this.$elm.trigger($.modal.BEFORE_OPEN,[this._ctx()]);if(this.options.showClose){this.closeButton=$('<a href="#close-modal" rel="modal:close" class="close-modal">'+this.options.closeText+'</a>');this.$elm.append(this.closeButton)}this.$elm.addClass(this.options.modalClass+' current');this.center();this.$elm.show().trigger($.modal.OPEN,[this._ctx()])},hide:function(){this.$elm.trigger($.modal.BEFORE_CLOSE,[this._ctx()]);if(this.closeButton)this.closeButton.remove();this.$elm.removeClass('current').hide();this.$elm.trigger($.modal.CLOSE,[this._ctx()])},showSpinner:function(){if(!this.options.showSpinner)return;this.spinner=this.spinner||$('<div class="'+this.options.modalClass+'-spinner"></div>').append(this.options.spinnerHtml);this.$body.append(this.spinner);this.spinner.show()},hideSpinner:function(){if(this.spinner)this.spinner.remove()},center:function(){this.$elm.css({position:'fixed',top:"50%",left:"50%",marginTop:-(this.$elm.outerHeight()/2),marginLeft:-(this.$elm.outerWidth()/2),zIndex:this.options.zIndex+1})},_ctx:function(){return{elm:this.$elm,blocker:this.blocker,options:this.options}}};$.modal.prototype.resize=$.modal.prototype.center;$.modal.close=function(event){if(!current)return;if(event)event.preventDefault();current.close();current=null};$.modal.resize=function(){if(!current)return;current.resize()};$.modal.defaults={overlay:"#000",opacity:0.75,zIndex:1,escapeClose:true,clickClose:true,closeText:'Close',modalClass:"modal",spinnerHtml:null,showSpinner:true,showClose:true};$.modal.BEFORE_BLOCK='modal:before-block';$.modal.BLOCK='modal:block';$.modal.BEFORE_OPEN='modal:before-open';$.modal.OPEN='modal:open';$.modal.BEFORE_CLOSE='modal:before-close';$.modal.CLOSE='modal:close';$.modal.AJAX_SEND='modal:ajax:send';$.modal.AJAX_SUCCESS='modal:ajax:success';$.modal.AJAX_FAIL='modal:ajax:fail';$.modal.AJAX_COMPLETE='modal:ajax:complete';$.fn.modal=function(options){if(this.length===1){current=new $.modal(this,options)}return this};$(document).on('click','a[rel="modal:close"]',$.modal.close);$(document).on('click','a[rel="modal:open"]',function(event){event.preventDefault();$(this).modal()})})(jQuery);