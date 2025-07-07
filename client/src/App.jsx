import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home'
import NotFound from './pages/NotFound';
import RootLayout from './layouts/RootLayout';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App