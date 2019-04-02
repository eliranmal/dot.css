(function (d, ns) {

  function paint(image, paper, {
    pixelate = 0,
    blur = 0,
    // this avoids subpixel issues causing black borders around pixels,
    // but we lose any guarantee for output image size
    noSubpixelRendering = false,
  } = {}) {

    let pixelNumX;
    let pixelNumY;
    let pixelWidth;
    let pixelHeight;

    const pixelatePerc = Number(pixelate);

    const isPixelatePercValid = Number.isInteger(pixelatePerc) &&
      pixelatePerc > 0 &&
      pixelatePerc <= 100;

    if (isPixelatePercValid) {
      let logX = percentageAsLogarithmicMirrored(image.width, pixelatePerc);
      let logY = percentageAsLogarithmicMirrored(image.height, pixelatePerc);
      if (logX < 1) {
        pixelNumX = 1;
      } else {
        pixelNumX = Math.ceil(logX);
      }
      if (logY < 1) {
        pixelNumY = 1;
      } else {
        pixelNumY = Math.ceil(logY);
      }
      if (noSubpixelRendering) {
        pixelWidth = (image.width - image.width % pixelNumX) / pixelNumX;
        pixelHeight = (image.height - image.height % pixelNumY) / pixelNumY;
      } else {
        pixelWidth = image.width / pixelNumX;
        pixelHeight = image.height / pixelNumY;
      }
    } else {
      pixelNumX = image.width;
      pixelNumY = image.height;
      pixelWidth = 1;
      pixelHeight = 1;
    }

    const canvas = d.createElement('canvas');
    canvas.width = pixelNumX;
    canvas.height = pixelNumY;

    canvas.getContext('2d')
      .drawImage(image, 0, 0, pixelNumX, pixelNumY);

    const pixelData = canvas.getContext('2d')
      .getImageData(0, 0, pixelNumX, pixelNumY).data;

    // todo - work efficiently with the buffer api
    const rgbValues = chunks(4, pixelData);

    // don't transform to objects, to keep the memory footprint lower
    const offsetMatrix = rgbValues.map((pixelDatum, i) => ([
      // calc coordinates and add offset to avoid the box-shadow being hidden
      /* x */ (i % pixelNumX) * pixelWidth + pixelWidth,
      /* y */ ((i - (i % pixelNumX)) / pixelNumX) * pixelHeight + pixelHeight,
    ]));

    const boxShadow = offsetMatrix
      .map(([x, y], i) => `${x}px ${y}px ${blur}px rgb(${rgbValues[i].join(',')})`)
      .join(',');

    const pixel = createSeedPixel(pixelWidth, pixelHeight, boxShadow);

    updatePaper(paper, pixel, pixelWidth * pixelNumX, pixelHeight * pixelNumY);
  }

  function painter(image = {}, paper = {}) {
    return paint.bind(null, image, paper);
  }

  function createSeedPixel(width, height, boxShadow) {
    const pixel = document.createElement('div');
    pixel.style.position = 'relative';
    pixel.style.top = `-${height}px`;
    pixel.style.left = `-${width}px`;
    pixel.style.width = `${width}px`;
    pixel.style.height = `${height}px`;
    pixel.style.boxShadow = boxShadow;
    return pixel;
  }

  function updatePaper(paper, pixel, paperWidth, paperHeight) {
    paper.style.width = `${paperWidth}px`;
    paper.style.height = `${paperHeight}px`;
    paper.innerHTML = '';
    paper.appendChild(pixel);
  }

  function chunks(chunkSize, arr) {
    const chunked = [];
    for (let c = 0; c < arr.length; c += chunkSize) {
      chunked.push(arr.slice(c, c + chunkSize));
    }
    return chunked;
  }

  function percentageAsLogarithmicMirrored(maxOutput, x) {
    return asLogarithmicScale(100, maxOutput, true, x);
  }

  function asLogarithmicScale(maxInput, maxOutput, mirrored, x) {
    let output;
    if (x <= 1) { // because log(0) = -Infinity and log(1) = 0
      // output = 0;
      output = 1;
    } else {
      output = maxOutput * Math.log2(x) / Math.log2(maxInput);
    }
    if (mirrored) {
      output = maxOutput - output;
    }
    return output;
  }


  ns.paint = paint;
  ns.painter = painter;

}(document, window.__dotCss = window.__dotCss || {}));
