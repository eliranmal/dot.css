(function (d, ns) {

  const imgSelect = d.getElementById('source-image-select');
  const img = d.getElementById('source-image');
  const paper = d.getElementById('paper');
  const source = d.getElementById('source');
  const target = d.getElementById('target');
  const subpixelRenderingSwitch = d.getElementById('subpixel-rendering-switch');
  const sliders = [...d.querySelectorAll('input[type="range"]')];

  const sliderMap = sliders.reduce((accum, node) => {
    accum[node.id.replace('-slider', '')] = node;
    return accum;
  }, {});


  let painted = false,
    painter = ns.painter(img, paper),
    imgBBox = img.getBoundingClientRect(),
    crossfadePerc = asNumber(sliderMap.crossfade.value),
    zoomLevel = asNumber(sliderMap.zoom.value),
    pixelate = sliderMap.pixelate.value,
    blur = sliderMap.blur.value,
    noSubpixelRendering = !subpixelRenderingSwitch.checked;


  loadSourceImage(imgSelect.value);

  bind(imgSelect, 'change', ({ target: { value } }) => {
    loadSourceImage(value);
  });

  bindDebounced(sliderMap.crossfade, 'input', ({ target: { value } }) => {
    crossfadePerc = asNumber(value);
    crossfade();
  }, 10);

  bindDebounced(sliderMap.pixelate, 'input', ({ target: { value } }) => {
    pixelate = value;
    paint();
  });

  bindDebounced(sliderMap.blur, 'input', ({ target: { value } }) => {
    blur = value;
    paint();
  });

  bindDebounced(sliderMap.zoom, 'input', ({ target: { value } }) => {
    zoomLevel = asNumber(value);
    zoom();
  });

  bind(subpixelRenderingSwitch, 'change', ({ target: { checked } }) => {
    noSubpixelRendering = !checked;
    paint();
  });

  sliderMap.crossfade.setAttribute('disabled', 'disabled');

  sliderMap.zoom.dispatchEvent(new Event('input'));

  paint();


  function paint() {

    painter({
      pixelate,
      blur,
      noSubpixelRendering,
    });

    if (!painted) {
      painted = true;
      sliderMap.crossfade.removeAttribute('disabled');
    }
    // trigger a change to hide the source image
    sliderMap.crossfade.dispatchEvent(new Event('input'));
  }

  function loadSourceImage(url) {
    img.onload = () => {
      imgBBox = img.getBoundingClientRect();
      painter = ns.painter(img, paper);
      paint();
    };
    img.src = url;
  }

  function zoom() {
    if (typeof zoomLevel !== 'number') {
      return;
    }
    [source, target]
      .forEach(el => {
        el.style.setProperty('transform', `scale(${zoomLevel},${zoomLevel})`);
      });
    imgBBox = img.getBoundingClientRect();
    crossfade();
  }

  function crossfade() {
    if (typeof crossfadePerc !== 'number') {
      return;
    }
    const boxWidth = imgBBox.width;
    const width = boxWidth / 100 * crossfadePerc;
    const marginLeft = (boxWidth - width) / 2 * -1;
    source.style.width = `${width / zoomLevel}px`;
    source.style.marginLeft = `${marginLeft}px`;
  }

  function asNumber(value) {
    return +Number(value).toFixed(3);
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
    let timeout;
    return function () {
      const context = this, args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

}(document, window.__dotCss = window.__dotCss || {}));
