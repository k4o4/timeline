// https://observablehq.com/@didoesdigital/2020-timeline@1567
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Users actions on the timeline`
)}

function _2(md){return(
md`To see your own events, enter them below in the .csv format.`
)}


function _eventsSelection(radio){return(
radio({
  title: 'Events',
  description: 'Please select which events to show',
  options: [
    { label: 'Shared', value: 'shared' },
    { label: 'Personal', value: 'personal' },
    { label: 'All', value: 'all' },
  ],
  value: 'shared'
})
)}

function _DiDoesDigital2020Timeline(d3,DOM,params,width,title,subtitle,axis,halo,lockdownData,y,data,dodge,labelSeparation,html)
{
  const markerDefaultColor = "#9880C2";
  const markerSelectedColor = "#9880C2";
  const markerFadedColor = "#E4DDEE";
  const markerPersonalColor = "#5598E2";

  const labelDefaultColor = "#331A5B";
  const labelSelectedColor = "#331A5B";
  const labelFadedColor = "#E4DDEE";
  const labelPersonalColor = "#093B72";
  
  const annotationDefaultColor = "#E4DDEE";
  const annotationPersonalColor = "#CADFF7";
  
  const svg = d3.select(DOM.svg(params.svg.width, params.svg.height))
    .attr("title", "What users did")
    .attr("id", "timeline");
  
  const chartBackground = svg.append("rect")
    .attr("id", "chart-background")
    .attr("fill", "#fff") // fallback for CSS
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", params.svg.width)
    .attr("height", params.svg.height);

  const chartTitle = svg.append("g")
      .attr("class", "chart-title")
      .append("text")
          .attr("id", "title-text")
          .attr("text-anchor", "start")
          .attr("x", width >= params.smallScreenSize ? 96 : params.event.offset)
          .attr("y", 24)
          .attr("dy", "2em")
          .style("font-weight", "700")
          .style("font-size", "clamp(1.2rem, 4vw, 2.5rem)") // minimum, preferred, maximum
          .text(title);

  const chartSubtitle = svg.append("g")
      .attr("class", "chart-subtitle")
      .append("text")
          .attr("text-anchor", "start")
          .attr("x", width >= params.smallScreenSize ? 96 : params.event.offset)
          .attr("y", 24)
          .attr("dy", "5.5em")
          .style("font-weight", "400")
          .style("font-size", "clamp(1rem, 2.5vw, 1.25rem)") // minimum, preferred, maximum
          .text(subtitle);

  const byline = svg.append("g")
    .attr("transform", `translate(${width >= params.smallScreenSize ? params.plot.x * 0.4 : params.event.offset}, ${params.svg.height - (params.margin.bottom / 2)})`)
    .append("text")
      .attr("id", "byline")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "0.5em")
      .text('Graphic by @DiDoesDigital');
  
  const plot = svg.append("g")
    .attr("id", "plot")
    .attr("transform", `translate(${width >= params.smallScreenSize ? params.plot.x : params.smallScreenMargin.left}, ${params.plot.y})`);

  const gy = plot.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(axis.y)
    .attr("aria-hidden", "true")
    .call(g => g.selectAll(".tick text").call(halo));
  
  const annotations = plot.append("g")
      .attr("class", "annotations")
      .selectAll("g")
      .data(lockdownData)
      .join("g");
  
  const annotationsLeftMargin = params.plot.x + 240 + 24;
  
  annotations.append("line")
      .attr("aria-hidden", "true")
      .attr("stroke", annotationDefaultColor)
      .attr("stroke-width", 3)
      .attr("x1", annotationsLeftMargin)
      .attr("x2", annotationsLeftMargin)
      .attr("y1", d => y(d.startDate))
      .attr("y2", d => y(d.endDate));
    
  annotations.append("text")
      .attr("x", annotationsLeftMargin + 24)
      .attr("y", d => y(d.startDate))
      .attr("dy", "0.7em")
      .style("font-size", 16)
      .style("font-weight", 600)
      .text(d => width >= params.mediumScreenSize ? d.name : '')
    
  annotations.append("text")
      .attr("x", annotationsLeftMargin + 24)
      .attr("y", d => y(d.startDate))
      .attr("dy", "2.0em")
      .style("font-size", 16)
      .style("font-weight", 400)
      .text(d => width >= params.mediumScreenSize ? d3.timeFormat("%e %b")(d.startDate) + " – " + d3.timeFormat("%e %b")(d.endDate) : '')
      // .text(d => d3.format("d")((d.endDate - d.startDate) / (1000*60*60*24)) + " days")

  const markers = plot.append("g")
    .attr("class", "markers")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(0, ${y(d.date)})`)
      .attr("aria-hidden", "true")
      // .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
      // .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
      // .attr("stroke-width", 1)
      .attr("cx", 0.5)
      .attr("cy", (params.marker.radius / 2) + 0.5)
      .attr("r", params.marker.radius);

  const dodgedYValues = dodge(data.map(d => y(d.date)), labelSeparation);
  // const dodgedYValues = data.map(d => y(d.date)); // for debugging alignment

  const eventLabels = plot.append("g")
    .attr("class", "eventLabels")
    .selectAll("text")
    .data(d => d3.zip(
      data,
      dodgedYValues,
    ))
    .join("text")
      .attr("class", "event-title")
      .style("font-weight", "400")
      // .style("fill", ([d]) => d.sharedOrPersonal === "Shared" ? labelDefaultColor : labelPersonalColor)
      .attr("x", width >= params.smallScreenSize ? params.event.offset : params.smallScreenEvent.offset)
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em");
    
  eventLabels.append("tspan")
      .text(([d]) => d.eventName);
  eventLabels.append("tspan")
      .text(([d]) => ` ${d.eventDescription} ${d3.timeFormat("%A, %e %B")(d.date)}`)
        .attr("x", width);
      // .text(([d]) => d.eventName);
  
  const tooltip = d3.create("div")
    .attr("class", "tooltip")
    .attr("aria-hidden", "true")
    .html(`
      <div class="tooltip-date">
        <span id="date"></span>
      </div>
      <div class="tooltip-name">
        <span id="name"></span>
      </div>
      <div class="tooltip-description">
        <span id="description"></span>
      </div>
    `);
  
  const rangeY = dodgedYValues.map(x => x + params.plot.y);
  const rangeY0 = rangeY[0];
  const fuzzyTextHeightAdjustment = 16
  
  svg.on("touchend mouseout", function(event) {
    markers
      .attr("fill", markerDefaultColor)
      .attr("stroke", markerDefaultColor);
    
    eventLabels
      .style("opacity", 1);
  });
  
  svg.on("touchmove mousemove", function(event) {
    const mouseY = d3.pointer(event,this)[1];
    const nearestEventY = rangeY.reduce((a, b) => Math.abs(b - mouseY) < Math.abs(a - mouseY) ? b : a);
    const dodgedIndex = rangeY.indexOf(nearestEventY);
    const dataEvent = data[dodgedIndex];

    if (mouseY >= rangeY0 - fuzzyTextHeightAdjustment) {

      eventLabels
        .filter((d, i) => i !== dodgedIndex)
        .style("opacity", 0.3);

      eventLabels
        .filter((d, i) => i === dodgedIndex)
        .style("opacity", 1);

      markers
        .filter((d, i) => i !== dodgedIndex)
        .attr("fill", markerFadedColor)
        .attr("stroke", markerFadedColor);

      markers
        .filter((d, i) => i === dodgedIndex)
        .attr("fill", markerDefaultColor)
        .attr("stroke", markerDefaultColor)
        .raise();
      
      tooltip.style("opacity", 1);
      tooltip.style("transform", `translate(${(width >= params.smallScreenSize ? params.plot.x + 8 : 0)}px, calc(-100% + ${nearestEventY}px))`);
      tooltip.select("#date")
        .text(d3.timeFormat("%A, %e %B")(dataEvent.date));
      tooltip.select("#name")
        .text(dataEvent.eventName);
      tooltip.select("#description")
        .text(dataEvent.eventDescription);
    }
  });

  svg.on("touchend mouseleave", () => tooltip.style("opacity", 0));

  return html`
    <figure style="max-width: 100%;">
      <div id="wrapper" class="wrapper">
        ${tooltip.node()}
        ${svg.node()}
      </div>
    </figure>
  </div>`;
  
  // return svg.node();
  // yield svg.node();
  // d3.selectAll(".event-name div").attr('class', 'teft');
}


