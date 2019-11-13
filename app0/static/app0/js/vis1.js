

var contextData_v = JSON.parse(document.getElementsByTagName('dataV')[0].getAttribute('data-v') || '{}');
var contextData_h = JSON.parse(document.getElementsByTagName('dataH')[0].getAttribute('data-h') || '{}');
const keys = Object.keys(contextData_v);

var dataTime2017 = d3.range(0, 12).map(function(m) {
	 return new Date(2017, m, 01);
 });
 var dataTime2018 = d3.range(0, 12).map(function(m) {
 	 return new Date(2018, m, 01);
  });

dataTime = dataTime2017.concat(dataTime2018);

var defaultStart1 = new Date(2017, 8, 01);
var defaultStart2 = new Date(2018, 4, 01);

getRange("2017-08-01\t2018-04-01")


// Range
var sliderRange = d3
	.sliderBottom()
	.min(d3.min(dataTime))
	.max(d3.max(dataTime))
	.width(1500)
	.tickFormat(d3.timeFormat('%b-%Y'))
	.tickValues(dataTime)
	.default([defaultStart1, defaultStart2])
	.fill('#2196f3')
	.on('onchange', val => {
		d3.select('p#value-range').text(val.map(d3.timeFormat('%d-%b-%Y')).join('\ta\t'));
		getRange(val.map(d3.timeFormat('%Y-%m-%d')).join('\t'));
	});

function onCheckChange(){
	var sliderValues = document.getElementById('value-range').textContent;
	var currentValues = sliderValues.split("\ta\t");
	var start = new Date(currentValues[0]);
	start = start.toISOString().split("T")[0];
	var end = new Date(currentValues[1]);
	end = end.toISOString().split("T")[0];
	var val = start + "\t" + end;
	getRange(val);
};

function getRange(val) {
	var homicidiosOn = document.getElementById("homicidios");
	var violenciaOn = document.getElementById("violencia");
	start = val.split('\t')[0];
	end = val.split('\t')[1];

	if(start === end) {
		dataToPlot_v = contextData_v[start];
		dataToPlot_h = contextData_h[start];
	} else {
		var total_v = [0,0,0,0,0,0,0,0,0]
		var total_h = [0,0,0,0,0,0,0,0,0]
		var startFlag = false;
		for(i = 0; i < keys.length; i++) {
			var currentKey = keys[i];
			if(currentKey == start) {
				startFlag = true;
			};
			if(startFlag){
				var currentDateValues_v = contextData_v[currentKey];
				var currentDateValues_h = contextData_h[currentKey];
				if(currentDateValues_h == null) {
					currentDateValues_h = [0,0,0,0,0,0,0,0,0]
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

		//console.log(total);
		dataToPlot_v = total_v;
		dataToPlot_h = total_h;

		//console.log(dataToPlot);
	};

	grand_total_v = dataToPlot_v.reduce((a, b) => a + b, 0);
	grand_total_h = dataToPlot_h.reduce((a, b) => a + b, 0);

	var total_h = d3
		.select('p#total_h')
		.text("Total homicidios: " + grand_total_h)

	var total_h = d3
		.select('p#total_v')
		.text("Total actos violencia interpersonal: " + grand_total_v)


	if((homicidiosOn.checked == true) & (violenciaOn.checked == true)){
		plot_both(dataToPlot_v, dataToPlot_h);
	} else if ((homicidiosOn.checked == true) & (violenciaOn.checked == false)) {
		plot_both([], dataToPlot_h);
	} else if ((homicidiosOn.checked == false) & (violenciaOn.checked == true)) {
		plot_both(dataToPlot_v, []);
	} else {
		plot_both(dataToPlot_v, dataToPlot_h);
	};
};


var gRange = d3
	.select('div#slider-range')
	.append('svg')
	.attr('width', 2000)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
    sliderRange
      .value()
      .map(d3.timeFormat('%d-%b-%Y'))
      .join('\ta\t')
  );

function plot_both(dataToPlot_v, dataToPlot_h) {

	var ctx = document.getElementById("violence-chart").getContext('2d');
	var chart = new Chart(ctx, {
			type: 'bar',
			data: {
					labels: [
						"00:00-2:59",
						"3:00-5:59",
						"6:00-8:59",
						"9:00-11:59",
						"12:00-14:59",
						"15:00-17:59",
						"18:00-20:59",
						"21:00-23:59",
						"Sin dato",
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
				showTooltips: false,
				title: {
            display: true,
            text: "Numero de incidentes de violencia"
        },
				scales: {
					yAxes: [{
						stacked: true,
						scaleLabel: {
			        display: true,
			        labelString: "Numero de incidentes"
			      },
						ticks: {
							beginAtZero: true
						}
					}],
					xAxes: [{
						stacked: true,
						scaleLabel: {
			        display: true,
			        labelString: "Hora del incidente"
			      }
					}]
				}
			}
	});
}
