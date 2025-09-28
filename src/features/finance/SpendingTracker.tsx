import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FiPlus, FiSave } from "react-icons/fi";
import Loading from "@/pages/Loading";

const categories = [
  "Income",
  "Housing",
  "Food",
  "Transportation",
  "Education",
  "Tools",
  "Hobbies",
  "Sports",
  "Health",
  "Entertainment",
  "Savings",
];

type Account = { name: string; balance: number };
type Transaction = {
  date: string;
  type: "spend" | "income" | "transfer";
  category: string;
  amount: number;
  account: number;
  accountName: string;
  transferTo?: number;
  transferToName?: string;
  description: string;
};

const SpendingTracker = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { name: "Cash", balance: 0 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    date: "",
    category: categories[0],
    amount: "",
    account: 0,
    description: "",
    type: "spend" as "spend" | "income" | "transfer",
    transferTo: 0,
  });
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buttonControls = useAnimation();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentDay = currentDate.getDate();

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Filter transactions for current month
  const monthlyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === currentYear &&
      txDate.getMonth() + 1 === currentMonth
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlySpend = monthlyTransactions
    .filter((tx) => tx.type === "spend")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Filter transactions for current day
  const dailyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === currentYear &&
      txDate.getMonth() + 1 === currentMonth &&
      txDate.getDate() === currentDay
    );
  });

  const dailySpend = dailyTransactions
    .filter((tx) => tx.type === "spend")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) {
      setError("Account name cannot be empty.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    setAccounts([...accounts, { name: newAccountName.trim(), balance: 0 }]);
    setNewAccountName("");
    setShowAddAccount(false);
    setError("");
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.date || !form.amount || isNaN(amount)) {
      setError("Please fill in date and a valid amount.");
      return;
    }
    if (form.type === "transfer" && form.account === form.transferTo) {
      setError("Cannot transfer to the same account.");
      return;
    }
    setError("");
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const updatedAccounts = [...accounts];
    if (form.type === "spend") {
      updatedAccounts[form.account].balance -= amount;
    } else if (form.type === "income") {
      updatedAccounts[form.account].balance += amount;
    } else if (form.type === "transfer") {
      updatedAccounts[form.account].balance -= amount;
      updatedAccounts[form.transferTo].balance += amount;
    }
    setAccounts(updatedAccounts);
    setTransactions([
      ...transactions,
      {
        date: form.date,
        type: form.type,
        category: form.category,
        amount,
        account: form.account,
        accountName: accounts[form.account].name,
        transferTo: form.type === "transfer" ? form.transferTo : undefined,
        transferToName:
          form.type === "transfer" ? accounts[form.transferTo].name : undefined,
        description: form.description,
      },
    ]);
    setForm({
      date: "",
      category: categories[0],
      amount: "",
      account: 0,
      description: "",
      type: "spend",
      transferTo: 0,
    });
    setShowAddTransaction(false);
    setIsLoading(false);
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative z-10 px-4"
      >
        {/* Summary Card */}
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8 w-full">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Spending Tracker
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-800/30 p-4 rounded-xl text-center border border-blue-600/40 shadow-inner"
              >
                <div className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                  Total Balance
                </div>
                <div className="text-xl mt-2 text-white">
                  {totalBalance.toFixed(2)} Ft
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gray-800/30 p-4 rounded-xl text-center border border-blue-600/40 shadow-inner"
              >
                <div className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                  Monthly Income
                </div>
                <div className="text-xl mt-2 text-white">
                  {monthlyIncome.toFixed(2)} Ft
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gray-800/30 p-4 rounded-xl text-center border border-blue-600/40 shadow-inner"
              >
                <div className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                  Monthly Spend
                </div>
                <div className="text-xl mt-2 text-white">
                  {monthlySpend.toFixed(2)} Ft
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-gray-800/30 p-4 rounded-xl text-center border border-blue-600/40 shadow-inner"
              >
                <div className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                  Daily Spend
                </div>
                <div className="text-xl mt-2 text-white">
                  {dailySpend.toFixed(2)} Ft
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-4"
            >
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setShowAddTransaction(true)}
                className={`w-full bg-white/10 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <FiPlus className="w-5 h-5" />
                  Add Transaction
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Transactions Card - Full Width */}
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Transactions
            </CardTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="text-blue-300 border-b border-blue-600/40">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Type</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Account</th>
                    <th className="py-2 px-4">Transfer To</th>
                    <th className="py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="border-b border-blue-600/20"
                    >
                      <td className="py-2 px-4">{tx.date}</td>
                      <td className="py-2 px-4">{tx.type}</td>
                      <td className="py-2 px-4">{tx.category}</td>
                      <td className="py-2 px-4">{tx.amount.toFixed(2)} Ft</td>
                      <td className="py-2 px-4">{tx.accountName}</td>
                      <td className="py-2 px-4">{tx.transferToName || "-"}</td>
                      <td className="py-2 px-4">{tx.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Card - Full Width */}
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mt-8 w-full">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Accounts
            </CardTitle>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setShowAddAccount(true)}
                className={`w-full bg-white/10 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <FiPlus className="w-5 h-5" />
                  Add Account
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
            <div className="flex gap-6 flex-wrap justify-center">
              {accounts.map((acc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-gray-800/30 p-4 rounded-xl min-w-[120px] text-center border border-blue-600/40 shadow-inner"
                >
                  <div className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                    {acc.name}
                  </div>
                  <div className="text-xl mt-2 text-white">
                    {acc.balance.toFixed(2)} Ft
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddTransaction(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Transaction
              </CardTitle>
              <motion.form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px] relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="type"
                      animate={
                        form.type ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Type
                    </motion.label>
                    <motion.select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 disabled:opacity-50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      <option value="spend">Spend</option>
                      <option value="income">Income</option>
                      <option value="transfer">Transfer</option>
                    </motion.select>
                  </div>
                  <div className="flex-1 min-w-[150px] relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="account"
                      animate={
                        form.account !== undefined
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Account
                    </motion.label>
                    <motion.select
                      id="account"
                      name="account"
                      value={form.account}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 disabled:opacity-50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    >
                      {accounts.map((acc, i) => (
                        <option key={i} value={i}>
                          {acc.name}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                  {form.type === "transfer" && (
                    <div className="flex-1 min-w-[150px] relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="transferTo"
                        animate={
                          form.transferTo !== undefined
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Transfer To
                      </motion.label>
                      <motion.select
                        id="transferTo"
                        name="transferTo"
                        value={form.transferTo}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 disabled:opacity-50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        {accounts.map((acc, i) => (
                          <option key={i} value={i}>
                            {acc.name}
                          </option>
                        ))}
                      </motion.select>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px] relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="date"
                      animate={
                        form.date ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Date
                    </motion.label>
                    <motion.input
                      id="date"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 disabled:opacity-50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  {form.type !== "transfer" && (
                    <div className="flex-1 min-w-[150px] relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="category"
                        animate={
                          form.category
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Category
                      </motion.label>
                      <motion.select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 disabled:opacity-50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </motion.select>
                    </div>
                  )}
                  <div className="flex-1 min-w-[150px] relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="amount"
                      animate={
                        form.amount
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Amount
                    </motion.label>
                    <motion.input
                      id="amount"
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 disabled:opacity-50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="description"
                    animate={
                      form.description
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Description
                  </motion.label>
                  <motion.input
                    id="description"
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 disabled:opacity-50"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                {error && (
                  <motion.p
                    id="form-error"
                    aria-live="assertive"
                    className="text-red-400 mb-6 text-center font-medium drop-shadow animate-pulse"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div animate={buttonControls}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                        <FiSave className="w-5 h-5" />
                        Save Transaction
                      </span>
                    )}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                  </Button>
                </motion.div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAddTransaction(false)}
                  className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 mt-4 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </Button>
              </motion.form>
            </CardContent>
          </motion.div>
        </motion.div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddAccount(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Account
              </CardTitle>
              <motion.label
                className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                htmlFor="newAccountName"
                animate={
                  newAccountName ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                }
              >
                Account Name
              </motion.label>
              <motion.input
                id="newAccountName"
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Enter account name"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mb-4 disabled:opacity-50"
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
              {error && (
                <motion.p
                  id="account-error"
                  aria-live="assertive"
                  className="text-red-400 mb-4 text-center font-medium drop-shadow animate-pulse"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {error}
                </motion.p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handleAddAccount}
                  className={`flex-1 bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                      <FiPlus className="w-5 h-5" />
                      Add
                    </span>
                  )}
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                </Button>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setShowAddAccount(false);
                    setNewAccountName("");
                    setError("");
                  }}
                  className={`flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SpendingTracker;
