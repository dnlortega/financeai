"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InvestmentAsset } from "@/app/_data/get-investments";
import { INVESTMENT_TYPE_LABELS } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";

export const investmentColumns: ColumnDef<InvestmentAsset>[] = [
  {
    accessorKey: "name",
    header: "Ativo",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: investment } }) => {
      return INVESTMENT_TYPE_LABELS[investment.type];
    },
  },
  {
    accessorKey: "amount",
    header: "Valor Investido",
    cell: ({ row: { original: investment } }) => {
      return formatCurrency(investment.amount);
    },
  },
  {
    accessorKey: "purchaseDate",
    header: "Data de Compra",
    cell: ({ row: { original: investment } }) => {
      return new Date(investment.purchaseDate).toLocaleDateString("pt-BR");
    },
  },
];
