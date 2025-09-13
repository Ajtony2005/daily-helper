import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Download, Trash2, ShoppingBag, Edit2 } from "lucide-react"; // Printer helyett Download ikon
import { Toast } from "@/components/ui/toast";
import Loading from "@/pages/Loading";

const predefinedCategories = [
  "Vegetables",
  "Dairy",
  "Baked Goods",
  "Meat",
  "Fruits",
  "Household",
  "Other",
];

const priorities = [
  { value: "low", label: "Low", color: "bg-gray-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

type Item = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  note: string;
  priority: "low" | "medium" | "high";
  category: string;
  bought: boolean;
};

type ItemsByStore = {
  [key: string]: Item[];
};

const Shopping = () => {
  const [showToast, setShowToast] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false); // showPrintModal helyett
  const [downloadStore, setDownloadStore] = useState<string>(""); // printStore helyett
  const [stores, setStores] = useState<string[]>(["Lidl", "Tesco", "Market"]);
  const [itemsByStore, setItemsByStore] = useState<ItemsByStore>(
    stores.reduce((acc, store) => {
      acc[store] = [];
      return acc;
    }, {} as ItemsByStore)
  );
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [form, setForm] = useState({
    store: stores[0],
    name: "",
    quantity: "",
    unit: "",
    note: "",
    priority: "medium" as "low" | "medium" | "high",
    category: predefinedCategories[0],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    stores.reduce((acc, store) => {
      acc[store] = "";
      return acc;
    }, {} as { [key: string]: string })
  );
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [shoppingModeStore, setShoppingModeStore] = useState<string | null>(
    null
  );
  const buttonControls = useAnimation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddItem = async () => {
    if (!form.name.trim() || !form.quantity.trim()) {
      setError("Name and quantity are required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const newItem: Item = {
      id: Date.now().toString(),
      name: form.name.trim(),
      quantity: form.quantity.trim(),
      unit: form.unit.trim(),
      note: form.note.trim(),
      priority: form.priority,
      category: form.category,
      bought: false,
    };
    setItemsByStore((prev) => ({
      ...prev,
      [form.store]: [...(prev[form.store] || []), newItem],
    }));
    setForm({
      store: stores[0],
      name: "",
      quantity: "",
      unit: "",
      note: "",
      priority: "medium",
      category: predefinedCategories[0],
    });
    setShowAddItem(false);
    setError("");
    setIsLoading(false);
  };

  const handleEditItem = async () => {
    if (!editItem || !form.name.trim() || !form.quantity.trim()) {
      setError("Name and quantity are required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    setItemsByStore((prev) => ({
      ...prev,
      [form.store]: prev[form.store].map((item) =>
        item.id === editItem.id
          ? {
              ...item,
              name: form.name.trim(),
              quantity: form.quantity.trim(),
              unit: form.unit.trim(),
              note: form.note.trim(),
              priority: form.priority,
              category: form.category,
            }
          : item
      ),
    }));
    setForm({
      store: stores[0],
      name: "",
      quantity: "",
      unit: "",
      note: "",
      priority: "medium",
      category: predefinedCategories[0],
    });
    setEditItem(null);
    setShowEditItem(false);
    setError("");
    setIsLoading(false);
  };

  const handleOpenEditItem = (store: string, item: Item) => {
    setEditItem(item);
    setForm({
      store,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      priority: item.priority,
      category: item.category,
    });
    setShowEditItem(true);
  };

  const handleToggleBought = (store: string, itemId: string) => {
    setItemsByStore((prev) => ({
      ...prev,
      [store]: prev[store].map((item) =>
        item.id === itemId ? { ...item, bought: !item.bought } : item
      ),
    }));
  };

  const handleDeleteItem = (store: string, itemId: string) => {
    setItemsByStore((prev) => ({
      ...prev,
      [store]: prev[store].filter((item) => item.id !== itemId),
    }));
  };

  const handleSearchChange = (store: string, value: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [store]: value,
    }));
  };

  const getFilteredAndGroupedItems = (store: string) => {
    const search = searchQueries[store].toLowerCase();
    const filtered = (itemsByStore[store] || []).filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.note.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
    );
    const grouped = filtered.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as { [key: string]: Item[] });
    return grouped;
  };

  // Új függvény a .txt fájl letöltéséhez
  const handleDownloadList = () => {
    if (!downloadStore) return;

    const groupedItems = getFilteredAndGroupedItems(downloadStore);
    let content = `${downloadStore}\n\n`;

    Object.keys(groupedItems).forEach((category) => {
      content += `${category}:\n`;
      groupedItems[category].forEach((item) => {
        content += `[ ] ${item.name} - ${item.quantity} ${item.unit}${
          item.note ? ` (${item.note})` : ""
        }\n`;
      });
      content += "\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${downloadStore}_shopping_list.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowDownloadModal(false);
    setDownloadStore("");
    setShowToast(true);
  };

  const handleAddStore = async () => {
    if (!newStoreName.trim()) {
      setError("Store name is required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const newStore = newStoreName.trim();
    setStores((prev) => [...prev, newStore]);
    setItemsByStore((prev) => ({
      ...prev,
      [newStore]: [],
    }));
    setSearchQueries((prev) => ({
      ...prev,
      [newStore]: "",
    }));
    setNewStoreName("");
    setShowAddStore(false);
    setError("");
    setIsLoading(false);
  };

  const handleDeleteStore = (store: string) => {
    setStores((prev) => prev.filter((s) => s !== store));
    setItemsByStore((prev) => {
      const newItems = { ...prev };
      delete newItems[store];
      return newItems;
    });
    setSearchQueries((prev) => {
      const newQueries = { ...prev };
      delete newQueries[store];
      return newQueries;
    });
    if (shoppingModeStore === store) {
      setShoppingModeStore(null);
    }
  };

  const handleEnterShoppingMode = (store: string) => {
    setShoppingModeStore(store);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Shopping Lists
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
                onClick={() => setShowAddStore(true)}
                className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <Plus className="w-5 h-5" />
                  Add Store
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mb-6"
            >
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setShowAddItem(true)}
                className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <Plus className="w-5 h-5" />
                  Add Item
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {stores.map((store, index) => {
                const groupedItems = getFilteredAndGroupedItems(store);
                return (
                  <motion.div
                    key={store}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden h-full">
                      <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
                      <CardContent className="p-6 relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                            {store}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => handleEnterShoppingMode(store)}
                              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white p-2 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <ShoppingBag className="w-4 h-4" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeleteStore(store)}
                              className="bg-red-500 text-white p-2 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <Trash2 className="w-4 h-4" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                          </div>
                        </div>
                        <Input
                          placeholder="Search items..."
                          value={searchQueries[store]}
                          onChange={(e) =>
                            handleSearchChange(store, e.target.value)
                          }
                          className="mb-4 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                        />
                        <div className="flex-1 overflow-y-auto">
                          {Object.keys(groupedItems).length > 0 ? (
                            Object.keys(groupedItems).map((category) => (
                              <div key={category} className="mb-4">
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                                  {category}
                                </h3>
                                <div className="space-y-2">
                                  {groupedItems[category]
                                    .sort((a, b) => {
                                      const priorityOrder = {
                                        high: 0,
                                        medium: 1,
                                        low: 2,
                                      };
                                      return (
                                        priorityOrder[a.priority] -
                                        priorityOrder[b.priority]
                                      );
                                    })
                                    .map((item) => (
                                      <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                                          item.bought
                                            ? "bg-green-500/10 border-green-400"
                                            : "bg-red-500/10 border-red-400"
                                        }`}
                                      >
                                        <Checkbox
                                          checked={item.bought}
                                          onCheckedChange={() =>
                                            handleToggleBought(store, item.id)
                                          }
                                          className="text-green-500"
                                        />
                                        <div className="flex-1 text-white">
                                          <div
                                            className={`font-medium ${
                                              item.bought
                                                ? "text-green-400"
                                                : "text-red-400"
                                            }`}
                                          >
                                            {item.name}
                                          </div>
                                          <div className="text-sm text-gray-300">
                                            {item.quantity} {item.unit}{" "}
                                            {item.note ? `(${item.note})` : ""}
                                          </div>
                                        </div>
                                        <Badge
                                          className={`${
                                            priorities.find(
                                              (p) => p.value === item.priority
                                            )?.color
                                          } text-white`}
                                        >
                                          {item.priority}
                                        </Badge>
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            handleOpenEditItem(store, item)
                                          }
                                          className="bg-blue-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                                        >
                                          <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                            <Edit2 className="w-4 h-4" />
                                          </span>
                                          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                                        </Button>
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteItem(store, item.id)
                                          }
                                          className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                                        >
                                          <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                            <Trash2 className="w-4 h-4" />
                                          </span>
                                          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                                        </Button>
                                      </motion.div>
                                    ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-center">
                              No items added yet
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
              <Download className="w-5 h-5" />
              Download List
            </span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
          </Button>
        </motion.div>

        {showDownloadModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Download Shopping List
                </CardTitle>
                <div className="mb-6">
                  <Label
                    htmlFor="download-store"
                    className="block text-blue-300 mb-2 font-semibold"
                  >
                    Select Store
                  </Label>
                  <Select
                    value={downloadStore}
                    onValueChange={setDownloadStore}
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store} value={store}>
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    disabled={!downloadStore}
                    onClick={handleDownloadList}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                  >
                    Download
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowDownloadModal(false)}
                    className="flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}

        {showAddStore && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddStore(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Add Store
                </CardTitle>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="newStoreName"
                    animate={
                      newStoreName ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Store Name
                  </motion.label>
                  <motion.input
                    id="newStoreName"
                    type="text"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Enter store name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mb-4"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                {error && (
                  <motion.p
                    id="store-error"
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
                  <motion.div animate={buttonControls}>
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={handleAddStore}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                          <Plus className="w-5 h-5" />
                          Add Store
                        </span>
                      )}
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                    </Button>
                  </motion.div>
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setShowAddStore(false);
                      setNewStoreName("");
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

        {showAddItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddItem(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Add Shopping Item
                </CardTitle>
                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddItem();
                  }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="store"
                      animate={
                        form.store ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Store
                    </motion.label>
                    <Select
                      value={form.store}
                      onValueChange={(value) =>
                        setForm({ ...form, store: value })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store} value={store}>
                            {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="name"
                      animate={
                        form.name ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Name
                    </motion.label>
                    <motion.input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Item name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="quantity"
                        animate={
                          form.quantity
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Quantity
                      </motion.label>
                      <motion.input
                        id="quantity"
                        type="text"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                    <div className="relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="unit"
                        animate={
                          form.unit
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Unit
                      </motion.label>
                      <motion.input
                        id="unit"
                        type="text"
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        placeholder="Unit (kg, pcs, etc.)"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="note"
                      animate={
                        form.note ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Note
                    </motion.label>
                    <motion.input
                      id="note"
                      type="text"
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Special note"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="priority"
                      animate={
                        form.priority
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Priority
                    </motion.label>
                    <Select
                      value={form.priority}
                      onValueChange={(value) =>
                        setForm({
                          ...form,
                          priority: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
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
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        setForm({ ...form, category: value })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                          <Plus className="w-5 h-5" />
                          Add Item
                        </span>
                      )}
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                    </Button>
                  </motion.div>
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowAddItem(false)}
                    className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
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

        {showEditItem && editItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditItem(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Edit Shopping Item
                </CardTitle>
                <motion.form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditItem();
                  }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="store"
                      animate={
                        form.store ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Store
                    </motion.label>
                    <Select
                      value={form.store}
                      onValueChange={(value) =>
                        setForm({ ...form, store: value })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store} value={store}>
                            {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="name"
                      animate={
                        form.name ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Name
                    </motion.label>
                    <motion.input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Item name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="quantity"
                        animate={
                          form.quantity
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Quantity
                      </motion.label>
                      <motion.input
                        id="quantity"
                        type="text"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                    <div className="relative">
                      <motion.label
                        className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                        htmlFor="unit"
                        animate={
                          form.unit
                            ? { y: -25, scale: 0.9 }
                            : { y: 0, scale: 1 }
                        }
                      >
                        Unit
                      </motion.label>
                      <motion.input
                        id="unit"
                        type="text"
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        placeholder="Unit (kg, pcs, etc.)"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="note"
                      animate={
                        form.note ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                      }
                    >
                      Note
                    </motion.label>
                    <motion.input
                      id="note"
                      type="text"
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Special note"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="priority"
                      animate={
                        form.priority
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Priority
                    </motion.label>
                    <Select
                      value={form.priority}
                      onValueChange={(value) =>
                        setForm({
                          ...form,
                          priority: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
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
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        setForm({ ...form, category: value })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                          <Save className="w-5 h-5" />
                          Save Changes
                        </span>
                      )}
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                    </Button>
                  </motion.div>
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setShowEditItem(false);
                      setEditItem(null);
                      setForm({
                        store: stores[0],
                        name: "",
                        quantity: "",
                        unit: "",
                        note: "",
                        priority: "medium",
                        category: predefinedCategories[0],
                      });
                      setError("");
                    }}
                    className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
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

        {shoppingModeStore && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShoppingModeStore(null)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10 h-full flex flex-col">
                <CardTitle className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Shopping Mode - {shoppingModeStore}
                </CardTitle>
                <Input
                  placeholder="Search items..."
                  value={searchQueries[shoppingModeStore]}
                  onChange={(e) =>
                    handleSearchChange(shoppingModeStore, e.target.value)
                  }
                  className="mb-4 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                />
                <div className="flex-1 overflow-y-auto">
                  {Object.keys(
                    getFilteredAndGroupedItems(shoppingModeStore)
                  ).map((category) => (
                    <div key={category} className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {getFilteredAndGroupedItems(shoppingModeStore)
                          [category].sort((a, b) => {
                            const priorityOrder = {
                              high: 0,
                              medium: 1,
                              low: 2,
                            };
                            return (
                              priorityOrder[a.priority] -
                              priorityOrder[b.priority]
                            );
                          })
                          .map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex items-center gap-2 p-2 rounded-lg border ${
                                item.bought
                                  ? "bg-green-500/10 border-green-400"
                                  : "bg-red-500/10 border-red-400"
                              }`}
                            >
                              <Checkbox
                                checked={item.bought}
                                onCheckedChange={() =>
                                  handleToggleBought(shoppingModeStore, item.id)
                                }
                                className="text-green-500"
                              />
                              <div className="flex-1 text-white">
                                <div
                                  className={`font-medium ${
                                    item.bought
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-300">
                                  {item.quantity} {item.unit}{" "}
                                  {item.note ? `(${item.note})` : ""}
                                </div>
                              </div>
                              <Badge
                                className={`${
                                  priorities.find(
                                    (p) => p.value === item.priority
                                  )?.color
                                } text-white`}
                              >
                                {item.priority}
                              </Badge>
                              <Button
                                type="button"
                                onClick={() =>
                                  handleOpenEditItem(shoppingModeStore, item)
                                }
                                className="bg-blue-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                  <Edit2 className="w-4 h-4" />
                                </span>
                                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                              </Button>
                              <Button
                                type="button"
                                onClick={() =>
                                  handleDeleteItem(shoppingModeStore, item.id)
                                }
                                className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                  <Trash2 className="w-4 h-4" />
                                </span>
                                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                              </Button>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => setShoppingModeStore(null)}
                  className="w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 mt-4"
                >
                  Exit Shopping Mode
                </Button>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
        {/* Toast notification */}
        {showToast && (
          <Toast
            message="Download successful!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Shopping;
