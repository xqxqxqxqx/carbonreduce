// TODO: Update functions and implement formulas

export function calcHomeUsage(gasUsage, electricityUsage) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  gasUsage / electricityUsage + insideTemp - renewableEnergy;
}

export function calcOfficeUsage(gasUsage, electricityUsage) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  gasUsage / electricityUsage + insideTemp - renewableEnergy;
}

export function calcTravelUsage(kmPerWeek, mode) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  kmPerWeek + mode;
}

export function calcHomeGasUsage(inputs) {
  const coeff = 2.4534;
  const intercept = 42.3542
  return  coeff*inputs["gasUsage"] + intercept;
}

export function calcHomeElectricityUsage(inputs) {
  const coeff = 2.4534;
  const intercept = 42.3542
  return  coeff*inputs["electricityUsage"] + intercept;
}

export function calcOfficeGasUsage(inputs) {
  const coeff = 2.4534;
  const intercept = 42.3542
  return  coeff*inputs["gasUsage"] + intercept;
}

export function calcOfficeElectricityUsage(inputs) {
  const coeff = 2.4534;
  const intercept = 42.3542
  return  coeff*inputs["electricityUsage"] + intercept;

}

export function calcCarUsage(inputs) {
  const coeff = 2.4534;
  const intercept = 42.3542
  return  coeff*inputs["kilometersPerWeek"] + intercept;
}

export function calcNonCarUsage(inputs) {
  return inputs["kilometersPerWeek"];
}

export function calcTotalUsage(homeConsumption, officeConsumption, travelConsumption) {
  return 9048;
  // return  homeConsumption + officeConsumption + travelConsumption;
}

export function calcSavings(baselineConsumption, newConsumption) {
  return 2234;
  // return  baselineConsumption - newConsumption;
}
