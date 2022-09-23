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
  return  2*inputs["gasUsage"] + inputs["electricityUsage"];
}

export function calcHomeElectricityUsage(inputs) {
return  inputs["gasUsage"] + inputs["electricityUsage"];
}

export function calcOfficeGasUsage(inputs) {
  return inputs["gasUsage"]/70 + 2*inputs["electricityUsage"];
}

export function calcOfficeElectricityUsage(inputs) {
  return inputs["gasUsage"]/50 + inputs["electricityUsage"];
}

export function calcCarUsage(inputs) {
  return 2*inputs["kilometersPerWeek"];
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