function _mdAbout(md){return(
md``
)}

function _6(md){return(
md``
)}

function _7(md){return(
md``
)}

function _8(md){return(
md``
)}

function _mdNotesAboutTheData(md){return(
md``
)}

function _10(md){return(
md``
)}

function _11(md){return(
md``
)}

function _mdResources(md){return(
md``
)}

function _13(md){return(
md``
)}

function _mdAppendix(md){return(
md`## Appendix`
)}

function _title(text){return(
text({title: "Chart title", placeholder: "Timeline", value: "Timeline"})
)}

function _subtitle(text){return(
text({title: "Chart subtitle", value: ""})
)}

function _labelSeparation(slider){return(
slider({
  min: 12, 
  max: 48,
  step: 2, 
  value: 24, 
  title: "Label separation",
})
)}


function _csv(){return(
`Date,Event,Description,SharedOrPersonal
20 05 2023 00:01:16,Click button emptybox,empty,Shared
20 05 2023 00:01:18,Load Richlink,empty,Shared
20 05 2023 00:01:18,Click button emptybox,empty,Shared
20 05 2023 00:01:18,Business info started,empty,Shared
20 05 2023 00:01:18,Click button emptybox,empty,Shared
20 05 2023 00:01:18,Load keyboards message,empty,Shared
20 05 2023 00:01:18,Click button emptybox,empty,Shared
20 05 2023 00:01:18,Click button emptybox,empty,Shared
20 05 2023 00:01:18,Click button emptybox,empty,Shared
20 05 2023 00:01:19,Click button emptybox,empty,Shared
20 05 2023 00:01:20,Click button emptybox,empty,Shared
20 05 2023 00:01:52,Business info closed,empty,Shared
20 05 2023 00:01:56,Click on CRM first time,deals/kanban,Shared
20 05 2023 00:01:56,Change archive mode,Archive clients,Shared
20 05 2023 00:01:57,Click button emptybox,empty,Shared
20 05 2023 00:01:57,Work,empty,Shared
20 05 2023 00:01:58,Change archive mode,Archive chats,Shared
20 05 2023 00:01:58,Success fetch archive by filter,Archive chats,Shared
`
)}

