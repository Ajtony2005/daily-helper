import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Edit2, Trash2 } from "lucide-react";
import Loading from "@/pages/Loading";

const initialCategories = [
  "Food",
  "Drinks",
  "Cleaning Supplies",
  "Spices",
  "Other",
];

const initialLocations = [
  "Kitchen Shelf",
  "Fridge",
  "Freezer",
  "Pantry",
  "Other",
];

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate: string;
  location: string;
  status: "in_stock" | "low" | "out";
};

const Inventory = () => {
  // Category management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(
    null
  );
  const [categoryInput, setCategoryInput] = useState("");

  // Location management
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editLocationIndex, setEditLocationIndex] = useState<number | null>(
    null
  );
  const [locationInput, setLocationInput] = useState("");

  // Category handlers
  const handleAddCategory = () => {
    if (!categoryInput.trim()) return;
    if (predefinedCategories.includes(categoryInput.trim())) return;
    setPredefinedCategories([...predefinedCategories, categoryInput.trim()]);
    setCategoryInput("");
    setShowCategoryModal(false);
    setEditCategoryIndex(null);
  };
  const handleEditCategory = () => {
    if (editCategoryIndex === null || !categoryInput.trim()) return;
    const updated = [...predefinedCategories];
    updated[editCategoryIndex] = categoryInput.trim();
    setPredefinedCategories(updated);
    setCategoryInput("");
    setShowCategoryModal(false);
    setEditCategoryIndex(null);
  };
  const handleDeleteCategory = (idx: number) => {
    setPredefinedCategories(predefinedCategories.filter((_, i) => i !== idx));
  };
  const openEditCategory = (idx: number) => {
    setEditCategoryIndex(idx);
    setCategoryInput(predefinedCategories[idx]);
    setShowCategoryModal(true);
  };

  // Location handlers
  const handleAddLocation = () => {
    if (!locationInput.trim()) return;
    if (locations.includes(locationInput.trim())) return;
    setLocations([...locations, locationInput.trim()]);
    setLocationInput("");
    setShowLocationModal(false);
    setEditLocationIndex(null);
  };
  const handleEditLocation = () => {
    if (editLocationIndex === null || !locationInput.trim()) return;
    const updated = [...locations];
    updated[editLocationIndex] = locationInput.trim();
    setLocations(updated);
    setLocationInput("");
    setShowLocationModal(false);
    setEditLocationIndex(null);
  };
  const handleDeleteLocation = (idx: number) => {
    setLocations(locations.filter((_, i) => i !== idx));
  };
  const openEditLocation = (idx: number) => {
    setEditLocationIndex(idx);
    setLocationInput(locations[idx]);
    setShowLocationModal(true);
  };
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [predefinedCategories, setPredefinedCategories] =
    useState<string[]>(initialCategories);
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: predefinedCategories[0],
    newCategory: "",
    expirationDate: "",
    location: locations[0],
    newLocation: "",
    status: "in_stock" as "in_stock" | "low" | "out",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const quantityNum = parseFloat(form.quantity);
    if (isNaN(quantityNum)) {
      setError("Quantity must be a number.");
      return;
    }
    let selectedCategory = form.category;
    if (form.newCategory.trim() && form.category === "Add New") {
      if (predefinedCategories.includes(form.newCategory.trim())) {
        setError("Category already exists.");
        return;
      }
      selectedCategory = form.newCategory.trim();
      setPredefinedCategories([...predefinedCategories, selectedCategory]);
    }
    let selectedLocation = form.location;
    if (form.newLocation.trim() && form.location === "Add New") {
      if (locations.includes(form.newLocation.trim())) {
        setError("Location already exists.");
        return;
      }
      selectedLocation = form.newLocation.trim();
      setLocations([...locations, selectedLocation]);
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
      quantity: quantityNum,
      unit: form.unit.trim(),
      category: selectedCategory,
      expirationDate: form.expirationDate,
      location: selectedLocation,
      status: form.status,
    };
    if (newItem.quantity === 0) {
      newItem.status = "out";
    }
    setItems([...items, newItem]);
    // Automatic transfer to shopping list if low or out
    if (newItem.status === "low" || newItem.status === "out") {
      transferToShopping(newItem);
    }
    setForm({
      name: "",
      quantity: "",
      unit: "",
      category: predefinedCategories[0],
      newCategory: "",
      expirationDate: "",
      location: locations[0],
      newLocation: "",
      status: "in_stock",
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
    const quantityNum = parseFloat(form.quantity);
    if (isNaN(quantityNum)) {
      setError("Quantity must be a number.");
      return;
    }
    let selectedCategory = form.category;
    if (form.newCategory.trim() && form.category === "Add New") {
      if (predefinedCategories.includes(form.newCategory.trim())) {
        setError("Category already exists.");
        return;
      }
      selectedCategory = form.newCategory.trim();
      setPredefinedCategories([...predefinedCategories, selectedCategory]);
    }
    let selectedLocation = form.location;
    if (form.newLocation.trim() && form.location === "Add New") {
      if (locations.includes(form.newLocation.trim())) {
        setError("Location already exists.");
        return;
      }
      selectedLocation = form.newLocation.trim();
      setLocations([...locations, selectedLocation]);
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const updatedItem = {
      ...editItem,
      name: form.name.trim(),
      quantity: quantityNum,
      unit: form.unit.trim(),
      category: selectedCategory,
      expirationDate: form.expirationDate,
      location: selectedLocation,
      status: form.status,
    };
    if (updatedItem.quantity === 0) {
      updatedItem.status = "out";
    }
    setItems(
      items.map((item) => (item.id === editItem.id ? updatedItem : item))
    );
    // Automatic transfer to shopping list if low or out
    if (updatedItem.status === "low" || updatedItem.status === "out") {
      transferToShopping(updatedItem);
    }
    setForm({
      name: "",
      quantity: "",
      unit: "",
      category: predefinedCategories[0],
      newCategory: "",
      expirationDate: "",
      location: locations[0],
      newLocation: "",
      status: "in_stock",
    });
    setEditItem(null);
    setShowEditItem(false);
    setError("");
    setIsLoading(false);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category,
      newCategory: "",
      expirationDate: item.expirationDate,
      location: item.location,
      newLocation: "",
      status: item.status,
    });
    setShowEditItem(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleStatusChange = (
    itemId: string,
    newStatus: "in_stock" | "low" | "out"
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    const updatedItem = items.find((item) => item.id === itemId);
    if (updatedItem && (newStatus === "low" || newStatus === "out")) {
      transferToShopping(updatedItem);
    }
  };

  const transferToShopping = (item: InventoryItem) => {
    // Placeholder for transferring to shopping list
    console.log(
      `Added to shopping list: ${item.name} - Quantity: ${item.quantity} ${item.unit}`
    );
    // In a real app, this would update the shopping list state or API
  };

  const getFilteredItems = () => {
    const search = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search)
    );
  };

  const getGroupedItems = () => {
    const filtered = getFilteredItems();
    const grouped = filtered.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as { [key: string]: InventoryItem[] });
    return grouped;
  };

  const isExpirationSoon = (date: string) => {
    if (!date) return false;
    const expDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil(
      (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
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
              Inventory
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
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-6 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Category Card */}
              <Card className="bg-gray-800/30 border border-blue-600/40 shadow-inner rounded-xl">
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-4 text-blue-400">
                    Categories
                  </CardTitle>
                  <div className="space-y-2">
                    {predefinedCategories.map((cat, idx) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between bg-gray-900/30 rounded-lg px-4 py-2"
                      >
                        <span className="text-white font-medium">{cat}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openEditCategory(idx)}
                            className="bg-blue-600 text-white p-1 rounded-xl"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteCategory(idx)}
                            className="bg-red-500 text-white p-1 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => {
                      setShowCategoryModal(true);
                      setEditCategoryIndex(null);
                      setCategoryInput("");
                    }}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-2 rounded-xl"
                  >
                    + Add Category
                  </Button>
                </CardContent>
              </Card>
              {/* Location Card */}
              <Card className="bg-gray-800/30 border border-blue-600/40 shadow-inner rounded-xl">
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-4 text-blue-400">
                    Locations
                  </CardTitle>
                  <div className="space-y-2">
                    {locations.map((loc, idx) => (
                      <div
                        key={loc}
                        className="flex items-center justify-between bg-gray-900/30 rounded-lg px-4 py-2"
                      >
                        <span className="text-white font-medium">{loc}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openEditLocation(idx)}
                            className="bg-blue-600 text-white p-1 rounded-xl"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteLocation(idx)}
                            className="bg-red-500 text-white p-1 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => {
                      setShowLocationModal(true);
                      setEditLocationIndex(null);
                      setLocationInput("");
                    }}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-2 rounded-xl"
                  >
                    + Add Location
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* ...existing code for inventory items... */}
            <div className="space-y-8">
              {Object.keys(getGroupedItems()).map((category) => (
                <div key={category}>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 mb-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getGroupedItems()[category].map((item) => (
                      // ...existing code for inventory item card...
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800/30 p-4 rounded-xl border border-blue-600/40 shadow-inner"
                      >
                        {/* ...existing code for inventory item details and actions... */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-lg text-white">
                            {item.name}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => handleOpenEditItem(item)}
                              className="bg-blue-600 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <Edit2 className="w-4 h-4" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <Trash2 className="w-4 h-4" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          Quantity: {item.quantity} {item.unit}
                          {item.quantity === 0 && (
                            <span className="text-red-500 ml-2">(Out)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          Expiration: {item.expirationDate || "N/A"}
                          {isExpirationSoon(item.expirationDate) && (
                            <span className="text-red-500 ml-2">
                              (Expiring soon)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          Location: {item.location}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            onClick={() =>
                              handleStatusChange(item.id, "in_stock")
                            }
                            className={`flex-1 ${
                              item.status === "in_stock"
                                ? "bg-green-500"
                                : "bg-gray-800/30"
                            } text-white py-1 rounded-xl`}
                          >
                            ✅ In Stock
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "low")}
                            className={`flex-1 ${
                              item.status === "low"
                                ? "bg-yellow-500"
                                : "bg-gray-800/30"
                            } text-white py-1 rounded-xl`}
                          >
                            ⚠️ Low
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "out")}
                            className={`flex-1 ${
                              item.status === "out"
                                ? "bg-red-500"
                                : "bg-gray-800/30"
                            } text-white py-1 rounded-xl`}
                          >
                            ❌ Out
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Category Modal */}
            {showCategoryModal && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={modalVariants}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowCategoryModal(false)}
              >
                <motion.div
                  className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardContent className="p-10 relative z-10">
                    <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow animate-gradient-x">
                      {editCategoryIndex !== null
                        ? "Edit Category"
                        : "Add Category"}
                    </CardTitle>
                    <Input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      placeholder="Category name"
                      className="mb-6 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={
                          editCategoryIndex !== null
                            ? handleEditCategory
                            : handleAddCategory
                        }
                        className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl"
                      >
                        {editCategoryIndex !== null ? "Save" : "Add"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowCategoryModal(false);
                          setCategoryInput("");
                          setEditCategoryIndex(null);
                        }}
                        className="flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            )}

            {/* Location Modal */}
            {showLocationModal && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={modalVariants}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowLocationModal(false)}
              >
                <motion.div
                  className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardContent className="p-10 relative z-10">
                    <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow animate-gradient-x">
                      {editLocationIndex !== null
                        ? "Edit Location"
                        : "Add Location"}
                    </CardTitle>
                    <Input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Location name"
                      className="mb-6 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={
                          editLocationIndex !== null
                            ? handleEditLocation
                            : handleAddLocation
                        }
                        className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl"
                      >
                        {editLocationIndex !== null ? "Save" : "Add"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowLocationModal(false);
                          setLocationInput("");
                          setEditLocationIndex(null);
                        }}
                        className="flex-1 bg-gray-800/30 text-white font-bold py-3 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Inventory Item
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
                        form.unit ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
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
                      setForm({ ...form, category: value, newCategory: "" })
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
                      <SelectItem value="Add New">Add New</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.category === "Add New" && (
                    <motion.input
                      id="newCategory"
                      type="text"
                      name="newCategory"
                      value={form.newCategory}
                      onChange={handleChange}
                      placeholder="New category name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mt-2"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="expirationDate"
                    animate={
                      form.expirationDate
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Expiration Date
                  </motion.label>
                  <motion.input
                    id="expirationDate"
                    type="date"
                    name="expirationDate"
                    value={form.expirationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="location"
                    animate={
                      form.location
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Location
                  </motion.label>
                  <Select
                    value={form.location}
                    onValueChange={(value) =>
                      setForm({ ...form, location: value, newLocation: "" })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                      <SelectItem value="Add New">Add New</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.location === "Add New" && (
                    <motion.input
                      id="newLocation"
                      type="text"
                      name="newLocation"
                      value={form.newLocation}
                      onChange={handleChange}
                      placeholder="New location name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mt-2"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="status"
                    animate={
                      form.status ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Status
                  </motion.label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        status: value as "in_stock" | "low" | "out",
                      })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">✅ In Stock</SelectItem>
                      <SelectItem value="low">⚠️ Low</SelectItem>
                      <SelectItem value="out">❌ Out</SelectItem>
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
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Edit Inventory Item
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
                        form.unit ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
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
                      setForm({ ...form, category: value, newCategory: "" })
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
                      <SelectItem value="Add New">Add New</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.category === "Add New" && (
                    <motion.input
                      id="newCategory"
                      type="text"
                      name="newCategory"
                      value={form.newCategory}
                      onChange={handleChange}
                      placeholder="New category name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mt-2"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="minQuantity"
                    animate={
                      form.minQuantity
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Min Quantity
                  </motion.label>
                  <motion.input
                    id="minQuantity"
                    type="text"
                    name="minQuantity"
                    value={form.minQuantity}
                    onChange={handleChange}
                    placeholder="Min quantity"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="expirationDate"
                    animate={
                      form.expirationDate
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Expiration Date
                  </motion.label>
                  <motion.input
                    id="expirationDate"
                    type="date"
                    name="expirationDate"
                    value={form.expirationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="location"
                    animate={
                      form.location
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Location
                  </motion.label>
                  <Select
                    value={form.location}
                    onValueChange={(value) =>
                      setForm({ ...form, location: value, newLocation: "" })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                      <SelectItem value="Add New">Add New</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.location === "Add New" && (
                    <motion.input
                      id="newLocation"
                      type="text"
                      name="newLocation"
                      value={form.newLocation}
                      onChange={handleChange}
                      placeholder="New location name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 mt-2"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="status"
                    animate={
                      form.status ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Status
                  </motion.label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        status: value as "in_stock" | "low" | "out",
                      })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">✅ In Stock</SelectItem>
                      <SelectItem value="low">⚠️ Low</SelectItem>
                      <SelectItem value="out">❌ Out</SelectItem>
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
                  onClick={() => setShowEditItem(false)}
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
    </div>
  );
};

export default Inventory;
