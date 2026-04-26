"use client";

import { TransactionCategory } from "@prisma/client";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import { upsertUserBudget } from "@/app/_actions/upsert-user-budget";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface BudgetItemProps {
  category: TransactionCategory;
  initialAmount: number;
}

const BudgetItem = ({ category, initialAmount }: BudgetItemProps) => {
  const [amount, setAmount] = useState(initialAmount.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      await upsertUserBudget({
        category,
        amount: Number(amount),
      });
      toast.success(`Limite para ${TRANSACTION_CATEGORY_LABELS[category]} atualizado!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar limite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-card">
      <div className="flex flex-col">
        <span className="font-bold">{TRANSACTION_CATEGORY_LABELS[category]}</span>
        <span className="text-xs text-muted-foreground text-foreground opacity-70">Defina o limite mensal</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8 w-32"
          />
        </div>
        <Button size="sm" onClick={handleSaveClick} disabled={isLoading}>
          {isLoading ? <Loader2Icon className="animate-spin" size={16} /> : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default BudgetItem;
