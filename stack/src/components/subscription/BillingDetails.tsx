import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingDetailsProps {
  name: string;
  email: string;
  plan: string;
  amount: number;
}

export default function BillingDetails({
  name,
  email,
  plan,
  amount,
}: BillingDetailsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Billing Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Name</span>
          <span>{name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span>{email}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Plan</span>
          <span>{plan}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span>₹{amount}</span>
        </div>
      </CardContent>
    </Card>
  );
}