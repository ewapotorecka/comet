import { useEffect, useState } from "react";
import styles from "@/styles/Search.module.css";
import { useRouter } from "next/router";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&datatype=json&keywords=${searchInput}&apikey=CJ6AYDD0MRYTRYJ7`
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
      <div className={styles.resultsContainer}>
        {results &&
          results.map((el) => {
            console.log(el);
            return (
              <div
                key={el["1. symbol"]}
                className={styles.result}
                onClick={() => router.push(`/${el["1. symbol"]}`)}
              >
                <p>{el["2. name"]}</p>
                <p>{el["1. symbol"]}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
