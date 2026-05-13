import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { earningsData } from "@/data/mockData";
import { DollarSign, TrendingUp, ArrowUp, Database } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const Earnings = () => {
  const growth = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
          <p className="text-muted-foreground">Track your data monetization</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Earnings</span>
              </div>
              <p className="text-3xl font-bold text-primary">{earningsData.totalEarnings.toLocaleString()} HLTH</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">This Month</span>
              </div>
              <p className="text-3xl font-bold">{earningsData.thisMonth} HLTH</p>
              <Badge variant="secondary" className="mt-2 gap-1">
                <ArrowUp className="h-3 w-3" /> +{growth}%
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Month</span>
              </div>
              <p className="text-3xl font-bold">{earningsData.lastMonth} HLTH</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData.history}>
                  <defs>
                    <linearGradient id="earnings-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(168, 80%, 32%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(168, 80%, 32%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v} HLTH`, "Earnings"]} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(168, 80%, 32%)" fill="url(#earnings-grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Data Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings by Data Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {earningsData.byDataType.map((d) => (
              <div key={d.type} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{d.type}</span>
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.percentage}%` }} />
                </div>
                <span className="text-sm font-medium w-20 text-right">{d.earnings} HLTH</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Dataset */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Earnings by Dataset
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tokens earned from each dataset you've contributed to.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Last Sold</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsData.byDataset.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell><Badge variant="secondary">{d.dataType}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.buyer}</TableCell>
                    <TableCell>{d.records.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.lastSold}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{d.earnings} HLTH</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
