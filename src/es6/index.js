$(function () {
  // calculate size dynamically
  $(window).bind('resize', function () {
    let psdWidth = 720;
    let $main = $('.main');
    let windowWidth = window.innerWidth;
    let maxWidth = parseInt($main.css('max-width')) || psdWidth;
    let mainWidth = (windowWidth > maxWidth ? maxWidth : windowWidth);
    let fontSize = mainWidth * 100 / psdWidth;

    document.documentElement.style.fontSize = fontSize + 'px';
    $main.css('visibility', 'visible');
  }).trigger('resize');
});