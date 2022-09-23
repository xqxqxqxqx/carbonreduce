// Formulas for Area Chart
export function calcHomeUsage(homeInputs, generalInputs) {
  // return 1.235*homeInputs["gasUsage"] + 0.023*homeInputs["electricityUsage"] + 6.212*2;
  return calcHomeGasUsage(homeInputs, generalInputs) + calcHomeElectricityUsage(homeInputs, generalInputs);
  
}

export function calcOfficeUsage(officeInputs, generalInputs) {
  // return 4.64*officeInputs["gasUsage"] + 0.55*officeInputs["electricityUsage"]*1000 + 5.242*2;
  return calcOfficeGasUsage(officeInputs, generalInputs) + calcOfficeElectricityUsage(officeInputs, generalInputs);
}

export function calcTravelUsage(travelInputs, generalInputs) {
  // return 5.974*(travelInputs["kilometersPerDay"]*(travelInputs["carUserPerc"]/100) + 2.621)
  //         + 3.217*travelInputs["kilometersPerDay"]*(1-travelInputs["carUserPerc"]/100)+ 2.621;
  return calcCarUsage(travelInputs, generalInputs) + calcNonCarUsage(travelInputs, generalInputs);
}

// Formulas for Polar Chart
export function calcHomeGasUsage(homeInputs, generalInputs) {
  const coeff = 1.235;
  const intercept = 6.212;
  const b2oImpact = (1-generalInputs["backToOffice"]/100);
  const daysPerWeekImpact = (5 - generalInputs["daysPerWeek"]) / 5;
  return (coeff*homeInputs["gasUsage"] + intercept) * daysPerWeekImpact * b2oImpact;
}

export function calcHomeElectricityUsage(homeInputs, generalInputs) {
  const coeff = 0.023;
  const intercept = 6.212;
  const b2oImpact = (1-generalInputs["backToOffice"]/100);
  const daysPerWeekImpact = (5 - generalInputs["daysPerWeek"] ) / 5;
  return (coeff*homeInputs["electricityUsage"] + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcOfficeGasUsage(officeInputs, generalInputs) {
  const coeff = 4.64;
  const intercept = 5.242;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*officeInputs["gasUsage"] + intercept) * daysPerWeekImpact * b2oImpact;
}

export function calcOfficeElectricityUsage(officeInputs, generalInputs) {
  const coeff = 0.55;
  const intercept = 5.242;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*officeInputs["electricityUsage"] + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcCarUsage(travelInputs, generalInputs) {
  const coeff = 5.974;
  const intercept = 2.621;
  const b2oImpact = generalInputs["backToOffice"]/100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*(travelInputs["kilometersPerDay"]*(travelInputs["carUserPerc"]/100)) + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcNonCarUsage(travelInputs, generalInputs) {
  const coeff = 3.217;
  const intercept = 2.621;
  const b2oImpact = generalInputs["backToOffice"] / 100;
  const daysPerWeekImpact = generalInputs["daysPerWeek"] / 5;
  return (coeff*(travelInputs["kilometersPerDay"]*(1-travelInputs["carUserPerc"]/100)) + intercept)  * daysPerWeekImpact * b2oImpact;
}

export function calcTotalUsage(homeConsumption, officeConsumption, travelConsumption) {
  return 9048;
  // return  homeConsumption + officeConsumption + travelConsumption;
}

export function calcSavings(baselineConsumption, newConsumption) {
  return 2234;
  // return  baselineConsumption - newConsumption;
}
