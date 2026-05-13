import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { marketplaceDatasets } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Star, Users, Database, CheckCircle2, Loader2, Wallet, ShieldCheck, Upload, FileSpreadsheet, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Dataset = (typeof marketplaceDatasets)[number];
type PurchaseStep = "confirm" | "processing" | "success";

const Marketplace = () => {
  const { user } = useAuth();
  const isContributor = user?.role === "user";
  const [search, setSearch] = useState("");
  const [dataTypeFilter, setDataTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [step, setStep] = useState<PurchaseStep>("confirm");
  const [txHash, setTxHash] = useState("");
  const [owned, setOwned] = useState<string[]>([]);
  const [userListings, setUserListings] = useState<Dataset[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [upload, setUpload] = useState({
    title: "",
    dataType: "Sleep",
    price: 100,
    description: "",
    tags: "",
    fileName: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const allDatasets = [...userListings, ...marketplaceDatasets];
  const filtered = allDatasets.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchType = dataTypeFilter === "all" || d.dataType === dataTypeFilter;
    return matchSearch && matchType;
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = /\.(csv|xlsx|xls)$/i.test(f.name);
    if (!ok) {
      toast({ title: "Unsupported file", description: "Please upload a CSV or Excel file.", variant: "destructive" });
      return;
    }
    setUpload((u) => ({ ...u, fileName: f.name }));
  };

  const submitUpload = () => {
    if (!upload.title.trim() || !upload.fileName || upload.price <= 0) {
      toast({ title: "Missing info", description: "Add a title, file, and a price greater than 0.", variant: "destructive" });
      return;
    }
    const tags = upload.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const newDataset: Dataset = {
      id: "uds_" + Math.random().toString(36).slice(2, 8),
      title: upload.title.trim(),
      dataType: upload.dataType,
      sampleSize: Math.floor(Math.random() * 500) + 50,
      price: Number(upload.price),
      rating: 5.0,
      ageRange: "Self-reported",
      location: "Self-listed",
      deviceTypes: tags.length ? tags : ["My Data"],
      description: upload.description.trim() || `Self-listed ${upload.dataType.toLowerCase()} data from ${upload.fileName}.`,
    };
    setUserListings((prev) => [newDataset, ...prev]);
    toast({ title: "Dataset listed", description: `${newDataset.title} is now in the marketplace.` });
    setUploadOpen(false);
    setUpload({ title: "", dataType: "Sleep", price: 100, description: "", tags: "", fileName: "" });
  };

  const openPurchase = (d: Dataset) => {
    setSelected(d);
    setStep("confirm");
    setTxHash("");
  };

  const confirmPurchase = () => {
    if (!selected) return;
    setStep("processing");
    setTimeout(() => {
      const hash =
        "0x" +
        Math.random().toString(16).slice(2, 6) +
        "..." +
        Math.random().toString(16).slice(2, 6);
      setTxHash(hash);
      setOwned((prev) => [...prev, selected.id]);
      setStep("success");
      toast({
        title: "Purchase Successful",
        description: `${selected.title} added to your datasets.`,
      });
    }, 1800);
  };

  const closeDialog = () => {
    setSelected(null);
    setStep("confirm");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Data Marketplace</h1>
            <p className="text-muted-foreground">
              {isContributor
                ? "Browse datasets or list your own data for sale"
                : "Browse and purchase anonymized health datasets"}
            </p>
          </div>
          {isContributor && (
            <Button className="gap-2" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Sell My Data
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search datasets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sleep">Sleep</SelectItem>
              <SelectItem value="Heart Rate">Heart Rate</SelectItem>
              <SelectItem value="Steps">Steps</SelectItem>
              <SelectItem value="SpO2">SpO2</SelectItem>
              <SelectItem value="HRV">HRV</SelectItem>
              <SelectItem value="Body Temp">Body Temp</SelectItem>
              <SelectItem value="Glucose">Glucose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dataset Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const isOwned = owned.includes(d.id);
            const isMine = userListings.some((u) => u.id === d.id);
            return (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-1.5">
                      <Badge variant="secondary">{d.dataType}</Badge>
                      {isMine && <Badge variant="outline" className="text-xs">My Listing</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-warning fill-warning" /> {d.rating}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{d.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {d.sampleSize.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Database className="h-3.5 w-3.5" /> {d.ageRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {d.deviceTypes.map((dt) => (
                      <Badge key={dt} variant="outline" className="text-xs">{dt}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{d.price} HLTH</span>
                    {isMine ? (
                      <Badge variant="secondary">Listed</Badge>
                    ) : isOwned ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Owned
                      </Badge>
                    ) : isContributor ? (
                      <Badge variant="outline">Available</Badge>
                    ) : (
                      <Button size="sm" onClick={() => openPurchase(d)}>Purchase</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          {step === "confirm" && selected && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogDescription>Review the dataset details and confirm payment.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{selected.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{selected.description}</p>
                    </div>
                    <Badge variant="secondary">{selected.dataType}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                    <div>
                      <p className="text-muted-foreground text-xs">Sample Size</p>
                      <p className="font-medium">{selected.sampleSize.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Age Range</p>
                      <p className="font-medium">{selected.ageRange}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Location</p>
                      <p className="font-medium">{selected.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Rating</p>
                      <p className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning fill-warning" /> {selected.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dataset price</span>
                    <span>{selected.price} HLTH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network fee</span>
                    <span>0.5 HLTH</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{(selected.price + 0.5).toFixed(2)} HLTH</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Funds locked in smart contract escrow until access is granted.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={confirmPurchase}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Confirm & Pay
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "processing" && (
            <div className="py-10 flex flex-col items-center text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div>
                <h3 className="font-semibold">Processing Transaction</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitting payment to smart contract on the HLTH network…
                </p>
              </div>
            </div>
          )}

          {step === "success" && selected && (
            <>
              <div className="py-6 flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Purchase Complete</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You now have access to <span className="font-medium">{selected.title}</span>.
                  </p>
                </div>
                <div className="w-full rounded-lg bg-muted/40 p-3 text-left space-y-1">
                  <p className="text-xs text-muted-foreground">Transaction Hash</p>
                  <p className="font-mono text-xs">{txHash}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeDialog} className="w-full">Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload / Sell Data Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>List Your Data for Sale</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file, add tags, and set your price in HLTH.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ds-title">Dataset title</Label>
              <Input
                id="ds-title"
                placeholder="e.g. My Sleep Data — Q1 2026"
                value={upload.title}
                onChange={(e) => setUpload((u) => ({ ...u, title: e.target.value }))}
                maxLength={80}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Data type</Label>
                <Select value={upload.dataType} onValueChange={(v) => setUpload((u) => ({ ...u, dataType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Sleep", "Heart Rate", "Steps", "SpO2", "HRV", "Body Temp", "Glucose"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ds-price">Price (HLTH)</Label>
                <Input
                  id="ds-price"
                  type="number"
                  min={1}
                  value={upload.price}
                  onChange={(e) => setUpload((u) => ({ ...u, price: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-tags">Tags (comma-separated)</Label>
              <Input
                id="ds-tags"
                placeholder="apple watch, athlete, 30-day"
                value={upload.tags}
                onChange={(e) => setUpload((u) => ({ ...u, tags: e.target.value }))}
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-desc">Description (optional)</Label>
              <Textarea
                id="ds-desc"
                placeholder="What's in this dataset?"
                value={upload.description}
                onChange={(e) => setUpload((u) => ({ ...u, description: e.target.value }))}
                maxLength={300}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data file</Label>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFile}
              />
              {upload.fileName ? (
                <div className="flex items-center justify-between rounded-md border p-2.5">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{upload.fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setUpload((u) => ({ ...u, fileName: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  type="button"
                  className="w-full gap-2"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Choose CSV or Excel
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={submitUpload}>List Dataset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Marketplace;
