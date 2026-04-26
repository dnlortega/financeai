"use client";

import { Button } from "@/app/_components/ui/button";
import UpsertInvestmentDialog from "./upsert-investment-dialog";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { InvestmentAsset } from "@/app/_data/get-investments";

interface EditInvestmentButtonProps {
  investment: InvestmentAsset;
}

const EditInvestmentButton = ({ investment }: EditInvestmentButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertInvestmentDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...investment,
          amount: Number(investment.amount),
          broker: investment.broker ?? "",
        }}
        transactionId={investment.id}
      />
    </>
  );
};

export default EditInvestmentButton;
