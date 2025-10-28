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

  // Fetch expenses from backend API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/expenses')
        if (!response.ok) {
          throw new Error('Failed to fetch expenses')
        }
        const { data } = await response.json()
        setExpenses(data)
      } catch (error) {
        console.error('Error fetching expenses:', error)
      }
    }

    fetchExpenses()
  }, [])

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add expense')
      }
      
      const newExpense = await response.json()
      setExpenses((prev) => [newExpense, ...prev])
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }
      
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
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
