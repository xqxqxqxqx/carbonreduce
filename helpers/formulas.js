// Formulas for Area Chart
export function calcHomeUsage(homeInputs) {
  return  1.235*homeInputs["gasUsage"] + 0.023*homeInputs["electricityUsage"] + (1231.116/3)*2;
}

export function calcOfficeUsage(officeInputs) {
  return 0.521*officeInputs["gasUsage"] + 0.577*officeInputs["electricityUsage"]*1000 + (15.726/3)*2;
}

export function calcTravelUsage(travelInputs) {
  return 1.239*(travelInputs["kilometersPerWeek"]*0.1923) + 15.726/3;
}

// Formulas for Polar Chart
export function calcHomeGasUsage(homeInputs, generalInputs) {
  const coeff = 1.235;
  const intercept = 1231.116 / 3;
  const b2oImpact = (1-generalInputs["backToOffice"]/100);
  const daysPerWeekImpact = (5 - generalInputs["daysPerWeek"]) / 5;
  return (coeff*homeInputs["gasUsage"] + intercept) * daysPerWeekImpact * b2oImpact;
}

export function calcHomeElectricityUsage(homeInputs, generalInputs) {
  const coeff = 0.023;
  const intercept = 1231.116 / 3;
  const b2oImpact = (1-generalInputs["backToOffice"]/100);
  const daysPerWeekImpact = (5 - generalInputs["daysPerWeek"] ) / 5;
  return (coeff*homeInputs["electricityUsage"] + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcOfficeGasUsage(officeInputs, generalInputs) {
  const coeff = 0.521;
  const intercept = 15.726 / 3;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*officeInputs["gasUsage"] + intercept) * daysPerWeekImpact * b2oImpact;
}

export function calcOfficeElectricityUsage(officeInputs, generalInputs) {
  const coeff = 0.577;
  const intercept = 15.726 / 3;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*officeInputs["electricityUsage"] + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcCarUsage(travelInputs, generalInputs) {
  const coeff = 1.239;
  const intercept = 15.726 / 3;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*(travelInputs["kilometersPerWeek"]*0.1923) + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcNonCarUsage(travelInputs, generalInputs) {
  const coeff = 1.239;
  const intercept = 15.726 / 3;
  const b2oImpact = generalInputs["backToOffice"] / 100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*(travelInputs["kilometersPerWeek"]*0.6518) + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcTotalUsage(homeConsumption, officeConsumption, travelConsumption) {
  return 9048;
  // return  homeConsumption + officeConsumption + travelConsumption;
}

export function calcSavings(baselineConsumption, newConsumption) {
  return 2234;
  // return  baselineConsumption - newConsumption;
}