function _lockdownData(){return(
[
  // {name: "Lockdown 1.0", startDate: new Date("2020", "2", "24", "6"), endDate: new Date("2020", "5", "1", "6"), description: "When social distancing began, we didn’t know much about the virus, such as how it spread or what precautions to take.\nIt was a difficult time."}, // zero-indexed month means "3" is March and "5" is June
  // {name: "Lockdown 2.0", startDate: new Date("2020", "6", "9", "6"), endDate: new Date("2020", "9", "28", "6"), description: "The second time around was easier and harder. We knew the drill, routines were easier, but we’d burnt through a lot more of our reserves.\nIt was 110 days."}, // zero-indexed month means "6" is Jul and "9" is October
  // {name: "Ring of Steel", startDate: new Date("2020", "9", "28", "6"), endDate: new Date("2020", "10", "8", "6"), description: "We continued to be trapped in Melbourne for another two weeks after lockdown “ended”."}, // zero-indexed month means "9" is October and "10" is November
]
)}

function _mdDataTable(md){return(
md`## Data table`
)}

function _accessibleDataTable(render_data_table,data){return(
render_data_table(data, {caption: "Sample text", columns: ["Date", "Event", "Event description", "Personal or Shared"], focusable: false})
)}

function _render_data_table(html,d3){return(
(data, options = {}) => {
  
  let caption = "";
  let ariaLabelledbyCaption = "";
  if (options.caption) {
    caption = `<caption id="caption">${options.caption}</caption>`;
    ariaLabelledbyCaption = `aria-labelledby="caption"`;
  }
  
  let theadRowHeaderCells;
  if (options.columns) {
    theadRowHeaderCells = options.columns.map((d) => {
      return `<th scope="col">${d}</th>`
    });
  }
  else {
    theadRowHeaderCells = Object.keys(data[0]).map((d, i) => {
      return `<th scope="col">${d}</th>`
    });
  }
  
  let focusable = 'tabindex="0"';
  if (options.focusable === false) {
    focusable = '';
  }
  
  return html`
  <div class="table-container" ${focusable} role="group" ${ariaLabelledbyCaption}>  
    <table>
      ${caption}
      <thead>
        <tr>${theadRowHeaderCells}</tr>
      <thead>
      <tbody>
        ${data.map(row => {
          return html`<tr>${Object.values(row).map((col, index) => {
            return index === 0 ? `<td>${d3.timeFormat("%A, %e %B")(col)}</td>`: `<td>${col}</td>`;
          })}</tr>`;
        })}
      </tbody>
    </table>
  </div>
`}
)}

