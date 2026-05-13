import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { transactions, researcherTransactions } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowDownLeft, ArrowUpRight, FileCheck, Clock, CheckCircle, ShieldCheck, Hash } from "lucide-react";

const stepFlow = [
  { step: "1", title: "Data Request", desc: "Researcher submits a request for specific data types", icon: FileCheck },
  { step: "2", title: "User Approval", desc: "Data provider reviews and approves the request", icon: CheckCircle },
  { step: "3", title: "Smart Contract Payment", desc: "HLTH tokens are locked in escrow contract", icon: ArrowUpRight },
  { step: "4", title: "Access Granted", desc: "Anonymized data is shared and payment released", icon: ArrowDownLeft },
];

type Tx = (typeof researcherTransactions)[number];

const Transactions = () => {
  const { user } = useAuth();
  const isResearcher = user?.role === "researcher";
  const txList = isResearcher ? researcherTransactions : transactions;
  const fromLabel = isResearcher ? "Dataset" : "From";
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Contract Transactions</h1>
          <p className="text-muted-foreground">
            {isResearcher
              ? "Your outgoing payments, data access, and data requests — researchers can only buy or access data."
              : "View transaction flow and history"}
          </p>
        </div>

        {/* Flow Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-4">
              {stepFlow.map((s, i) => (
                <div key={s.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden sm:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-primary/20" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <p className="text-xs text-muted-foreground">Click a row to view full transaction details.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TX Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{fromLabel}</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txList.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{tx.blockHash}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {tx.type.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{isResearcher ? tx.to : tx.from}</TableCell>
                    <TableCell className="font-medium text-primary">{tx.amount} {tx.token}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "confirmed" ? "default" : "secondary"} className="gap-1">
                        {tx.status === "confirmed" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.timestamp}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(o) => !o && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedTx && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  Transaction Details
                </DialogTitle>
                <DialogDescription className="capitalize">
                  {selectedTx.type.replace(/_/g, " ")} — {selectedTx.status}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {(() => {
                  const purpose: Record<string, { what: string; why: string; does: string }> = {
                    payment_received: {
                      what: "Incoming HLTH token payment from a researcher buying access to your data.",
                      why: "A researcher purchased a dataset that included your contributed data.",
                      does: "Tokens are credited to your wallet balance and counted toward your earnings.",
                    },
                    payment_sent: {
                      what: "Outgoing HLTH token payment to access a dataset on the marketplace.",
                      why: "You purchased a dataset listing as a researcher.",
                      does: "Tokens are deducted from your balance and locked in escrow until access is granted.",
                    },
                    data_access: {
                      what: "On-chain record of dataset access being granted.",
                      why: "Either your data was shared with a researcher, or a researcher was granted dataset access.",
                      does: "Releases escrowed tokens and unlocks anonymized data to the buyer.",
                    },
                    data_request: {
                      what: "A pending request to access specific health data.",
                      why: "A researcher wants to include this data in a study; awaiting consent or approval.",
                      does: "Stays pending until the data owner approves — no funds move yet.",
                    },
                  };
                  const p = purpose[selectedTx.type] ?? {
                    what: "Smart contract transaction on the HLTH network.",
                    why: "Triggered by activity in the marketplace.",
                    does: "Recorded on-chain for auditability.",
                  };
                  return (
                    <div className="rounded-lg border p-3 space-y-2 bg-primary/5">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What it is</p>
                        <p className="text-sm">{p.what}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Why it happened</p>
                        <p className="text-sm">{p.why}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What it does</p>
                        <p className="text-sm">{p.does}</p>
                      </div>
                    </div>
                  );
                })()}
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Transaction Hash</p>
                  <p className="font-mono text-sm break-all">{selectedTx.blockHash}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-sm font-medium">{selectedTx.from}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Dataset</p>
                    <p className="text-sm font-medium">{selectedTx.to}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium text-primary">{selectedTx.amount} {selectedTx.token}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Network Fee</p>
                    <p className="text-sm font-medium">0.5 {selectedTx.token}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-medium">{selectedTx.timestamp}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={selectedTx.status === "confirmed" ? "default" : "secondary"} className="gap-1">
                      {selectedTx.status === "confirmed" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {selectedTx.status}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Smart Contract</p>
                  <p className="font-mono text-xs break-all">0xHLTH...EscrowV2</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Verified on HLTH network
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTx(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;

