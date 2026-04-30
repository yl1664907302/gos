export function setTime(generateConfig, date, hour, minute, second) {
  let nextTime = generateConfig.setHour(date, hour);
  nextTime = generateConfig.setMinute(nextTime, minute);
  nextTime = generateConfig.setSecond(nextTime, second);
  return nextTime;
}
export function setDateTime(generateConfig, date, defaultDate) {
  if (!defaultDate) {
    return date;
  }
  let newDate = date;
  newDate = generateConfig.setHour(newDate, generateConfig.getHour(defaultDate));
  newDate = generateConfig.setMinute(newDate, generateConfig.getMinute(defaultDate));
  newDate = generateConfig.setSecond(newDate, generateConfig.getSecond(defaultDate));
  return newDate;
}
export function getLowerBoundTime(hour, minute, second, hourStep, minuteStep, secondStep) {
  const lowerBoundHour = Math.floor(hour / hourStep) * hourStep;
  if (lowerBoundHour < hour) {
    return [lowerBoundHour, 60 - minuteStep, 60 - secondStep];
  }
  const lowerBoundMinute = Math.floor(minute / minuteStep) * minuteStep;
  if (lowerBoundMinute < minute) {
    return [lowerBoundHour, lowerBoundMinute, 60 - secondStep];
  }
  const lowerBoundSecond = Math.floor(second / secondStep) * secondStep;
  return [lowerBoundHour, lowerBoundMinute, lowerBoundSecond];
}
export function getLastDay(generateConfig, date) {
  const year = generateConfig.getYear(date);
  const month = generateConfig.getMonth(date) + 1;
  const endDate = generateConfig.getEndDate(generateConfig.getFixedDate(`${year}-${month}-01`));
  const lastDay = generateConfig.getDate(endDate);
  const monthShow = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${monthShow}-${lastDay}`;
}