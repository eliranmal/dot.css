(function (d, ns) {

  const img = d.getElementById('source-image');
  const paper = d.getElementById('paper');
  const source = d.getElementById('source');
  const target = d.getElementById('target');
  // const target = paper;
  const paintBtn = d.getElementById('paint-btn');
  const sliders = [...d.querySelectorAll('input[type="range"]')];
  const crossfadeSlider = d.getElementById('crossfade-slider');

  let sourceBBox;

  source.style.overflow = 'hidden';
  source.style.zIndex = '1';

  target.style.width = `${img.width}px`;
  target.style.height = `${img.height}px`;

  sliders.forEach((slider) => slider.setAttribute('disabled', 'disabled'));

  crossfadeSlider.addEventListener('input', ({ target: { value } }) => {
    if (!sourceBBox) {
      return false;
    }
    const width = sourceBBox.width / 100 * value;
    source.style.width = `${width}px`;
    source.style.marginLeft = `${(sourceBBox.width - width) / 2 * -1}px`;
  });

  paintBtn.addEventListener('click', () => {
    const sizeInPixels = 22;
    ns.paint(img, paper, {
      width: sizeInPixels,
      height: sizeInPixels,
      dotWidth: img.width / sizeInPixels,
      dotHeight: img.height / sizeInPixels,
      blur: 0,
    });

    if (!sourceBBox) {
      // remove the initially disabled state
      sliders.forEach((slider) => slider.removeAttribute('disabled'));
    }
    sourceBBox = source.getBoundingClientRect();
    // trigger a change to hide the source image
    crossfadeSlider.dispatchEvent(new Event('input'));

  }, false);

}(document, window.__dotCss = window.__dotCss || {}));
