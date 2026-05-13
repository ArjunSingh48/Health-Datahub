import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20" />
      <div className="relative text-center px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">HealthMarket</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Shield className="h-4 w-4" /> Blockchain-Powered Data Ownership
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
          Own Your Health Data.{" "}
          <span className="text-primary">Share Securely.</span>{" "}
          Earn Transparently.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          A decentralized marketplace where wearable device users securely share anonymized health data
          and earn rewards, while researchers access high-quality real-world datasets.
        </p>
        <Button size="lg" className="gap-2 text-base px-8" onClick={() => navigate("/choose-role")}>
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
