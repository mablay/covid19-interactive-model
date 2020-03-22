/** @param {string} country country code ('us', 'cn', ...) */
async function covid19ByCountry (country) {
  const url = `data/${country}.json`
  // const url = `https://thevirustracker.com/free-api?countryTimeline=${country.toUpperCase()}`
  const samples = await fetch(url)
    .then(res => res.json())

  const timeline = samples.timelineitems[0]
  delete timeline.stat
  const lastKey = Object.keys(timeline).pop()
  delete timeline[lastKey]
  const series = Object.keys(timeline)
    .map(key => ({
      date: new Date(key),
      ...timeline[key]
    }))
    .filter(day => day.total_cases >= 100)
  const firstDay = series[0]
  const mspd = 86400000
  series.forEach((element, i) => {
    element.day = 1 + (element.date - firstDay.date) / mspd
    // element.total_cases /= 1e3
  })
  return {
    country: samples.countrytimelinedata[0].info.title,
    samples: series,
    days: series.length
  }
}
