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
import {
  Plus,
  Save,
  Edit2,
  Trash2,
  ShoppingBag,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  DollarSign,
  Link,
  Image,
  Heart,
} from "lucide-react";
import { Toast } from "@/components/ui/toast";
import Loading from "@/pages/Loading";

const initialCategories = [
  "Electronics",
  "Kitchen",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Travel",
  "Other",
];

const priorities = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

type WishlistItem = {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high";
  estimatedPrice: number;
  link?: string;
  store?: string;
  image?: string;
  note: string;
  dateAdded: string;
  purchased: boolean;
  purchaseDate?: string;
  actualPrice?: number;
  reminderDate?: string;
};

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterPurchased, setFilterPurchased] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    priority: "medium" as "low" | "medium" | "high",
    estimatedPrice: "",
    link: "",
    store: "",
    image: "",
    note: "",
    reminderDate: "",
  });
  const [quickAddName, setQuickAddName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buttonControls = useAnimation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddItem = async () => {
    if (!form.name.trim()) {
      setError("Item name is required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
      category: form.category,
      priority: form.priority,
      estimatedPrice: parseFloat(form.estimatedPrice) || 0,
      link: form.link.trim(),
      store: form.store.trim(),
      image: form.image.trim(),
      note: form.note.trim(),
      dateAdded: new Date().toISOString().split("T")[0],
      purchased: false,
      reminderDate: form.reminderDate || undefined,
    };

    setItems((prev) => [newItem, ...prev]);
    setForm({
      name: "",
      category: categories[0],
      priority: "medium",
      estimatedPrice: "",
      link: "",
      store: "",
      image: "",
      note: "",
      reminderDate: "",
    });
    setShowAddItem(false);
    setError("");
    setIsLoading(false);
    setToastMessage("Item added to wishlist!");
    setShowToast(true);
  };

  const handleQuickAdd = async () => {
    if (!quickAddName.trim()) return;

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      name: quickAddName.trim(),
      category: "Other",
      priority: "medium",
      estimatedPrice: 0,
      note: "",
      dateAdded: new Date().toISOString().split("T")[0],
      purchased: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setQuickAddName("");
    setShowQuickAdd(false);
    setToastMessage("Item quickly added!");
    setShowToast(true);
  };

  const handleEditItem = async () => {
    if (!editItem || !form.name.trim()) {
      setError("Item name is required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });

    setItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? {
              ...item,
              name: form.name.trim(),
              category: form.category,
              priority: form.priority,
              estimatedPrice: parseFloat(form.estimatedPrice) || 0,
              link: form.link.trim(),
              store: form.store.trim(),
              image: form.image.trim(),
              note: form.note.trim(),
              reminderDate: form.reminderDate || undefined,
            }
          : item
      )
    );

    setForm({
      name: "",
      category: categories[0],
      priority: "medium",
      estimatedPrice: "",
      link: "",
      store: "",
      image: "",
      note: "",
      reminderDate: "",
    });
    setEditItem(null);
    setShowEditItem(false);
    setError("");
    setIsLoading(false);
    setToastMessage("Item updated!");
    setShowToast(true);
  };

  const handleOpenEditItem = (item: WishlistItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      priority: item.priority,
      estimatedPrice: item.estimatedPrice.toString(),
      link: item.link || "",
      store: item.store || "",
      image: item.image || "",
      note: item.note,
      reminderDate: item.reminderDate || "",
    });
    setShowEditItem(true);
  };

  const handleTogglePurchased = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              purchased: !item.purchased,
              purchaseDate: !item.purchased
                ? new Date().toISOString().split("T")[0]
                : undefined,
              actualPrice: !item.purchased ? item.estimatedPrice : undefined,
            }
          : item
      )
    );
    setToastMessage("Item status updated!");
    setShowToast(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setToastMessage("Item deleted!");
    setShowToast(true);
  };

  const getFilteredItems = () => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      const matchesPriority =
        filterPriority === "All" || item.priority === filterPriority;
      const matchesPurchased =
        filterPurchased === "All" ||
        (filterPurchased === "Purchased" && item.purchased) ||
        (filterPurchased === "Not Purchased" && !item.purchased);

      return (
        matchesSearch && matchesCategory && matchesPriority && matchesPurchased
      );
    });
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
        className="w-full max-w-6xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              <Heart className="inline-block w-10 h-10 mr-4" />
              My Wishlist
            </CardTitle>

            {/* Quick Add Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6 flex gap-2"
            >
              <Input
                placeholder="Quick add item..."
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQuickAdd()}
                className="flex-1 glass px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
              />
              <Button
                onClick={handleQuickAdd}
                disabled={!quickAddName.trim()}
                className="bg-linear-to-r from-blue-600 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={() => setShowAddItem(true)}
                className="bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode("card")}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                    viewMode === "card"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/30 text-gray-300"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/30 text-gray-300"
                  }`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 glass px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
              />

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-gray-900 text-white border border-blue-600/40 shadow-inner rounded-xl">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48 bg-gray-900 text-white border border-blue-600/40 shadow-inner rounded-xl">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                  <SelectItem value="All">All Priorities</SelectItem>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterPurchased}
                onValueChange={setFilterPurchased}
              >
                <SelectTrigger className="w-48 bg-gray-900 text-white border border-blue-600/40 shadow-inner rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                  <SelectItem value="All">All Items</SelectItem>
                  <SelectItem value="Not Purchased">Not Purchased</SelectItem>
                  <SelectItem value="Purchased">Purchased</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items Display */}
            <div
              className={
                viewMode === "card"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {getFilteredItems().map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {viewMode === "card" ? (
                    <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
                      <CardContent className="p-6 relative z-10">
                        {item.image && (
                          <div className="w-full h-32 bg-gray-800 rounded-xl mb-4 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white truncate flex-1">
                            {item.name}
                          </h3>
                          <Badge
                            className={`ml-2 ${priorities.find((p) => p.value === item.priority)?.color} text-white`}
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-blue-300 mb-2">{item.category}</p>
                        <p className="text-green-400 font-bold mb-2">
                          ${item.estimatedPrice}
                        </p>
                        {item.note && (
                          <p className="text-gray-300 text-sm mb-4">
                            {item.note}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleTogglePurchased(item.id)}
                              className={`px-3 py-2 rounded-xl transition-all duration-300 ${
                                item.purchased
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-800/30 text-gray-300 hover:bg-green-600/20"
                              }`}
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenEditItem(item)}
                              className="bg-blue-600/20 text-blue-300 px-3 py-2 rounded-xl hover:bg-blue-600/40 transition-all duration-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-600/20 text-red-300 px-3 py-2 rounded-xl hover:bg-red-600/40 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-xs text-gray-400">
                            {item.dateAdded}
                          </span>
                        </div>
                        {item.purchased && (
                          <div className="mt-2 p-2 bg-green-600/20 rounded-xl">
                            <p className="text-green-300 text-sm">
                              Purchased on {item.purchaseDate}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
                      <CardContent className="p-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-bold text-white">
                                {item.name}
                              </h3>
                              <Badge
                                className={`${priorities.find((p) => p.value === item.priority)?.color} text-white`}
                              >
                                {item.priority}
                              </Badge>
                              <span className="text-blue-300">
                                {item.category}
                              </span>
                              <span className="text-green-400 font-bold">
                                ${item.estimatedPrice}
                              </span>
                            </div>
                            {item.note && (
                              <p className="text-gray-300 text-sm mb-2">
                                {item.note}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Added: {item.dateAdded}</span>
                              {item.store && <span>Store: {item.store}</span>}
                              {item.reminderDate && (
                                <span>Reminder: {item.reminderDate}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => handleTogglePurchased(item.id)}
                              className={`px-3 py-2 rounded-xl transition-all duration-300 ${
                                item.purchased
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-800/30 text-gray-300 hover:bg-green-600/20"
                              }`}
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenEditItem(item)}
                              className="bg-blue-600/20 text-blue-300 px-3 py-2 rounded-xl hover:bg-blue-600/40 transition-all duration-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-600/20 text-red-300 px-3 py-2 rounded-xl hover:bg-red-600/40 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {item.purchased && (
                          <div className="mt-2 p-2 bg-green-600/20 rounded-xl">
                            <p className="text-green-300 text-sm">
                              Purchased on {item.purchaseDate}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {getFilteredItems().length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No items in your wishlist yet
                </p>
                <p className="text-gray-500">
                  Add your first item to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Item Modal */}
        {showAddItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddItem(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Add Wishlist Item
                </CardTitle>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddItem();
                  }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Item Name *
                    </Label>
                    <motion.input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="What do you want?"
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Category
                      </Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) =>
                          setForm({ ...form, category: value })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Priority
                      </Label>
                      <Select
                        value={form.priority}
                        onValueChange={(value) =>
                          setForm({
                            ...form,
                            priority: value as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                          {priorities.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Estimated Price
                    </Label>
                    <motion.input
                      type="number"
                      name="estimatedPrice"
                      value={form.estimatedPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Store
                      </Label>
                      <motion.input
                        type="text"
                        name="store"
                        value={form.store}
                        onChange={handleChange}
                        placeholder="Where to buy"
                        className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>

                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Reminder Date
                      </Label>
                      <motion.input
                        type="date"
                        name="reminderDate"
                        value={form.reminderDate}
                        onChange={handleChange}
                        className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Link
                    </Label>
                    <motion.input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Image URL
                    </Label>
                    <motion.input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Note
                    </Label>
                    <motion.textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Why do you want this? Any alternatives?"
                      rows={3}
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50 resize-none"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  {error && (
                    <motion.p
                      className="text-red-400 text-center font-medium"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-2">
                    <motion.div animate={buttonControls} className="flex-1">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                      >
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Item
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <Button
                      type="button"
                      onClick={() => setShowAddItem(false)}
                      className="flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Item Modal */}
        {showEditItem && editItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditItem(false)}
          >
            <motion.div
              className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
              <CardContent className="p-10 relative z-10">
                <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                  Edit Wishlist Item
                </CardTitle>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditItem();
                  }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Item Name *
                    </Label>
                    <motion.input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="What do you want?"
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Category
                      </Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) =>
                          setForm({ ...form, category: value })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Priority
                      </Label>
                      <Select
                        value={form.priority}
                        onValueChange={(value) =>
                          setForm({
                            ...form,
                            priority: value as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 text-white rounded-xl shadow-lg">
                          {priorities.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Estimated Price
                    </Label>
                    <motion.input
                      type="number"
                      name="estimatedPrice"
                      value={form.estimatedPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Store
                      </Label>
                      <motion.input
                        type="text"
                        name="store"
                        value={form.store}
                        onChange={handleChange}
                        placeholder="Where to buy"
                        className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>

                    <div>
                      <Label className="block text-blue-300 mb-2 font-semibold">
                        Reminder Date
                      </Label>
                      <motion.input
                        type="date"
                        name="reminderDate"
                        value={form.reminderDate}
                        onChange={handleChange}
                        className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300"
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Link
                    </Label>
                    <motion.input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Image URL
                    </Label>
                    <motion.input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  <div>
                    <Label className="block text-blue-300 mb-2 font-semibold">
                      Note
                    </Label>
                    <motion.textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Why do you want this? Any alternatives?"
                      rows={3}
                      className="glass w-full px-4 py-3 text-white border-blue-600/40 focus:outline-none transition-all duration-300 placeholder-gray-400/50 resize-none"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>

                  {error && (
                    <motion.p
                      className="text-red-400 text-center font-medium"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-2">
                    <motion.div animate={buttonControls} className="flex-1">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                      >
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowEditItem(false);
                        setEditItem(null);
                        setForm({
                          name: "",
                          category: categories[0],
                          priority: "medium",
                          estimatedPrice: "",
                          link: "",
                          store: "",
                          image: "",
                          note: "",
                          reminderDate: "",
                        });
                        setError("");
                      }}
                      className="flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Wishlist;
