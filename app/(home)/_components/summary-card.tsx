import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
  budgetAmount?: number | null;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
  budgetAmount,
}: SummaryCardProps) => {
  const percentage = budgetAmount ? Math.round((amount / budgetAmount) * 100) : 0;
  const isOverBudget = percentage >= 100;

  return (
    <Card className={isOverBudget && title === "Despesas" ? "border-red-500 bg-red-500/5" : ""}>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-foreground opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p
            className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
          >
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>

          {size === "large" && (
            <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
          )}
        </div>

        {budgetAmount && (
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className={isOverBudget ? "[&>div]:bg-red-500" : ""}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage}% do limite global</span>
              <span>Limite: {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(budgetAmount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
