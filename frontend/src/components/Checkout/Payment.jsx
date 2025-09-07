import { useState } from 'react'
import { useForm } from 'react-hook-form'

const Payment = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [paymentMethod, setPaymentMethod] = useState('card')

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, paymentMethod })
  }

  const cardNumber = watch('cardNumber')
  const formattedCardNumber = cardNumber?.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'card' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="sr-only"
            />
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm font-medium">Credit Card</span>
          </label>

          <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'paypal' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="sr-only"
            />
            <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 14.25c-.6 0-1.1.45-1.2 1.05-.1.6.3 1.2.9 1.35.6.15 1.2-.15 1.5-.75.3-.6.15-1.35-.45-1.65-.15-.15-.45-.15-.75-.15zm12.75-1.5c0-.45-.3-.75-.75-.75h-1.05c-.45 0-.75.3-.75.75s.3.75.75.75h1.05c.45 0 .75-.3.75-.75zm-3.6-2.25c.3 0 .6-.3.6-.6 0-.3-.3-.6-.6-.6h-1.8c-.3 0-.6.3-.6.6v4.2c0 .3.3.6.6.6s.6-.3.6-.6v-1.35l1.65 1.95c.15.15.3.15.45.15.15 0 .3-.15.45-.3.15-.3.15-.6 0-.75l-1.35-1.65 1.05-.3zm-9.9-1.05c0-.3-.3-.6-.6-.6h-1.8c-.3 0-.6.3-.6.6v4.2c0 .3.3.6.6.6s.6-.3.6-.6v-3.6h.6c.3 0 .6-.3.6-.6s-.3-.6-.6-.6h-.6v-.6zm6.9-1.05c-2.4 0-4.35 1.95-4.35 4.35s1.95 4.35 4.35 4.35 4.35-1.95 4.35-4.35-1.95-4.35-4.35-4.35zm0 7.5c-1.8 0-3.15-1.35-3.15-3.15s1.35-3.15 3.15-3.15 3.15 1.35 3.15 3.15-1.35 3.15-3.15 3.15z"/>
            </svg>
            <span className="text-sm font-medium">PayPal</span>
          </label>

          <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'applepay' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="applepay"
              checked={paymentMethod === 'applepay'}
              onChange={() => setPaymentMethod('applepay')}
              className="sr-only"
            />
            <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-13.5C6.48 1.5 1.5 6.48 1.5 12S6.48 22.5 12 22.5 22.5 17.52 22.5 12 17.52 1.5 12 1.5zm0 19c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z"/>
            </svg>
            <span className="text-sm font-medium">Apple Pay</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              {...register('cardNumber', { 
                required: 'Card number is required',
                pattern: {
                  value: /^[0-9]{16}$/,
                  message: 'Please enter a valid card number'
                }
              })}
              className="input-field"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />
            {errors.cardNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                {...register('expiryDate', { 
                  required: 'Expiry date is required',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'Please enter a valid expiry date (MM/YY)'
                  }
                })}
                className="input-field"
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <p className="text-red-600 text-sm mt-1">{errors.expiryDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                {...register('cvv', { 
                  required: 'CVV is required',
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: 'Please enter a valid CVV'
                  }
                })}
                className="input-field"
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <p className="text-red-600 text-sm mt-1">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              {...register('cardholderName', { required: 'Cardholder name is required' })}
              className="input-field"
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <p className="text-red-600 text-sm mt-1">{errors.cardholderName.message}</p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            You will be redirected to PayPal to complete your payment.
          </p>
        </div>
      )}

      {paymentMethod === 'applepay' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800 text-sm">
            You will complete your payment using Apple Pay.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay Now`
        )}
      </button>
    </form>
  )
}

export default Payment