  const numDaysMap = {
    2: 'Mon',
    3: 'Tue',
    4: 'Wed',
    5: 'Thu',
    6: 'Fri',
    7: 'Sat',
    1: 'Sun'
  };

export const makeTriplles = (days, durations, subjectNames, dates) => {
  const result = [];
  for (let i = 0; i < days.length; i++) {
    result.push([days[i], durations[i], subjectNames[i], dates[i]]);
  }
  return result;
};

export const makeDurationsByDay = (triples) => {
  const result = {};
  for (let i = 0; i < triples.length; i++) {
    const day = triples[i][0];
    const duration = triples[i][1];
    const date = triples[i][3];
    if (result[day]) {
      result[day].duration += duration;
    } else {
      result[day] = { duration, date,day };
    }
  }
  return result;
};

export const makeChartSeriesAndCategories = (durationsByDay) => {
  const result = [];
  for (let duration in durationsByDay) {
    result.push(durationsByDay[duration]);
  }

  const sortedResult = result.sort((a, b) => {
    return a.date - b.date;
  });


  const chartSeries  = [0,0,0,0,0,0,0];
  for (let i = 0; i < sortedResult.length; i++) {
    chartSeries[sortedResult[i].day-1]=sortedResult[i].duration/60;
  }
  return {chartSeries}
};


export const makeDurationBySubject = (triples) => {
  const result = {};
  for (let i = 0; i < triples.length; i++) {
    const subject = triples[i][2];
    const duration = triples[i][1];
    if (result[subject]) {
      result[subject] += duration;
    } else {
      result[subject] = duration;
    }
  }
  return result;
};

export const makeTraffic = (durationBySubject) => {
  const result = [];
  for (let subject in durationBySubject) {
    result.push({
      subject: subject,
      duration: durationBySubject[subject] / 60
    });
  }
  return result;
};