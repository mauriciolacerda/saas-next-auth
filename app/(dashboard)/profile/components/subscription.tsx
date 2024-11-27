import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "./card-plan";
import { BillingHistory } from "@/app/(dashboard)/profile/components/BillingHistory";
import { PaymentMethod } from "@/app/(dashboard)/profile/components/PaymentMethod";

const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for individuals and small projects",
    features: [
      { text: "Up to 3 projects", included: true },
      { text: "Basic analytics", included: true },
      { text: "24/7 support", included: true },
      { text: "Custom domain", included: false },
      { text: "Advanced security", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "Best for professional developers",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Advanced analytics", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Custom domain", included: true },
      { text: "Advanced security", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "For large teams and organizations",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Enterprise analytics", included: true },
      { text: "Dedicated support", included: true },
      { text: "Multiple domains", included: true },
      { text: "Advanced security + Audit", included: true },
    ],
  },
];

export function Subscription() {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan);
      setShowConfirmDialog(false);
    }
  };

  const getCurrentPlanDetails = () => {
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === currentPlan);
  };

  const currentPlanDetails = getCurrentPlanDetails();
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and payment details
        </p>
      </div>

      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Current Subscription</AlertTitle>
        <AlertDescription>
          You are currently on the {currentPlanDetails?.name} plan. Your next
          billing date is {nextBillingDate.toLocaleDateString()}.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isCurrentPlan={currentPlan === plan.id}
                isUpgrade={
                  SUBSCRIPTION_PLANS.findIndex((p) => p.id === plan.id) >
                  SUBSCRIPTION_PLANS.findIndex((p) => p.id === currentPlan)
                }
                onSelect={() => handlePlanSelect(plan.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <PaymentMethod
            last4="4242"
            expiry="12/2025"
            type="Visa"
          />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Billing History</h2>
            <BillingHistory />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change your subscription plan? This will
              take effect on your next billing cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={handleConfirmChange}
            >
              Confirm Change
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}