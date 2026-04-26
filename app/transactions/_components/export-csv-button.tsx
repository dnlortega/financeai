"use client";

import { Button } from "@/app/_components/ui/button";
import { DownloadIcon } from "lucide-react";
import { TransactionWithNumberAmount } from "@/app/_data/get-dashboard/types";
import { 
  TRANSACTION_CATEGORY_LABELS, 
  TRANSACTION_PAYMENT_METHOD_LABELS 
} from "@/app/_constants/transactions";

interface ExportCsvButtonProps {
  transactions: TransactionWithNumberAmount[];
}

const ExportCsvButton = ({ transactions }: ExportCsvButtonProps) => {
  const handleExportClick = () => {
    const csvRows = [
      ["Nome", "Tipo", "Categoria", "Metodo de Pagamento", "Valor", "Data"].join(","),
      ...transactions.map((t) =>
        [
          t.name,
          t.type,
          TRANSACTION_CATEGORY_LABELS[t.category],
          TRANSACTION_PAYMENT_METHOD_LABELS[t.paymentMethod],
          t.amount,
          new Date(t.date).toLocaleDateString("pt-BR"),
        ].join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transacoes-${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExportClick} className="rounded-full font-bold">
      Exportar CSV
      <DownloadIcon size={16} />
    </Button>
  );
};

export default ExportCsvButton;
