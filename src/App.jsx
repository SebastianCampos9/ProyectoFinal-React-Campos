import React from 'react';
import ItemDetailContainer from "./components/ItemDetailContainer/ItemDetailContainer";
import ItemListContainer from "./components/ItemListContainer/ItemListContainer";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import NavBar from "./components/NavBar/NavBar";
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <CartProvider>
          <div className="App"> 
            <NavBar title="LIP" imageSrc={"https://scontent.fepa8-1.fna.fbcdn.net/v/t39.30808-6/305480084_419946430123891_6441192320849204842_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YpRwr-f1p2oQ7kNvgGbVBPU&_nc_ht=scontent.fepa8-1.fna&oh=00_AYDjLvz1jVdDpZWaTmZ7_VxeCstj9nP3yDhueRY3gvOQsg&oe=66BD6EE3"} />
            <Routes>
              <Route exact path="/" element={<ItemListContainer />} />
              <Route exact path="/category/:categoryId" element={<ItemListContainer />} />
              <Route exact path="/detail/:productId" element={<ItemDetailContainer />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route path="*" element={<h1>:404 Not found</h1>} />
            </Routes>
          </div>
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
