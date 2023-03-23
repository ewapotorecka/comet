import Nav from "@/components/Nav";
import StockList from "@/components/StockList";

import { useEffect, useState } from "react";
import styles from "@/styles/Favorites.module.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div>
      <Nav />
      <div className={styles.favoritesWrapper}>
        <h1 className={styles.title}>Favorite stocks</h1>
        {favorites.length > 0 ? (
          <StockList list={favorites} />
        ) : (
          <p>No favorites saved</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