function _data(sourceData,eventsSelection){return(
sourceData.filter(d => {
  if (eventsSelection === "shared") { return d.sharedOrPersonal === "Shared"; }
  else if (eventsSelection === "personal") { return d.sharedOrPersonal === "Personal"; }
  else { return true };
})
)}

function _sourceData(d3,csv)
{
  const timeParser = d3.timeParse("%d %m %Y %T"); 
  const csvString = csv;
  const rowConversionFunction = ({
        "Date": date,
        "Event": eventName,
        "Description": eventDescription,
        "SharedOrPersonal": sharedOrPersonal
      }) => ({
        date: timeParser(date + " 06:00AM"), // adjusting to 6AM instead of midnight aligns first of month circles with axis tick markers
        eventName, 
        eventDescription,
        sharedOrPersonal
      });
  return d3.csvParse(csvString, rowConversionFunction);

  // 22 Jul 2020
  // 20/05/23 00:01:57,Work,empty,Shared

  const extraPropertiesSource = {
    title: "Title B",
    subtitle: "Subtitle B"
  };
  return Object.assign(dataObjectTarget, extraPropertiesSource);
}


function _dodge(d3){return(
function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
  positions = Array.from(positions);
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error("invalid position");
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}
)}

function _y(d3,data,params){return(
d3.scaleUtc()
  .domain(d3.extent(data, d => d.date))//.nice()
  .range([params.plot.y, params.plot.height])
)}

function _axis(width,params,d3,y)
{
  const yAxis = width >= params.smallScreenSize ? 
        d3.axisRight(y)
            .tickPadding(-(params.margin.axisLeft))
            .tickSizeOuter(0)
            .tickSizeInner(-(params.margin.axisLeft))
        :
        d3.axisRight(y)
            .tickPadding(-(params.smallScreenMargin.axisLeft))
            .tickSizeOuter(0)
            .tickSizeInner(-(params.smallScreenMargin.axisLeft))
            .tickFormat(d3.timeFormat('%b'));

  return {y: yAxis};
}


