# dot.css

> box-shadow as pixels


### wat

**dot.css** is a piece of code that will paint any given image onto another element, using a single `box-shadow` property(!).


### why

> why are you doing this? also, how can it be used? what is it good for?  

i dunno. you figure it out. and let me know, seriously.


### how

1. take the image element, and pour its contents into a canvas
1. from that canvas, get data about pixel coordinates and colors
1. maybe change stuff, like pixel size and output image width
1. build a `box-shadow` multivalue, using the altered data

