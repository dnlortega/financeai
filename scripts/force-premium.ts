import { clerkClient } from "@clerk/nextjs/server";

async function forcePremium() {
  const clerkUserId = "user_3Crd…EGiOm3idV".includes("…") ? null : "user_3Crd…EGiOm3idV";
  
  // Como o ID enviado contém reticências, vou tentar buscar o usuário pelo e-mail dnlortega@gmail.com que você passou antes
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

  console.log(`✅ SUCESSO: Plano Premium forçado para o usuário: ${user.id} (${user.emailAddresses[0].emailAddress})`);
}

forcePremium();
