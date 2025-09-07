import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart')
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 }
  } catch {
    return { items: [], total: 0 }
  }
}

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item._id === product._id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ ...product, quantity })
      }
      
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item._id !== productId)
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item._id === productId)
      
      if (item) {
        item.quantity = quantity
        state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        saveCartToStorage(state)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      saveCartToStorage(state)
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer