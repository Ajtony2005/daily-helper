"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Edit2, Trash2, Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { InventoryItemSchema } from "@/lib/schemas";
import { z } from "zod";

type Category = { id: string; name: string };
type Location = { id: string; name: string };
type Status = "in_stock" | "low" | "out";

type Item = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  categoryId: string | null;
  locationId: string | null;
  expires?: string; // ISO date
  status: Status;
};

function uid(prefix = "") {
  return (
    prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}

export default function InventoryManager() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([
    { id: uid("c_"), name: "Produce" },
    { id: uid("c_"), name: "Dairy" },
  ]);
  const [locations, setLocations] = useState<Location[]>([
    { id: uid("l_"), name: "Fridge" },
    { id: uid("l_"), name: "Pantry" },
  ]);

  const [items, setItems] = useState<Item[]>([]);

  const [search, setSearch] = useState("");

  // modals state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [isItemOpen, setIsItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // form states
  const [catName, setCatName] = useState("");
  const [locName, setLocName] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemUnit, setItemUnit] = useState("pcs");
  const [itemCategoryId, setItemCategoryId] = useState<string | null>(null);
  const [itemLocationId, setItemLocationId] = useState<string | null>(null);
  const [itemExpires, setItemExpires] = useState<string | undefined>(undefined);
  const [itemStatus, setItemStatus] = useState<Status>("in_stock");

  const filteredItems = useMemo(
    () =>
      items.filter((it) =>
        it.name.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  // Category handlers
  function openAddCategory() {
    setEditingCategory(null);
    setCatName("");
    setIsCategoryOpen(true);
  }
  function openEditCategory(c: Category) {
    setEditingCategory(c);
    setCatName(c.name);
    setIsCategoryOpen(true);
  }
  function saveCategory() {
    if (!catName.trim()) return toast({ title: "Name required" });
    if (editingCategory) {
      setCategories((cs) =>
        cs.map((x) =>
          x.id === editingCategory.id ? { ...x, name: catName.trim() } : x
        )
      );
      toast({ title: "Category updated" });
    } else {
      setCategories((cs) => [{ id: uid("c_"), name: catName.trim() }, ...cs]);
      toast({ title: "Category added" });
    }
    setIsCategoryOpen(false);
  }
  function deleteCategory(id: string) {
    setCategories((cs) => cs.filter((c) => c.id !== id));
    setItems((it) =>
      it.map((i) => (i.categoryId === id ? { ...i, categoryId: null } : i))
    );
  }

  // Location handlers
  function openAddLocation() {
    setEditingLocation(null);
    setLocName("");
    setIsLocationOpen(true);
  }
  function openEditLocation(l: Location) {
    setEditingLocation(l);
    setLocName(l.name);
    setIsLocationOpen(true);
  }
  function saveLocation() {
    if (!locName.trim()) return toast({ title: "Name required" });
    if (editingLocation) {
      setLocations((ls) =>
        ls.map((x) =>
          x.id === editingLocation.id ? { ...x, name: locName.trim() } : x
        )
      );
      toast({ title: "Location updated" });
    } else {
      setLocations((ls) => [{ id: uid("l_"), name: locName.trim() }, ...ls]);
      toast({ title: "Location added" });
    }
    setIsLocationOpen(false);
  }
  function deleteLocation(id: string) {
    setLocations((ls) => ls.filter((l) => l.id !== id));
    setItems((it) =>
      it.map((i) => (i.locationId === id ? { ...i, locationId: null } : i))
    );
  }

  // Item handlers
  function openAddItem() {
    setEditingItem(null);
    setItemName("");
    setItemQty(1);
    setItemUnit("pcs");
    setItemCategoryId(categories[0]?.id ?? null);
    setItemLocationId(locations[0]?.id ?? null);
    setItemExpires(undefined);
    setItemStatus("in_stock");
    setIsItemOpen(true);
  }
  function openEditItem(it: Item) {
    setEditingItem(it);
    setItemName(it.name);
    setItemQty(it.qty);
    setItemUnit(it.unit);
    setItemCategoryId(it.categoryId);
    setItemLocationId(it.locationId);
    setItemExpires(it.expires);
    setItemStatus(it.status);
    setIsItemOpen(true);
  }
  function saveItem() {
    if (!itemName.trim()) return toast({ title: "Name required" });
    // validate with Zod
    try {
      InventoryItemSchema.parse({
        id: editingItem?.id ?? uid("i_"),
        name: itemName.trim(),
        quantity: itemQty,
        unit: itemUnit,
        // map sentinel to undefined so schema receives true "none"
        location:
          itemLocationId === "__none__"
            ? undefined
            : (itemLocationId ?? undefined),
        notes: undefined,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.issues?.[0]?.message || "Validation failed";
        toast({ title: msg });
        return;
      }
      throw err;
    }
    if (editingItem) {
      setItems((is) =>
        is.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: itemName.trim(),
                qty: itemQty,
                unit: itemUnit,
                categoryId: itemCategoryId,
                locationId: itemLocationId,
                expires: itemExpires,
                status: itemStatus,
              }
            : i
        )
      );
      toast({ title: "Item updated" });
    } else {
      setItems((is) => [
        {
          id: uid("i_"),
          name: itemName.trim(),
          qty: itemQty,
          unit: itemUnit,
          categoryId: itemCategoryId,
          locationId: itemLocationId,
          expires: itemExpires,
          status: itemStatus,
        },
        ...is,
      ]);
      toast({ title: "Item added" });
    }
    setIsItemOpen(false);
  }
  function deleteItem(id: string) {
    setItems((is) => is.filter((i) => i.id !== id));
  }

  function statusBadge(s: Status) {
    if (s === "in_stock")
      return <Badge className="bg-green-600/10 text-green-600">In stock</Badge>;
    if (s === "low")
      return <Badge className="bg-amber-600/10 text-amber-600">Low</Badge>;
    return <Badge className="bg-rose-600/10 text-rose-600">Out</Badge>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Inventory</h2>
            <p className="text-sm text-muted-foreground">
              Manage categories, locations and stock items.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <Button onClick={openAddItem} className="flex items-center gap-2">
              <Plus /> Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Categories</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={openAddCategory}>
                  <Plus />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {categories.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  className="flex items-center justify-between"
                >
                  <div>{c.name}</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditCategory(c)}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete category?")) deleteCategory(c.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Locations</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={openAddLocation}>
                  <Plus />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {locations.map((l) => (
                <motion.div
                  key={l.id}
                  layout
                  className="flex items-center justify-between"
                >
                  <div>{l.name}</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditLocation(l)}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete location?")) deleteLocation(l.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Items</h3>
              <div className="text-sm text-muted-foreground">
                {filteredItems.length} results
              </div>
            </div>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>{it.name}</TableCell>
                      <TableCell>
                        {it.qty} {it.unit}
                      </TableCell>
                      <TableCell>
                        {categories.find((c) => c.id === it.categoryId)?.name ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {locations.find((l) => l.id === it.locationId)?.name ??
                          "-"}
                      </TableCell>
                      <TableCell>{it.expires ?? "-"}</TableCell>
                      <TableCell>{statusBadge(it.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditItem(it)}
                          >
                            <Edit2 />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Delete item?")) deleteItem(it.id);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Category Modal */}
        <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Label>Name</Label>
              <Input
                value={catName}
                onChange={(e: any) => setCatName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveCategory}>
                  <Save /> Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Location Modal */}
        <Dialog open={isLocationOpen} onOpenChange={setIsLocationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add Location"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Label>Name</Label>
              <Input
                value={locName}
                onChange={(e: any) => setLocName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLocationOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveLocation}>
                  <Save /> Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Modal */}
        <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "Add Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={itemName}
                    onChange={(e: any) => setItemName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Qty</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={itemQty}
                      onChange={(e: any) => setItemQty(Number(e.target.value))}
                    />
                    <Input
                      value={itemUnit}
                      onChange={(e: any) => setItemUnit(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select
                    onValueChange={(v) =>
                      setItemCategoryId(v === "__none__" ? null : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">-- none --</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select
                    onValueChange={(v) =>
                      setItemLocationId(v === "__none__" ? null : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">-- none --</SelectItem>
                      {locations.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expires</Label>
                  <Input
                    type="date"
                    value={itemExpires ?? ""}
                    onChange={(e: any) =>
                      setItemExpires(e.target.value || undefined)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select onValueChange={(v) => setItemStatus(v as Status)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In stock</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="out">Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsItemOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveItem}>
                  <Save /> Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
