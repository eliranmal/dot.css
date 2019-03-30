(function (d, ns) {

  const main = d.getElementById('main');
  const img = d.getElementById('source-image');
  const paper = d.getElementById('paper');
  const source = d.getElementById('source');
  const subpixelRenderingSwitch = d.getElementById('subpixel-rendering-switch');
  const sliders = [...d.querySelectorAll('input[type="range"]')]
    .reduce((accum, node) => {
      accum[node.id.replace('-slider', '')] = node;
      return accum;
    }, {});

  const painter = ns.painter(img, paper);
  const sourceBBox = source.getBoundingClientRect();

  let painted = false,
    pixelate = sliders.pixelate.value,
    blur = sliders.blur.value,
    noSubpixelRendering = !subpixelRenderingSwitch.checked;

  bindDebounced(sliders.crossfade, 'input', ({ target: { value } }) => {
    const width = sourceBBox.width / 100 * value;
    source.style.width = `${width}px`;
    source.style.marginLeft = `${(sourceBBox.width - width) / 2 * -1}px`;
  }, 10);

  bindDebounced(sliders.pixelate, 'input', ({ target: { value } }) => {
    pixelate = value;
    paint();
  });

  bindDebounced(sliders.blur, 'input', ({ target: { value } }) => {
    blur = value;
    paint();
  });

  bind(subpixelRenderingSwitch, 'change', ({ target: { checked } }) => {
    noSubpixelRendering = !checked;
    paint();
  });

  bindDebounced(sliders.zoom, 'input', ({ target: { value } }) => {
    zoom(value);
  });

  sliders.crossfade.setAttribute('disabled', 'disabled');

  zoom(sliders.zoom.value);

  paint();


  function zoom(value) {
    const zoom = Number(value).toFixed(3);
    main.style.setProperty('transform', `scale(${zoom})`);
  }

  function paint() {

    painter({
      pixelate,
      blur,
      noSubpixelRendering,
    });

    if (!painted) {
      painted = true;
      sliders.crossfade.removeAttribute('disabled');
    }
    // trigger a change to hide the source image
    sliders.crossfade.dispatchEvent(new Event('input'));
  }

  function bind(node, event, fn) {
    node.addEventListener(event, fn, false);
  }

  function bindDebounced(node, event, fn, delay = 200) {
    node.addEventListener(event, debounce(fn, delay), false);
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

}(document, window.__dotCss = window.__dotCss || {}));
