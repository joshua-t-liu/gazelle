const COLORS = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
];

const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)'
];

function nextColor(type, index = 0) {
  switch (type) {
    case 'color':
      return COLORS[index % COLORS.length];
    case 'background':
      return BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
    default:
      return COLORS[index % COLORS.length];
  }
}

function setMultiColors(size) {
  const borderColor = [];
  const backgroundColor = [];
  const pointBackgroundColor = [];
  const pointBorderColor = [];

  let i = 0;
  while(i < size) {
    borderColor.push(nextColor('color', i));
    backgroundColor.push(nextColor('background', i));
    pointBackgroundColor.push(nextColor('background', i)),
    pointBorderColor.push(nextColor('color', i)),
    i++;
  }

  return {
    borderColor,
    backgroundColor,
    pointBackgroundColor,
    pointBorderColor,
  }
}

function alphabeticalSort(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function numericalSort(a, b) {
  return a - b;
}

function uniqKey(val) {
  if (typeof val === 'object') {
    return val.toString();
  } else {
    return String(val);
  }
}

export {
  nextColor,
  alphabeticalSort,
  numericalSort,
  setMultiColors,
  uniqKey,
}