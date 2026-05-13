import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Upload, FlaskConical, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="relative w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">HealthMarket</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">How would you like to join?</h2>
        <p className="text-muted-foreground text-center mb-10">Choose the role that best describes you.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contributor */}
          <Card className="border-2 hover:border-primary/40 transition-colors cursor-pointer group" onClick={() => navigate("/signup?role=user")}>
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Join as a Contributor</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Share your anonymized wearable health data and earn HLTH token rewards. You stay in full control of what you share and can revoke access anytime.
              </p>
              <Button className="gap-2 w-full">
                Proceed <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Researcher */}
          <Card className="border-2 hover:border-primary/40 transition-colors cursor-pointer group" onClick={() => navigate("/signup?role=researcher")}>
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <FlaskConical className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Join as a Researcher</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Access high-quality, ethically sourced real-world health datasets. Filter by demographics, device type, and data category to find what you need.
              </p>
              <Button className="gap-2 w-full">
                Proceed <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
