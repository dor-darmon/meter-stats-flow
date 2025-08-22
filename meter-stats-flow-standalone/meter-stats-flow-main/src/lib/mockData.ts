// Mock data simulating the energy pipeline outputs
export interface RawReading {
  meter_id: string;
  ts: string;
  kwh: number;
  voltage: number;
  current: number;
}

export interface HourlyUsage {
  meter_id: string;
  hour_ts: string;
  kwh_sum: number;
  kwh_avg: number;
}

export interface DailyUsage {
  meter_id: string;
  date: string;
  kwh_sum: number;
  kwh_avg: number;
  anomaly_flag: boolean;
  anomaly_score: number;
}

// Generate mock data for the last 30 days
const generateMockData = () => {
  const meters = ['MTR001', 'MTR002', 'MTR003', 'MTR004', 'MTR005', 'MTR006', 'MTR007', 'MTR008', 'MTR009', 'MTR010'];
  const dailyUsage: DailyUsage[] = [];
  const hourlyUsage: HourlyUsage[] = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    meters.forEach(meterId => {
      // Generate daily usage with occasional anomalies
      const baseUsage = 45 + Math.random() * 30; // 45-75 kWh normal range
      const isAnomaly = Math.random() < 0.05; // 5% chance of anomaly
      const kwhSum = isAnomaly ? baseUsage * (2 + Math.random()) : baseUsage;
      const anomalyScore = isAnomaly ? 3.2 + Math.random() * 2 : Math.random() * 2;
      
      dailyUsage.push({
        meter_id: meterId,
        date: dateStr,
        kwh_sum: Math.round(kwhSum * 100) / 100,
        kwh_avg: Math.round((kwhSum / 24) * 100) / 100,
        anomaly_flag: isAnomaly,
        anomaly_score: Math.round(anomalyScore * 100) / 100
      });
      
      // Generate hourly usage for the last 7 days only (to keep data manageable)
      if (i <= 7) {
        for (let hour = 0; hour < 24; hour++) {
          const hourTs = new Date(date);
          hourTs.setHours(hour, 0, 0, 0);
          
          // Simulate daily usage pattern (higher during day, lower at night)
          const hourlyMultiplier = 0.3 + 0.7 * Math.sin((hour - 6) / 24 * Math.PI * 2);
          const hourlyKwh = (kwhSum / 24) * hourlyMultiplier * (0.8 + Math.random() * 0.4);
          
          hourlyUsage.push({
            meter_id: meterId,
            hour_ts: hourTs.toISOString(),
            kwh_sum: Math.round(hourlyKwh * 100) / 100,
            kwh_avg: Math.round(hourlyKwh * 100) / 100
          });
        }
      }
    });
  }
  
  return { dailyUsage, hourlyUsage };
};

export const { dailyUsage, hourlyUsage } = generateMockData();

// Query implementations matching the 5 core queries
export const getDailyUsageForMeter = (meterId: string, startDate: string, endDate: string) => {
  return dailyUsage.filter(usage => 
    usage.meter_id === meterId && 
    usage.date >= startDate && 
    usage.date <= endDate
  ).sort((a, b) => a.date.localeCompare(b.date));
};

export const getTopMetersByUsageYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  return dailyUsage
    .filter(usage => usage.date === yesterdayStr)
    .sort((a, b) => b.kwh_sum - a.kwh_sum)
    .slice(0, 5);
};

export const getAnomaliesLast30Days = () => {
  return dailyUsage
    .filter(usage => usage.anomaly_flag)
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const getHourlyProfileForMeterDay = (meterId: string, date: string) => {
  const targetDate = new Date(date).toISOString().split('T')[0];
  
  return hourlyUsage
    .filter(usage => {
      const usageDate = new Date(usage.hour_ts).toISOString().split('T')[0];
      return usage.meter_id === meterId && usageDate === targetDate;
    })
    .sort((a, b) => new Date(a.hour_ts).getTime() - new Date(b.hour_ts).getTime());
};

export const getCompanyWideDailyTotal = () => {
  const totals = new Map<string, number>();
  
  dailyUsage.forEach(usage => {
    const current = totals.get(usage.date) || 0;
    totals.set(usage.date, current + usage.kwh_sum);
  });
  
  return Array.from(totals.entries())
    .map(([date, total_kwh]) => ({ date, total_kwh: Math.round(total_kwh * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
