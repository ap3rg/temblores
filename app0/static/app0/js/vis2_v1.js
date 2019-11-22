var sliderData = JSON.parse(document.getElementsByTagName('dataS')[0].getAttribute('sliders-vals') || '{}');
var violenceData = JSON.parse(document.getElementsByTagName('dataV')[0].getAttribute('violence-vals') || '{}');
var homicideData = JSON.parse(document.getElementsByTagName('dataH')[0].getAttribute('homicide-vals') || '{}');
const keys = Object.keys(violenceData);
getPlotData(["15-17", "25-29"])
var numericSliderData = sliderData.map(function (x) {
  if(x == ">80") {
    return "80"
  }
  return x.split("-")[0];
});
var sliderRange = d3
    .sliderBottom()
    .min(numericSliderData[0])
    .max(numericSliderData[numericSliderData.length - 1])
    .width(500)
    .tickValues(numericSliderData)
    .default([numericSliderData[3], numericSliderData[7]])
    .fill('#2196f3')
    .on('onchange', val => {
      d3.select('p#value-range').text("Rango de edad: " + concatRange(val.map(function(d1) {
        var start = translate(d1);
        return start;
      })));
      getPlotData(val.map(function(d1) {
        var start = translate(d1);
        return start;
      }));
    });

function concatRange(x) {
    if((x[0] != null) & (x[1] != null)){
      return x[0].split("-")[0] + "-" + x[1].split("-")[1];
    }
};

function translate(d) {
  var range;
  for(i = 0; i < sliderData.length; i++) {
    point = sliderData[i]
    if(point == ">80"){
      start = 80;
      end = 81;
    } else {
      start = parseInt(point.split("-")[0])
      end = parseInt(point.split("-")[1])
    };
    if((d >= start) & (d <= end)) {
      return start + "-" + end;
    };
  }
};

function getPlotData(x){
  start = x[0]
  end = x[1]
  if(start == end) {
    dataToPlot_v = violenceData[start];
    dataToPlot_h = homicideData[start];
  } else {
    var total_v = [0,0,0]
		var total_h = [0,0,0]
		var startFlag = false;
    for(i = 0; i < keys.length; i++) {
			var currentKey = keys[i];
			if(currentKey == start) {
				startFlag = true;
			};
			if(startFlag){
				var currentDateValues_v = violenceData[currentKey];
				var currentDateValues_h = homicideData[currentKey];
				if(currentDateValues_h == null) {
					currentDateValues_h = [0,0,0]
				}
				var sum_v = total_v.map(function (num, idx) {
				  return num + currentDateValues_v[idx];
				});
				var sum_h = total_h.map(function (num, idx) {
				  return num + currentDateValues_h[idx];
				});
				total_v = sum_v;
				total_h = sum_h;
			};
			if(currentKey == end) {
				startFlag = false;
			};
		};
    dataToPlot_v = total_v;
    dataToPlot_h = total_h;
  };
    plot(dataToPlot_v, dataToPlot_h);
}

  var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 800)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);

  d3.select('p#value-range').text("Rango de edad: " +
    sliderRange
      .value()
      .join('-')
  );


  function plot(dataToPlot_v, dataToPlot_h) {

    if (chart) {
      console.log("destroying")
      chart.destroy();
    }

  	var ctx = document.getElementById("age-chart").getContext('2d');
  	var chart = new Chart(ctx, {
  			type: 'bar',
  			data: {
  					labels: [
  						"Mujeres",
              "Hombres",
  						"Total"
  					],
  					datasets: [{
  							label: 'Violencia Interpersonal',
  							data: dataToPlot_v,
  							backgroundColor:
  							'rgba(255, 99, 132, 1)',
  					},
  					{
  							label: 'Homicidios',
  							data: dataToPlot_h,
  							backgroundColor:
  							'rgba(75, 192, 192, 1)',
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
  }
