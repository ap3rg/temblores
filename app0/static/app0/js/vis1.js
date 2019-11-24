var contextData_v = JSON.parse(document.getElementsByTagName('dataV')[0].getAttribute('data-v') || '{}');
var contextData_h = JSON.parse(document.getElementsByTagName('dataH')[0].getAttribute('data-h') || '{}');

var hourLabels = [
	"00:00-2:59",
	"3:00-5:59",
	"6:00-8:59",
	"9:00-11:59",
	"12:00-14:59",
	"15:00-17:59",
	"18:00-20:59",
	"21:00-23:59",
	"Sin dato"]

var _months = contextData_v.map(function(d) {
	date = d.date.split("-");
	year = date[0];
	month = date[1];

	return year + "-" + month;
})
let months = [...new Set(_months)];

var selectorColor = "#FF6666";
		clickColor = "#33CCCC"
		violenceColor = "#ffcccc"
		homicideColor = "#FF6666"

var dataV = buildData(contextData_v)[0];
		maxV = buildData(contextData_v)[1];
		dataH= buildData(contextData_h)[0];
		maxH = buildData(contextData_h)[1];

function buildData(context) {
	data = {};
	max = 0;
	for(i=0; i < months.length; i++ ){
		data[months[i]] = 0
	};

	context.map(function(x) {
		dateContext = x.date.split("-");
		year = dateContext[0];
		month = dateContext[1];
		date = year + "-" + month;

		itemTotal = x.instances.reduce(function(a, b) {
			return a + b;
		});
		total = data[date] + itemTotal;
		data[date] = total;
		if(total >= max) {
			max = total;
		}
	});

	return [data, max];
}

var width = 400,
    leftMargin = 100,
    topMargin = 70,
    barHeight = 20,
    barGap = 5,
    tickGap = 5,
    tickHeight = 10,
    scaleFactor = width / (maxV + maxH),
    barSpacing = barHeight + barGap,
    translateText = "translate(" + leftMargin + "," + topMargin + ")",
    scaleText = "scale(" + scaleFactor + ",1)";


var selector = d3.select("#selector_chart");
var svg_selector = selector.append("svg")
		.attr("height", 700)
		.attr("width", 550)

var barV = svg_selector.append("g")
   .attr("transform", translateText + " " + scaleText)
   .attr("class", "bar");

barV.selectAll("rect")
    .data(months)
    .enter().append("rect")
    .attr("x", 0)
    .attr("y", function(d,i) { return i * barSpacing })
    .attr("width", function(d) { return (dataV[d] + dataH[d]) })
    .attr("height", barHeight)
    .attr("fill", selectorColor)
		.on("click", handleClick)
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);


var barLabel = svg_selector.append("g")
     .attr("transform", translateText)
		 .attr("text-anchor", "end")
     .attr("class","bar-label");

barLabel.selectAll("text")
    .data(months)
    .enter().append("text")
    .attr("x", -5)
    .attr("y", function(d,i) {return i * barSpacing + barHeight*(2/3)})
    .text(function(d) {return d})
    .style("fill", "#808080");

var graphTitle = svg_selector.append("g")
  .attr("transform", translateText)
  .attr("class","axis-label");

graphTitle.selectAll("text")
	.data(["Incidentes de violencia por mes"])
	.enter().append("text")
	.attr("y", -30)
	.attr("x", 0)
	.style("font-size", 20)
	.style("font-weight", "bold")
	.style("fill", "#606060")
	.text(function(d) {return d});

var yAxisLabel = svg_selector.append("g")
  .attr("transform", translateText)
  .attr("class","axis-label");

yAxisLabel.selectAll("text")
  .data(["Rango de Mes"])
  .enter().append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -100)
  .attr("x", -(((months.length * barSpacing) / 2) + topMargin))
  .attr("dy", "1em")
  .style("fill", "#808080")
  .style("font-size", 15)
  .text(function(d) {return d});

var totals = svg_selector.append("g")
    .attr("transform", translateText)
    .attr("class","bar-totals");

totals.selectAll("text")
    .data(months)
    .enter().append("text")
    .attr("x",function(d) { return ((dataV[d] + dataH[d]) * scaleFactor) - 40 })
    .attr("y", function(d,i) {return i * barSpacing + barHeight*(2/3)})
    .text(function(d) { return (dataV[d] + dataH[d]) })
    .style("font-size", 13)
    .style("fill", "#FFFFFF");

