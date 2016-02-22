(function (window) {
  if (!('forEach' in NodeList.prototype) && ('forEach' in Array.prototype))
    NodeList.prototype.forEach = Array.prototype.forEach;

  if (!('$' in window)) window.$ = {};

  var style = '.ripple{-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000);overflow:hidden}.ripple-mask{position:absolute;border-radius:50%;width:50px;height:50px;background:#fff;-webkit-animation:ripple-animation 2s forwards;-moz-animation:ripple-animation 2s forwards;-o-animation:ripple-animation 2s forwards;animation:ripple-animation 2s forwards}@-webkit-keyframes ripple-animation{from{transform:translate(-50%,-50%) scale(1);opacity:.4}to{transform:scale(100);opacity:0}}@-moz-keyframes ripple-animation{from{transform:translate(-50%,-50%) scale(1);opacity:.4}to{transform:scale(100);opacity:0}}@-o-keyframes ripple-animation{from{transform:translate(-50%,-50%) scale(1);opacity:.4}to{transform:scale(100);opacity:0}}@keyframes ripple-animation{from{transform:translate(-50%,-50%) scale(1);opacity:.4}to{transform:scale(100);opacity:0}}';
  var styleEl = document.createElement('style');
  styleEl.innerText = style;
  document.head.appendChild(styleEl);

  $.ripple = { attach: attachRipple, create: createRipple, observe: observeRipples };

  $.ripple.init = function(sel) {
    var node = document.querySelector(sel) || document.body;
    var ripples = node.querySelectorAll('.ripple');

    for (var i = 0; i < ripples.length; i++)
      attachRipple(ripples[i]);

    if (window.MutationObserver)
      observeRipples(node);
  };

  function attachRipple(target) {
    if (target.rippled) return;
    target.rippled = true;

    // var div = document.createElement('div');
    // div.classList.add('test');
    //
    // target.appendChild(div);

    target.addEventListener('click', function (e) {
      e.preventDefault();

      // var test = this.querySelector('.test');

      var mask = createRipple(this, e);

      this.appendChild(mask);
      // test.appendChild(mask);

      window.setTimeout(function(){
        mask.remove();
      }, 2000);
    });
  }

  function createRipple(container, e) {
    var mask = document.createElement('div');
    var xPos = e.pageX - container.offsetLeft;
    var yPos = e.pageY - container.offsetTop;

    mask.classList.add('ripple-mask');
    // mask.classList.add('test');

    var dimension = Math.max(container.offsetWidth, container.offsetHeight) * 0.1;
    mask.style.width = mask.style.height = dimension + 'px';
    mask.style.top = yPos;
    mask.style.left = xPos;

    mask.style.backgroundColor = (container.getAttribute('data-ripple-color') || container.getAttribute('ripple-color'));
    // mask.style.backgroundColor = this.dataset.rippleColor;

    return mask;
  }

  function observeRipples(node) {
    node = node || document.body;
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (!mutation.addedNodes) return;

        mutation.addedNodes.forEach(function(node) {
          if (node.classList && node.classList.contains('ripple'))
            attachRipple(node);
        });
      });
    });

    observer.observe(node, { childList: true });

    return observer;
  }
})(window);