function _params(width,data)
{
  let output = {};
  
  output["smallScreenSize"] = 768;
  output["mediumScreenSize"] = 940;
  
  output["svg"] = {
    "width":  width,
    "height": data.length * 48 // Roughly relative to number of data points but doesn't factor in the full timeline scale such as clustering or spread out data
  };
  
  output["margin"] = {
    "top":    104,
    "right":  96,
    "bottom": 192,
    "left":   240,
    "axisLeft": 144,
  };
  
  output["plot"] = {
    "x":      output["margin"]["left"],
    "y":      output["margin"]["top"],
    "width":  output["svg"]["width"]  - output["margin"]["left"] - output["margin"]["right"],
    "height": output["svg"]["height"] - output["margin"]["top"]  - output["margin"]["bottom"]
  };
  
  output["smallScreenMargin"] = {
    "top":    60,
    "right":  8,
    "bottom": 192,
    "left":   8,
    "axisLeft": 144,
  };

  output["smallScreenPlot"] = {
    "x":      output["margin"]["left"],
    "y":      output["margin"]["top"],
    "width":  output["svg"]["width"]  - output["margin"]["left"] - output["margin"]["right"],
    "height": output["svg"]["height"] - output["margin"]["top"]  - output["margin"]["bottom"]
  };

  output["marker"] = {
    "radius": 4
  }
  
  output["date"] = {
    "offset": output["marker"]["radius"] * 2
  }

  output["event"] = {
    "offset": output["marker"]["radius"] * 6
  }

  output["smallScreenEvent"] = {
    "offset": output["marker"]["radius"] * 4
  }
  
  return output;
}


function _halo(backgroundColor){return(
function halo(text) {
  text.clone(true)
      .each(function() { this.parentNode.insertBefore(this, this.previousSibling); })
      .attr("aria-hidden", "true")
      .attr("fill", "none")
      .attr("stroke", backgroundColor)
      .attr("stroke-width", 24)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .style("text-shadow", `-1px -1px 2px ${backgroundColor}, 1px 1px 2px ${backgroundColor}, -1px 1px 2px ${backgroundColor}, 1px -1px 2px ${backgroundColor}`);
}
)}

function _tooltipStyles(html){return(
html`
<style>
  .wrapper {
    position: relative;
  }

  .tooltip {
    background-color: #fff;
    border: 1px solid #5F428F;
    font-family: "Source Sans Pro", "Noto Sans", sans-serif;
    left: 0;
    max-width: 300px;
    opacity: 0;
    padding: calc(16px - 1px); /* border width adjustment */
    pointer-events: none;
    border-radius: 5px;
    position: absolute;
    top: -8px;
    transition: opacity 0.1s linear, transform 0.05s ease-in-out;
    z-index: 1;
  }

/*
  .tooltip:before {
    background-color: #fff;
    border-left-color: transparent;
    border-top-color: transparent;
    bottom: 0;
    content: '';
    height: 12px;
    left: 50%;
    position: absolute;
    transform-origin: center center;
    transform: translate(-50%, 50%) rotate(45deg);
    width: 12px;
    z-index: 1;
  }
*/

  .tooltip-date {
    margin-bottom: 0.2em;
    font-size: 0.7em;
    line-height: 1.2;
    font-weight: 400;
  }

  .tooltip-name {
    margin-bottom: 0.2em;
    font-size: 1em;
    line-height: 1.4;
    font-weight: 700;
  }

  .tooltip-description {
    margin-bottom: 0.2em;
    font-size: 0.8em;
    line-height: 1.4;
    font-weight: 400;
  }
</style>
`
)}

function _typographyStyles(html,params){return(
html`<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700;900&display=swap');

text {
  fill: #3C3941;
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
}

.event-title {
  fill: #3C3941;
  font-size: 16px;
  line-height: 1.4;
  font-family: "Source Sans Pro", "Noto Sans", sans-serif;
}

.event-title:hover {
  cursor: default;
}

.event-description {
  fill: #3C3941;
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
  transform: translateY(1em);
}

#title {
  fill: #3C3941;
  font: 600 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
}

.axis text {
  font: 400 16px/1.4 "Source Sans Pro", "Noto Sans", sans-serif;
  fill: #676170;
}

@media (max-width: ${params.smallScreenSize}px) {
  text,
  .event-title,
  .event-description,
  #title,
  .axis text {
    font-size: 14px;
  }
}

</style>
`
)}

