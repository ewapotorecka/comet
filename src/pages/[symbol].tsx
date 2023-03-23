import { useRouter } from "next/router";
import styles from "@/styles/DetailedView.module.css";
import React, { useEffect, useState } from "react";
import Favorite from "../assets/favorite.svg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Nav from "@/components/Nav";
import { prepareHistoryData } from "@/helpers/prepareHistoryData";
import { toggleFavorites } from "@/helpers/toggleFavorites";

const apikey = process.env.NEXT_PUBLIC_API_KEY;

const DetailedStock = () => {
  const router = useRouter();
  const { symbol, name } = router.query as { symbol: string; name: string };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [history, setHistory] = useState<any[] | undefined>();
  const price =
    data && data["Global Quote"] && data["Global Quote"]["05. price"];
  const [isFavorite, setFavorite] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apikey}`,
        { next: { revalidate: 120 } }
      );

      const historyData = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apikey}`,
        { next: { revalidate: 120 } }
      );
      const data = await responseData.json();

      const history = await historyData.json();
      const chartHistoryData = history[`Time Series (Daily)`]
        ? prepareHistoryData(
            history[`Time Series (Daily)`],
            Object.keys(history[`Time Series (Daily)`])
          )
        : undefined;

      setData(data);

      setHistory(chartHistoryData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const favorites = localStorage.getItem("favorites");

    if (!favorites) {
      setFavorite(false);
    } else {
      if (
        JSON.parse(favorites).findIndex(
          (el: { symbol: string; name: string }) => el.symbol === symbol
        ) >= 0
      ) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  }, [isFavorite]);

  return (
    <>
      <Nav />
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <>
          <div className={styles.detailedView}>
            <div className={styles.header}>
              <h1>{name ? name : ""}</h1>
              <button
                className={styles.favorites}
                onClick={() => {
                  toggleFavorites({ symbol, name });
                  setFavorite(!isFavorite);
                }}
              >
                <Favorite
                  className={
                    isFavorite
                      ? styles.favoritesIconActive
                      : styles.favoritesIcon
                  }
                />
              </button>
            </div>
            <p>Symbol: {symbol ? symbol : ""}</p>
            <p>
              Current price:{" "}
              {price
                ? price
                : "API calls number restriction - please reload page in 60s to see current price"}
            </p>
          </div>
          {history && history?.length > 0 ? (
            <div className={styles.chart}>
              <ResponsiveContainer width="90%" height="100%" minHeight={400}>
                <LineChart
                  width={500}
                  height={300}
                  data={history}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin", "dataMax"]} />
                  <Tooltip />
                  <Legend verticalAlign="top" />

                  <Line type="monotone" dataKey="high" stroke="#A5BE00" />
                  <Line type="monotone" dataKey="low" stroke="#ED7D3A" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.info}>
              <p>
                API calls number restriction - please reload page in 60s to see
                the history chart
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DetailedStock;
