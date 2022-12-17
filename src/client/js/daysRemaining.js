//function to calc the days remaining to a trip
function daysRemaining(departDate, currentData) {
  // resource: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
  const remainingDays =
    (departDate.getTime() - currentData.getTime()) / (1000 * 60 * 60 * 24);
  return Math.ceil(remainingDays);
}
export { daysRemaining };
