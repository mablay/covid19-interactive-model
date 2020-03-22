window.onload = function () {
}

function initChart (data = {}) {
  // Draw a line chart with two data sets
  let activePoint = null;
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  const options = {
    animation: { duration: 0 },
    tooltips: { mode: 'nearest' },
    scales: {
      yAxes: [{
          ticks: {
              min: 0,
              max: 1e5
          }
      }]
    }
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
        var yValue = mapYCoord(position.y, chartArea.bottom, chartArea.top, yAxis.min, yAxis.max);

        // update y value of active data point
        data.datasets[datasetIndex].data[activePoint._index] = yValue;

        updateModel()
        window.myChart.update();
    };
  }

  function updateModel () {
    const ds = data.datasets[0]
    const model = fit({
      x: daysArray(ds.data.length),
      y: ds.data
    }, ds.data[ds.data.length - 1] * 1)
    const samples = model.values(DAYS)
    data.datasets[1].label = `${data.datasets[0].label} (Model)`
    data.datasets[1].data = model.values(DAYS)
  }

  const sel = document.getElementById("selectCountry")
  sel.onchange = (ev, val) => {
    if (ev.type !== 'change') return
    const country = ev.target.value
    console.log('country', country)
    countryData(country).then(set => {
      data.datasets[0] = set
      updateModel()
      window.myChart.update()
    })
  }
}

// map value to other coordinate system
function mapYCoord(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
};