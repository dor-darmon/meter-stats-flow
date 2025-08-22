import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Database, Users } from "lucide-react";
import { dailyUsage, getAnomaliesLast30Days, getCompanyWideDailyTotal } from "@/lib/mockData";

export function MetricsOverview() {
  // Calculate metrics from mock data
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);
  const dayBeforeStr = dayBefore.toISOString().split('T')[0];
  
  const yesterdayTotal = dailyUsage
    .filter(usage => usage.date === yesterdayStr)
    .reduce((sum, usage) => sum + usage.kwh_sum, 0);
    
  const dayBeforeTotal = dailyUsage
    .filter(usage => usage.date === dayBeforeStr)
    .reduce((sum, usage) => sum + usage.kwh_sum, 0);
    
  const percentChange = dayBeforeTotal > 0 ? ((yesterdayTotal - dayBeforeTotal) / dayBeforeTotal) * 100 : 0;
  
  const anomalies = getAnomaliesLast30Days();
  const activeMeters = new Set(dailyUsage.filter(usage => usage.date === yesterdayStr).map(usage => usage.meter_id)).size;
  
  const metrics = [
    {
      title: "Total Energy Yesterday",
      value: `${Math.round(yesterdayTotal).toLocaleString()} kWh`,
      description: "Across all meters",
      trend: percentChange > 0 ? "up" : "down",
      trendValue: `${Math.abs(percentChange).toFixed(1)}%`,
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "Active Meters",
      value: activeMeters.toString(),
      description: "Currently reporting",
      trend: "up",
      trendValue: "100%",
      icon: Database,
      color: "text-success"
    },
    {
      title: "Recent Anomalies",
      value: anomalies.length.toString(),
      description: "Last 30 days",
      trend: anomalies.length > 5 ? "up" : "down",
      trendValue: `${anomalies.length > 5 ? 'High' : 'Low'} activity`,
      icon: AlertTriangle,
      color: anomalies.length > 5 ? "text-warning" : "text-success"
    },
    {
      title: "Pipeline Status",
      value: "Operational",
      description: "Last sync 5 min ago",
      trend: "up",
      trendValue: "99.9% uptime",
      icon: TrendingUp,
      color: "text-success"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 text-xs ${
                    metric.trend === "up" ? "border-success/30 text-success" : "border-muted-foreground/30"
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {metric.trendValue}
                </Badge>
              </div>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/50 to-primary-glow/50" />
          </Card>
        );
      })}
    </div>
  );
}