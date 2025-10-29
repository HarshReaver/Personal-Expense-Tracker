import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, Filter, Calendar, IndianRupee, Edit } from "lucide-react"
import type { Expense } from "@/page"

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

export function ExpenseList({ expenses: initialExpenses, onDeleteExpense }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch expenses from backend on component mount
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
        interface BackendExpense {
          _id: string
          title: string
          amount: number
          category: string
          date: string
          description?: string
        }
        const fetchedExpenses: Expense[] = data.data.map((item: BackendExpense) => ({
          id: item._id,
          title: item.title,
          amount: item.amount,
          category: item.category,
          date: item.date,
          description: item.description || '',
        }))

        setExpenses(fetchedExpenses)
      } catch (error: unknown) {
        console.error('Error fetching expenses:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch expenses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete expense')
      }else {
        alert('Expense deleted successfully!')
        }

      // Remove the deleted expense from state
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
      onDeleteExpense(id)
    } catch (error: unknown) {
      console.error('Error deleting expense:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete expense')
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(expenses.map((expense) => expense.category)))
    return uniqueCategories.sort()
  }, [expenses])

  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [expenses, searchTerm, categoryFilter, sortBy, sortOrder])

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getCategoryColor = (category: string) => {
    const colors = {
      "Food & Dining": "bg-orange-100 text-orange-800 border-orange-200",
      Transportation: "bg-blue-100 text-blue-800 border-blue-200",
      Shopping: "bg-purple-100 text-purple-800 border-purple-200",
      Entertainment: "bg-pink-100 text-pink-800 border-pink-200",
      "Bills & Utilities": "bg-red-100 text-red-800 border-red-200",
      Healthcare: "bg-green-100 text-green-800 border-green-200",
      Travel: "bg-cyan-100 text-cyan-800 border-cyan-200",
      Education: "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Personal Care": "bg-teal-100 text-teal-800 border-teal-200",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[category as keyof typeof colors] || colors["Other"]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Expense List
        </h1>
        <p className="text-muted-foreground">View and manage all your recorded expenses</p>
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

      {/* Filters and Search */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60 border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/60 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={(value: "date" | "amount" | "title") => setSortBy(value)}>
                <SelectTrigger className="bg-white/60 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger className="bg-white/60 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Filtered</p>
                <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
              <IndianRupee className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Expenses Shown</p>
                <p className="text-2xl font-bold">{filteredAndSortedExpenses.length}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Average</p>
                <p className="text-2xl font-bold">
                  ₹
                  {filteredAndSortedExpenses.length > 0
                    ? (totalAmount / filteredAndSortedExpenses.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <IndianRupee className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>
            {filteredAndSortedExpenses.length} of {expenses.length} expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedExpenses.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm border border-white/20 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{expense.title}</h4>
                      <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      {expense.description && <span className="truncate max-w-md">{expense.description}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2  className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Edit  className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
              <p className="text-muted-foreground">
                {expenses.length === 0
                  ? "Start by adding your first expense!"
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
