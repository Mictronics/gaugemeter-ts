# GaugeMeter.ts - not a jQuery Plugin

An elegant and dynamic animated graphical gauge meter built Typescript. GaugeMeter.ts is highly customizable and includes full-radial, semi-radial &amp; arch dials.

#### GaugeMeter.ts Features

- [No jQuery required](https://youmightnotneedjquery.com).
- Just one script, there is no other dependencies.
- Built-in themes.
- HTML5 renders the Canvas content without images.
- Add custom text & label.
- Support for any page size and page color.
- Configure via data attributes, object properties on call or default settings.
- Update via function call.
- Backward compatible with GaugeMeter jQuery plugin. Equal CSS and HTML code. Javascript requires minor code changes.

[See demo page for details](https://www.mictronics.de/gaugemeter/index.html)

#### Requirements

- HTML5 compatible web browser.

#### Implementation

Include the following JavaScript Code, CSS and HTML code to render a minimal form of the GaugeMeter.

**jQuery & JavaScript Code**

```html
<script src="./GaugeMeter.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const gauges = document.getElementsByClassName('GaugeMeter');
  for (const gauge of gauges) {
    const meter = new GaugeMeter(gauge);
  }
});
</script>
```

**CSS Styles**

```css
.GaugeMeter {
  position: Relative;
  text-align: Center;
  overflow: Hidden;
  cursor: Default;
}

.GaugeMeter SPAN,
.GaugeMeter B {
  margin: 0 23%;
  width: 54%;
  position: Absolute;
  text-align: Center;
  display: Inline-Block;
  color: RGBa(0, 0, 0, 0.8);
  font-weight: 100;
  font-family: 'Open Sans', Arial;
  overflow: Hidden;
  white-space: NoWrap;
  text-overflow: Ellipsis;
}
.GaugeMeter[data-style='Semi'] B {
  margin: 0 10%;
  width: 80%;
}

.GaugeMeter S,
.GaugeMeter U {
  text-decoration: None;
  font-size: 0.5em;
  opacity: 0.5;
}

.GaugeMeter B {
  color: Black;
  font-weight: 300;
  font-size: 0.5em;
  opacity: 0.8;
}
```

**HTML Code**

Minimal Implementation. The code below is all you will need to render a basic gauge meter with 0 indication.

```html
<div class="GaugeMeter" id="GaugeMeter_1"></div>
```

Basic Implementation. The code below is all you will need to render a basic gauge meter with 10 indication.

```html
<div class="GaugeMeter" id="GaugeMeter_1" data-percent="10"></div>
```

Update the gauge value and its indication via update function call.

```javascript
const meter103 = new GaugeMeter(document.getElementById('GaugeMeter_103'));
meter103.update({ percent: 15 });
```

Below is a list of all the optional parameters, see the Parameter Definitions for more details on how to utilize these data attributes.

```html
<div
  class="GaugeMeter"
  id="GaugeMeter_1"
  data-percent="10"
  data-min="-100"
  data-used="256"
  data-total="1024"
  data-size="200"
  data-prepend="$"
  data-append=".00"
  data-theme="Red-Gold-Green"
  data-color="Blue"
  data-back="Silver"
  data-width="2"
  data-style="Semi"
  data-stripe="2"
  data-animationstep="0"
  data-animate_gauge_colors="1"
  data-animate_text_colors="1"
  data-label="VISA Card"
  data-label_color="#FF0000"
  data-text="Spendings"
  data-text_size="0.22"
  data-fill="#FFFFFF"
  data-showvalue="0"
></div>
```

---

#### Parameter Definitions

The form of the gauge meter can be manipulated by means of the following parameters. These parameters can be passed in to the library via HTML5 tag data attributes, as illustrated in the HTML example code above or as object properties when calling the library. The following table elaborates upon each of the parameter properties. All property values shall be given as strings.[See MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).

| Attribute                         | Optional |    Defaults     | Values                                                                                                                                                                                                                                                                                                                                          | Description                                                                                                                                                                                                         |
| --------------------------------- | :------: | :-------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **_`data-percent`_**              |    No    |        0        | Any positive integer, between 0 to 100.                                                                                                                                                                                                                                                                                                         | The value to set the gauge meter to.                                                                                                                                                                                |
| **_`data-min`_**                  |   Yes    |      null       | Any integer.                                                                                                                                                                                                                                                                                                                                    | The minimum value of the gauge meter. Negative values show in combination with `data-showvalue=true`.                                                                                                               |
| **_`data-used`_**                 |   Yes    |      null       | Any positive integer.                                                                                                                                                                                                                                                                                                                           | Display a percentage of a value that overrides any `data-percent` defined count. To show "25%" of 512 GB of RAM being used, you would specify "128" here and "512" for `data-total`.                                |
| **_`data-total`_**                |   Yes    |      null       | Any positive integer.                                                                                                                                                                                                                                                                                                                           | Display a percentage of a value that overrides any `data-percent` defined count. To show "25%" of 512 GB of RAM being used, you would specify "512" here and "128" for `data-used`.                                 |
| **_`data-text`_**                 |   Yes    |      null       | Any short string.                                                                                                                                                                                                                                                                                                                               | Replaces the `data-percent` count in the center of the gauge.                                                                                                                                                       |
| **_`data-text_size`_**            |   Yes    |      0.22       | Any positive float between 0.0 and 0.5.                                                                                                                                                                                                                                                                                                         | Scale factor for text size (indicated value or text in gauge center) in relation to gauge size.                                                                                                                     |
| **_`data-prepend`_**              |   Yes    |      null       | Any string (2 bytes max).                                                                                                                                                                                                                                                                                                                       | Adds this text before the percent count in the center of the gauge.                                                                                                                                                 |
| **_`data-append`_**               |   Yes    |      null       | Any string (2 bytes max).                                                                                                                                                                                                                                                                                                                       | Adds this text after the percent count in the center of the gauge. Typical use would be a "%" symbol.                                                                                                               |
| **_`data-size`_**                 |   Yes    |       100       | Any positive integer.                                                                                                                                                                                                                                                                                                                           | Width & height of the gauge meter in pixels.                                                                                                                                                                        |
| **_`data-width`_**                |   Yes    |        3        | Any positive integer.                                                                                                                                                                                                                                                                                                                           | Thickness of the gauge meter progress bar in pixels.                                                                                                                                                                |
| **_`data-style`_**                |   Yes    |      Full       | Full, Semi or Arch                                                                                                                                                                                                                                                                                                                              | Displays either a full circle, semi-circle or an arched-circle.                                                                                                                                                     |
| **_`data-color`_**                |   Yes    |     #2C94E0     | Hex values (#FFFFFF), Red-Green-Blue-Alpha color space (RGBa(255,255,255,1.0)) or HTML color-name (Red)                                                                                                                                                                                                                                         | The foreground-color of the gauge meter's progress bar. This value is overridden if `data-theme` is specified.                                                                                                      |
| **_`data-back`_**                 |   Yes    | RGBa(0,0,0,.06) | Hex values (#FFFFFF), Red-Green-Blue-Alpha color space (RGBa(255,255,255,1.0)) or HTML color-name (Green)                                                                                                                                                                                                                                       | The background-color of the gauge meter's progress bar.                                                                                                                                                             |
| **_`data-theme`_**                |   Yes    | Red-Gold-Green  | <ul><li>Red-Gold-Green</li><li>Green-Gold-Red</li><li>Green-Red</li><li>Red-Green</li><li>DarkBlue-LightBlue</li><li>LightBlue-DarkBlue</li><li>DarkRed-LightRed</li><li>LightRed-DarkRed</li><li>DarkGreen-LightGreen</li><li>LightGreen-DarkGreen</li><li>DarkGold-LightGold</li><li>LightGold-DarkGold</li><li>White</li><li>Black</li></ul> | Color & gradient themes to fill the foreground-color of the gauge meter's progress bar with.                                                                                                                        |
| **_`data-animate_gauge_colors`_** |   Yes    |      false      | Boolean, false or true.                                                                                                                                                                                                                                                                                                                         | When enabled, the foreground-color of the gauge meter's progress bar will cycle according to the color value, as directed by the `data-theme`. If enabled, this overrides any values specified by the `data-color`. |
| **_`data-animate_text_colors`_**  |   Yes    |      false      | Boolean, false or true.                                                                                                                                                                                                                                                                                                                         | When enabled, the percentage text color of the gauge meter will cycle according to the color value, as directed by the `data-theme`. If enabled, this overrides any values specified by the `data-label_color`.     |
| **_`data-label`_**                |   Yes    |      null       | Any short string.                                                                                                                                                                                                                                                                                                                               | Supplemental text label that can appear below the central percentage or text of the gauge meter.                                                                                                                    |
| **_`data-label_color`_**          |   Yes    |      Black      | Hex values (#FFFFFF), Red-Green-Blue-Alpha color space (RGBa(255,255,255,1.0)) or HTML color-name (Blue)                                                                                                                                                                                                                                        | The foreground text color of the supplemental text label.                                                                                                                                                           |
| **_`data-stripe`_**               |   Yes    |        0        | Any positive integers.                                                                                                                                                                                                                                                                                                                          | Show the gauge meter's progress bar in solid form or stripe form. If the value is greater than 0, the gauge meter's progress bar changes from a solid to a stripe, where the value is the thickness of the stripes. |
| **_`data-fill`_**                 |   Yes    |      null       | Hex values (#FFFFFF), Red-Green-Blue-Alpha color space (RGBa(255,255,255,1.0)) or HTML color-name (Blue)                                                                                                                                                                                                                                        | Fill color of internal gauge background area where prepend, append and gauge text is shown.                                                                                                                         |
| **_`data-animationstep`_**        |   Yes    |        0        | Any positive integer.                                                                                                                                                                                                                                                                                                                           | Step width used for animation when gauge bargraph is drawn. Higher number results in higher animation speed. 0 stops animation.                                                                                     |
| **_`data-showvalue`_**            |   Yes    |      false      | Boolean, false or true.                                                                                                                                                                                                                                                                                                                         | Label will show value instead of percent. Gauge bargraph will show 0-100% or computation of `data-used` and `data-total`.                                                                                           |

See [doc.html](src/doc.html) for more details.
