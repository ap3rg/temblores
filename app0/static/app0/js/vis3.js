var geoJson = document.getElementsByTagName('data')[0].getAttribute('Geojson');
var totals_v = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('totals_v') || '{}');
var totals_h = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('totals_h') || '{}');
var data_v = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('data_v') || '{}');
var data_h = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('data_h') || '{}');
var data_p = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('data_p') || '{}');

console.log(data_v)
console.log(data_p)
console.log(totals_v)

var selectorColor = "#003366";
		clickColor = "tomato"
    backgroundColor = "#E0E0E0"


var popDict = {};
var maxPop = 0;
data_p.map(function(x) {

  itemV = totals_v[x.departamento];
  itemH = totals_h[x.departamento];
  if(itemV == null) {
    itemV = 0;
  }
  if(itemH == null) {
    itemH = 0;
  }
  density = (itemV + itemH) * 1000 / x.population
  if(maxPop <= density) {
    maxPop = density;
  };
  popDict[x.departamento] = density

});

console.log(popDict)

var width = 500,
    height = 600,
    centered,
    totals_width = 1000,
    totals_height = 50,
    spacing = 5;

var selectedDepts = {}
data_p.map(function(x) {
  selectedDepts[x.departamento] = 0;
})

// Define color scale
var color = d3.scale.linear()
  .domain([0, maxPop])
  .clamp(true)
  .range(['#fff', selectorColor]);

var projection = d3.geo.mercator()
  .scale(1500)
  // Center the Map in Colombia
  .center([-74, 4])
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Set svg width & height
var svg = d3.select('#map')
  .attr('width', width)
  .attr('height', height)


// Add background
svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr("x", 50)
  .attr("y", -50)
  .style("fill", backgroundColor)

var svg_totals = d3.select('#totals')
  .attr('width', totals_width)
  .attr('height', totals_height)

// var totals = svg_totals.append('g');
//
// totals.selectAll("text")
//   .data(data_p.map(function(d) {
//       if(selectedDepts[d.departamento] == 1){ return (
//       {"dept": d.departamento,
//     "total" : totals_v[d.departamento]}
//   )} else {
//     return ({"dept": d.departamento,
//   "total" : 0})
//   }
//     }))
//   .enter().append("text")
//   .attr("y", 20)
//   .attr("x", function(d, i) {return totals_width /2 + (i * 100)})
//   .attr("text-anchor", "middle")
//   .text(function(x) { return (x.dept + ": " + x.total) })

var g = svg.append('g');

var mapLayer = g.append('g')
  .classed('map-layer', true);


// Load map data
d3.json(geoJson, function(error, mapData) {
  var features = mapData.features;

  // Update color scale domain based on data
  //color.domain([0, d3.max(features, population)]);

  // Draw each province as a path
  mapLayer.selectAll('path')
      .data(features)
      .enter().append('path')
      .attr('d', path)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('fill', fillFn)
      .attr("isClicked", false)
      .on("click", handleClick)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
});

// Get province name
function nameFn(d){
  return d && d.properties ? d.properties.NOMBRE_DPT : null;
}

// Get province name length
function nameLength(d){
  var n = nameFn(d);
  return n ? n.length : 0;
}

function population(d) {
  var n = nameFn(d);
  return popDict[n];
}

// Get province color
function fillFn(d){
  var n = nameFn(d);
  return color(popDict[n]);
}

function handleClick(d) {
  name = nameFn(d);
  console.log(name)
  var selected = false;
  // if it is not selected
  if(selectedDepts[name] == 0) {
    d3.select(this).style("fill", clickColor);
    selectedDepts[name] = 1;
  } else {
    d3.select(this).style('fill', fillFn(d));
    selectedDepts[name] = 0;
  }
  updateChart(deptDetails);
}

function mouseover(d){
  // Highlight hovered province
  d3.select(this).style('fill', clickColor);

}


function mouseout(d){
  // Reset province color
  name = nameFn(d);
  var selected = false;
  // if it is not selected
  if(selectedDepts[name] == 0) {
    d3.select(this).style('fill', fillFn(d));
  } else {
    d3.select(this).style('fill', clickColor);
  }
}

var ctx = document.getElementById("dept_details").getContext('2d');
var deptDetails = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Violencia Interpersonal',
            data: [],
            backgroundColor: "#ffcccc",
        },
        {
            label: 'Homicidios',
            data: [],
            backgroundColor: "lightseagreen",
        },]
        },
    options: {
      title: {
          display: true,
          text: "Numero de incidentes de violencia por municipio",
          fontSize: "20"
      },
      scales: {
        yAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: "Numero de incidentes",
            fontSize: "20"
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
						labelString: "Lugar del incidente",
						fontSize: "20"
          }
        }]
      }
    }
});

function updateChart(chart) {
  labels = []
  dataV = []
  dataH = []
  data_p.map(function(dept, i) {
    if(selectedDepts[dept.departamento] == 1) {
      departamento = dept.departamento
      if(data_v[departamento] != null){
        data_v[departamento].municipios.map(function(mun, i) {
          labels.push(departamento + ": " + mun )
          casoV = data_v[departamento].casos[i]
          if(data_h[departamento] != null) {
            casoH = data_h[departamento].casos[i]
          } else {
            casoH = 0
          }
          if(casoV == null){
            casoV = 0
          }
          if(casoH == null){
            casoH = 0
          }
          dataV.push(casoV)
          dataH.push(casoH)
        })
      }
    }
  })

  chart.data.labels = labels;
  chart.data.datasets.forEach((dataset) => {
    if(dataset.label == "Violencia Interpersonal") {
      dataset.data = dataV;
    } else {
      dataset.data = dataH;
    }
  });
  //console.log(chart.data.datasets);
  chart.update();
}
