// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Ãƒâ€šÃ‚Â© 2001 Robert Penner
 * All rights reserved.
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Ãƒâ€šÃ‚Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

(function(f){f.fn.noUiSlider=function(n,r){function s(a,e,c){var g=e.data("setup"),l=g.handles;e=g.settings;g=g.pos;a=0>a?0:100<a?100:a;2==e.handles&&(c.is(":first-child")?(c=parseFloat(l[1][0].style[g])-e.margin,a=a>c?c:a):(c=parseFloat(l[0][0].style[g])+e.margin,a=a<c?c:a));e.step&&(c=m.from(e.range,e.step),a=Math.round(a/c)*c);return a}function t(a){try{return[a.clientX||a.originalEvent.clientX||a.originalEvent.touches[0].clientX,a.clientY||a.originalEvent.clientY||a.originalEvent.touches[0].clientY]}catch(e){return["x",
"y"]}}var j=window.navigator.msPointerEnabled?2:"ontouchend"in document?3:1;window.debug&&console&&console.log(j);var m={to:function(a,e){e=0>a[0]?e+Math.abs(a[0]):e-a[0];return 100*e/this._length(a)},from:function(a,e){return 100*e/this._length(a)},is:function(a,e){return e*this._length(a)/100+a[0]},_length:function(a){return a[0]>a[1]?a[0]-a[1]:a[1]-a[0]}},w={handles:2,serialization:{to:["",""],resolution:0.01}};methods={create:function(){return this.each(function(){var a=f.extend(w,n),e=f(this).data("_isnS_",
!0),c=[],g,l,b="",h=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},k=(a.serialization.resolution=a.serialization.resolution||0.01).toString().split("."),q=1==k[0]?0:k[1].length;a.start=h(a.start)?[a.start,0]:a.start;f.each(a,function(b,d){h(d)?a[b]=parseFloat(d):"object"==typeof d&&h(d[0])&&(d[0]=parseFloat(d[0]),h(d[1])&&(d[1]=parseFloat(d[1])));var c=!1;d="undefined"==typeof d?"x":d;switch(b){case "range":case "start":c=2!=d.length||!h(d[0])||!h(d[1]);break;case "handles":c=1>d||2<d||!h(d);
break;case "connect":c="lower"!=d&&"upper"!=d&&"boolean"!=typeof d;break;case "orientation":c="vertical"!=d&&"horizontal"!=d;break;case "margin":case "step":c="undefined"!=typeof d&&!h(d);break;case "serialization":c="object"!=typeof d||!h(d.resolution)||"object"==typeof d.to&&d.to.length<a.handles;break;case "slide":c="function"!=typeof d}c&&console&&console.error("Bad input for "+b+" on slider:",e)});a.margin=a.margin?m.from(a.range,a.margin):0;if(a.serialization.to instanceof jQuery||"string"==
typeof a.serialization.to||!1===a.serialization.to)a.serialization.to=[a.serialization.to];"vertical"==a.orientation?(b+="vertical",g="top",l=1):(b+="horizontal",g="left",l=0);b+=a.connect?"lower"==a.connect?" connect lower":" connect":"";e.addClass(b);for(b=0;b<a.handles;b++){c[b]=e.append("<a><div></div></a>").children(":last");k=m.to(a.range,a.start[b]);c[b].css(g,k+"%");100==k&&c[b].is(":first-child")&&c[b].css("z-index",2);var k=(1===j?"mousedown":2===j?"MSPointerDown":"touchstart")+".noUiSliderX",
r=(1===j?"mousemove":2===j?"MSPointerMove":"touchmove")+".noUiSlider",v=(1===j?"mouseup":2===j?"MSPointerUp":"touchend")+".noUiSlider";c[b].find("div").on(k,function(b){f("body").bind("selectstart.noUiSlider",function(){return!1});if(!e.hasClass("disabled")){f("body").addClass("TOUCH");var d=f(this).addClass("active").parent(),h=d.add(f(document)).add("body"),k=parseFloat(d[0].style[g]),j=t(b),u=j,n=!1;f(document).on(r,function(b){b.preventDefault();b=t(b);if("x"!=b[0]){b[0]-=j[0];b[1]-=j[1];var p=
[u[0]!=b[0],u[1]!=b[1]],f=k+100*b[l]/(l?e.height():e.width()),f=s(f,e,d);if(p[l]&&f!=n){d.css(g,f+"%").data("input").val(m.is(a.range,f).toFixed(q));var p=a.slide,h=e.data("_n",!0);"function"===typeof p&&p.call(h,void 0);n=f;d.css("z-index",2==c.length&&100==f&&d.is(":first-child")?2:1)}u=b}}).on(v,function(){h.off(".noUiSlider");f("body").removeClass("TOUCH");e.find(".active").removeClass("active").end().data("_n")&&e.data("_n",!1).change()})}}).on("click",function(a){a.stopPropagation()})}if(1==
j)e.on("click",function(b){if(!e.hasClass("disabled")){var d=t(b);b=100*(d[l]-e.offset()[g])/(l?e.height():e.width());d=1<c.length?d[l]<(c[0].offset()[g]+c[1].offset()[g])/2?c[0]:c[1]:c[0];b=s(b,e,d);d.css(g,b+"%").data("input").val(m.is(a.range,b).toFixed(q));b=a.slide;"function"===typeof b&&b.call(e,void 0);e.change()}});for(b=0;b<c.length;b++)k=m.is(a.range,parseFloat(c[b][0].style[g])).toFixed(q),"string"==typeof a.serialization.to[b]?c[b].data("input",e.append('<input type="hidden" name="'+a.serialization.to[b]+
'">').find("input:last").val(k).change(function(a){a.stopPropagation()})):!1==a.serialization.to[b]?c[b].data("input",{val:function(a){if("undefined"!=typeof a)this.handle.data("noUiVal",a);else return this.handle.data("noUiVal")},handle:c[b]}):c[b].data("input",a.serialization.to[b].data("handleNR",b).val(k).change(function(){var a=[null,null];a[f(this).data("handleNR")]=f(this).val();e.val(a)}));f(this).data("setup",{settings:a,handles:c,pos:g,res:q})})},val:function(a){if("undefined"!==typeof a){var e=
"number"==typeof a?[a]:a;return this.each(function(){for(var a=f(this).data("setup"),b=0;b<a.handles.length;b++)if(null!=e[b]){var c=s(m.to(a.settings.range,e[b]),f(this),a.handles[b]);a.handles[b].css(a.pos,c+"%").data("input").val(m.is(a.settings.range,c).toFixed(a.res))}})}a=f(this).data("setup").handles;for(var c=[],g=0;g<a.length;g++)c.push(parseFloat(a[g].data("input").val()));return 1==c.length?c[0]:c},disabled:function(){return r?f(this).addClass("disabled"):f(this).removeClass("disabled")}};
var v=jQuery.fn.val;jQuery.fn.val=function(){return this.data("_isnS_")?methods.val.apply(this,arguments):v.apply(this,arguments)};return"disabled"==n?methods.disabled.apply(this):methods.create.apply(this)}})(jQuery);

