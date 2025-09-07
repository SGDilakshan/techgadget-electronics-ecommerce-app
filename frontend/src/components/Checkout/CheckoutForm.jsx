import { useState } from 'react'
import { useForm } from 'react-hook-form'

const CheckoutForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              {...register('shippingFirstName', { required: 'First name is required' })}
              className="input-field"
            />
            {errors.shippingFirstName && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingFirstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              {...register('shippingLastName', { required: 'Last name is required' })}
              className="input-field"
            />
            {errors.shippingLastName && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingLastName.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              {...register('shippingAddress', { required: 'Address is required' })}
              className="input-field"
            />
            {errors.shippingAddress && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingAddress.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              {...register('shippingCity', { required: 'City is required' })}
              className="input-field"
            />
            {errors.shippingCity && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingCity.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              {...register('shippingPostalCode', { required: 'Postal code is required' })}
              className="input-field"
            />
            {errors.shippingPostalCode && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingPostalCode.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              {...register('shippingCountry', { required: 'Country is required' })}
              className="input-field"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
            {errors.shippingCountry && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingCountry.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
            Billing address same as shipping address
          </label>
        </div>

        {!sameAsShipping && (
          <>
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  {...register('billingFirstName', { 
                    required: !sameAsShipping && 'First name is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                />
                {errors.billingFirstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingFirstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  {...register('billingLastName', { 
                    required: !sameAsShipping && 'Last name is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                />
                {errors.billingLastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingLastName.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  {...register('billingAddress', { 
                    required: !sameAsShipping && 'Address is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                />
                {errors.billingAddress && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingAddress.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register('billingCity', { 
                    required: !sameAsShipping && 'City is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                />
                {errors.billingCity && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingCity.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <input
                  {...register('billingPostalCode', { 
                    required: !sameAsShipping && 'Postal code is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                />
                {errors.billingPostalCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingPostalCode.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  {...register('billingCountry', { 
                    required: !sameAsShipping && 'Country is required' 
                  })}
                  className="input-field"
                  disabled={sameAsShipping}
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                {errors.billingCountry && (
                  <p className="text-red-600 text-sm mt-1">{errors.billingCountry.message}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
      >
        Continue to Payment
      </button>
    </form>
  )
}

export default CheckoutForm