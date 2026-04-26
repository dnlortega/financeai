"use client";

import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { Transaction } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/app/_lib/utils";

interface TransactionIconProps {
  transaction: Transaction;
}

const TransactionIcon = ({ transaction }: TransactionIconProps) => {
  const isInvestment = transaction.type === "INVESTMENT";
  const isDeposit = transaction.type === "DEPOSIT";

  // Mantemos apenas a borda de destaque para patrimônio, que ajuda na leitura visual
  const borderClass = isInvestment 
    ? "border border-blue-500/50" 
    : isDeposit 
    ? "border border-primary/50" 
    : "border border-transparent";

  // Caso seja investimento geral (sem logo de banco)
  if (isInvestment) {
    return (
      <div className={cn("rounded-lg bg-blue-600 p-2 shadow-sm", borderClass)}>
        <Image
          src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
          height={20}
          width={20}
          alt="Investimento"
          className="brightness-0 invert"
        />
      </div>
    );
  }

  // Fallback padrão para o ícone do método de pagamento
  return (
    <div className={cn("rounded-lg bg-muted p-3 text-foreground shadow-sm", borderClass)}>
      <Image
        src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
        height={20}
        width={20}
        alt={transaction.paymentMethod}
      />
    </div>
  );
};

export default TransactionIcon;
