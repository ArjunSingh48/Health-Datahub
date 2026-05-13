import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { notifications as mockNotifications, researcherNotifications } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, DollarSign, FlaskConical, FileText, Check } from "lucide-react";

const iconMap = {
  data_request: FileText,
  payment: DollarSign,
  opportunity: FlaskConical,
};

const Notifications = () => {
  const { user } = useAuth();
  const isResearcher = user?.role === "researcher";
  const [items, setItems] = useState(isResearcher ? researcherNotifications : mockNotifications);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
              <Check className="h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {items.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <Card key={n.id} className={n.read ? "" : "border-primary/20 bg-primary/5"}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-primary/10"}`}>
                    <Icon className={`h-5 w-5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.read && <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
