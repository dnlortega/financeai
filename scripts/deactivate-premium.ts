import { clerkClient } from "@clerk/nextjs/server";

async function deactivatePremium() {
  const users = await (await clerkClient()).users.getUserList();
  const user = users.data.find(u => u.emailAddresses.some(e => e.emailAddress === "dnlortega@gmail.com"));

  if (!user) {
    console.log("Usuário não encontrado!");
    return;
  }

  await (await clerkClient()).users.updateUserMetadata(user.id, {
    publicMetadata: {
      subscriptionPlan: null,
    },
  });

  console.log(`Plano Premium REMOVIDO com sucesso para: ${user.emailAddresses[0].emailAddress}`);
}

deactivatePremium();
