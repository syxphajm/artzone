import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import About from "./pages/about"
import Contact from "./pages/contact"
import Artworks from "./pages/artworks"
import ArtworkDetail from "./pages/artwork-detail"
import Categories from "./pages/categories"
import CategoryDetail from "./pages/category-detail"
import Artists from "./pages/artists"
import ArtistDetail from "./pages/artist-detail"
import Login from "./pages/login"
import Register from "./pages/register"
import Cart from "./pages/cart"
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/artworks/:id" element={<ArtworkDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>

  )
}

export default App

