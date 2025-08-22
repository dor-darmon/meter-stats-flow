import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyUsageForMeter } from "@/lib/mockData";
import { useState } from "react";

export function DailyUsageChart() {
  const [selectedMeter, setSelectedMeter] = useState("MTR001");
  
  // Get last 30 days
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const data = getDailyUsageForMeter(selectedMeter, startDate, endDate).map(usage => ({
    date: new Date(usage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    kwh: usage.kwh_sum,
    anomaly: usage.anomaly_flag
  }));

  const meters = ['MTR001', 'MTR002', 'MTR003', 'MTR004', 'MTR005', 'MTR006', 'MTR007', 'MTR008', 'MTR009', 'MTR010'];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Daily Energy Usage</CardTitle>
            <CardDescription>Daily kWh consumption with anomaly detection</CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date" 
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 12 }}
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
                formatter={(value: number, name) => [
                  `${value.toFixed(1)} kWh`, 
                  name === 'kwh' ? 'Energy Usage' : name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="kwh" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={payload.anomaly ? 6 : 3}
                      fill={payload.anomaly ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                      stroke={payload.anomaly ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                      strokeWidth={payload.anomaly ? 3 : 2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}