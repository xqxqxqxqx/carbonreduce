// TODO: Update functions and implement formulas

export function calcHomeUsage(floorSize, insulation, insideTemp, renewableEnergy) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  floorSize / insulation + insideTemp - renewableEnergy;
}

export function calcOfficeUsage(floorSize, insulation, insideTemp, renewableEnergy) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  floorSize / insulation + insideTemp - renewableEnergy;
}

export function calcTravelUsage(kmPerWeek, mode) {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100));
  // return  kmPerWeek + mode;
}

export function calcHomeHeatingUsage(a, b) {
  return 839;
  // return  a + b;
}

export function calcHomeElectricityUsage(a, b) {
  return 235;
  // return  a + b;
}

export function calcOfficeHeatingUsage(a, b) {
  return 642;
  // return  a + b;
}

export function calcOfficeElectricityUsage(a, b) {
  return 432;
  // return  a + b;
}

export function calcCarUsage(a, b) {
  return 123;
  // return  a + b;
}

export function calcPublicTransportUsage(a, b) {
  return 12;
  // return  a + b;
}

export function calcTotalUsage(homeConsumption, officeConsumption, travelConsumption) {
  return 9048;
  // return  homeConsumption + officeConsumption + travelConsumption;
}

export function calcSavings(baselineConsumption, newConsumption) {
  return 2234;
  // return  baselineConsumption - newConsumption;
}
