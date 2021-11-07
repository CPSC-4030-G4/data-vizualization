const handleChange = (publisher) => {

  document.getElementById("chart-title").innerHTML = "Global Game Sales by Platform for Most Popular Publishers"
  var div = d3.select("div");
  div.selectAll("*").remove();
  const margin = {top: 30, right: 30, bottom: 70, left: 100},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const nintendo = ['Wii', 'GBA', 'GB', 'DS', 'SNES', 'NES', 'WiiU', '3DS', 'GC', 'N64']
const playstation = ['PS2', 'PS3', 'PSV', 'PSP', 'PS', 'PS4']
const microsoft = ['XB', 'X360', 'XOne']
let platforms = []
let choice = publisher.toLowerCase()

color = ""

let sales_map = {}

if(choice == 'nintendo') {
  platforms = nintendo
  color = "#e4000f"
}
else if(choice == 'sony') {
  platforms = playstation
  color = "#003087"
}
else {
  platforms = microsoft
  color = '#107C10'
}

platforms.forEach(element => sales_map[element] = 0);

console.log(sales_map)

// append the svg object to the body of the page
const svg = d3.select("#bar-graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .text("life expectancy (years)")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// // Parse the Data
d3.csv("./vgsales.csv").then( function(dataset) {
  console.log(dataset)
  const data = dataset.filter((d) => d['Global_Sales'] != 'N/A')
  const platformed_data = data.filter((d)=> {
    return platforms.includes(d['Platform'])
  })
 

  platformed_data.forEach( d => {
    sales_map[d['Platform']] += +d['Global_Sales']
  });

  const sales = Object.values(sales_map)

const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(platformed_data.map(d => d['Platform']))
  .padding(0.2);


  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  
    svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width / 1.5)
            .attr("y", height + 50)
            .text(`Platforms developed by ${publisher}`)
            .attr("fill", "white")


// // Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(sales)])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("x", -(height) / 3)
  .attr("y", -50)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .attr("fill", "white")
  .text("Global Sales (Millions)")

  svg.selectAll("mybar")
  .data(platformed_data)
  .join("rect")
    .attr("x", d => x(d['Platform']))
    .attr("y", d => y(+sales_map[d['Platform']]))
    .attr("width", x.bandwidth())
    .attr("height", d => {
     return height - y(+sales_map[d['Platform']])
    })
    .attr("fill", color)
    .on("mouseout",function(){
      svg.select(".tooltip").remove();
      d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
    })
})
}