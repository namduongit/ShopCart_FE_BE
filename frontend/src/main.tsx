import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import WebLayout from './components/layout/layout'
import HomePage from './pages/home/home'
import LoginPage from './pages/login/login'
import RegisterPage from './pages/register/register'
import ProductPage from './pages/product/product'
import ProductDetailPage from './pages/product-detail/product-detail'
import { CartProvider } from './contexts/cart-context'

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/page/login" element={<LoginPage />} />
          <Route path="/page/register" element={<RegisterPage />} />
          <Route path="/page/product" element={<ProductPage />} />
          <Route path="/page/product/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
)
