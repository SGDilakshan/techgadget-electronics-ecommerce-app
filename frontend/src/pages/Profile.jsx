import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [isEditing, setIsEditing] = useState(false)

  const onSubmit = (data) => {
    console.log('Profile data:', data)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-600">Update your personal information.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                defaultValue={user?.given_name || ''}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                defaultValue={user?.family_name || ''}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                disabled
                className="input-field disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register('phone')}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Address</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your shipping addresses.</p>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Address */}
            <div className="border rounded-lg p-4 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Default
                </span>
              </div>
              <h3 className="font-medium mb-2">Home</h3>
              <p className="text-sm text-gray-600">
                123 Main Street<br />
                Apt 4B<br />
                New York, NY 10001<br />
                United States
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-3">
                Edit Address
              </button>
            </div>

            {/* Add New Address */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 cursor-pointer">
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Add New Address</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile