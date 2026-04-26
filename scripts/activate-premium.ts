import { clerkClient } from "@clerk/nextjs/server";

async function activatePremium() {
  const users = await (await clerkClient()).users.getUserList();
  const user = users.data.find(u => u.emailAddresses.some(e => e.emailAddress === "dnlortega@gmail.com"));

  if (!user) {
    console.log("Usuário não encontrado!");
    return;
  }

  await (await clerkClient()).users.updateUserMetadata(user.id, {
    publicMetadata: {
      subscriptionPlan: "premium",
    },
  });

  console.log(`Plano Premium ativado com sucesso para: ${user.emailAddresses[0].emailAddress}`);
}

activatePremium();
