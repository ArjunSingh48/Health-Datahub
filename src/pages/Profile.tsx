import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Watch,
  Calendar,
  Wallet,
  FlaskConical,
  Users,
  MapPin,
  Mail,
  Phone,
  Heart,
  Activity,
  Award,
  ShieldCheck,
  Languages,
  Briefcase,
  Trophy,
  Target,
} from "lucide-react";
import { walletData, researcherData } from "@/data/mockData";

const contributorProfile = {
  age: 32,
  sex: "Female",
  height: "168 cm",
  weight: "62 kg",
  bloodType: "O+",
  location: "San Francisco, CA",
  phone: "+1 (415) 555-0142",
  languages: ["English", "Spanish"],
  emergencyContact: { name: "Jamie Johnson", relation: "Sibling", phone: "+1 (415) 555-0188" },
  conditions: ["Mild seasonal allergies"],
  allergies: ["Penicillin"],
  lifestyle: { activityLevel: "Active", smoker: "Never", alcohol: "Occasional" },
  dataSharingScore: 86,
  contributionStreak: 42,
  studiesJoined: 7,
  achievements: [
    { name: "First Sale", icon: Trophy },
    { name: "30-Day Streak", icon: Target },
    { name: "Top 10% Contributor", icon: Award },
    { name: "Verified Identity", icon: ShieldCheck },
  ],
};

const researcherProfile = {
  institution: "Stanford School of Medicine",
  department: "Cardiovascular Research",
  title: "Principal Investigator",
  location: "Stanford, CA",
  phone: "+1 (650) 555-0117",
  orcid: "0000-0002-1825-0097",
  credentials: ["MD", "PhD"],
  specialties: ["Cardiology", "Sleep Medicine", "Wearable Data"],
  publications: 42,
  citations: 1280,
  hIndex: 21,
  verifiedAffiliation: true,
};

const Profile = () => {
  const { user } = useAuth();
  const isResearcher = user?.role === "researcher";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <Badge variant="default" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-1 text-sm mt-0.5">
                  <Mail className="h-3.5 w-3.5" /> {user?.email}
                </p>
                <Badge className="mt-2 capitalize">{user?.role}</Badge>
                <p className="mt-3 text-muted-foreground text-sm">{user?.bio}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {user?.joinedDate}</span>
                  <span className="flex items-center gap-1"><Wallet className="h-4 w-4" /> {user?.walletBalance?.toLocaleString()} HLTH</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {isResearcher ? researcherProfile.location : contributorProfile.location}
                  </span>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {isResearcher ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Affiliation
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                <Field label="Institution" value={researcherProfile.institution} />
                <Field label="Department" value={researcherProfile.department} />
                <Field label="Title" value={researcherProfile.title} />
                <Field label="Phone" value={researcherProfile.phone} />
                <Field label="ORCID" value={researcherProfile.orcid} />
                <Field label="Credentials" value={researcherProfile.credentials.join(", ")} />
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {researcherProfile.specialties.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> Academic Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-center">
                <Stat label="Publications" value={researcherProfile.publications} />
                <Stat label="Citations" value={researcherProfile.citations.toLocaleString()} />
                <Stat label="h-index" value={researcherProfile.hIndex} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Research Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {researcherData.projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.participants.toLocaleString()} participants</span>
                          <span>{p.datasets} datasets</span>
                          <span>Started {p.startDate}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant={p.status === "Active" ? "default" : p.status === "Completed" ? "secondary" : "outline"}>{p.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                <Field label="Age" value={`${contributorProfile.age}`} />
                <Field label="Sex" value={contributorProfile.sex} />
                <Field label="Height" value={contributorProfile.height} />
                <Field label="Weight" value={contributorProfile.weight} />
                <Field label="Blood Type" value={contributorProfile.bloodType} />
                <Field label="Phone" value={contributorProfile.phone} icon={Phone} />
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Languages className="h-3.5 w-3.5" /> Languages
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {contributorProfile.languages.map((l) => (
                      <Badge key={l} variant="secondary">{l}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> Health Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                <Field label="Activity Level" value={contributorProfile.lifestyle.activityLevel} />
                <Field label="Smoker" value={contributorProfile.lifestyle.smoker} />
                <Field label="Alcohol" value={contributorProfile.lifestyle.alcohol} />
                <Field label="Conditions" value={contributorProfile.conditions.join(", ") || "None"} />
                <Field label="Allergies" value={contributorProfile.allergies.join(", ") || "None"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> Contribution Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat label="Day Streak" value={contributorProfile.contributionStreak} />
                  <Stat label="Studies Joined" value={contributorProfile.studiesJoined} />
                  <Stat label="Devices" value={walletData.wearables.length} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">Data Sharing Score</span>
                    <span className="text-primary font-semibold">{contributorProfile.dataSharingScore}/100</span>
                  </div>
                  <Progress value={contributorProfile.dataSharingScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on data quality, consistency, and study participation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contributorProfile.achievements.map((a) => (
                  <div key={a.name} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <a.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs font-medium">{a.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connected Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {walletData.wearables.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Watch className="h-5 w-5 text-primary" />
                      <span className="font-medium">{w.name}</span>
                    </div>
                    <Badge variant={w.status === "Connected" ? "default" : "secondary"}>{w.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
                <Field label="Name" value={contributorProfile.emergencyContact.name} />
                <Field label="Relation" value={contributorProfile.emergencyContact.relation} />
                <Field label="Phone" value={contributorProfile.emergencyContact.phone} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const Field = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="rounded-md border p-3">
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      {Icon && <Icon className="h-3.5 w-3.5" />} {label}
    </p>
    <p className="font-medium mt-0.5">{value}</p>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md bg-muted/30 p-3">
    <p className="text-2xl font-bold text-primary">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
