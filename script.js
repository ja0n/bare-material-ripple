(function (window) {
  if (!('forEach' in NodeList.prototype) && ('forEach' in Array.prototype))
    NodeList.prototype.forEach = Array.prototype.forEach;

  document.addEventListener('DOMContentLoaded', function() {
    var ripples = document.querySelectorAll('.ripple');

    ripples.forEach(function(target) {
      attachRipple(target);
    });

    if (window.MutationObserver)
      observeRipples();
  });


  function attachRipple(target) {
    if (target.rippled) return;
    target.rippled = true;

    target.addEventListener('click', function (e) {
      e.preventDefault();

      var div = createRipple(this);

      this.appendChild(div);

      window.setTimeout(function(){
        div.remove();
      }, 2000);
    });
  }

  function createRipple(container) {
    var div = document.createElement('span');
    var xPos = event.pageX - container.offsetLeft;
    var yPos = event.pageY - container.offsetTop;

    div.classList.add('ripple-effect');

    // div.style.top = yPos - (div.style.height/2);
    // div.style.left = xPos - (div.style.width/2);
    div.style.top = yPos - 12.5;
    div.style.left = xPos - 12.5;

    div.style.backgroundColor = (container.getAttribute('data-ripple-color') || container.getAttribute('ripple-color'));
    // div.style.backgroundColor = this.dataset.rippleColor;

    return div;
  }

  function observeRipples() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (!mutation.addedNodes) return;

        mutation.addedNodes.forEach(function(node) {
          if (node.classList.contains('ripple'))
            attachRipple(node);
        });
      });
    });

    observer.observe(document.body, { childList: true });

    return observer;
  }
})(window);
