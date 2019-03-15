(function (d, ns) {

  function paint(image = {}, paper = {}, {
    width = image.width,
    height = image.height,
    dotWidth = 1,
    dotHeight = 1,
    blur = 0,
  } = {}) {

    const canvas = d.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    canvas.getContext('2d')
      .drawImage(image, 0, 0, width, height);

    const pixelData = canvas.getContext('2d')
      .getImageData(0, 0, width, height).data;
    // console.log('>>> pixel data:', pixelData);

    const chunkedData = chunks(4, pixelData);
    // console.log('>>> chunked data:', chunkedData);

    const rgbValues = chunkedData.map(pixelChunk => (
      `rgb(${pixelChunk.join(',')})`
    ));
    // console.log('>>> rgb values:', rgbValues);

    const offsetMatrixPoints = chunkedData.map((pixelChunk, i) => ({
      // calc coordinates and add offset to avoid the box-shadow being hidden
      x: (i % width) * dotWidth + dotWidth,
      y: ((i - (i % width)) / width) * dotHeight + dotHeight,
    }));
    // console.log('>>> pixel offset matrix as points:',
    // JSON.stringify(offsetMatrixPoints, null, 2));

    const boxShadow = offsetMatrixPoints
      .map((point, i) => `${point.x}px ${point.y}px ${blur}px ${rgbValues[i]}`)
      .join(',');
    // console.log('>>> box shadow:', boxShadow);

    paper.style.width = `${width * dotWidth}px`;
    paper.style.height = `${height * dotHeight}px`;
    paper.innerHTML = '';
    const pixel = createSeedPixelElement(dotWidth, dotHeight, boxShadow);
    paper.appendChild(pixel);
  }

  function painter(image = {}, paper = {}) {
    return paint.bind(null, image, paper);
  }

  function createSeedPixelElement(width, height, boxShadow) {
    const pixel = document.createElement('div');
    pixel.style.position = 'relative';
    pixel.style.top = `-${height}px`;
    pixel.style.left = `-${width}px`;
    pixel.style.width = `${width}px`;
    pixel.style.height = `${height}px`;
    pixel.style.boxShadow = boxShadow;
    return pixel;
  }

  function chunks(chunkSize, arr) {
    const chunked = [];
    for (let c = 0; c < arr.length; c += chunkSize) {
      chunked.push(arr.slice(c, c + chunkSize));
    }
    return chunked;
  }


  ns.paint = paint;
  ns.painter = painter;

}(document, window.__dotCss = window.__dotCss || {}));
