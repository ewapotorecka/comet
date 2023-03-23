export const prepareHistoryData = (history: any, dates: any) => {
  if (!history || !dates) {
    return;
  }
  const chartData = [];

  for (const day of dates) {
    const dayData = {
      high: history[day]["2. high"],
      low: history[day]["3. low"],
      date: day,
    };

    chartData.push(dayData);
  }

  return chartData;
};
