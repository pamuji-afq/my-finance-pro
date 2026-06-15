export class ForecastService {
  calculateMovingAverage(data: number[], windowSize: number = 3): number[] {
    const result: number[] = [];
    for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);
      const avg = window.reduce((a, b) => a + b, 0) / windowSize;
      result.push(avg);
    }
    return result;
  }

  forecastNextValue(data: number[], method: 'average' | 'trend' = 'average'): number {
    if (data.length === 0) return 0;
    if (method === 'average') {
      return data.reduce((a, b) => a + b, 0) / data.length;
    }
    // Simple linear trend
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return slope * n + intercept;
  }

  predictNextMonthExpense(monthlyExpenses: number[]): number {
    if (monthlyExpenses.length === 0) return 0;
    const trend = this.forecastNextValue(monthlyExpenses, 'trend');
    return Math.max(0, trend);
  }
}

export const forecastService = new ForecastService();