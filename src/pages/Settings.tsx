import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, switchRole } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Role Switcher (for demo) */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Demo: Switch Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={user?.role} onValueChange={(v) => switchRole(v as UserRole)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Data Requests", desc: "Notify when researchers request your data" },
              { label: "Payments", desc: "Notify when you receive HLTH tokens" },
              { label: "Research Opportunities", desc: "New studies matching your profile" },
              { label: "System Updates", desc: "Platform updates and announcements" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{n.label}</Label>
                  <p className="text-sm text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Export My Data</Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
