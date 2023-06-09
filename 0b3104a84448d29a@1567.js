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
31 Dec 2019,Bushfires over New Years,"The fire in Mogo cut all communication in the region. I heard nothing from my family there for 25 hours.","Shared"
1 Jan 2020,Sundown 2020 festival,"I danced while waiting to hear from my family.","Personal"
3 Jan 2020,State of Disaster in Victoria,"State of Disaster declared in Victoria with bushfire conditions expected to deteriorate.","Shared"
6 Jan 2020,Cambridge masks,"We ordered Cambridge masks to protect against bushfire smoke.","Personal"
8 Jan 2020,Offsite work activity,"I was nervous about smoke inhalation and paid for Ubers to the offsite to avoid asthma problems.","Personal"
16 Jan 2020,Air quality deteriorates,"We are monitoring air quality before leaving the house.","Shared"
20 Jan 2020,"Hailstorms, flash flooding, and thunderstorms","Canberra and NSW cop massive hailstorms. Victoria suffers hailstorms, thunderstorms, and flash flooding.","Shared"
25 Jan 2020,First COVID-19 case reported in Australia,"It's here!","Shared"
2 Feb 2020,Went to the zoo,"This was lovely.","Personal"
6 Feb 2020,Performance sync,"This was kinda brutal.","Personal"
8 Feb 2020,Started Animation course,"SVG Essentials & Animation, v2 by Sarah Drasner.","Personal"
20 Feb 2020,Train derailment in Victoria,"A train derailed in Wallan, killing 2 people.","Shared"
21 Feb 2020,Cancelled my train ticket,"The train derailment on the line I was supposed to take that weekend to Sydney meant I needed to replace my train ticket with a last-minute plane ticket.","Personal"
27 Feb 2020,ReactConf AU in Sydney,"2-day conference interstate. People were flying in with cases at this time.","Personal"
1 Mar 2020,First Covid death reported in Australia,"A 78-year-old Perth man, who was one of the passengers from the Diamond Princess.","Shared"
3 Mar 2020,Supermarkets begin rationing toilet paper,"Panic buying led to shortages in stores.","Shared"
4 Mar 2020,We all learn how to wash our hands,"See also: TikTok hand washing dance. See also: hand washing meme.","Shared"
10 Mar 2020,Culture Amp starts working from home,"A level playing field.","Personal"
12 Mar 2020,WHO officially declares COVID-19 a pandemic,"We stop talking about the novel coronavirus and start talking about the pandemic.","Shared"
12 Mar 2020,Tom Hanks and his wife Rita Wilson test positive,"Isolated in Gold Coast hospital.","Shared"
15 Mar 2020,Visited family in Melbourne,"Who knew there'd be so few trips after this?","Personal"
15 Mar 2020,Coles imposes 2-item limit on panic shoppers,"The purchase of mince, pasta, flour, dry rice, paper towels, paper tissues and hand sanitisers is limited to 2 items per customer. Toilet paper remains limited to 1 pack per customer.","Shared"
16 Mar 2020,State of Emergency,"Victoria declares state of emergency.","Shared"
16 Mar 2020,Ordered food online from CERES,"I felt so much relief at the ability to order food online again.","Personal"
19 Mar 2020,Australia closes its borders,"Closed the borders to all non-residents.","Shared"
19 Mar 2020,Ruby Princess cruise ship docked in Sydney,"Celebrity Solstice contributed 11 cases. Eventually 440 passengers on Ruby Princess tested positive.","Shared"
21 Mar 2020,Social distancing rules imposed,"Nation-wide social distancing. Indoor gatherings of fewer than 100 people are still allowed.","Shared"
22 Mar 2020,Dan Andrews says we shouldn't get on the beers,"“You won’t be able to go to the pub because the pub is shut,” said Premier Dan Andrews. “That doesn’t mean you can have all your mates around to [your] home and get on the beers, that’s not appropriate.”","Shared"
23 Mar 2020,Nation-wide lockdown begins,"From midday, 23 March, all pubs, clubs, restaurants, cinemas and indoor sporting venues across the country shut down.","Shared"
24 Mar 2020,Non-essential businesses closed,"For Victoria. Limit your day to day activities outside your home. If you don’t need to do it, don’t do it. If you have to go outside, keep a full arm-span (about 1.5 metres) between yourself and other people.","Shared"
28 Mar 2020,Finished one of Shirley Wu's D3 courses,"","Personal"
31 Mar 2020,JobKeeper wage subsidy program announced,"$70 billion to pay employers up to $1500 a fortnight per employee.","Shared"
31 Mar 2020,South Australia closes its borders,"Border towns have exceptions.","Shared"
2 May 2020,Outbreak reported at Victorian meatworks,"8 cases reported, later linked to 90 cases.","Shared"
15 May 2020,NSW eases restrictions on public gatherings,"","Shared"
18 May 2020,Flu shot,"I took a trip to the Chemist to get a flu shot so I couldn't catch Covid and the flu at the same time.","Personal"
19 May 2020,Virtual rent inspection,"This was such a fail.","Personal"
24 May 2020,"Rio Tinto destroys historic Aboriginal site","46,000-year-old Juukan Gorge cave in the Hammersley Ranges, WA, was destroyed.","Shared"
25 May 2020,The killing of George Floyd,"Black Lives Matter. Several protests followed in Australia around social issues faced by Indigenous Australians, including Aboriginal deaths in custody.","Shared"
25 May 2020,Published “Learning data viz with D3”,"This Medium article captured my first 30 days of a 100-day project.","Personal"
26 May 2020,Melbourne quarantine hotel cases escape,"A night duty manager and 5 security guards at Melbourne quarantine hotels tested positive leading to second wave in Melbourne.","Shared"
27 May 2020,Culture Amp lets go 36 people,"~8% of our global team.","Personal"
30 May 2020,Began two-week staycation,"I couldn't go anywhere, but it was lovely.","Personal"
6 Apr 2020,Ordered more sweatpants,"Working From Home this much requires more pants.","Personal"
7 Apr 2020,"High Court quashes George Pell convictions","“… the evidence did not establish guilt to the requisite standard of proof”","Shared"
12 Apr 2020,Finished second of Shirley Wu's D3 courses,"This is a great course.","Personal"
17 Apr 2020,Finished third of Shirley Wu's D3 courses,"I want to visualise things!","Personal"
25 Apr 2020,Started 100 days of data viz,"I published Observable notebooks daily.","Personal"
28 Apr 2020,Toilet paper panic buying,"People literally fighting over toilet paper.","Shared"
1 Jun 2020,Victorians allowed up to 20 visitors,"Up to 20 people in your home or in a public place. Restaurants, cafes and pubs can have up to 20 customers dine in, and businesses such as beauty therapists can see clients again.","Shared"
7 Jun 2020,Birthday celebration,"Visited family in Melbourne for birthday celebrations.","Personal"
12 Jun 2020,Friend's birthday,"I had dinner at a friend's house. It was strange figuring out how to interact and social distance indoors.","Personal"
22 Jun 2020,Victorians allowed only 5 visitors,"Households can only have five visitors.","Shared"
24 Jun 2020,Ended my physio streak,"I had managed 84 days of consistent physio.","Personal"
27 Jun 2020,WA relaxes its restrictions,"Normal life resumes over there.","Shared"
1 Jul 2020,Lockdown in Melbourne hotspots,"Not my area. 10 different Melbourne postcodes.","Shared"
2 Jul 2020,Judicial Inquiry Into Hotel Quarantine Program,"","Shared"
4 Jul 2020,Visited in-laws,"Further birthday celebrations.","Personal"
4 Jul 2020,2 more hotspot post codes locked down,"Friends are back in lockdown.","Shared"
7 Jul 2020,Upcoming Stage 3 restrictions announced,"Only allowed to leave the house for four reasons: shopping for food and essential items, care and caregiving, daily exercise, and work. This is when we should have fled to the country.","Shared"
8 Jul 2020,Victorian and NSW interstate border closed,"The border closed for the first time since the 1918–19 Spanish flu pandemic.","Shared"
8 Jul 2020,SA imposes hard border closure to Victorians,"Throws border towns into chaos. My family can't do their grocery shopping.","Personal"
21 Jul 2020,I officially resigned from my role,"This is one of the bigger risks I've ever taken.","Personal"
22 Jul 2020,Melbourne compulsory masks,"At 11.59pm, masks became mandatory. A fine of A$200 will apply to those not complying. 3 days notice was given for people to buy masks.","Shared"
25 Jul 2020,Covid-19 test,"I had a minor cough. Did drive through test.","Personal"
28 Jul 2020,Covid-19 test result was negative,"That was a good SMS to read.","Personal"
2 Aug 2020,Finished 100 days of data viz,"Oof. That was hard work!","Personal"
2 Aug 2020,Melbourne Stage 4 restrictions,"Curfew between 8pm and 5am. 5km travel restriction. Reduced business. Only one hour of exercise.","Shared"
2 Aug 2020,State of disaster,"Victoria declares state of disaster.","Shared"
8 Aug 2020,Six year anniversary with my partner,"We did nothing special.","Personal"
17 Aug 2020,Loved one's 40th birthday,"Iso birthdays involve lots of delivered food.","Personal"
4 Sep 2020,My final day at Culture Amp,"People were so nice.","Personal"
13 Sep 2020,Social bubbles in First Step for reopening,"Those living alone or single parents allowed to have one other person in their home. Playgrounds reopened. A reduction of the curfew by an hour.","Shared"
21 Sep 2020,Whales beached in Tasmania,"Within 3 days, upwards of 450 whales were beached.","Shared"
24 Sep 2020,Released significant changes to Typey Type,"I redesigned Typey Type for Stenographers, added new lessons, added a metronome, and made a bunch of fixes.","Personal"
27 Sep 2020,Restrictions starting to ease and curfew ended,"Public gathering limits increased up to 5 people from 2 households outdoors for social interaction.","Shared"
28 Sep 2020,Saw a friend at the park,"First non-stranger I've seen outside my house in 12 weeks.","Personal"
28 Sep 2020,Childcare reopened,"This was a big deal for many people.","Shared"
16 Oct 2020,Trip to hospital emergency department (not related to Covid),"We're ok. 4 hours 51 minutes was the longest I'd been outside my apartment in 14 weeks.","Personal"
18 Oct 2020,“Get on the Beers (featuring Dan Andrews)” remix goes viral,"Played at the Wine Machine festival in Swan Valley, WA, the viral remix by Mashd N Kutcher was officially release 26 Oct 2020."
19 Oct 2020,Restrictions further eased to 25km radius,"Two-hour time limit for exercise and socialising was lifted. Hairdressers allowed to open. Many allied health services allowed to have face-to-face services.","Shared"
19 Oct 2020,Visited the beach,"First time leaving my 5km bubble in 15 weeks (except for the hospital trip).","Personal"
20 Oct 2020,Offered a new role,"Prospect of employment!","Personal"
20 Oct 2020,Postal voted in local election,"Postal voting was so easy.","Personal"
26 Oct 2020,News of lockdown ending in 2 days,"I cried.","Shared"
26 Oct 2020,Donut Day shows 0 cases and 0 deaths in Vic,"Victorians celebrate by buying donuts in droves.","Shared"
27 Oct 2020,Dan Andrews confirms we can get on the beers,"“Can I confirm you are saying we can finally get on the beers?” a reporter asked at the presser. “I don’t know that I’ll be drinking a beer tonight,” replies Premier Dan Andrews. “I might go a little higher up the shelf.”","Shared"
28 Oct 2020,People no longer require a reason to leave home,"All retail, restaurants, hotels, cafes and bars allowed to open with capacity limits. Beauty, personal services and tattooing reopened, outdoor community and non-contact sport recommences. A maximum of 10 people allowed to attend weddings. A maximum of 20 mourners allowed to attend funerals. Faith and religious gatherings allowed to resume.","Shared"
1 Nov 2020,Saw Melbourne family,"First time since June.","Personal"
9 Nov 2020,Allowed to travel more than 25km,"Gyms and fitness studios opened, capacity limits for restaurants, hotels, cafes and bars increased, gathering limits for faith and religious gatherings increased, and indoor pools opened.","Shared"
9 Nov 2020,Ring of Steel around Melbourne opened,"Finally allowed to leave the city.","Shared"
9 Nov 2020,Saw out of Melbourne family for the first time in six months,"Left the city! It was glorious.","Personal"
10 Nov 2020,"Traditional Place names addressing guidelines","Australia Post's public endorsement of Traditional Place name addressing came during NAIDOC week.","Shared"
11 Nov 2020,Warnings of thunderstorm asthma,"I didn't need a puffer at this time.","Shared"
14 Nov 2020,Breakfast with a friend at a favourite cafe,"Potentially the last time we'll be here for years!","Personal"
15 Nov 2020,Brunch with friends,"What a concept! Finally met our friends' new twins.","Personal"
16 Nov 2020,South Australia locks down after outbreak,"","Shared"
19 Nov 2020,Ate out at a restaurant for dinner,"First time since… I can remember.","Personal"
20 Nov 2020,Saw Mum for the first time since January,"Such a moment.","Personal"
21 Nov 2020,South Australia ends its lockdown,"Successful tracing.","Shared"
23 Nov 2020,NSW opens its borders to Victoria,"Progress!","Shared"
23 Nov 2020,We moved out of Melbourne to regional Victoria,"Fleeeeeeeee!","Personal"
1 Dec 2020,Queensland opens its borders to Victoria,"Sunshine awaits!","Shared"
10 Dec 2020,Interest rates went negative,"The interest rate on Treasury notes went negative for the first time. The Australian government was paid to borrow money.","Shared"
13 Dec 2020,Early Christmas celebration,"Spent time with one part of the family in outback Victoria.","Personal"
18 Dec 2020,Sydney's Northern Beaches declared hotspot,"The national COVID-19 hotspot was declared because of the outbreak linked to 28 cases, later linked to 83 cases.","Shared"
19 Dec 2020,WA closes its border to NSW again,"The hard border closure prohibits travel from anywhere in NSW to WA without an exemption.","Shared"
20 Dec 2020,Christmas lunch,"Spent time with another part of the family in regional Victoria.","Personal"
21 Dec 2020,Applied for and received Queensland Border Pass,"Phew! There was not a lot of wriggle room for this.","Personal"
25 Dec 2020,Christmas day,"A small Christmas celebration.","Personal"
26 Dec 2020,Began road trip to Queensland,"We started a 4-day drive to move to Queensland.","Personal"
28 Dec 2020,Crossed border into Queensland,"We made it!","Personal"
30 Dec 2020,Victoria ended 61-day streak of no cases,"There were 3 community cases.","Shared"
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
  const timeParser = d3.timeParse("%d %b %Y %I:%M%p"); 
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
