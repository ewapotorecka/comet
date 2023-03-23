import styles from "@/styles/Search.module.css";
import { useRouter } from "next/router";

const StockList = ({
  list,
}: {
  list: { "1. symbol": string; "2. name": string }[];
}) => {
  const router = useRouter();

  return (
    <div className={styles.resultsContainer}>
      {list &&
        list.map((el) => {
          return (
            <div
              key={el["1. symbol"]}
              className={styles.result}
              onClick={() =>
                router.push({
                  pathname: `/[symbol]`,
                  query: { symbol: el["1. symbol"], name: el["2. name"] },
                })
              }
            >
              <div>
                <p className={styles.name}>{el["2. name"]}</p>
                <p>Symbol: {el["1. symbol"]}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default StockList;
