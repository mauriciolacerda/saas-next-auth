import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  isCurrentPlan: boolean;
  isUpgrade: boolean;
  onSelect: () => void;
}

export function PlanCard({
  name,
  price,
  description,
  features,
  isCurrentPlan,
  isUpgrade,
  onSelect,
}: PlanCardProps) {
  return (
    <Card className={cn(
      "flex flex-col",
      isCurrentPlan && "border-primary shadow-lg"
    )}>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check
                className={cn(
                  "h-4 w-4",
                  feature.included ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className={cn(!feature.included && "text-muted-foreground")}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={isCurrentPlan ? "outline" : "default"}
          className="w-full"
          onClick={onSelect}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan
            ? "Current Plan"
            : isUpgrade
            ? "Upgrade Plan"
            : "Downgrade Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}