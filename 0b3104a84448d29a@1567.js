// https://observablehq.com/@didoesdigital/2020-timeline@1567
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# 2020 Timeline`
)}

function _2(md){return(
md`To make your own timeline, enter your events [below](https://observablehq.com/@didoesdigital/2020-timeline#csv).`
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
    .attr("title", "Timeline of Melbourne in 2020")
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
      .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
      .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
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
      .style("fill", ([d]) => d.sharedOrPersonal === "Shared" ? labelDefaultColor : labelPersonalColor)
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
      .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
      .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor);
    
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
        .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
        .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
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
md`## About this timeline`
)}

function _6(md){return(
md`I created this timeline to make sense of this nonsense year. I couldn't recall the order of certain events, or get a sense of how much time had really passed. How long was lockdown anyway? So I recorded all the events that happened to myself and those around me living in Melbourne in 2020.`
)}

function _7(md){return(
md`You might also enjoy reading [The Year of Blur By Alex Williams - The New York Times](https://www.nytimes.com/2020/10/31/style/the-year-of-blur.html). This explains the brain fog, the strange sense of time, the drinking, the worrying, and other bizarre aspects of experiencing 2020.`
)}

function _8(md){return(
md`Here are some of the things that happened throughout the year that this timeline doesn't capture:

- The ambiguity and fuzziness of rule changes and guidance. While I've noted the major "lockdown" periods, there were periods before, after, and in between when we were still fairly significantly impeded. Between lockdowns, we were technically allowed out to cafes, but strongly discouraged. It was hard to know what to do.
- The bushfire season in Australia that burned 18.6 million hectares, destroyed over 5,900 buildings, killed at least 34 people, and killed 3 billion animals.
- The uncertainty of what risks we were taking leaving the house when we knew so little about the disease and how it was transmitted.
- Every time we discovered a horrifying new sympton of the COVID-19 disease.
- When we stopped being able to make plans. The future was so uncertain and there were so many restrictions that our horizon shrunk down to a day or two at best.
- Anxiety about shopping and buying food. How would we safely acquire food to eat? How would we deal with panic buying? Where would we get toilet paper from? How would we deal with 2-item limits? How would we deal with restrictions on online grocery shopping? How would we manage dietary needs and physical challenges?
- Sewing masks, baking sourdough, and all the hobbies we started.
- Deteriorating relations with China.
- The wider racial justice movement.
- Everything else that happened abroad: Captain Sir Thomas Moore raising £30 million for NHS Charities Together by walking, climate change, Scotland making sanitary products free, Africa declared free of wild polio, Trump's impeachment, Trump suggesting people drink bleach to cure the coronavirus, the Harvey Weinstein verdict, Kamala Harris as Democratic Vice President-Elect, the US election, the death of Ruth Bader Ginsburg, Brexit, the COVID-19 toll, Ukrainian Boeing 737 plane crash in Iran, Elliot Page announcing he is transgender, Prince Harry and Meghan Markle stepping back from royalty, Grimes and Elon Musk named their son “X AE A-12”, her Excellency Sarah Al Amiri is the science lead on Hope, the United Arab Emirates' first mission to Mars, and so much more…
`
)}

function _mdNotesAboutTheData(md){return(
md`## Notes about the data`
)}

function _10(md){return(
md`I focused on events that I personally remember happening when it happened, rather than those I heard about later. I also focused on events that directly affected Victorians and Australians, especially in Melbourne.`
)}

function _11(md){return(
md`For rule changes implemented at 11.59pm, I generally rounded up to the next day, because that's when the rule started having an impact on me. I also focused on when rules came into effect rather than when they were announced, except where the announcement itself was significant.`
)}

function _mdResources(md){return(
md`## Resources`
)}

