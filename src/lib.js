(function (d, exports) {

  function paintCss(image = {}, paper = {}, {
    x = 0,
    y = 0,
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

    const pixel = document.createElement('div');
    pixel.style.boxShadow = boxShadow;
    pixel.style.width = `${dotWidth}px`;
    pixel.style.height = `${dotHeight}px`;
    pixel.style.position = 'relative';
    pixel.style.top = `-${dotHeight}px`;
    pixel.style.left = `-${dotWidth}px`;

    paper.style.width = `${width * dotWidth}px`;
    paper.style.height = `${height * dotHeight}px`;
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


  exports.paint = paintCss;

}(document, window.__cssCanvas = window.__cssCanvas || {}));
