"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import UpsertInvestmentDialog from "./upsert-investment-dialog";

const AddInvestmentButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setDialogIsOpen(true)}
      >
        Adicionar Ativo
        <PlusIcon />
      </Button>
      <UpsertInvestmentDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddInvestmentButton;
