var mecanismoV = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('mecanismoV') || '{}');
var mecanismoH = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('mecanismoH') || '{}');
var causaH = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('causaH') || '{}');
var ocupacionH = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('ocupacionH') || '{}');
var ocupacionV = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('ocupacionV') || '{}');
var minoriaV = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('minoriaV') || '{}');
var minoriaH = JSON.parse(document.getElementsByTagName('data')[0].getAttribute('minoriaH') || '{}');

var datasets = [
  {"name": "causaH", "set": causaH, "title": "Causa de Muerte"},
  {"name": "mecanismoV", "set": mecanismoV, "title": "Mecanismo de Violencia"},
  {"name": "minoriaH", "set": minoriaH, "title": "Minorias asesinadas"},
  {"name": "minoriaV", "set": minoriaV, "title": "Minorias violentadas"},
  // {"name": "ocupacionV", "set": ocupacionV, "title": "Ocupacion de la Victima de violencia"},
  // {"name": "ocupacionH", "set": ocupacionH, "title": "Ocupacion de la Victima del homicidio"}
]

/* Must use an interpolated color scale, which has a range of [0, 1] */
function interpolateColors(dataLength) {
  // var colorScale = d3.interpolateRdYlBu;
  var colorScale = d3.interpolatePuBuGn;
  var colorRange = 1;
  var intervalSize = colorRange / dataLength;
  var i, colorPoint;
  var colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = 0.3 + (i * (1 / dataLength));
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}

console.log(interpolateColors(6))

function plot(data) {
  name = data.name
  console.log(name)
  set = data.set
  //doughnut
  var ctxD = document.getElementById(name).getContext('2d');
  var myLineChart = new Chart(ctxD, {
  type: 'doughnut',
  data: {
  labels: set.labels,
  datasets: [{
  data: set.data,
  backgroundColor: interpolateColors(set.data.length),
  hoverBackgroundColor: interpolateColors(set.data.length)
  }]
  },
  options: {
    title: {
            display: true,
            text: data.title,
            fontSize: 20,
        },
  responsive: true
  }
  });
}
for(i=0; i<datasets.length;i++){
  plot(datasets[i])
}
