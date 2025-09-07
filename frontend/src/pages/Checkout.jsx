import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { createOrder } from '../store/slices/orderSlice'
import { formatPrice } from '../utils/formatters'
import CheckoutForm from '../components/Checkout/CheckoutForm'
import Payment from '../components/Checkout/Payment'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const { loading: orderLoading, error: orderError } = useSelector(state => state.orders)
  const { user } = useSelector(state => state.auth)

  const handleShippingSubmit = (data) => {
    setShippingData(data)
    setStep(2)
  }

  const handlePaymentSubmit = async (paymentData) => {
    const orderData = {
      items,
      total,
      shipping: shippingData,
      payment: paymentData,
      customer: {
        userId: user?.id,
        email: user?.email,
        name: `${user?.given_name} ${user?.family_name}`
      }
    }

    try {
      const result = await dispatch(createOrder(orderData)).unwrap()
      clearCart()
      navigate('/orders', { 
        state: { 
          message: 'Order placed successfully!',
          orderId: result._id 
        } 
      })
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <CheckoutForm onSubmit={handleShippingSubmit} />
            )}
            
            {step === 2 && (
              <Payment 
                onSubmit={handlePaymentSubmit} 
                loading={orderLoading}
              />
            )}

            {orderError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                {orderError}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(9.99)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(total * 0.08)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total + 9.99 + (total * 0.08))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout