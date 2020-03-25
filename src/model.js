/** @param {Object} series { x: [Number], y: [Number] }  */
function fit (series, initL = 1e5, initK = 4, initX0 = 6) {
  // https://en.wikipedia.org/wiki/Logistic_function
  function logisticCurve ([L, k, x0]) {
    return x => L / (1 + Math.exp((x - x0) / (-k)))
  }

  const options = {
    // minValues: [0, 0, -10],
    maxValues: [1e7, 50, 50],
    // gradientDifference: 10e-2,
    damping: 0.5,
    // initialValues: [100, 3, 18],
    initialValues: [initL, initK, initX0],
    maxIterations: 100,
    errorTolerance: 10e2
  }

  const fittedParams = mlLevenbergMarquardt(series, logisticCurve, options)
  const fn = logisticCurve(fittedParams.parameterValues)
  const inflection = fittedParams.parameterValues[2]
  return {
    fittedParams,
    inflection,
    fn,
    values: n => [...Array(n)]
      .map((_, i) => i)
      .map(x => fn(x))
  }
}
