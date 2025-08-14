"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    type: "credit",
    amount: 150000,
    description: "Event ticket sales - Tech Conference 2024",
    date: "2024-03-10T14:30:00Z",
    status: "completed",
    reference: "TXN-001",
  },
  {
    id: "2",
    type: "debit",
    amount: 5000,
    description: "Platform fee",
    date: "2024-03-10T14:35:00Z",
    status: "completed",
    reference: "TXN-002",
  },
  {
    id: "3",
    type: "credit",
    amount: 75000,
    description: "Event ticket sales - Marketing Workshop",
    date: "2024-03-08T10:15:00Z",
    status: "completed",
    reference: "TXN-003",
  },
  {
    id: "4",
    type: "debit",
    amount: 50000,
    description: "Withdrawal to bank account",
    date: "2024-03-05T16:20:00Z",
    status: "completed",
    reference: "TXN-004",
  },
  {
    id: "5",
    type: "credit",
    amount: 25000,
    description: "Refund processed",
    date: "2024-03-03T09:45:00Z",
    status: "pending",
    reference: "TXN-005",
  },
]

export default function WalletPage() {
  const { user } = useAuth()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawalMethods, setWithdrawalMethods] = useState([
    {
      id: "1",
      type: "bank",
      bankName: "First Bank of Nigeria",
      accountNumber: "0123456789",
      accountName: "John Doe",
      isDefault: true,
      dateAdded: "2024-03-01T10:00:00Z",
    },
  ])
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [newMethod, setNewMethod] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return

    setIsWithdrawing(true)
    // Simulate API call
    setTimeout(() => {
      setIsWithdrawing(false)
      setWithdrawAmount("")
      // Show success message
    }, 2000)
  }

  const handleAddWithdrawalMethod = async () => {
    if (!newMethod.bankName || !newMethod.accountNumber || !newMethod.accountName) return

    const newWithdrawalMethod = {
      id: Date.now().toString(),
      type: "bank",
      ...newMethod,
      isDefault: withdrawalMethods.length === 0,
      dateAdded: new Date().toISOString(),
    }

    setWithdrawalMethods([...withdrawalMethods, newWithdrawalMethod])
    setNewMethod({ bankName: "", accountNumber: "", accountName: "" })
    setShowAddMethod(false)
  }

  const setDefaultMethod = (methodId: string) => {
    setWithdrawalMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    )
  }

  const removeMethod = (methodId: string) => {
    setWithdrawalMethods((methods) => methods.filter((method) => method.id !== methodId))
  }

  const totalCredits = mockTransactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = mockTransactions
    .filter((t) => t.type === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

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
            <div className="text-2xl font-bold">₦{user?.walletBalance?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{totalDebits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time withdrawals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="settings">Withdrawal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
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
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.reference}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Transfer money to your bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {withdrawalMethods.length > 0 && (
                <div className="space-y-2">
                  <Label>Withdrawal Method</Label>
                  <div className="p-3 border rounded-lg bg-gray-50">
                    {(() => {
                      const defaultMethod = withdrawalMethods.find((m) => m.isDefault)
                      return defaultMethod ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{defaultMethod.bankName}</p>
                            <p className="text-sm text-gray-600">
                              {defaultMethod.accountNumber} • {defaultMethod.accountName}
                            </p>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No default withdrawal method set</p>
                      )
                    })()}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Available balance: ₦{user?.walletBalance?.toLocaleString() || "0"}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Withdrawal Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Minimum withdrawal amount: ₦1,000</li>
                  <li>• Processing time: 1-3 business days</li>
                  <li>• No withdrawal fees</li>
                  <li>• Funds will be sent to your registered bank account</li>
                </ul>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmount || Number(withdrawAmount) <= 0 || isWithdrawing || withdrawalMethods.length === 0
                }
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isWithdrawing ? "Processing..." : "Withdraw Funds"}
              </Button>

              {withdrawalMethods.length === 0 && (
                <p className="text-sm text-red-600 text-center">
                  Please add a withdrawal method in the Withdrawal Settings tab before making a withdrawal.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Withdrawal Methods</CardTitle>
                <CardDescription>Manage your bank accounts and payment methods</CardDescription>
              </div>
              <Button onClick={() => setShowAddMethod(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {withdrawalMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal methods</h3>
                  <p className="text-gray-600 mb-4">Add a bank account to receive your earnings</p>
                  <Button onClick={() => setShowAddMethod(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Method
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawalMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.bankName}</p>
                          <p className="text-sm text-gray-600">
                            {method.accountNumber} • {method.accountName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Added {new Date(method.dateAdded).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && <Badge>Default</Badge>}
                        {!method.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setDefaultMethod(method.id)}>
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMethod(method.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddMethod && (
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Bank Account</CardTitle>
                    <CardDescription>Enter your bank account details for withdrawals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g., First Bank of Nigeria"
                        value={newMethod.bankName}
                        onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter 10-digit account number"
                        value={newMethod.accountNumber}
                        onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                        maxLength={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Account holder's full name"
                        value={newMethod.accountName}
                        onChange={(e) => setNewMethod({ ...newMethod, accountName: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddWithdrawalMethod} className="flex-1">
                        Add Account
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddMethod(false)
                          setNewMethod({ bankName: "", accountNumber: "", accountName: "" })
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