$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = "img/" + this;
    });
};

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

  // 4.2.3. â€˜transparentâ€™ color keyword
  transparent: [ null, null, null, 0 ],

  _default: "#ffffff"
};

})( jQuery );

/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.5.2
*/
(function($){var current=null;$.modal=function(el,options){$.modal.close();var remove,target;this.$body=$('body');this.options=$.extend({},$.modal.defaults,options);if(el.is('a')){target=el.attr('href');if(/^#/.test(target)){this.$elm=$(target);if(this.$elm.length!==1)return null;this.open()}else{this.$elm=$('<div>');this.$body.append(this.$elm);remove=function(event,modal){modal.elm.remove()};this.showSpinner();el.trigger($.modal.AJAX_SEND);$.get(target).done(function(html){if(!current)return;el.trigger($.modal.AJAX_SUCCESS);current.$elm.empty().append(html).on($.modal.CLOSE,remove);current.hideSpinner();current.open();el.trigger($.modal.AJAX_COMPLETE)}).fail(function(){el.trigger($.modal.AJAX_FAIL);current.hideSpinner();el.trigger($.modal.AJAX_COMPLETE)})}}else{this.$elm=el;this.open()}};$.modal.prototype={constructor:$.modal,open:function(){this.block();this.show();if(this.options.escapeClose){$(document).on('keydown.modal',function(event){if(event.which==27)$.modal.close()})}if(this.options.clickClose)this.blocker.click($.modal.close)},close:function(){this.unblock();this.hide();$(document).off('keydown.modal')},block:function(){this.$elm.trigger($.modal.BEFORE_BLOCK,[this._ctx()]);this.blocker=$('<div class="jquery-modal blocker"></div>').css({top:0,right:0,bottom:0,left:0,width:"100%",height:"100%",position:"fixed",zIndex:this.options.zIndex,background:this.options.overlay,opacity:this.options.opacity});this.$body.append(this.blocker);this.$elm.trigger($.modal.BLOCK,[this._ctx()])},unblock:function(){this.blocker.remove()},show:function(){this.$elm.trigger($.modal.BEFORE_OPEN,[this._ctx()]);if(this.options.showClose){this.closeButton=$('<a href="#close-modal" rel="modal:close" class="close-modal">'+this.options.closeText+'</a>');this.$elm.append(this.closeButton)}this.$elm.addClass(this.options.modalClass+' current');this.center();this.$elm.show().trigger($.modal.OPEN,[this._ctx()])},hide:function(){this.$elm.trigger($.modal.BEFORE_CLOSE,[this._ctx()]);if(this.closeButton)this.closeButton.remove();this.$elm.removeClass('current').hide();this.$elm.trigger($.modal.CLOSE,[this._ctx()])},showSpinner:function(){if(!this.options.showSpinner)return;this.spinner=this.spinner||$('<div class="'+this.options.modalClass+'-spinner"></div>').append(this.options.spinnerHtml);this.$body.append(this.spinner);this.spinner.show()},hideSpinner:function(){if(this.spinner)this.spinner.remove()},center:function(){this.$elm.css({position:'fixed',top:"50%",left:"50%",marginTop:-(this.$elm.outerHeight()/2),marginLeft:-(this.$elm.outerWidth()/2),zIndex:this.options.zIndex+1})},_ctx:function(){return{elm:this.$elm,blocker:this.blocker,options:this.options}}};$.modal.prototype.resize=$.modal.prototype.center;$.modal.close=function(event){if(!current)return;if(event)event.preventDefault();current.close();current=null};$.modal.resize=function(){if(!current)return;current.resize()};$.modal.defaults={overlay:"#000",opacity:0.75,zIndex:1,escapeClose:true,clickClose:true,closeText:'Close',modalClass:"modal",spinnerHtml:null,showSpinner:true,showClose:true};$.modal.BEFORE_BLOCK='modal:before-block';$.modal.BLOCK='modal:block';$.modal.BEFORE_OPEN='modal:before-open';$.modal.OPEN='modal:open';$.modal.BEFORE_CLOSE='modal:before-close';$.modal.CLOSE='modal:close';$.modal.AJAX_SEND='modal:ajax:send';$.modal.AJAX_SUCCESS='modal:ajax:success';$.modal.AJAX_FAIL='modal:ajax:fail';$.modal.AJAX_COMPLETE='modal:ajax:complete';$.fn.modal=function(options){if(this.length===1){current=new $.modal(this,options)}return this};$(document).on('click','a[rel="modal:close"]',$.modal.close);$(document).on('click','a[rel="modal:open"]',function(event){event.preventDefault();$(this).modal()})})(jQuery);