"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseDashboard } from "@/components/expense-dashboard"
import { AddExpenseForm } from "@/components/add-expense-form"
import { ExpenseList } from "@/components/expense-list"

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activeView, setActiveView] = useState<"dashboard" | "add" | "list">("dashboard")

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <ExpenseDashboard expenses={expenses} />
      case "add":
        return <AddExpenseForm onAddExpense={addExpense} />
      case "list":
        return <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
      default:
        return <ExpenseDashboard expenses={expenses} />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  )
}
