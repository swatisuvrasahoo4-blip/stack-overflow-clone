import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  currentPlan: string;
  onUpgrade?: (plan: string) => void;
}

export default function PlanCard({
  name,
  price,
  description,
  features,
  isCurrent = false,
  isPopular = false,
  currentPlan,
  onUpgrade,
}: PlanCardProps) {

  const planOrder: Record<string, number> = {
  Free: 0,
  Bronze: 1,
  Silver: 2,
  Gold: 3,
};

const canUpgrade =
  planOrder[name] > planOrder[currentPlan || "Free"];
  return (
    <div
  className={`relative rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
    isPopular
      ? "border-yellow-400 shadow-xl ring-2 ring-yellow-200 scale-[1.03]"
      : "border-gray-200 shadow-md"
  }`}
>
      {isPopular && (
        <span className="absolute top-4 right-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <h2
  className={`text-3xl font-bold ${
    name === "Free"
      ? "text-gray-900"
      : name === "Bronze"
      ? "text-amber-700"
      : name === "Silver"
      ? "text-slate-600"
      : "text-yellow-600"
  }`}
>
  {name}
</h2>

      <p
  className={`mt-4 mb-3 text-5xl font-extrabold ${
    name === "Free"
      ? "text-purple-600"
      : name === "Bronze"
      ? "text-amber-700"
      : name === "Silver"
      ? "text-slate-600"
      : "text-yellow-500"
  }`}
>
  {price}
</p>

      <p className="mt-4 text-base text-gray-600">{description}</p>

      <div className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check
  className={`h-5 w-5 ${
    name === "Free"
      ? "text-purple-600"
      : name === "Bronze"
      ? "text-amber-600"
      : name === "Silver"
      ? "text-slate-500"
      : "text-yellow-500"
  }`}
/>
            <span className="text-sm font-medium text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {isCurrent ? (
          <Button
  disabled={!canUpgrade}
  className={`w-full text-white font-semibold ${
    name === "Free"
      ? "bg-purple-600 hover:bg-purple-600"
      : name === "Bronze"
      ? "bg-amber-700 hover:bg-amber-700"
      : name === "Silver"
      ? "bg-slate-600 hover:bg-slate-600"
      : "bg-yellow-500 hover:bg-yellow-500"
  }`}
>
  Current Plan
</Button>
        ) : (
          <Button
  onClick={() => onUpgrade?.(name)}
  className={`w-full font-semibold text-white transition-all duration-300 ${
    name === "Bronze"
      ? "bg-amber-700 hover:bg-amber-800"
      : name === "Silver"
      ? "bg-slate-600 hover:bg-slate-700"
      : name === "Gold"
      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
      : "bg-purple-600 hover:bg-purple-700"
  }`}
>
  {canUpgrade ? "Upgrade" : "Lower Plan"}
</Button>
        )}
      </div>
    </div>
  );
}