import styles from "@/styles/Search.module.css";
import { useRouter } from "next/router";

const StockList = ({ list }: { list: { symbol: string; name: string }[] }) => {
  const router = useRouter();

  return (
    <div className={styles.resultsContainer}>
      {list &&
        list.map((el) => {
          return (
            <div
              key={el.symbol}
              className={styles.result}
              onClick={() =>
                router.push({
                  pathname: `/[symbol]`,
                  query: { symbol: el["symbol"], name: el.name },
                })
              }
            >
              <div>
                <p className={styles.name}>{el.name}</p>
                <p>Symbol: {el.symbol}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default StockList;
