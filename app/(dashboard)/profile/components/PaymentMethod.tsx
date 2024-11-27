import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentMethodProps {
  last4: string;
  expiry: string;
  type: string;
}

export function PaymentMethod({ last4, expiry, type }: PaymentMethodProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payment Method</CardTitle>
        <CardDescription>
          Manage your payment method and billing details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="rounded-md border p-2">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">
              {type} ending in {last4}
            </p>
            <p className="text-sm text-muted-foreground">Expires {expiry}</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Update Card
          </Button>
          <Button variant="outline" size="sm">
            Update Billing Address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}