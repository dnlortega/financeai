"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvestmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const upsertInvestmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(InvestmentType),
  purchaseDate: z.date(),
});

type UpsertInvestmentParams = z.infer<typeof upsertInvestmentSchema>;

export const upsertInvestment = async (params: UpsertInvestmentParams) => {
  upsertInvestmentSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.investment.upsert({
    where: {
      id: params?.id ?? "",
    },
    update: { ...params, userId },
    create: { ...params, userId },
  });

  revalidatePath("/investments");
  revalidatePath("/");
};
