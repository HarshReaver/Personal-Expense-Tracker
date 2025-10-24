"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import type { Expense } from "@/page"

interface ExpenseDashboardProps {
  expenses: Expense[] // Keep prop for compatibility, but use state internally
}

export function ExpenseDashboard({ expenses: initialExpenses }: ExpenseDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch expenses from MongoDB
  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:3000/api/expenses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch expenses')
        }

        // Map backend data to Expense type
        const fetchedExpenses: Expense[] = data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          amount: item.amount,
          category: item.category,
          date: item.date,
          description: item.description || '',
        }))

        setExpenses(fetchedExpenses)
      } catch (error: any) {
        console.error('Error fetching expenses:', error)
        setError(error.message || 'Failed to fetch expenses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const dashboardData = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Category breakdown
    const categoryData = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0.0',
    }))

    // Monthly breakdown
    const monthlyData = expenses.reduce(
      (acc, expense) => {
        const month = new Date(expense.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6) // Last 6 months

    // Recent expenses
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    // This month's expenses
    const currentMonth = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    const thisMonthExpenses = monthlyData[currentMonth] || 0

    return {
      totalExpenses,
      categoryChartData,
      monthlyChartData,
      recentExpenses,
      thisMonthExpenses,
      expenseCount: expenses.length,
    }
  }, [expenses])

  const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Expense Dashboard
        </h1>
        <p className="text-muted-foreground">Track and visualize your personal expenses</p>
      </div>

      {/* Error and Loading States */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.totalExpenses.toFixed(2)}</div>
            <p className="text-xs opacity-90">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">This Month</CardTitle>
            <Calendar className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.thisMonthExpenses.toFixed(2)}</div>
            <p className="text-xs opacity-90">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.expenseCount}</div>
            <p className="text-xs opacity-90">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-green-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Average Expense</CardTitle>
            <TrendingDown className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {dashboardData.expenseCount > 0
                ? (dashboardData.totalExpenses / dashboardData.expenseCount).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs opacity-90">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Expenses by Category
            </CardTitle>
            <CardDescription>Breakdown of your spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.categoryChartData.length > 0 ? (
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      //label={({ category, percentage }) => `₹{category} (₹{percentage}%)`}
                    >
                      {dashboardData.categoryChartData.map((entry, index) => (
                        <Cell key={`cell-₹{index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expenses to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Monthly Spending Trend
            </CardTitle>
            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.monthlyChartData.length > 0 ? (
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.monthlyChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No monthly data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Recent Expenses
          </CardTitle>
          <CardDescription>Your latest spending activities</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{expense.title}</h4>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                    <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{expense.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet. Start by adding your first expense!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
