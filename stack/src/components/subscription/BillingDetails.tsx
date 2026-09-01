import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BillingDetailsProps {
  name: string;
  email: string;
  plan: string;
  amount: number;
}

const BillingDetails = ({
  name,
  email,
  plan,
  amount,
}: BillingDetailsProps) => {
  const { t } =
    useTranslation("subscription");

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          {t(
            "billing.title"
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">
            {t(
              "billing.name"
            )}
          </span>

          <span>{name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            {t(
              "billing.email"
            )}
          </span>

          <span>{email}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            {t(
              "billing.plan"
            )}
          </span>

          <span>{plan}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            {t(
              "billing.amount"
            )}
          </span>

          <span>
            ₹{amount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingDetails;