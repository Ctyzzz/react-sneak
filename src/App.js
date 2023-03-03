import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";

import Home from "./pages/Home";
import Favourites from "./pages/Favourites";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const cartResponse = await axios.get("https://62f172ac25d9e8a2e7cc9e15.mockapi.io/cart");
      const favouritesResponse = await axios.get("https://62f172ac25d9e8a2e7cc9e15.mockapi.io/favorites");
      const itemsResponse = await axios.get("https://62f172ac25d9e8a2e7cc9e15.mockapi.io/items");  
      setCartItems(cartResponse.data);
      setFavourites(favouritesResponse.data);
      setItems(itemsResponse.data);
    }

    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))){
        axios.delete(`https://62f172ac25d9e8a2e7cc9e15.mockapi.io/cart/${obj.id}`);
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        axios.post("https://62f172ac25d9e8a2e7cc9e15.mockapi.io/cart", obj);
        setCartItems((prev) => [...prev, obj]);
      }
    } catch (error) {
      
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://62f172ac25d9e8a2e7cc9e15.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onAddToFavourite = async (obj) => {
    try {
      if (favourites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`https://62f172ac25d9e8a2e7cc9e15.mockapi.io/favorites/${obj.id}`);
        setFavourites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post(`https://62f172ac25d9e8a2e7cc9e15.mockapi.io/favorites/`, obj);
        setFavourites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в избранные')
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="wrapper clear">
      {cartOpened && (
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
        />
      )}
      <Header onClickCart={() => setCartOpened(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavourite={onAddToFavourite}
              onAddToCart={onAddToCart}
            />
          }
        />
        <Route
          path="/favourites"
          element={
            <Favourites
              items={favourites}
              onAddToFavourite={onAddToFavourite}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
