<a href="https://vincerubinetti.github.io/svg-to-png/">
  <img height="150" src="https://raw.githubusercontent.com/vincerubinetti/svg-to-png/main/public/logo.png?raw=true">
</a>

# SVG to PNG

Convert SVG to PNG right in your browser, reliably and correctly

[**OPEN THE APP**](https://vincerubinetti.github.io/svg-to-png/)

## Screenshot

<a href="https://vincerubinetti.github.io/svg-to-png/">
  <img width="200" src="https://private-user-images.githubusercontent.com/8326331/373400743-44bd1a65-4654-4e24-9951-2d5807121b73.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjc5ODY2MjYsIm5iZiI6MTcyNzk4NjMyNiwicGF0aCI6Ii84MzI2MzMxLzM3MzQwMDc0My00NGJkMWE2NS00NjU0LTRlMjQtOTk1MS0yZDU4MDcxMjFiNzMucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MTAwMyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDEwMDNUMjAxMjA2WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZjIwNGQ0MTI5MjFhMzdiNTMyZGJiNzQzMzEwYzUyODJjOTkyNTk3ZTRjODc2NjNlN2U5YmJmZDgwZmI2OTY5OCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.fjc06XRbyhJPAav9crnSeksGVhxsOuZcczKmzWv5t50" />
</a>

## Motivation

There are many tools to convert SVGs to raster formats:
[Inkscape](https://inkscape.org/),
[ImageMagick](https://imagemagick.org/),
[ezgif.com](https://ezgif.com/svg-to-png/),
[convertio.co](https://convertio.co/svg-png/),
[online-convert.com](https://image.online-convert.com/convert/svg-to-png),
[cloudconvert.com](https://cloudconvert.com/svg-to-png), and more.
But in my experience, **these tools have a lot of problems correctly converting anything but the most basic of SVGs**.

If you work with SVGs a lot, you've probably run into this at some point too.
You draw an SVG in one program, and then open it in another to discover that all of your text is rotated, or a shape is misaligned, or whole elements of your image are just gone.

Or, if you're an SVG wizard who codes them by hand, you might use the [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) feature, or some elaborate [CSS `<styles>`'s](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS), or some [`<filter>`'s](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter) – only to find out that some GUI editor doesn't support those features, and the image is incomprehensible.

### _Why does this happen?_

Probably because the specification for the SVG format is enormous, and it's incredibly difficult to support all of the features it lays out.
Even for popular programs like Inkscape and ImageMagick that have large teams of developers, it's a monumental task to get everything right.

### _What's the solution?_

**Use a web browser to do the conversion.**
SVG is first and foremost a web standard.
It was designed for the web, and web browsers were the first to implement it.
It is meant to work well and be mixed in with other web technologies like HTML and CSS.
As such, in my experience, **modern web browsers such as Chrome and Firefox are always the most accurate tools at displaying/rendering SVGs**, especially for uncommon, new, or otherwise "advanced" features.

### _How does this tool work?_

This little web tool simply leverages your browser's built-in capability to accurately display/render SVGs.
Your browser "renders" the vector graphic to raster pixels so it can display it on the screen, and the tool essentially takes whatever pixels are on the screen and saves it as an image.

### _Why not just open the SVG in a browser and take a screenshot?_

This works fine for many cases.
But it becomes a pain if you need a very high resolution image, where you would have to take multiple screenshots and stitch them together.
Taking a screenshot also doesn't allow transparent backgrounds.
This tool alleviates both of these problems with the use of HTML5 [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Note about fonts

If your SVG has text in it, the fonts it uses may need to be installed on your system for the text to display properly, depending on how the SVG was exported or constructed.

## Related tools

- [svgexport](https://github.com/shakiba/svgexport), a browser-based SVG renderer as a node.js package
- [mybyways converter](https://mybyways.com/blog/convert-svg-to-png-using-your-browser)
- [Profesor08's converter](https://github.com/Profesor08/SVG-to-PNG)
