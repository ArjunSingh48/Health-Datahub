import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, Lock, Eye, Database, UserCheck } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Data Ownership",
    content: "You retain full ownership of your health data at all times. Our platform never claims rights to your personal information. Data is stored in your personal vault and shared only with your explicit consent.",
  },
  {
    icon: Lock,
    title: "Encryption & Security",
    content: "All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. Private keys are generated locally on your device and never transmitted to our servers.",
  },
  {
    icon: Eye,
    title: "Anonymization",
    content: "Before any data is shared with researchers, it undergoes a rigorous anonymization process. All personally identifiable information (PII) is stripped, and differential privacy techniques are applied.",
  },
  {
    icon: Database,
    title: "Decentralized Storage",
    content: "Health data is stored across a decentralized network, eliminating single points of failure. No central authority can access or modify your data without your cryptographic consent.",
  },
  {
    icon: UserCheck,
    title: "Consent Management",
    content: "You have granular control over what data is shared, with whom, and for how long. Consent can be revoked at any time, and access is immediately terminated via smart contract enforcement.",
  },
];

const DataPrivacy = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Data Privacy</h1>
          <p className="text-muted-foreground">Understanding how your data is protected</p>
        </div>

        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DataPrivacy;
