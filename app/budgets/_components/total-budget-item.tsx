"use client";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import { upsertTotalBudget } from "@/app/_actions/upsert-total-budget";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface TotalBudgetItemProps {
  initialAmount: number;
}

const TotalBudgetItem = ({ initialAmount }: TotalBudgetItemProps) => {
  const [amount, setAmount] = useState(initialAmount.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      await upsertTotalBudget(Number(amount));
      toast.success("Limite total atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar limite total.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-6 rounded-lg border-2 border-primary bg-primary/5 mb-6">
      <div className="flex flex-col">
        <span className="font-bold text-lg">Limite Mensal Global</span>
        <span className="text-sm text-muted-foreground text-foreground opacity-70">
          Defina o máximo que você pretende gastar no total por mês.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8 w-40 text-lg font-bold"
          />
        </div>
        <Button size="lg" onClick={handleSaveClick} disabled={isLoading}>
          {isLoading ? <Loader2Icon className="animate-spin" size={20} /> : "Definir Limite Global"}
        </Button>
      </div>
    </div>
  );
};

export default TotalBudgetItem;
