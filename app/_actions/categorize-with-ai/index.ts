"use server";

import { OpenAI } from "openai";
import { TransactionCategory } from "@prisma/client";

export const categorizeWithAI = async (name: string): Promise<TransactionCategory> => {
  if (!process.env.OPENAI_API_KEY) {
    return TransactionCategory.OTHER;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Você é um assistente financeiro que categoriza transações bancárias.
        Retorne APENAS uma das seguintes categorias em letra maiúscula:
        HOUSING, TRANSPORTATION, FOOD, ENTERTAINMENT, HEALTH, UTILITY, SALARY, EDUCATION, OTHER.`,
      },
      {
        role: "user",
        content: `Qual a categoria mais provável para a transação: "${name}"?`,
      },
    ],
  });

  const category = response.choices[0].message.content?.trim() as TransactionCategory;
  
  if (Object.values(TransactionCategory).includes(category)) {
    return category;
  }

  return TransactionCategory.OTHER;
};
