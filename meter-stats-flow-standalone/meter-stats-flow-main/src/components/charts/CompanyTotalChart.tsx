import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCompanyWideDailyTotal } from "@/lib/mockData";
import { Building2, TrendingUp } from "lucide-react";

export function CompanyTotalChart() {
  const data = getCompanyWideDailyTotal().slice(-30).map(usage => ({
    date: new Date(usage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total_kwh: usage.total_kwh
  }));

  // Calculate trend
  const recent7Days = data.slice(-7);
  const previous7Days = data.slice(-14, -7);
  const recentAvg = recent7Days.reduce((sum, d) => sum + d.total_kwh, 0) / recent7Days.length;
  const previousAvg = previous7Days.reduce((sum, d) => sum + d.total_kwh, 0) / previous7Days.length;
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-success" />
            <div>
              <CardTitle className="text-xl font-semibold">Company-wide Energy Usage</CardTitle>
              <CardDescription>Total daily consumption across all meters</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-warning' : 'text-success'}`} />
            <span className={trend > 0 ? 'text-warning' : 'text-success'}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}% vs last week
            </span>
          </div>
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
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} kWh`, 'Total Energy']}
              />
              <Line 
                type="monotone" 
                dataKey="total_kwh" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--success))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}