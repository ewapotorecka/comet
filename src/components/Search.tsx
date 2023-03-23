import { useEffect, useState } from "react";
import styles from "@/styles/Search.module.css";
import StockList from "@/components/StockList";
const apikey = process.env.NEXT_PUBLIC_API_KEY;

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&datatype=json&keywords=${searchInput}&apikey=${apikey}`,
        { next: { revalidate: 120 } }
      );
      const data = await response.json();
      setResults(data.bestMatches);
    };

    fetchData();
  }, [searchInput]);

  return (
    <div className={styles.searchContainer}>
      <h1>STOCK QUOTE SEARCH</h1>
      <p>Type in stock symbol or name</p>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={styles.searchInput}
      />
      <StockList list={results} />
    </div>
  );
};

export default Search;
