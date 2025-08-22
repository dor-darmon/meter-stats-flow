import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHourlyProfileForMeterDay } from "@/lib/mockData";
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

export function HourlyProfileChart() {
  const [selectedMeter, setSelectedMeter] = useState("MTR001");
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });
  
  const data = getHourlyProfileForMeterDay(selectedMeter, selectedDate).map(usage => ({
    hour: new Date(usage.hour_ts).getHours(),
    kwh: usage.kwh_sum,
    time: new Date(usage.hour_ts).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    })
  }));

  const meters = ['MTR001', 'MTR002', 'MTR003', 'MTR004', 'MTR005'];
  
  // Get last 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1));
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-xl font-semibold">Hourly Energy Profile</CardTitle>
              <CardDescription>24-hour energy consumption pattern</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMeter} onValueChange={setSelectedMeter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent>
                {meters.map(meter => (
                  <SelectItem key={meter} value={meter}>{meter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {dates.map(date => (
                  <SelectItem key={date.value} value={date.value}>{date.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="hour"
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 12 }}
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)'
                }}
                formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Energy Usage']}
                labelFormatter={(label) => `${label}:00`}
              />
              <Area 
                type="monotone" 
                dataKey="kwh" 
                stroke="hsl(var(--primary))" 
                fill="url(#hourlyGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}