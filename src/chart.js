var x_data = [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050];
var y_data_1 = [86,114,106,106,107,111,133,221,783,2478];
var y_data_2 = [2000,700,200,100,100,100,100,50,25,0];

const defaultData = {
  labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
  datasets: [{
      label: 'A',
      // backgroundColor: 'rgb(255, 99, 132)',
      // borderColor: 'rgb(255, 99, 132)',
      data: [86,114,106,106,107,111,133,221,783,2478]
  },
  {
    label: 'B',
    data: [2000,700,200,100,100,100,100,50,25,0]
  }]
}

window.onload = function () {
  console.log('window.onload')
}

function initChart (data = defaultData) {
  // Draw a line chart with two data sets
  let activePoint = null;
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  const options = {
    animation: { duration: 0 },
    tooltips: { mode: 'nearest' }
  }
  window.myChart = Chart.Line(ctx, { data, options });

  // --- MOUSE DOWN ---
  // set pointer event handlers for canvas element
  canvas.onpointerdown = function down_handler(event) {
    // check for data point near event location
    const points = window.myChart.getElementAtEvent(event, {intersect: false});
    if (points.length > 0) {
        // grab nearest point, start dragging
        activePoint = points[0];
        canvas.onpointermove = move_handler;
    }
  }

  // --- MOUSE UP ---
  canvas.onpointerup = function up_handler(event) {
    // release grabbed point, stop dragging
    activePoint = null;
    canvas.onpointermove = null;
  }

  // --- DRAG ---
  canvas.onpointermove = null;
  function move_handler(event) {
    // locate grabbed point in chart data
    if (activePoint != null) {
        var data = activePoint._chart.data;
        var datasetIndex = activePoint._datasetIndex;

        // read mouse position
        const helpers = Chart.helpers;
        var position = helpers.getRelativePosition(event, myChart);

        // convert mouse position to chart y axis value 
        var chartArea = window.myChart.chartArea;
        var yAxis = window.myChart.scales["y-axis-0"];
        var yValue = map(position.y, chartArea.bottom, chartArea.top, yAxis.min, yAxis.max);

        // update y value of active data point
        data.datasets[datasetIndex].data[activePoint._index] = yValue;
        window.myChart.update();
    };
  }
}

// map value to other coordinate system
function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
};