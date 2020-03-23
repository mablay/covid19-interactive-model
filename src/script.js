const DAYS = 80
function daysArray (days) {
  return [...Array(days)].map((_, i) => i)
}

/*
de:
parameterValues (3) [971,952, 4.2, 35.5]
script.js:32 parameterError 6411.169914410728
script.js:33 iterations 5

cn:
parameterValues (3) [80,938, 4.5, 16.7]
script.js:42 parameterError 72502.48263760556
script.js:43 iterations 100

*/
window.onload = function () {
  const country = document.getElementById("selectCountry").value
  console.log('selectedcountry', country)
  covid19ByCountry(country).then(stats => {
    const days = daysArray(DAYS)
    console.log(stats)
    const data = {
      labels: days,
      datasets: [{
        label: stats.country,
        fill: false,
        showLine: false,
        pointRadius: 5,
        pointBackgroundColor: 'red',
        borderColor: `hsl(${Math.random() * 100}, 100%, 50%)`,
        data: stats.samples.map(s => s.total_cases)
      }]
    }
    let i = data.datasets.length
    while (i--) {
      const sets = data.datasets
      const ds = sets[i]
      const model = fit({
        x: daysArray(ds.data.length),
        y: ds.data
      })
      const samples = model.values(DAYS)
      console.log('parameterValues', model.fittedParams.parameterValues)
      console.log('parameterError', model.fittedParams.parameterError)
      console.log('iterations', model.fittedParams.iterations)
      
      sets.push({
        label: `${ds.label} (Model)`,
        pointRadius: 0,
        pointHitRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        fill: false,
        borderColor: `hsl(${Math.random() * 360}, 100%, 40%)`,
        data: model.values(DAYS)
      })
    }
    initChart(data)
  })
}

async function countryData (countryCode) {
  const s = await covid19ByCountry(countryCode)
  return {
    label: s.country,
    fill: false,
    borderColor: `hsl(${Math.random() * 100}, 100%, 50%)`,
    pointRadius: 5,
    pointBackgroundColor: 'red',
    showLine: false,
    data: s.samples.map(s => s.total_cases)
  }
}
