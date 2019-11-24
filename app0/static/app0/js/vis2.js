var violenceData = JSON.parse(document.getElementsByTagName('dataV')[0].getAttribute('violence-vals') || '{}');
var homicideData = JSON.parse(document.getElementsByTagName('dataH')[0].getAttribute('homicide-vals') || '{}');
var dataWomenV = violenceData.map(function(x) { return x.mujer }),
  dataMenV = violenceData.map(function(x) { return x.hombre }),
  barLabels = violenceData.map(function(x) { return x.edad });

var dataWomenH = homicideData.map(function(x) { return x.mujer }),
  dataMenH = homicideData.map(function(x) { return x.hombre });

var dataV = violenceData.map(function(x) { return x.total });
var dataH = homicideData.map(function(x) { return x.total });
var total = dataV.map(function(x, i) {
  if(dataH[i]){
    return x + dataH[i]
  } else {
    return x
  }});

var selectorColor = "#AAD9BC",
		clickColor = "#FFFF66",
    violenceColor = "#ffcccc",
    homicideColor = "#FF6666";

var width = 350,
    leftMargin = 100,
    topMargin = 30,
    barHeight = 20,
    barGap = 5,
    tickGap = 5,
    tickHeight = 10,
    scaleFactor = width / (dataV.reduce(function(a, b) {
        return Math.max(a, b);
      }) + dataH.reduce(function(a, b) {
          return Math.max(a, b);
        })),
    barSpacing = barHeight + barGap,
    translateText = "translate(" + leftMargin + "," + topMargin + ")",
    scaleText = "scale(" + scaleFactor + ",1)";


var selector = d3.select("#selector_chart");

var svg_selector = selector.append("svg")
    .attr("width", 500);


var barGroupV = svg_selector.append("g")
    .attr("transform", translateText + " " + scaleText)
    .attr("class", "bar");

barGroupV.selectAll("rect")
     .data(total)
     .enter().append("rect")
     .attr("x", 0)
     .attr("y", function(d,i) {return i * barSpacing})
     .attr("width", function(d) {return d})
     .attr("height", barHeight)
     .attr("fill", selectorColor)
     .on("click", handleClick)
     .on("mouseover", handleMouseOver)
     .on("mouseout", handleMouseOut);

var totals = svg_selector.append("g")
    .attr("transform", translateText)
    .attr("class","bar-totals");

totals.selectAll("text")
    .data(total)
    .enter().append("text")
    .attr("x",function(d) {return d*scaleFactor + 30})
    .attr("y", function(d,i) {return i * barSpacing + barHeight*(2/3)})
    .text(function(d) {return d})
    .style("font-size", 13)
    .style("fill", "#808080")


var barLabelGroup = svg_selector.append("g")
     .attr("transform", translateText)
     .attr("class","bar-label");

barLabelGroup.selectAll("text")
    .data(barLabels)
    .enter().append("text")
    .attr("x",-5)
    .attr("y", function(d,i) {return i * barSpacing + barHeight*(2/3)})
    .text(function(d) {return d})
    .style("fill", "#808080");

var yAxisLabel = svg_selector.append("g")
  .attr("transform", translateText)
  .attr("class","axis-label");

yAxisLabel.selectAll("text")
  .data(["Edad de la victima"])
  .enter().append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -75)
  .attr("x", -((barLabels.length * barSpacing) / 2))
  .attr("dy", "1em")
  .style("fill", "#808080")
  .style("font-size", 15)
  .text(function(d) {return d});

var graphTitle = svg_selector.append("g")
  .attr("transform", translateText)
  .attr("class","axis-label");

graphTitle.selectAll("text")
	.data(["Incidentes de violencia por edad"])
	.enter().append("text")
	.attr("y", -10)
	.attr("x", 80)
	.style("font-size", 20)
	.style("font-weight", "bold")
	.style("fill", "#606060")
	.text(function(d) {return d});

var listOn = [];

function handleClick(d, i) {
  var alredySelected = false;
  for(j = 0; j < listOn.length; j++) {
    if(i == listOn[j]){
      alredySelected = true;
      break;
    }
  }
  if(alredySelected) {
    d3.select(this).attr("isClicked", "false")
    d3.select(this).attr("fill", selectorColor);
    // remove from list
    tmp = [];
    for(j = 0; j < listOn.length; j++) {
      if(listOn[j] != i) {
        tmp.push(listOn[j])
      }
    };
    listOn = tmp;
  } else {
    listOn.push(i)
    // Use D3 to select element, change color and size
    d3.select(this).attr("isClicked", "true")
    d3.select(this).attr("fill", clickColor);
  }
  updateDetails(detailsChart, listOn);
}

function handleMouseOver(d, i) {
	d3.select(this).attr( "fill", clickColor);
}

function handleMouseOut(d, i) {
	if(d3.select(this).attr("isClicked") == "true") {
		d3.select(this).attr("fill", clickColor);
	} else {
		d3.select(this).attr( "fill", selectorColor);
	}
}

var womenDetailsV = violenceData.map(function(d) {return d.mujer}).reduce(function(a, b) {
  return a + b;
});

var menDetailsV = violenceData.map(function(d) {return d.hombre}).reduce(function(a, b) {
  return a + b;
});

var womenDetailsH = homicideData.map(function(d) {return d.mujer}).reduce(function(a, b) {
  return a + b;
});

var menDetailsH = homicideData.map(function(d) {return d.hombre}).reduce(function(a, b) {
  return a + b;
});

var ctx = document.getElementById("details_chart").getContext('2d');
var detailsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
          "Mujeres",
          "Hombres",
        ],
        datasets: [{
            label: 'Violencia Interpersonal',
            data: [womenDetailsV, menDetailsV],
            backgroundColor: violenceColor,
        },
        {
            label: 'Homicidios',
            data: [womenDetailsH, menDetailsH],
            backgroundColor: homicideColor,
        },]
        },
    options: {
      title: {
          display: true,
          text: "Numero de incidentes de violencia",
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

          }
        }]
      }
    }
});

function updateDetails(chart, list) {
  if(list.length == 0) {
    chart.data.datasets.forEach((dataset) => {
      if(dataset.label == "Violencia Interpersonal") {
        dataset.data = [womenDetailsV, menDetailsV]
      } else {
        dataset.data = [womenDetailsH, menDetailsH]
      }
    });
    //console.log(chart.data.datasets);
    chart.update();
    return;
  }

  var wDataV = 0;
  var mDataV = 0;
  var wDataH = 0;
  var mDataH = 0;
  for(j = 0; j<list.length; j++) {
    i = list[j];
    wDataV += dataWomenV[i];
    wDataH += dataWomenH[i];
    mDataV += dataMenV[i];
    mDataH += dataMenH[i];
  }
    chart.data.datasets.forEach((dataset) => {
      if(dataset.label == "Violencia Interpersonal") {
        dataset.data = [wDataV, mDataV]
      } else {
        dataset.data = [wDataH, mDataH]
      }
    });
    //console.log(chart.data.datasets);
    chart.update();
}
