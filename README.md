# techgadget-electronics-ecommerce-app
Modern &amp; secure electronics e-commerce platform built with React, Redux Toolkit, Tailwind CSS, and Asgardeo IDP authentication. Includes safeguards against CSRF, XSS, and SQL injection.

## Features
- 🔧 Browse the latest tech gadgets and electronics
- 🛒 Add items to cart with quantity selection
- 👤 Secure user authentication (login/register)
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔄 State management with Redux Toolkit
- 🔒 Secure payment processing
- ⭐ Product reviews and ratings

## Tech Stack
- **Frontend**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Authentication**: Asgardeo IDP
- **Backend**: Node.js with Express


## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- pnpm package manager
 
### Installation
1. **Navigate to the frontend directory**:

   ```bash
   cd TechGadget/frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   pnpm add react
   pnpm add @asgardeo/auth-react
   pnpm add react-router-dom
   pnpm add -D tailwindcss postcss autoprefixer
   pnpm exec tailwindcss init -p

3. **Navigate to the backendtend directory**:
   ```bash
   cd TechGadget/backend
   ```

4. **Install dependencies**:
   ```bash
   pnpm init
   pnpm add express
   pnpm add cors
   pnpm add @asgardeo/oidc-node
   pnpm add dotenv
   pnpm add mongoose
   pnpm add stripe
   pnpm add -D nodemon
   ```

### Running the Application
1. **Start the backend server**:

   ```bash
   cd backend
   pnpm run dev
   ```
2. **Start the frontend development server**:
   ```bash
   cd frontend
   pnpm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production
```bash
pnpm run build
```

## Project Structure
```
TechGadget/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   └── default.json 
│   ├── middleware/   
│   │   ├── auth.js
│   │   └── security.js
│   ├── models/    
│   │   ├── Order.js
│   │   ├── Product.js           
│   │   ├── User.js
│   │   └── Review.js               
│   ├── routes/           
│   │   ├── index.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── users.js
│   │   └── payment.js
│   ├── .env        
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductModal.jsx
│   │   │   │   └── ProductFilter.jsx
│   │   │   ├── Cart/
│   │   │   │   ├── CartDrawer.jsx
│   │   │   │   └── CartItem.jsx
│   │   │   ├── Checkout/
│   │   │   │   ├── CheckoutForm.jsx
│   │   │   │   └── Payment.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── UI/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── productSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── authSlice.js
│   │   │   │   └── orderSlice.js
│   │   │   └── store.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Features Explained
### Authentication
- Secure authentication using Asgardeo IDP
- Login and logout functionality
- User session management with JWT tokens
- Protected routes for authenticated users

### Product Catalog
- Browse electronics products with high-quality images
- Filter products by category, price range, and brand
- Search functionality to find specific products
- Detailed product views with specifications
- Customer reviews and rating system

### Shopping Cart
- Add/remove items from cart
- Adjust quantities
- Persistent cart data across sessions
- Real-time cart total calculation

### Checkout Process
- Secure payment processing with Stripe integration
- Multiple payment options
- Order confirmation and tracking
- Order history for registered users

### User Profile
- Personal information management
- Address book for shipping
- Order history and tracking
- Wishlist functionality

### Security Measures
- CSRF protection for all form submissions
- XSS prevention through input sanitization
- SQL injection protection with parameterized queries
- Secure authentication flows with OIDC
- HTTPS enforcement in production

## Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build
- `pnpm run test` - Run test suite

## Environment Variables
### Create a .env file in both frontend and backend directories with the following variables:

### Backend:
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ASGARDEO_CLIENT_ID=your_asgardeo_client_id
ASGARDEO_CLIENT_SECRET=your_asgardeo_client_secret
ASGARDEO_BASE_URL=your_asgardeo_base_url
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
```

### Frontend:
```bash
VITE_ASGARDEO_CLIENT_ID=your_asgardeo_client_id
VITE_ASGARDEO_BASE_URL=your_asgardeo_base_url
VITE_API_BASE_URL=http://localhost:5000/api
```

## Deployment
```bash
The application can be deployed to platforms like Vercel, Netlify (frontend) and Heroku, Railway (backend). Ensure all environment variables are properly set in your deployment platform.
```

## Contributing
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

## License
```bash
This project is licensed under the MIT License.
```

## Contact Information
- Owner: Sivanathan Dilakshan
- Email: dilakshan.info@gmail.com