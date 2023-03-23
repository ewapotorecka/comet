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

const apikey = process.env.NEXT_PUBLIC_API_KEY;

const prepareHistoryData = (history: any, dates: any) => {
  if (!history || !dates) {
    return;
  }
  const chartData = [];

  for (const day of dates) {
    const dayData = { ...history[day], date: day };

    chartData.push(dayData);
  }

  return chartData;
};

const toggleFavorites = ({
  symbol,
  name,
}: {
  symbol: string;
  name: string;
}) => {
  const favorites = localStorage.getItem("favorites");

  if (favorites) {
    const favoritesToUpdate = JSON.parse(favorites);

    if (
      favoritesToUpdate.findIndex(
        (el: { "1. symbol": string; "2. name": string }) =>
          el["1. symbol"] === symbol
      ) >= 0
    ) {
      favoritesToUpdate.splice(
        favoritesToUpdate.findIndex(
          (el: { "1. symbol": string; "2. name": string }) =>
            el["1. symbol"] === symbol
        )
      );
      localStorage.setItem("favorites", JSON.stringify(favoritesToUpdate));
    } else {
      favoritesToUpdate.push({ "1. symbol": symbol, "2. name": name });
      localStorage.setItem("favorites", JSON.stringify(favoritesToUpdate));
    }
  } else {
    localStorage.setItem(
      "favorites",
      JSON.stringify([{ "1. symbol": symbol, "2. name": name }])
    );
  }
};

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
          (el: { "1. symbol": string; "2. name": string }) =>
            el["1. symbol"] === symbol
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
            <p>Current price: {price ? price : ""}</p>
          </div>
          {history && (
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

                  <Line type="monotone" dataKey="2. high" stroke="#A5BE00" />
                  <Line type="monotone" dataKey="3. low" stroke="#ED7D3A" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DetailedStock;
