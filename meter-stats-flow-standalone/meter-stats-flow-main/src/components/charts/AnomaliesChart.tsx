import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnomaliesLast30Days } from "@/lib/mockData";
import { AlertTriangle } from "lucide-react";

interface AnomaliesChartProps {
  showDetailed?: boolean;
}

export function AnomaliesChart({ showDetailed = false }: AnomaliesChartProps) {
  const anomalies = getAnomaliesLast30Days();
  
  const chartData = anomalies.map(anomaly => ({
    date: new Date(anomaly.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: anomaly.anomaly_score,
    kwh: anomaly.kwh_sum,
    meter: anomaly.meter_id,
    fullDate: anomaly.date
  }));

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <div>
            <CardTitle className="text-xl font-semibold">Energy Anomalies</CardTitle>
            <CardDescription>
              {showDetailed ? 'Detailed anomaly analysis' : 'Recent anomalies detected by AI pipeline'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto text-warning border-warning/30">
            {anomalies.length} detected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {showDetailed ? (
          <div className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="score"
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Anomaly Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)'
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      name === 'score' ? `${value.toFixed(2)}` : `${value.toFixed(1)} kWh`,
                      name === 'score' ? 'Anomaly Score' : 'Energy Usage'
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.meter || label}
                  />
                  <Scatter dataKey="score" fill="hsl(var(--warning))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anomalies.slice(0, 6).map((anomaly, index) => (
                <div key={index} className="p-4 rounded-lg border bg-warning/5 border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-warning border-warning/30">
                      {anomaly.meter_id}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{anomaly.date}</span>
                  </div>
                  <p className="text-sm font-medium">{anomaly.kwh_sum.toFixed(1)} kWh</p>
                  <p className="text-xs text-muted-foreground">
                    Score: {anomaly.anomaly_score.toFixed(2)} (threshold: 3.0)
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={chartData.slice(0, 10)} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="score"
                  className="text-xs text-muted-foreground"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'Anomaly Score']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.meter || label}
                />
                <Scatter dataKey="score" fill="hsl(var(--warning))" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}