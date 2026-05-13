import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { dataSharingSettings } from "@/data/mockData";
import { Share2, DollarSign } from "lucide-react";

const DataSharing = () => {
  const [settings, setSettings] = useState(dataSharingSettings);
  const [globalSharing, setGlobalSharing] = useState(true);

  const toggleSetting = (id: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const enabledCount = settings.filter((s) => s.enabled).length;
  const totalEstEarnings = settings.filter((s) => s.enabled).reduce((a, s) => a + s.earnings, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Data Sharing Controls</h1>
          <p className="text-muted-foreground">Choose what health data you want to share</p>
        </div>

        {/* Global Toggle */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Global Data Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  {globalSharing ? `${enabledCount} data types shared · Est. ${totalEstEarnings} HLTH/month` : "All sharing paused"}
                </p>
              </div>
            </div>
            <Switch checked={globalSharing} onCheckedChange={setGlobalSharing} />
          </CardContent>
        </Card>

        {/* Individual Controls */}
        <div className="grid gap-4">
          {settings.map((s) => (
            <Card key={s.id} className={!globalSharing ? "opacity-50" : ""}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{s.label}</p>
                    {s.enabled && globalSharing && <Badge variant="secondary" className="text-xs gap-1"><DollarSign className="h-3 w-3" /> ~{s.earnings} HLTH/mo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
                <Switch checked={s.enabled && globalSharing} onCheckedChange={() => toggleSetting(s.id)} disabled={!globalSharing} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataSharing;