function _13(md){return(
md`Here are some useful resources I found for looking up dates of events:

- [Wikipedia: 2020 in Australia](https://en.wikipedia.org/wiki/2020_in_Australia)
- [COVID-19 pandemic in Australia](https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Australia)
- [ABC: Victoria coronavirus restrictions: Daniel Andrews says Melbourne's lockdown to ease from Wednesday](https://www.abc.net.au/news/2020-10-26/coronavirus-restrictions-in-melbourne-easing-vic-premier-says/12813254): “people in Melbourne, who have been living under stage three restrictions since July 9 and stage four restrictions since August 2.”
- [ABC: Victoria in stage 3 coronavirus shutdown restrictions, 30 March 2020](https://www.abc.net.au/news/2020-03-30/victoria-stage-3-coronavirus-restrictions-as-cases-rise/12101632)
- Media releases such as [DHHS: Coronavirus update for Victoria - 1 June 2020](https://www.dhhs.vic.gov.au/coronavirus-update-victoria-1-june-2020)
- [ABC: Melbourne enters new coronavirus lockdown](https://www.abc.net.au/news/2020-07-07/melbourne-lockdown-daniel-andrews-key-points/12431708): “These stay-at-home orders will come into effect at 11:59pm on July 8”
- [ABC: Melbourne placed under stage 4 coronavirus lockdown](https://www.abc.net.au/news/2020-08-02/victoria-coronavirus-restrictions-imposed-death-toll-cases-rise/12515914)
- [ABC: Melbourne's coronavirus restrictions ease as Victorian Premier Daniel Andrews announces end to lockdown](https://www.abc.net.au/news/2020-10-26/melbourne-coronavirus-restrictions-daniel-andrews-lockdown/12812858): “The city will be able to take some "big steps" from 11:59pm on Tuesday October 27.”
`
)}

function _mdAppendix(md){return(
md`## Appendix`
)}

function _title(text){return(
text({title: "Chart title", placeholder: "2020 timeline", value: "Melbourne in 2020"})
)}

function _subtitle(text){return(
text({title: "Chart subtitle", value: "One Aussie’s effort to make sense of it"})
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
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Load Richlink,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Business info started,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Load keyboards message,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Business info closed,empty,Shared
20 05 2023,Click on CRM first time,deals/kanban,Shared
20 05 2023,Change archive mode,Archive clients,Shared
20 05 2023,Click button emptybox,empty,Shared
20 05 2023,Work,empty,Shared
20 05 2023,Change archive mode,Archive chats,Shared
20 05 2023,Success fetch archive by filter,Archive chats,Shared
`
)}

function _lockdownData(){return(
[
  {name: "Lockdown 1.0", startDate: new Date("2020", "2", "24", "6"), endDate: new Date("2020", "5", "1", "6"), description: "When social distancing began, we didn’t know much about the virus, such as how it spread or what precautions to take.\nIt was a difficult time."}, // zero-indexed month means "3" is March and "5" is June
  {name: "Lockdown 2.0", startDate: new Date("2020", "6", "9", "6"), endDate: new Date("2020", "9", "28", "6"), description: "The second time around was easier and harder. We knew the drill, routines were easier, but we’d burnt through a lot more of our reserves.\nIt was 110 days."}, // zero-indexed month means "6" is Jul and "9" is October
  {name: "Ring of Steel", startDate: new Date("2020", "9", "28", "6"), endDate: new Date("2020", "10", "8", "6"), description: "We continued to be trapped in Melbourne for another two weeks after lockdown “ended”."}, // zero-indexed month means "9" is October and "10" is November
]
)}

function _mdDataTable(md){return(
md`## Data table`
)}

function _accessibleDataTable(render_data_table,data){return(
render_data_table(data, {caption: "This data shows Melbourne in 2020, where Lockdown 1.0, Lockdown 2.0, and the Ring of Steel together take up a little more than half the year.", columns: ["Date", "Event", "Event description", "Personal or Shared"], focusable: false})
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

  // const extraPropertiesSource = {
  //   title: "My 2020 timeline",
  //   subtitle: "One Aussie's story"
  // };
  // return Object.assign(dataObjectTarget, extraPropertiesSource);
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
