"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, Plus, Minus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

interface WalletData {
  balance: number
  pendingBalance: number
  totalEarnings: number
  lastPayout: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  date: string
  status: string
}

export default function WalletPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    lastPayout: "",
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (user) {
      fetchWalletData()
    }
  }, [user])

  const fetchWalletData = async () => {
    try {
      // Fetch wallet balance
      const balanceResponse = await fetch(`/api/wallet/balance?userId=${user?.id}`)
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json()
        setWalletData(prev => ({ ...prev, ...balanceData }))
      }

      // Fetch wallet transactions
      const transactionsResponse = await fetch(`/api/wallet/transactions?userId=${user?.id}`)
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalCredits = transactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = transactions
    .filter((t) => t.type === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">Loading wallet data...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600">Manage your earnings and transactions</p>
      </div>

      {/* Wallet Balance */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{walletData.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {walletData.balance === 0 ? "No earnings yet" : "Ready for withdrawal"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalCredits === 0 ? "Start earning from events" : "All time earnings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{totalDebits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalDebits === 0 ? "No withdrawals yet" : "All time withdrawals"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-4">Transactions will appear here when you earn from events</p>
              <Link href="/create-event">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "credit" ? (
                        <Plus className="w-4 h-4 text-green-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                    </p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
