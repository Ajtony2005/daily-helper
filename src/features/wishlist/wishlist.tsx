"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  Search,
  X,
  Heart,
  MapPin,
  DollarSign,
  LinkIcon,
  Calendar,
  StickyNote,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high";
  estimatedPrice: number;
  store: string;
  reminderDate: string;
  link: string;
  imageUrl: string;
  note: string;
  purchased: boolean;
}

const categoryOptions = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Sports",
  "Beauty",
  "Gaming",
  "Music",
  "Other",
];

const priorityColors = {
  low: "bg-blue-500/20 text-blue-600 border-blue-200",
  medium: "bg-amber-500/20 text-amber-600 border-amber-200",
  high: "bg-red-500/20 text-red-600 border-red-200",
};

const priorityBgColors = {
  low: "bg-blue-50",
  medium: "bg-amber-50",
  high: "bg-red-50",
};

export function WishlistManager() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Electronics");
  const [priorityFilter, setPriorityFilter] = useState("medium");
  const [purchasedFilter, setPurchasedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickAddValue, setQuickAddValue] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    priority: "medium" as "low" | "medium" | "high",
    estimatedPrice: 0,
    store: "",
    reminderDate: "",
    link: "",
    imageUrl: "",
    note: "",
  });

  const handleAddItem = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    const newItem: WishlistItem = {
      id: editingId || Date.now().toString(),
      ...formData,
      purchased: false,
    };

    if (editingId) {
      setItems(items.map((item) => (item.id === editingId ? newItem : item)));
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setEditingId(null);
    } else {
      setItems([...items, newItem]);
      toast({
        title: "Success",
        description: "Item added to your wishlist",
      });
    }

    setFormData({
      name: "",
      category: "Electronics",
      priority: "medium",
      estimatedPrice: 0,
      store: "",
      reminderDate: "",
      link: "",
      imageUrl: "",
      note: "",
    });
    setShowAddForm(false);
  };

  const handleQuickAdd = () => {
    if (!quickAddValue.trim()) return;

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      name: quickAddValue,
      category: "Other",
      priority: "medium",
      estimatedPrice: 0,
      store: "",
      reminderDate: "",
      link: "",
      imageUrl: "",
      note: "",
      purchased: false,
    };

    setItems([...items, newItem]);
    setQuickAddValue("");
    toast({
      title: "Success",
      description: "Item added quickly to your wishlist",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Deleted",
      description: "Item removed from your wishlist",
    });
  };

  const handleTogglePurchased = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const handleEditItem = (item: WishlistItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      priority: item.priority,
      estimatedPrice: item.estimatedPrice,
      store: item.store,
      reminderDate: item.reminderDate,
      link: item.link,
      imageUrl: item.imageUrl,
      note: item.note,
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    const matchesPurchased =
      purchasedFilter === "all" ||
      (purchasedFilter === "purchased" && item.purchased) ||
      (purchasedFilter === "unpurchased" && !item.purchased);

    return (
      matchesSearch && matchesCategory && matchesPriority && matchesPurchased
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                Manage and organize your wishlist items
              </p>
            </div>
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setFormData({
                  name: "",
                  category: "Electronics",
                  priority: "medium",
                  estimatedPrice: 0,
                  store: "",
                  reminderDate: "",
                  link: "",
                  imageUrl: "",
                  note: "",
                });
              }}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Quick Add Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Quick add item..."
                value={quickAddValue}
                onChange={(e) => setQuickAddValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuickAdd();
                }}
                className="pl-4"
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickAdd}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={purchasedFilter} onValueChange={setPurchasedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="unpurchased">Not Purchased</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-2"
        >
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </motion.div>

        {/* Items Display */}
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {items.length === 0
                  ? "Start adding items to your wishlist!"
                  : "No items match your filters"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={
                    viewMode === "grid"
                      ? ""
                      : "flex items-start justify-between"
                  }
                >
                  <Card
                    className={`overflow-hidden border-0 shadow-lg relative group transition-all duration-300 ${
                      item.purchased ? "opacity-60" : ""
                    } ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div
                      className={`absolute inset-0 -z-10 ${priorityBgColors[item.priority]}`}
                    />

                    <div
                      className={
                        viewMode === "list"
                          ? "flex items-start gap-4 p-6"
                          : "flex flex-col h-full"
                      }
                    >
                      {/* Image Section */}
                      {item.imageUrl && (
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {item.purchased && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content Section */}
                      <div
                        className={
                          viewMode === "grid"
                            ? "p-4 flex-1 flex flex-col"
                            : "flex-1"
                        }
                      >
                        {/* Priority Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                              priorityColors[item.priority]
                            }`}
                          >
                            {item.priority.charAt(0).toUpperCase() +
                              item.priority.slice(1)}{" "}
                            Priority
                          </span>
                          {item.purchased && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                              Purchased
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-semibold text-foreground mb-2 ${item.purchased ? "line-through" : ""}`}
                        >
                          {item.name}
                        </h3>

                        {/* Category */}
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.category}
                        </p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                          {item.estimatedPrice > 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>${item.estimatedPrice.toFixed(2)}</span>
                            </div>
                          )}
                          {item.store && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{item.store}</span>
                            </div>
                          )}
                          {item.reminderDate && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{item.reminderDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Note */}
                        {item.note && (
                          <div className="mb-4 p-2 bg-muted/50 rounded text-sm text-muted-foreground border border-muted">
                            <div className="flex gap-2 items-start">
                              <StickyNote className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span>{item.note}</span>
                            </div>
                          </div>
                        )}

                        {/* Link */}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                          >
                            <LinkIcon className="h-4 w-4" />
                            View Product
                          </a>
                        )}

                        {/* Actions */}
                        <div
                          className={`flex gap-2 pt-4 border-t border-border ${
                            viewMode === "list" ? "flex-col" : "flex-row"
                          }`}
                        >
                          <Button
                            size="sm"
                            variant={item.purchased ? "secondary" : "default"}
                            onClick={() => handleTogglePurchased(item.id)}
                            className="flex-1 gap-2"
                          >
                            <Heart
                              className={`h-4 w-4 ${item.purchased ? "fill-current" : ""}`}
                            />
                            {item.purchased ? "Undo" : "Mark Purchased"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                            className="flex-1 gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex-1 gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Item" : "Add New Item"}
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Item Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter item name"
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Priority
                      </label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            priority: value as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price and Store */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Estimated Price
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.estimatedPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedPrice:
                              Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Store
                      </label>
                      <Input
                        value={formData.store}
                        onChange={(e) =>
                          setFormData({ ...formData, store: e.target.value })
                        }
                        placeholder="e.g., Amazon"
                      />
                    </div>
                  </div>

                  {/* Reminder Date and Link */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reminder Date
                      </label>
                      <Input
                        type="date"
                        value={formData.reminderDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product Link
                      </label>
                      <Input
                        type="url"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Note
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      placeholder="Add any notes about this item..."
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-24"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={handleAddItem}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {editingId ? "Update Item" : "Add Item"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WishlistManager;
