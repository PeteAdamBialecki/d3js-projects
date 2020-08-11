## **Notes On D3.js and Chrome Console**

Tasks:

- Append a scalable vector graphic (svg) element to the course viewer window
- Set the appropriate scale for x and y coordinates
- Append a red circle to the svg

The placement of the circle on the x and y axis was determined by the type of scale used to describe the data (linear or log), the domain values (max and min values of data) and range (max and min pixel values available on each axis). We inverted the range values for the y axis to account for the fact that the top of the y axis has a pixel value of 0. The max value extends down the y-axis rather than up the y-axis.

Here are the steps you took to accomplish this in the JavaScript console while viewing a course viewer page in Chrome. Note that the quotes used in expressions are straight, plain quotes (text-only) not curly, smart quotes (rich text format).

    1. Paste contents of d3.min.js file into console.
    2. Expected Output: True
    3. Clear content from div in course viewer: Input: d3.select('.main').html('');
    4. Expected Output: >[Array[1]]
    5. Define svg variable: Input: var svg = d3.select('.main').append('svg')
    6. Expected Output: undefined
    7. Assign y axis linear scale to y variable. This axis describes life expectancy. Note that while the height of the svg is 300 pixels, only 250 are used for the y axis to leave a buffer. Also, for the y axis the max value comes first because of a quirk with how objects are drawn in the browser: highest value at bottom of axis. Input: var y = d3.scale.linear().domain([15,90]).range([250,0]);
    8. Expected Output: undefined
    9. Assign X axis scale to x variable. This axis describes annual income. Input: var x = d3.scale.log().domain([250,100000]).range([0,600]);
    10. Expected Output: undefined
    11. Assign radius scale to r variable. The radius corresponds to the square root of the population. Input: var r = d3.scale.sqrt().domain([52070, 1380000000]).range([10, 50]);
    12. Check scaling with console.log by plugging in life expectancy for China in y variable, and annual income per person for China in x variable, and population for China in r variable. Input: console.log(y(77), x(13330), r(1380000000));
    13. Expected Output appox: 43.33333333333314 398.1976156961321 50
    14. Append circle with attribute values for radius, fill color, center x and center y of circle: Input: svg.append('circle').attr('r', r(1380000000)).attr('fill','red').attr('cx', x(13330)).attr('cy', y(77));
    15. Expected Output: >[Array[1]]
    16. Look at placement of the circle in the svg, and compare with the placement in the original Gapminder World graph: http://www.gapminder.org/world/