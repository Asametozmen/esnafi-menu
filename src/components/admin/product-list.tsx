"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Database } from "@/types/database";
import { formatPrice, type CurrencySettings } from "@/lib/currency";
import { reorderProducts, deleteProduct } from "@/app/admin/products/actions";

type Product = Database["public"]["Tables"]["products"]["Row"];

function SortableRow({ product, currency }: { product: Product; currency: CurrencySettings }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const name = (product.name as Record<string, string> | null)?.tr ?? "";

  async function handleDelete() {
    if (!confirm(`"${name}" ürününü silmek istediğine emin misin?`)) {
      return;
    }
    setIsPending(true);
    await deleteProduct(product.id);
    router.refresh();
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-black"
    >
      <button
        type="button"
        aria-label="Sırala"
        className="cursor-grab touch-none text-black/40 dark:text-white/40"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <span className="flex-1 font-medium">{name}</span>
      <span className="text-sm text-black/60 dark:text-white/60">
        {formatPrice(product.price, currency)}
      </span>
      {product.availability === "out_of_stock" && (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
          Tükendi
        </span>
      )}
      {!product.is_active && (
        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/15">
          Pasif
        </span>
      )}
      <Link href={`/admin/products/${product.id}`} className="text-sm font-medium underline">
        Düzenle
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-red-600 underline disabled:opacity-50 dark:text-red-400"
      >
        Sil
      </button>
    </li>
  );
}

export function ProductList({
  categoryId,
  products,
  currency,
}: {
  categoryId: string;
  products: Product[];
  currency: CurrencySettings;
}) {
  const router = useRouter();
  const [items, setItems] = useState(products);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    await reorderProducts(
      categoryId,
      reordered.map((item) => item.id),
    );
    router.refresh();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {items.map((product) => (
            <SortableRow key={product.id} product={product} currency={currency} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
