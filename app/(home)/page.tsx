import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select-client";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

import { getAvailableMonths } from "../_data/get-available-months";
import { getTimeEvolution } from "../_data/get-time-evolution";
import TimeEvolutionChart from "./_components/time-evolution-chart";
import { getBudgets } from "../_data/get-budgets";

interface HomeProps {
  searchParams: Promise<{
    month: string;
    year: string;
  }>;
}

const Home = async (props: HomeProps) => {
  const searchParams = await props.searchParams;
  const { month, year } = searchParams;
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const monthIsInvalid = !month || !isMatch(month, "MM");
  const yearIsInvalid = !year || !isMatch(year, "yyyy");
  if (monthIsInvalid || yearIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`);
  }
  const [dashboard, availableMonths, userCanAddTransaction, user, timeEvolution, budgets] =
    await Promise.all([
      getDashboard(month, year),
      getAvailableMonths(),
      canUserAddTransaction(),
      (await clerkClient()).users.getUser(userId),
      getTimeEvolution(year),
      getBudgets(),
    ]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-4 p-6 md:space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect availableMonths={availableMonths} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-6">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
              totalBudget={budgets.totalBudget}
            />
            <TimeEvolutionChart data={timeEvolution} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <TransactionsPieChart {...dashboard} />
              <div className="md:col-span-2">
                <ExpensesPerCategory
                  expensesPerCategory={dashboard.totalExpensePerCategory}
                  categoryBudgets={budgets.categoryBudgets}
                />
              </div>
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
