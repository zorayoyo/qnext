document.addEventListener('touchmove', function(e){ e.preventDefault() })

function $(selector) { return document.querySelector(selector) }
function $$(selector) { return document.querySelectorAll(selector) }

var pages = {};

new PreLoad($('#progress'), [
  'balloon.png',
  'cloud-opening.png',
  'house.png',
  'house-p.png',
  'logo.png',
  'mountain.png'
], {
  prefix: 'images/',
  complete: function(){
    var $loader = $('#loader');
    var $pages = $('.js-pages-container');
    // var $page3s = $$('.page-job');

    $pages.classList.remove('d-n');
    pages = new PageSlide($pages, 'Y');
  }
}).load();
