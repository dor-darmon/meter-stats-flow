import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTopMetersByUsageYesterday } from "@/lib/mockData";
import { Trophy } from "lucide-react";

export function TopMetersChart() {
  const data = getTopMetersByUsageYesterday().map((usage, index) => ({
    meter_id: usage.meter_id,
    kwh_sum: usage.kwh_sum,
    rank: index + 1
  }));

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-accent" />
          <div>
            <CardTitle className="text-xl font-semibold">Top Energy Consumers</CardTitle>
            <CardDescription>Top 5 meters by usage yesterday</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="meter_id" 
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
                formatter={(value: number) => [`${value.toFixed(1)} kWh`, 'Energy Usage']}
                labelFormatter={(label) => `Meter: ${label}`}
              />
              <Bar 
                dataKey="kwh_sum" 
                fill="url(#gradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}