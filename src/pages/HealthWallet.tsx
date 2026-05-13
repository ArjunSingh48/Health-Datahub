import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { walletData } from "@/data/mockData";
import {
  Watch,
  Syringe,
  FileText,
  Pill,
  Upload,
  Wifi,
  WifiOff,
  CheckCircle,
  Heart,
  Moon,
  Activity,
  Droplet,
  Footprints,
  Flame,
  Thermometer,
  Gauge,
  CalendarClock,
  Stethoscope,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Record = (typeof walletData.medicalRecords)[number];

const HealthWallet = () => {
  const [wearables, setWearables] = useState(walletData.wearables);
  const [openRecord, setOpenRecord] = useState<Record | null>(null);
  const { toast } = useToast();

  const toggleConnect = (id: string) => {
    setWearables((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === "Connected" ? "Disconnected" : "Connected" } : w,
      ),
    );
    toast({ title: "Device Updated", description: "Wearable connection status changed." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Health Vault</h1>
            <p className="text-muted-foreground">Your secure store of devices, records, and health history</p>
          </div>
          <Button className="gap-2"><Upload className="h-4 w-4" /> Upload Data</Button>
        </div>

        <Tabs defaultValue="wearables">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wearables" className="gap-1"><Watch className="h-3 w-3" /> Devices</TabsTrigger>
            <TabsTrigger value="vaccinations" className="gap-1"><Syringe className="h-3 w-3" /> Vaccines</TabsTrigger>
            <TabsTrigger value="records" className="gap-1"><FileText className="h-3 w-3" /> Records</TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-1"><Pill className="h-3 w-3" /> Supplements</TabsTrigger>
          </TabsList>

          {/* DEVICES — expandable */}
          <TabsContent value="wearables" className="mt-4">
            <Accordion type="single" collapsible className="space-y-3">
              {wearables.map((w) => (
                <AccordionItem key={w.id} value={w.id} className="border rounded-lg bg-card px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${w.status === "Connected" ? "bg-primary/10" : "bg-muted"}`}>
                        <Watch className={`h-5 w-5 ${w.status === "Connected" ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{w.name}</p>
                        <p className="text-sm text-muted-foreground">Last sync: {w.lastSync} · {w.dataPoints.toLocaleString()} data points</p>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <Badge variant={w.status === "Connected" ? "default" : "secondary"} className="gap-1">
                          {w.status === "Connected" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                          {w.status}
                        </Badge>
                        <Switch
                          checked={w.status === "Connected"}
                          onCheckedChange={() => toggleConnect(w.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-3 gap-2 text-sm pb-2">
                      <div className="rounded-md border p-3">
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="font-medium">{w.model}</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className="font-medium">{w.battery}%</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <p className="text-xs text-muted-foreground">Firmware</p>
                        <p className="font-medium">{w.firmware}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-2">Latest Metrics</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm pb-3">
                      <Metric icon={Heart} label="Heart Rate" value={`${w.metrics.heartRate.resting} rest · ${w.metrics.heartRate.max} max ${w.metrics.heartRate.unit}`} />
                      <Metric icon={Moon} label="Sleep" value={`${w.metrics.sleep.hours} hr · ${w.metrics.sleep.score}/100`} />
                      <Metric icon={Activity} label="REM Sleep" value={`${w.metrics.sleep.rem} hr (Deep ${w.metrics.sleep.deep} · Light ${w.metrics.sleep.light})`} />
                      <Metric icon={Droplet} label="Blood Oxygen" value={`${w.metrics.bloodOxygen}%`} />
                      <Metric icon={Gauge} label="Blood Pressure" value={w.metrics.bloodPressure} />
                      <Metric icon={Footprints} label="Steps" value={w.metrics.steps.toLocaleString()} />
                      <Metric icon={Flame} label="Calories" value={`${w.metrics.calories} kcal`} />
                      <Metric icon={Thermometer} label="Body Temp" value={w.metrics.bodyTemp} />
                      <Metric icon={Activity} label="HRV" value={`${w.metrics.hrv} ms`} />
                      <Metric icon={Activity} label="Stress" value={w.metrics.stressLevel} />
                      <Metric icon={Stethoscope} label="ECG" value={w.metrics.ecg} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* VACCINES — expandable */}
          <TabsContent value="vaccinations" className="mt-4">
            <Accordion type="single" collapsible className="space-y-3">
              {walletData.vaccinations.map((v) => (
                <AccordionItem key={v.id} value={v.id} className="border rounded-lg bg-card px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Syringe className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{v.name}</p>
                        <p className="text-sm text-muted-foreground">{v.date} · {v.provider}</p>
                      </div>
                      {v.verified && (
                        <Badge variant="default" className="gap-1 ml-auto mr-2">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-3">{v.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <Metric icon={Syringe} label="Dose" value={v.doseNumber} />
                      <Metric icon={FileText} label="Lot Number" value={v.lotNumber} />
                      <Metric icon={CalendarClock} label="Next Shot" value={v.nextShot} />
                      <Metric icon={Activity} label="Common Side Effects" value={v.sideEffects} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* RECORDS — opens sample report */}
          <TabsContent value="records" className="space-y-4 mt-4">
            {walletData.medicalRecords.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">{r.date} · {r.type} · {r.size}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setOpenRecord(r)}>View</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* SUPPLEMENTS — expandable */}
          <TabsContent value="prescriptions" className="mt-4">
            <Accordion type="single" collapsible className="space-y-3">
              {walletData.prescriptions.map((p) => (
                <AccordionItem key={p.id} value={p.id} className="border rounded-lg bg-card px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${p.active ? "bg-primary/10" : "bg-muted"}`}>
                        <Pill className={`h-5 w-5 ${p.active ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.dosage} · {p.frequency}</p>
                      </div>
                      <Badge variant={p.active ? "default" : "secondary"} className="ml-auto mr-2">
                        {p.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-md bg-muted/40 p-3 mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Why you're taking this</p>
                      <p className="text-sm">{p.reason}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <Metric icon={Stethoscope} label="Prescribed By" value={p.prescribedBy} />
                      <Metric icon={CalendarClock} label="Start Date" value={p.startDate} />
                      <Metric icon={Activity} label="Duration" value={p.duration} />
                      <Metric icon={FileText} label="Instructions" value={p.instructions} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>

      {/* Record dialog */}
      <Dialog open={!!openRecord} onOpenChange={(o) => !o && setOpenRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          {openRecord && (
            <>
              <DialogHeader>
                <DialogTitle>{openRecord.name}</DialogTitle>
                <DialogDescription>
                  {openRecord.date} · {openRecord.type} · {openRecord.size}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="font-medium">{openRecord.provider}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Facility</p>
                    <p className="font-medium">{openRecord.facility}</p>
                  </div>
                </div>
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Summary</p>
                  <p>{openRecord.summary}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Findings</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {openRecord.findings.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recommendations</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {openRecord.recommendations.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-[10px] text-muted-foreground/70 italic text-right">Sample report — mock data</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenRecord(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const Metric = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2 rounded-md border p-3">
    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default HealthWallet;
