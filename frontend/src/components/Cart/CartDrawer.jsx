import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'
import CartItem from './CartItem'
import { Link } from 'react-router-dom'

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart()

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCheckout = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={handleCheckout}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                >
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={clearCart}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Clear Cart
                </button>
                
                <button
                  onClick={onClose}
                  className="block w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer