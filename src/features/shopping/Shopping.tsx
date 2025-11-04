import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  ShoppingCart,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  priority: "low" | "medium" | "high";
  store: string;
  note: string;
  bought: boolean;
}

const PREDEFINED_CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Bakery",
  "Beverages",
  "Pantry",
  "Frozen",
  "Toiletries",
  "Household",
];

const PREDEFINED_STORES = [
  "Walmart",
  "Whole Foods",
  "Costco",
  "Target",
  "Local Market",
  "Other",
];

const PRIORITY_COLORS = {
  low: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  medium:
    "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  high: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function ShoppingManager() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showBoughtFilter, setShowBoughtFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickAddInput, setQuickAddInput] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "piece",
    category: "Pantry",
    priority: "medium" as const,
    store: "Walmart",
    note: "",
  });
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;
      const matchesBought = !showBoughtFilter || item.bought;

      return (
        matchesSearch && matchesCategory && matchesPriority && matchesBought
      );
    });
  }, [items, searchQuery, categoryFilter, priorityFilter, showBoughtFilter]);

  const itemsByStore = useMemo(() => {
    const grouped: Record<string, ShoppingItem[]> = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.store]) {
        grouped[item.store] = [];
      }
      grouped[item.store].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, ...newItem } : item
        )
      );
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setEditingId(null);
    } else {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        ...newItem,
        bought: false,
      };
      setItems([...items, item]);
      toast({
        title: "Success",
        description: "Item added to shopping list",
      });
    }

    setNewItem({
      name: "",
      quantity: 1,
      unit: "piece",
      category: "Pantry",
      priority: "medium",
      store: "Walmart",
      note: "",
    });
    setIsModalOpen(false);
  };

  const handleQuickAdd = () => {
    if (!quickAddInput.trim()) return;

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: quickAddInput.trim(),
      quantity: 1,
      unit: "piece",
      category: "Pantry",
      priority: "medium",
      store: "Walmart",
      note: "",
      bought: false,
    };
    setItems([...items, item]);
    setQuickAddInput("");
    toast({
      title: "Success",
      description: "Item added quickly",
    });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Success",
      description: "Item deleted",
    });
  };

  const handleToggleBought = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const handleEdit = (item: ShoppingItem) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      priority: item.priority,
      store: item.store,
      note: item.note,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const exportToCSV = () => {
    const stores = Object.keys(itemsByStore);
    let csv = "Store,Item,Quantity,Unit,Category,Priority,Note,Bought\n";

    stores.forEach((store) => {
      itemsByStore[store].forEach((item) => {
        csv += `${store},"${item.name}",${item.quantity},${item.unit},${item.category},${item.priority},"${item.note}",${item.bought}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Shopping list exported to CSV",
    });
    setIsExportModalOpen(false);
  };

  const stores = Object.keys(itemsByStore).sort();
  const boughtCount = items.filter((item) => item.bought).length;
  const totalCount = items.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 sm:p-8">
      <Toaster />
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-accent" />
                Shopping List
              </h1>
              <p className="text-muted-foreground mt-2">
                {boughtCount} of {totalCount} items purchased
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog
                open={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Shopping List</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Export your shopping list as CSV per store
                    </p>
                    <Button onClick={exportToCSV} className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download as CSV
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Edit Item" : "Add New Item"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Item Name
                      </label>
                      <Input
                        placeholder="e.g., Milk"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Quantity
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity: Number.parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Unit
                        </label>
                        <Select
                          value={newItem.unit}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, unit: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "piece",
                              "kg",
                              "lb",
                              "liter",
                              "ml",
                              "pack",
                              "box",
                              "bottle",
                            ].map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Category
                        </label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PREDEFINED_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Store
                        </label>
                        <Select
                          value={newItem.store}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, store: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PREDEFINED_STORES.map((store) => (
                              <SelectItem key={store} value={store}>
                                {store}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Priority
                      </label>
                      <Select
                        value={newItem.priority}
                        onValueChange={(value: any) =>
                          setNewItem({ ...newItem, priority: value })
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Note
                      </label>
                      <Input
                        placeholder="Add any notes..."
                        value={newItem.note}
                        onChange={(e) =>
                          setNewItem({ ...newItem, note: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddItem}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {editingId ? "Update Item" : "Add Item"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingId(null);
                          setNewItem({
                            name: "",
                            quantity: 1,
                            unit: "piece",
                            category: "Pantry",
                            priority: "medium",
                            store: "Walmart",
                            note: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Add */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Quick add item..."
              value={quickAddInput}
              onChange={(e) => setQuickAddInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleQuickAdd()}
              className="flex-1"
            />
            <Button onClick={handleQuickAdd} size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showBoughtFilter ? "default" : "outline"}
              onClick={() => setShowBoughtFilter(!showBoughtFilter)}
              className="gap-2"
            >
              Unbought Only
            </Button>
          </div>
        </motion.div>

        {/* Empty State */}
        {stores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No items in your shopping list yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first item to get started
            </p>
          </motion.div>
        ) : (
          /* Stores Accordion */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {stores.map((store, storeIndex) => (
              <motion.div
                key={store}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: storeIndex * 0.1 }}
              >
                <StoreAccordion
                  store={store}
                  items={itemsByStore[store]}
                  onToggleBought={handleToggleBought}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface StoreAccordionProps {
  store: string;
  items: ShoppingItem[];
  onToggleBought: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
}

function StoreAccordion({
  store,
  items,
  onToggleBought,
  onEdit,
  onDelete,
}: StoreAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const boughtCount = items.filter((item) => item.bought).length;

  return (
    <Card className="overflow-hidden border-border/50 hover:border-border transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <ShoppingCart className="h-5 w-5 text-accent" />
          <div className="text-left">
            <h3 className="font-semibold text-foreground">{store}</h3>
            <p className="text-xs text-muted-foreground">
              {boughtCount} of {items.length} items purchased
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50"
          >
            <div className="px-6 py-4 space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                    item.bought
                      ? "bg-muted/50 border-muted"
                      : "bg-card/30 border-border/30 hover:bg-card/50"
                  }`}
                >
                  <Checkbox
                    checked={item.bought}
                    onCheckedChange={() => onToggleBought(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`font-medium truncate ${
                          item.bought
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {item.quantity} {item.unit} {item.name}
                      </p>
                      <Badge
                        className={`whitespace-nowrap ${PRIORITY_COLORS[item.priority]} border`}
                      >
                        {item.priority === "high" && (
                          <Zap className="h-3 w-3 mr-1" />
                        )}
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      {item.note && (
                        <>
                          <span>•</span>
                          <span className="truncate">{item.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0 hover:bg-accent/20"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
