import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '../../store/slices/productSlice'

const ProductFilter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.products)
  const [isOpen, setIsOpen] = useState(false)

  const categories = ['Electronics', 'Gadgets', 'Accessories', 'Smart Home', 'Wearables']
  const brands = ['Apple', 'Samsung', 'Sony', 'Google', 'Bose']
  const priceRanges = [
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200 - $500', value: '200-500' },
    { label: 'Over $500', value: '500-10000' }
  ]

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block space-y-6`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category === category}
                  onChange={(e) => handleFilterChange('category', e.target.checked ? category : '')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brands</label>
          <div className="space-y-2">
            {brands.map(brand => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange === range.value}
                  onChange={() => handleFilterChange('priceRange', range.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}

export default ProductFilter