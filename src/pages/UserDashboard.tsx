import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { healthMetrics, earningsData, notifications } from "@/data/mockData";
import { Heart, Moon, Footprints, Wind, TrendingUp, Bell } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const metricIcons = { heartRate: Heart, sleepScore: Moon, steps: Footprints, oxygenLevel: Wind };
const metricLabels = { heartRate: "Heart Rate", sleepScore: "Sleep Score", steps: "Steps", oxygenLevel: "Oxygen Level" };
const metricColors = { heartRate: "hsl(0, 70%, 55%)", sleepScore: "hsl(250, 60%, 55%)", steps: "hsl(168, 80%, 32%)", oxygenLevel: "hsl(200, 70%, 50%)" };

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">Your real-time health overview</p>
        </div>

        {/* Health Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(healthMetrics) as Array<keyof typeof healthMetrics>).map((key) => {
            const metric = healthMetrics[key];
            const Icon = metricIcons[key];
            const sparkData = metric.trend.map((v, i) => ({ v, i }));

            return (
              <Card key={key} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metricColors[key]}15` }}>
                        <Icon className="h-4 w-4" style={{ color: metricColors[key] }} />
                      </div>
                      <span className="text-sm text-muted-foreground">{metricLabels[key]}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{metric.status}</Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold">{metric.current.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                    </div>
                    <div className="w-20 h-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData}>
                          <defs>
                            <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={metricColors[key]} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={metricColors[key]} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke={metricColors[key]} fill={`url(#grad-${key})`} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" /> Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold text-primary">{earningsData.thisMonth} HLTH</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{earningsData.totalEarnings.toLocaleString()} HLTH</p>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData.history}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip formatter={(v: number) => [`${v} HLTH`, "Earnings"]} />
                    <Bar dataKey="amount" fill="hsl(168, 80%, 32%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className={`p-3 rounded-lg ${n.read ? "bg-muted/30" : "bg-primary/5 border border-primary/20"}`}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
