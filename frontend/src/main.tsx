import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import WebLayout from './components/layout/layout'
import LoginPage from './pages/login/login'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WebLayout />} >
        <Route path="/page/login" element={<LoginPage />} />

      </Route>

    </Routes>
  </BrowserRouter>,
)
