import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    // ถ้าไม่มี user ให้ return ตะกร้าว่าง
    if (!user) return [];
    
    // โหลดตะกร้าของ user นั้นๆ
    const savedCart = localStorage.getItem(`cart_user_${user.id}`);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return; // ถ้าไม่มี user ไม่ให้เพิ่มของในตะกร้า

      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
        localStorage.setItem(`cart_user_${user.id}`, JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem(`cart_user_${user.id}`, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.removeItem(`cart_user_${user.id}`);
      }
      state.items = [];
    },
    initCart: (state) => {
      state.items = loadCartFromStorage();
    }
  }
});

export const { addToCart, removeFromCart, clearCart, initCart } = cartSlice.actions;
export default cartSlice.reducer;