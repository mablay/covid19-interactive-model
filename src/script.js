Promise.all([
  covid19ByCountry('de'),
  covid19ByCountry('it')
]).then(stats => {
  const data = {
    labels: [...Array(40)].map((_, i) => i),
    datasets: stats.map(s => ({
      label: s.country,
      fill: false,
      borderColor: `hsl(${Math.random() * 100}, 100%, 50%)`,
      data: s.samples.map(s => s.total_cases)
    }))
  }
  initChart(data)
})