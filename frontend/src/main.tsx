import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import WebLayout from './components/layout/layout'
import HomePage from './pages/home/home'
import LoginPage from './pages/login/login'
import RegisterPage from './pages/register/register'
import ProductPage from './pages/product/product'
import ProductDetailPage from './pages/product-detail/product-detail'
import CartPage from './pages/cart/cart'
import CheckoutPage from './pages/checkout/checkout'
import OrdersPage from './pages/orders/orders'
import OrderDetailPage from './pages/order-detail/order-detail'
import { CartProvider } from './contexts/cart-context'
import { NotificateProvider } from './contexts/notificate-context'
import { AuthProvider } from './contexts/auth-context'

createRoot(document.getElementById('root')!).render(
  <NotificateProvider>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WebLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/page/login" element={<LoginPage />} />
              <Route path="/page/register" element={<RegisterPage />} />
              <Route path="/page/product" element={<ProductPage />} />
              <Route path="/page/product/:id" element={<ProductDetailPage />} />
              <Route path="/page/cart" element={<CartPage />} />
              <Route path="/page/checkout" element={<CheckoutPage />} />
              <Route path="/page/orders" element={<OrdersPage />} />
              <Route path="/page/orders/:orderId" element={<OrderDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </NotificateProvider>
)
