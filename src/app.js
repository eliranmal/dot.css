(function (d, ns) {

  const img = d.getElementById('source-image');
  const paper = d.getElementById('paper');

  d.getElementById('paint-btn')
    .addEventListener('click', () => ns.paint(img, paper, {
      width: 16,
      height: 16,
      dotWidth: 10,
      dotHeight: 10,
      blur: 0,
    }), false);

}(document, window.__cssCanvas = window.__cssCanvas || {}));
