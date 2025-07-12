import { ref, computed, watch, onMounted } from "vue";
import type { Ref, ComputedRef } from "vue";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface UseProductCartReturn {
  items: Ref<CartItem[]>;
  totalItems: ComputedRef<number>;
  totalPrice: ComputedRef<number>;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => ComputedRef<boolean>;
}

const STORAGE_KEY = "cart-items";

export const useProductCart = (): UseProductCartReturn => {
  const items = ref<CartItem[]>([]);

  onMounted(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        items.value = JSON.parse(storedItems) as CartItem[];
      }
    } catch (error) {
      console.error(error);
    }
  });

  watch(
    items,
    (newItems) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error(error);
      }
    },
    { deep: true }
  );

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });

  const addItem = (product: any, quantity: number = 1) => {
    if (!product || typeof product.id === "undefined") return;

    const existingItem = items.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        variant: product.variant,
      });
    }
  };

  const removeItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  const updateQuantity = (id: number, quantity: number) => {
    const item = items.value.find((item) => item.id === id);
    if (item) {
      if (quantity <= 0) {
        removeItem(id);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  const isInCart = (id: number): ComputedRef<boolean> => {
    return computed(() => items.value.some((item) => item.id === id));
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };
};