function handleClick(d, i) {

  if(dictOn[months[i]]) {
    d3.select(this).attr( "fill", selectorColor);
		d3.select(this).attr( "isClicked", "false");
    // remove from list
    dictOn[months[i]] = 0;
  } else {
		dictOn[months[i]] = 1;
    // Use D3 to select element, change color and size
    d3.select(this).attr("fill", clickColor);
		d3.select(this).attr( "isClicked", "true");
  }
  updateDetails(chartHour, chartDay);
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

var ctx = document.getElementById("details_chart_hour").getContext('2d');
var chartHour = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: hourLabels,
        datasets: [{
            label: 'Violencia Interpersonal',
            data: [],
            backgroundColor: violenceColor,
        },
        {
            label: 'Homicidios',
            data: [],
            backgroundColor: homicideColor,
        },]
        },
    options: {
      title: {
          display: true,
          text: "Numero de incidentes de violencia (agregado por hora)",
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
						labelString: "Hora del incidente",
						fontSize: "20"
          }
        }]
      }
    }
});


var ctx = document.getElementById("details_chart_day").getContext('2d');
var chartDay = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Violencia Interpersonal',
            data: [],
            backgroundColor: violenceColor,
        },
        {
            label: 'Homicidios',
            data: [],
            backgroundColor: homicideColor,
        },]
        },
    options: {
      title: {
          display: true,
          text: "Numero de incidentes de violencia por dia",
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
						labelString: "Hora del incidente",
						fontSize: "20"
          }
        }]
      }
    }
});

var dictOn = {};
initGraphs();

function getHourInstanceData(data) {
	instancesTotal = [];
	for(j=0; j < hourLabels.length; j++){
		instancesTotal.push(0);
	}
	var instances = data.map(function(x) {
		dateContext = x.date.split("-");
		year = dateContext[0];
		month = dateContext[1];
		date = year + "-" + month;
		if(dictOn[date] == 1) {
			tmp = x.instances.map(function(d, i) { return instancesTotal[i] + d });
			instancesTotal = tmp;
		}
	})
	return instancesTotal;
}

function getDayInstanceData(data) {
	instancesTotal = [];
	dayLabels = [];
	// get dayLabels
	data.map(function(x) {
		dateContext = x.date.split("-");
		year = dateContext[0];
		month = dateContext[1];
		date = year + "-" + month;
		if(dictOn[date] == 1) {
			dayLabels.push(x.date);
			totalItem = x.instances.reduce(function(a , b) {
				return a + b;
			})
			instancesTotal.push(totalItem);
		}
	})
return [dayLabels, instancesTotal];
}

function initGraphs() {
	// Initialize listOn with all months on
	for(i=0;i<months.length;i++) {
		window.dictOn[months[i]] = 1;
	}

	instancesHourTotalV = getHourInstanceData(contextData_v);
	instancesHourTotalH = getHourInstanceData(contextData_h);
	instancesDayTotalV = getDayInstanceData(contextData_v)
	instancesDayTotalH = getDayInstanceData(contextData_h);
	initDayTotalH = instancesDayTotalH[1];
	initDayTotalV = instancesDayTotalV[1];
	initDayLabels = instancesDayTotalH[0];

	chartHour.data.datasets.forEach((dataset) => {
		if(dataset.label == "Violencia Interpersonal") {
			dataset.data = instancesHourTotalV;
		} else {
			dataset.data = instancesHourTotalH;
		}
	});
	chartDay.data.labels = initDayLabels;
	chartDay.data.datasets.forEach((dataset) => {
		if(dataset.label == "Violencia Interpersonal") {
			dataset.data = initDayTotalV;
		} else {
			dataset.data = initDayTotalH;
		}
	});
	//console.log(chart.data.datasets);
	chartHour.update();
	chartDay.update();

	// Initialize listOn with all months on
	var dictOn = {};
	for(i=0;i<months.length;i++) {
		window.dictOn[months[i]] = 0;
	}
}

function updateDetails(chartHour, chartDay) {
		onValues = 0;
		Object.keys(dictOn).forEach(function(key) {
			onValues += dictOn[key];
		})
		if(onValues == 0) {
			initGraphs();
			return;
		}

		instancesHourTotalV = getHourInstanceData(contextData_v);
		instancesHourTotalH = getHourInstanceData(contextData_h);
		dataDayV = getDayInstanceData(contextData_v);
		dataDayH = getDayInstanceData(contextData_h);
		dayLabels = dataDayH[0];
    chartHour.data.datasets.forEach((dataset) => {
      if(dataset.label == "Violencia Interpersonal") {
        dataset.data = instancesHourTotalV
      } else {
        dataset.data = instancesHourTotalH
      }
    });
		chartDay.data.labels = dayLabels;
		chartDay.data.datasets.forEach((dataset) => {
      if(dataset.label == "Violencia Interpersonal") {
        dataset.data = dataDayV[1]
      } else {
        dataset.data = dataDayH[1]
      }
    });
    //console.log(chart.data.datasets);
    chartHour.update();
		chartDay.update();
}
