import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsOverview } from "./MetricsOverview";
import { DailyUsageChart } from "./charts/DailyUsageChart";
import { TopMetersChart } from "./charts/TopMetersChart";
import { AnomaliesChart } from "./charts/AnomaliesChart";
import { HourlyProfileChart } from "./charts/HourlyProfileChart";
import { CompanyTotalChart } from "./charts/CompanyTotalChart";
import { Zap, TrendingUp, AlertTriangle, Database, Activity } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  EnergyFlow Analytics
                </h1>
                <p className="text-sm text-muted-foreground">Real-time Energy Data Pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-success border-success/30">
                <Activity className="w-3 h-3 mr-1" />
                Pipeline Active
              </Badge>
              <Button variant="outline" size="sm">
                <Database className="w-4 h-4 mr-2" />
                Data Status
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics Overview */}
        <MetricsOverview />

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="daily-usage">Daily Usage</TabsTrigger>
            <TabsTrigger value="top-meters">Top Meters</TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="hourly">Hourly Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompanyTotalChart />
              <AnomaliesChart />
            </div>
          </TabsContent>

          <TabsContent value="daily-usage" className="mt-6">
            <DailyUsageChart />
          </TabsContent>

          <TabsContent value="top-meters" className="mt-6">
            <TopMetersChart />
          </TabsContent>

          <TabsContent value="anomalies" className="mt-6">
            <AnomaliesChart showDetailed={true} />
          </TabsContent>

          <TabsContent value="hourly" className="mt-6">
            <HourlyProfileChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}