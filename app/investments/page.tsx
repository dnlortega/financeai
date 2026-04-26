import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { DataTable } from "../_components/ui/data-table";
import { investmentColumns } from "./_columns";
import { getInvestments } from "../_data/get-investments";
import AddInvestmentButton from "./_components/add-investment-button";
import { ScrollArea } from "../_components/ui/scroll-area";

const InvestmentsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const investments = await getInvestments();

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-4 md:p-6">
        {/* TÍTULO E BOTÃO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Investimentos</h1>
          <AddInvestmentButton />
        </div>
        <ScrollArea className="h-full">
          <DataTable columns={investmentColumns} data={investments} />
        </ScrollArea>
      </div>
    </>
  );
};

export default InvestmentsPage;
