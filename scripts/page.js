'use strict';
if ("document" in self && !("classList" in document.createElement("_"))) {
  (function(view) {
    if (!('Element' in view)) return;

    var classListProp = "classList",
      protoProp = "prototype",
      elemCtrProto = view.Element[protoProp],
      objCtr = Object,
      strTrim = String[protoProp].trim || function() {
          return this.replace(/^\s+|\s+$/g, "");
      }, arrIndexOf = Array[protoProp].indexOf || function(item) {
          var
          i = 0,
              len = this.length;
          for (; i < len; i++) {
              if (i in this && this[i] === item) {
                  return i;
              }
          }
          return -1;
      }, DOMEx = function(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
      }, checkTokenAndGetIndex = function(classList, token) {
          if (token === "") {
              throw new DOMEx(
                  "SYNTAX_ERR", "An invalid or illegal string was specified"
              );
          }
          if (/\s/.test(token)) {
              throw new DOMEx(
                  "INVALID_CHARACTER_ERR", "String contains an invalid character"
              );
          }
          return arrIndexOf.call(classList, token);
      }, ClassList = function(elem) {
          var
          trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
              classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
              i = 0,
              len = classes.length;
          for (; i < len; i++) {
              this.push(classes[i]);
          }
          this._updateClassName = function() {
              elem.setAttribute("class", this.toString());
          };
      }, classListProto = ClassList[protoProp] = [],
      classListGetter = function() {
          return new ClassList(this);
      };
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function(i) {
        return this[i] || null;
    };
    classListProto.contains = function(token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function() {
        var
        tokens = arguments,
            i = 0,
            l = tokens.length,
            token, updated = false;
        do {
            token = tokens[i] + "";
            if (checkTokenAndGetIndex(this, token) === -1) {
                this.push(token);
                updated = true;
            }
        }
        while (++i < l);

        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.remove = function() {
        var
        tokens = arguments,
            i = 0,
            l = tokens.length,
            token, updated = false;
        do {
            token = tokens[i] + "";
            var index = checkTokenAndGetIndex(this, token);
            if (index !== -1) {
                this.splice(index, 1);
                updated = true;
            }
        }
        while (++i < l);

        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.toggle = function(token, force) {
        token += "";

        var
        result = this.contains(token),
            method = result ?
                force !== true && "remove" :
                force !== false && "add";

        if (method) {
            this[method](token);
        }

        return !result;
    };
    classListProto.toString = function() {
        return this.join(" ");
    };

    if (objCtr.defineProperty) {
        var classListPropDesc = {
            get: classListGetter,
            enumerable: true,
            configurable: true
        };
        try {
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
            if (ex.number === -0x7FF5EC54) {
                classListPropDesc.enumerable = false;
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
        }
    } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }
  }(self));
}

var PreLoad = function(progress, items, options) {
  if(!items || !Array.isArray(items) || !items.length) return

  this.progress = progress
  this.items = items
  this.prefix = options.prefix || ''
  this.complete = options.complete || false
}

PreLoad.prototype.load = function() {
  var count = 0
  var items = this.items
  var length = this.items.length
  var complete = this.complete
  var self = this

  items.forEach(function(item){
    var img = new Image

    img.onload = img.onerror = img.onabort = function() {
      if(++count === length && typeof complete === 'function') complete.call(self)
      self.progress.innerText = Math.floor(100*count/length) + '%';
    }

    img.src = self.prefix + item
  })
}



// PageSlide
var PageSlide = function(el, swipe, options) {
  this.options = options || {}
  this.current = 0
  this.pageX
  this.pageY
  this.height
  this.width
  this.flag
  this.move

  this.$el = el
  this.swipe = swipe || 'X'
  this.resize().init().bindEvents()
}


PageSlide.prototype.init = function(i) {
  var current = i? this.$el.children[i]: this.$el.firstElementChild
  if (!current) throw 'ERROR';

  current.classList.add('moving')
  current.style.webkitTransform = 'translate3d(0,0,0)'

  setTimeout(function() {
    current.classList.remove('moving')
    current.classList.add('play')
  }, 3e2)

  return this
}


PageSlide.prototype.bindEvents = function() {
  var self = this

  window.addEventListener('resize orientationchange', this.resize.bind(this), false)

  'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(evn) {
    self.$el.addEventListener(evn, self[evn].bind(self), false)
  })
}

PageSlide.prototype.getCurrent = function() {
  return this.$el.children[this.current]
}

PageSlide.prototype.resize = function() {
  this.width = this.$el.parentNode.clientWidth
  this.height = this.$el.parentNode.clientHeight
  return this
}

PageSlide.prototype.random = function() {
  var count = this.$el.children.length
  var current = this.current
  var arr = []
  var num

  for(var i=0; i<count; i++) {
    if(i!==current) arr.push(i.toString())
  }

  num = Math.floor(Math.random()*arr.length)
  this.go(+arr[num])
}

PageSlide.prototype.touchstart = function(e) {
  var touches = e.touches[0]

  //touch start initializing
  this.flag = null
  this.move = 0

  //record coordinates
  this.pageX = touches.pageX
  this.pageY = touches.pageY
}

PageSlide.prototype.touchmove = function(e) {
  var touches = e.touches[0]
  var X = touches.pageX - this.pageX
  var Y = touches.pageY - this.pageY
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling

  //add moving styled

  if(!this.flag) {
    this.flag = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y'

    if( this.flag === this.swipe ) {
      current.classList.add('moving')
      next && next.classList.add('moving')
      prev && prev.classList.add('moving')
    }
  }

  if (this.flag === this.swipe) {
    e.preventDefault()
    e.stopPropagation()

    switch (this.swipe) {
      case 'X': //swipe horizontal
        this.move = X

        this.setX(current, X)
        next && ( this.setX(next, X+this.width) )
        prev && ( this.setX(prev, X-this.width) )
        break;
      case 'Y': //swipe vertical
        this.move = Y

        this.setY(current, Y)
        next && ( this.setY(next, Y+this.height) )
        prev && ( this.setY(prev, Y-this.height) )
        break;
    }
  }
}

PageSlide.prototype.touchend = function(e) {
  var minRange = 50
  var move = this.move
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling

  current.classList.remove('moving')
  next && next.classList.remove('moving')
  prev && prev.classList.remove('moving')

  if (!this.flag) return

  e.preventDefault()
  
  if (move<-minRange && next) return this.next()
  if (move>minRange && prev) return this.prev()
  this.reset()
}

PageSlide.prototype.touchcancel = function(e) {
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling

  current.classList.remove('moving')
  next && next.classList.remove('moving')
  prev && prev.classList.remove('moving')
  this.reset()
}


PageSlide.prototype.setX = function(el, x, unit) {
  el && (el.style.webkitTransform = 'translate3d('+x+(unit||'px')+',0,0)')
}

PageSlide.prototype.setY = function(el, y, unit) {
  el && (el.style.webkitTransform = 'translate3d(0,'+y+(unit||'px')+',0)')
}

PageSlide.prototype.setCurrent = function(el, i) {
  el && (el.style.webkitTransform = 'translate3d(0,0,0)')

  if(i) {
    this.current = i
    this.$current = this.$el.children[i]
  }
}

PageSlide.prototype.next = function() {
  this.go(this.current+1)
}

PageSlide.prototype.prev = function() {
  this.go(this.current-1)
}

PageSlide.prototype.reset = function() {
  var width = this.width
  var height = this.height
  var swipe = this.swipe
  var current = this.getCurrent()
  var prev = current.previousElementSibling
  var next = current.nextElementSibling

  this.setCurrent(current)
  prev && ( this['set'+swipe](prev,-(swipe === 'X'? width: height)) )
  next && ( this['set'+swipe](next, swipe === 'X'? width: height)   )
}

PageSlide.prototype.go = function(i) {
  var onFinish = this.options.onFinish
  var current = this.getCurrent()
  var total = this.$el.childElementCount
  var target = this.$el.children[i]
  var d = i<this.current? -1: 1


  if (i === this.current || i<0 || i>=total) return
  if(onFinish && (typeof onFinish === 'function')) onFinish.call(this, i)

  this.current = i

  this['set'+this.swipe](current, -d*(this.swipe === 'X'? this.width: this.height))
  this.setCurrent(target, i)
  this.finish(current, target)
}

PageSlide.prototype.finish = function(curr, target) {
  this.flag = null
  setTimeout(function(){
    curr && curr.classList.remove('play')
    target && target.classList.add('play')
  }, 3e2)
}

// module.exports = {
//     preload: PreLoad,
//     pageslide: PageSlide
// };