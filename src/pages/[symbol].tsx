import { useRouter } from "next/router";
import styles from "@/styles/DetailedView.module.css";
import Link from "next/link";

const DetailedStock = ({ data, detailedInfo }) => {
  console.log(data, detailedInfo);
  const router = useRouter();
  const price = data["Global Quote"] && data["Global Quote"]["05. price"];
  const name = detailedInfo && detailedInfo[`2. name`];
  const symbol = detailedInfo && detailedInfo[`1. symbol`];

  return (
    <div className={styles.detailedView}>
      <Link href="/">Back to search</Link>
      <h1>{name ? name : ""}</h1>
      <p>{symbol ? symbol : ""}</p>
      <p>{price ? price : ""}</p>
    </div>
  );
};

export async function getServerSideProps({
  query,
}: {
  query: { symbol: string };
}) {
  const { symbol } = query;
  const responseData = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=CJ6AYDD0MRYTRYJ7`
  );
  const responseSymbol = await fetch(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&datatype=json&keywords=${symbol}&apikey=CJ6AYDD0MRYTRYJ7`
  );
  console.log(responseData);
  const data = await responseData.json();
  const symbols = await responseSymbol.json();
  const detailedInfo = symbols.bestMatches?.find(
    (el) => el["1. symbol"] === symbol
  );

  return {
    props: { data, detailedInfo },
  };
}

export default DetailedStock;
