import { getDashboard } from "../get-dashboard";
import { getBudgets } from "../get-budgets";

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "danger" | "info";
}

export const getAlerts = async (month: string, year: string): Promise<Alert[]> => {
  const [dashboard, { categoryBudgets, totalBudget }] = await Promise.all([
    getDashboard(month, year),
    getBudgets(),
  ]);

  const alerts: Alert[] = [];

  // Alerta de Gasto Total
  if (totalBudget && totalBudget > 0) {
    const totalExpenses = dashboard.expensesTotal;
    const percentage = (totalExpenses / totalBudget) * 100;
    
    if (percentage >= 100) {
      alerts.push({
        id: "total-budget-danger",
        title: "Limite Total Atingido!",
        description: `Você gastou R$ ${totalExpenses}, ultrapassando seu limite total de R$ ${totalBudget}.`,
        type: "danger",
      });
    } else if (percentage >= 80) {
      alerts.push({
        id: "total-budget-warning",
        title: "Cuidado com o Gasto Total",
        description: `Você já utilizou ${Math.round(percentage)}% do seu limite total mensal.`,
        type: "warning",
      });
    }
  }

  dashboard.totalExpensePerCategory.forEach((category) => {
    const budget = categoryBudgets.find((b) => b.category === category.category);
    if (budget && budget.amount > 0) {
      const percentage = (category.totalAmount / budget.amount) * 100;
      
      if (percentage >= 100) {
        alerts.push({
          id: `budget-danger-${category.category}`,
          title: "Limite Ultrapassado!",
          description: `Você gastou R$ ${category.totalAmount} em ${category.category}, ultrapassando o limite de R$ ${budget.amount}.`,
          type: "danger",
        });
      } else if (percentage >= 80) {
        alerts.push({
          id: `budget-warning-${category.category}`,
          title: "Atenção ao Orçamento",
          description: `Você já utilizou ${Math.round(percentage)}% do seu orçamento de ${category.category}.`,
          type: "warning",
        });
      }
    }
  });

  return alerts;
};
