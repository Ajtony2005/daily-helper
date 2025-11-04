"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSave,
  FiArrowUpRight,
  FiArrowDownRight,
  FiEdit2,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TransactionSchema } from "@/lib/schemas";
import { z } from "zod";

type Account = { id: string; name: string; balance: number };
type TxType = "spend" | "income" | "transfer";
type Transaction = {
  id: string;
  date: string;
  type: TxType;
  accountId: string;
  toAccountId?: string | null;
  category?: string;
  amount: number;
  description?: string;
};

function uid(prefix = "") {
  return (
    prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}

export default function SpendingTracker() {
  const { toast } = useToast();

  const [accounts, setAccounts] = useState<Account[]>([
    { id: uid("a_"), name: "Checking", balance: 1200 },
    { id: uid("a_"), name: "Savings", balance: 5400 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // UI state
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTxOpen, setIsTxOpen] = useState(false);

  // form states
  const [acctName, setAcctName] = useState("");

  const [txType, setTxType] = useState<TxType>("spend");
  const [txAccountId, setTxAccountId] = useState<string | null>(
    accounts[0]?.id ?? null
  );
  const [txToAccountId, setTxToAccountId] = useState<string | null>(
    accounts[1]?.id ?? null
  );
  const [txDate, setTxDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [txCategory, setTxCategory] = useState<string>("General");
  const [txAmount, setTxAmount] = useState<number>(0);
  const [txDesc, setTxDesc] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const totalBalance = useMemo(
    () => accounts.reduce((s, a) => s + a.balance, 0),
    [accounts]
  );

  const monthlyIncome = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    return transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          t.type === "income" && d.getMonth() === m && d.getFullYear() === y
        );
      })
      .reduce((s, t) => s + t.amount, 0);
  }, [transactions]);

  const monthlySpend = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    return transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          t.type === "spend" && d.getMonth() === m && d.getFullYear() === y
        );
      })
      .reduce((s, t) => s + t.amount, 0);
  }, [transactions]);

  const dailySpend = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return transactions
      .filter((t) => t.type === "spend" && t.date === today)
      .reduce((s, t) => s + t.amount, 0);
  }, [transactions]);

  function handleAddAccount() {
    if (!acctName.trim()) {
      toast({ title: "Name required" });
      return;
    }
    const a: Account = { id: uid("a_"), name: acctName.trim(), balance: 0 };
    setAccounts((s) => [a, ...s]);
    setAcctName("");
    setIsAccountOpen(false);
    toast({ title: "Account added" });
  }

  function handleSubmitTx() {
    if (!txAccountId) {
      toast({ title: "Select account" });
      return;
    }
    if (txType === "transfer" && !txToAccountId) {
      toast({ title: "Select destination account" });
      return;
    }
    if (txAmount <= 0) {
      toast({ title: "Amount must be > 0" });
      return;
    }
    // validate with zod
    try {
      const candidate = {
        id: uid("t_"),
        date: txDate,
        type: txType,
        accountId: txAccountId || "",
        toAccountId: txType === "transfer" ? txToAccountId : null,
        category: txType === "transfer" ? undefined : txCategory,
        amount: txAmount,
        description: txDesc || undefined,
      };
      TransactionSchema.parse(candidate);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.issues?.[0]?.message || "Validation failed";
        toast({ title: msg });
        return;
      }
      throw err;
    }

    setLoading(true);
    setTimeout(() => {
      const t: Transaction = {
        id: uid("t_"),
        date: txDate,
        type: txType,
        accountId: txAccountId,
        toAccountId: txType === "transfer" ? txToAccountId : null,
        category: txType === "transfer" ? undefined : txCategory,
        amount: txAmount,
        description: txDesc,
      };
      setTransactions((s) => [t, ...s]);
      // update balances
      setAccounts((as) =>
        as.map((a) => {
          if (txType === "income" && a.id === txAccountId)
            return { ...a, balance: a.balance + txAmount };
          if (txType === "spend" && a.id === txAccountId)
            return { ...a, balance: a.balance - txAmount };
          if (txType === "transfer") {
            if (a.id === txAccountId)
              return { ...a, balance: a.balance - txAmount };
            if (a.id === txToAccountId)
              return { ...a, balance: a.balance + txAmount };
          }
          return a;
        })
      );
      setLoading(false);
      setIsTxOpen(false);
      toast({ title: "Transaction saved" });
    }, 400);
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Spending Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Accounts, transactions and summaries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white flex items-center gap-2">
                  <FaWallet /> Add Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Label>Name</Label>
                  <Input
                    value={acctName}
                    onChange={(e: any) => setAcctName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddAccount}>
                      <FiSave /> Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isTxOpen} onOpenChange={setIsTxOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-500 to-orange-500 text-white flex items-center gap-2">
                  <FiPlus /> New Tx
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select onValueChange={(v) => setTxType(v as TxType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spend">Spend</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={txDate}
                        onChange={(e: any) => setTxDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Account</Label>
                      <Select onValueChange={(v) => setTxAccountId(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {txType === "transfer" ? (
                      <div>
                        <Label>To Account</Label>
                        <Select onValueChange={(v) => setTxToAccountId(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={txCategory}
                          onChange={(e: any) => setTxCategory(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={txAmount}
                        onChange={(e: any) =>
                          setTxAmount(Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={txDesc}
                        onChange={(e: any) => setTxDesc(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsTxOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitTx} disabled={loading}>
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <FiSave /> Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FaWallet className="h-6 w-6" />
              <div>
                <div className="text-sm text-muted-foreground">
                  Total balance
                </div>
                <div className="text-xl font-semibold">
                  ${totalBalance.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Monthly Income
                </div>
                <div className="text-lg font-semibold">
                  ${monthlyIncome.toFixed(2)}
                </div>
              </div>
              <div className="text-green-600">
                <FiArrowUpRight size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Monthly Spend
                </div>
                <div className="text-lg font-semibold">
                  ${monthlySpend.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Daily spend: ${dailySpend.toFixed(2)}
                </div>
              </div>
              <div className="text-rose-600">
                <FiArrowDownRight size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-semibold mb-3">Accounts</h4>
            <div className="space-y-2">
              {accounts.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  className="p-3 rounded-md bg-muted/5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${a.balance.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAcctName(a.name);
                        setIsAccountOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold mb-3">Transactions</h4>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>
                        {accounts.find((a) => a.id === tx.accountId)?.name ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {tx.category ??
                          (tx.type === "transfer"
                            ? `To ${accounts.find((a) => a.id === tx.toAccountId)?.name}`
                            : "-")}
                      </TableCell>
                      <TableCell>${tx.amount.toFixed(2)}</TableCell>
                      <TableCell>{tx.description ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