function _chartStyles(html,backgroundColor){return(
html`<style>
  #chart-background {
    fill: ${backgroundColor};
  }

  .tick line,
  .domain {
    stroke: #E2E0E5;
  }
`
)}

function _backgroundColor(){return(
"#FAF9FB"
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof eventsSelection")).define("viewof eventsSelection", ["radio"], _eventsSelection);
  main.variable(observer("eventsSelection")).define("eventsSelection", ["Generators", "viewof eventsSelection"], (G, _) => G.input(_));
  main.variable(observer("DiDoesDigital2020Timeline")).define("DiDoesDigital2020Timeline", ["d3","DOM","params","width","title","subtitle","axis","halo","lockdownData","y","data","dodge","labelSeparation","html"], _DiDoesDigital2020Timeline);
  main.variable(observer("mdAbout")).define("mdAbout", ["md"], _mdAbout);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("mdNotesAboutTheData")).define("mdNotesAboutTheData", ["md"], _mdNotesAboutTheData);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("mdResources")).define("mdResources", ["md"], _mdResources);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("mdAppendix")).define("mdAppendix", ["md"], _mdAppendix);
  main.variable(observer("viewof title")).define("viewof title", ["text"], _title);
  main.variable(observer("title")).define("title", ["Generators", "viewof title"], (G, _) => G.input(_));
  main.variable(observer("viewof subtitle")).define("viewof subtitle", ["text"], _subtitle);
  main.variable(observer("subtitle")).define("subtitle", ["Generators", "viewof subtitle"], (G, _) => G.input(_));
  main.variable(observer("viewof labelSeparation")).define("viewof labelSeparation", ["slider"], _labelSeparation);
  main.variable(observer("labelSeparation")).define("labelSeparation", ["Generators", "viewof labelSeparation"], (G, _) => G.input(_));
  main.variable(observer("csv")).define("csv", _csv);
  main.variable(observer("lockdownData")).define("lockdownData", _lockdownData);
  main.variable(observer("mdDataTable")).define("mdDataTable", ["md"], _mdDataTable);
  main.variable(observer("accessibleDataTable")).define("accessibleDataTable", ["render_data_table","data"], _accessibleDataTable);
  main.variable(observer("render_data_table")).define("render_data_table", ["html","d3"], _render_data_table);
  main.variable(observer("data")).define("data", ["sourceData","eventsSelection"], _data);
  main.variable(observer("sourceData")).define("sourceData", ["d3","csv"], _sourceData);
  main.variable(observer("dodge")).define("dodge", ["d3"], _dodge);
  main.variable(observer("y")).define("y", ["d3","data","params"], _y);
  main.variable(observer("axis")).define("axis", ["width","params","d3","y"], _axis);
  main.variable(observer("params")).define("params", ["width","data"], _params);
  main.variable(observer("halo")).define("halo", ["backgroundColor"], _halo);
  main.variable(observer("tooltipStyles")).define("tooltipStyles", ["html"], _tooltipStyles);
  main.variable(observer("typographyStyles")).define("typographyStyles", ["html","params"], _typographyStyles);
  main.variable(observer("chartStyles")).define("chartStyles", ["html","backgroundColor"], _chartStyles);
  main.variable(observer("backgroundColor")).define("backgroundColor", _backgroundColor);
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  const child2 = runtime.module(define1);
  main.import("text", child2);
  const child3 = runtime.module(define1);
  main.import("slider", child3);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}

// document.querySelector("body > div:nth-child(4)").style.display = "none"
// document.querySelector("body > div:nth-child(5)").style.display = "none"