import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { researcherData, sampleDatasetRows } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, Database, Clock, DollarSign, Download, Eye, Target, Calendar, Users } from "lucide-react";

type ActiveRequest = (typeof researcherData.activeRequests)[number];
type PurchasedDataset = (typeof researcherData.purchasedDatasets)[number];

const toCSV = (rows: Array<Record<string, string | number>>) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => r[h]).join(",")).join("\n");
  return headers.join(",") + "\n" + body;
};

const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const ResearcherDashboard = () => {
  const { stats, activeRequests, purchasedDatasets } = researcherData;
  const [selectedRequest, setSelectedRequest] = useState<ActiveRequest | null>(null);
  const [previewDataset, setPreviewDataset] = useState<PurchasedDataset | null>(null);
  const { toast } = useToast();

  const handleDownload = (dataset: PurchasedDataset, format: "csv" | "xlsx") => {
    const rows = sampleDatasetRows[dataset.id] ?? [];
    const safeName = dataset.name.replace(/\s+/g, "_");
    if (format === "csv") {
      downloadFile(`${safeName}.csv`, toCSV(rows), "text/csv");
    } else {
      // Simple Excel-compatible XML (.xls) — opens cleanly in Excel/Sheets
      const headers = rows.length ? Object.keys(rows[0]) : [];
      const headerRow = `<Row>${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join("")}</Row>`;
      const dataRows = rows
        .map(
          (r) =>
            `<Row>${headers
              .map((h) => {
                const v = r[h];
                const t = typeof v === "number" ? "Number" : "String";
                return `<Cell><Data ss:Type="${t}">${v}</Data></Cell>`;
              })
              .join("")}</Row>`,
        )
        .join("");
      const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="${safeName}"><Table>${headerRow}${dataRows}</Table></Worksheet></Workbook>`;
      downloadFile(`${safeName}.xls`, xml, "application/vnd.ms-excel");
    }
    toast({ title: "Download started", description: `${dataset.name}.${format === "csv" ? "csv" : "xls"}` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Researcher Dashboard</h1>
          <p className="text-muted-foreground">Manage your data requests and purchases</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Datasets Owned", value: stats.datasetsOwned, icon: Database, color: "text-primary" },
            { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "text-warning" },
            { label: "Active Studies", value: stats.activeStudies, icon: FlaskConical, color: "text-info" },
            { label: "Total Spent", value: `${stats.totalSpent} HLTH`, icon: DollarSign, color: "text-primary" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Accuracy Match</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRequests.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRequest(r)}
                  >
                    <TableCell className="font-medium">{r.dataset}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "approved" ? "default" : "secondary"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.requestDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={r.accuracyMatch} className="h-2" />
                        <span className="text-sm font-medium">{r.accuracyMatch}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(r);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Purchased Datasets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Purchased Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedDatasets.map((d) => (
                <Card key={d.id} className="relative">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{d.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Purchased {d.purchaseDate}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{d.format}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{d.records.toLocaleString()} records</span>
                      <span className="font-medium text-primary">{d.cost} HLTH</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setPreviewDataset(d)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="flex-1 gap-1">
                            <Download className="h-3.5 w-3.5" /> Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleDownload(d, "csv")}>Download as CSV</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(d, "xlsx")}>Download as Excel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="absolute bottom-1.5 right-3 text-[10px] text-muted-foreground/70 italic">
                      All mock data
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(o) => !o && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRequest.dataset}</DialogTitle>
                <DialogDescription>{selectedRequest.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" /> Status
                    </div>
                    <Badge variant={selectedRequest.status === "approved" ? "default" : "secondary"} className="capitalize">
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" /> Requested
                    </div>
                    <p className="text-sm font-medium">{selectedRequest.requestDate}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5" /> Age Range
                    </div>
                    <p className="text-sm font-medium">{selectedRequest.ageRange}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Target className="h-3.5 w-3.5" /> Sample Target
                    </div>
                    <p className="text-sm font-medium">{selectedRequest.sampleTarget.toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Accuracy Match</span>
                    <span className="text-sm font-semibold text-primary">{selectedRequest.accuracyMatch}%</span>
                  </div>
                  <Progress value={selectedRequest.accuracyMatch} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    How well available participant data matches your study criteria.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Requested Data Types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.dataTypes.map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Latest Response</p>
                  <p className="text-sm">{selectedRequest.response}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dataset Preview Dialog */}
      <Dialog open={!!previewDataset} onOpenChange={(o) => !o && setPreviewDataset(null)}>
        <DialogContent className="sm:max-w-2xl">
          {previewDataset && (
            <>
              <DialogHeader>
                <DialogTitle>{previewDataset.name}</DialogTitle>
                <DialogDescription>
                  Preview of sample records — {previewDataset.records.toLocaleString()} total rows available.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(sampleDatasetRows[previewDataset.id]?.[0] ?? {}).map((h) => (
                        <TableHead key={h} className="capitalize">{h.replace(/_/g, " ")}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(sampleDatasetRows[previewDataset.id] ?? []).map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((v, j) => (
                          <TableCell key={j} className="text-sm">{v}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => handleDownload(previewDataset, "csv")} className="gap-1">
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button onClick={() => handleDownload(previewDataset, "xlsx")} className="gap-1">
                  <Download className="h-4 w-4" /> Excel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ResearcherDashboard;
