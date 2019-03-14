(function (d) {

  function paintCss(image = {}, paper = {}, {
    x = 0,
    y = 0,
    width = image.width,
    height = image.height,
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
      x: i % width,
      y: (i - (i % width)) / width,
    }));
    // console.log('>>> pixel offset matrix as points:',
    // JSON.stringify(offsetMatrixPoints, null, 2));

    const boxShadow = offsetMatrixPoints
      .map((point, i) => `${point.x}px ${point.y}px ${blur}px ${rgbValues[i]}`)
      .join(',');
    // console.log('>>> box shadow:', boxShadow);

    const pixel = document.createElement('div');
    pixel.style.boxShadow = boxShadow;
    pixel.style.height = '1px';
    pixel.style.width = '1px';
    pixel.style.backgroundColor = 'transparent';

    paper.style.width = `${width}px`;
    paper.style.height = `${height}px`;
    paper.style.position = 'relative';
    paper.style.left = `calc(50% - ${width / 2}px)`;
    paper.appendChild(pixel);
  }

  function chunks(chunkSize, arr) {
    const chunked = [];
    for (let c = 0; c < arr.length; c += chunkSize) {
      chunked.push(arr.slice(c, c + chunkSize));
    }
    return chunked;
  }


  function entry() {
    const img = d.getElementById('source-image');
    const paper = d.getElementById('paper');

    d.getElementById('paint-btn')
      .addEventListener('click', () => paintCss(img, paper, {
        // width: 500,
        // height: 100,
        // blur: 5,
      }), false);
  }


  entry();

}(document));
