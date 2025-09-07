import { useDispatch, useSelector } from 'react-redux'
import { 
  addToCart as addToCartAction, 
  removeFromCart as removeFromCartAction, 
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction
} from '../store/slices/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)

  const addToCart = (product, quantity = 1) => {
    dispatch(addToCartAction({ product, quantity }))
  }

  const removeFromCart = (productId) => {
    dispatch(removeFromCartAction(productId))
  }

  const updateQuantity = (productId, quantity) => {
    dispatch(updateQuantityAction({ productId, quantity }))
  }

  const clearCart = () => {
    dispatch(clearCartAction())
  }

  const getCartItemsCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    items: cart.items,
    total: cart.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount
  }
}