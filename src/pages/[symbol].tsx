import { useRouter } from "next/router";
import styles from "@/styles/DetailedView.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

const DetailedStock = () => {
  const router = useRouter();
  const { symbol, name } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [history, setHistory] = useState<any[] | undefined>();
  const price =
    data && data["Global Quote"] && data["Global Quote"]["05. price"];

  console.log(history, "history");

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

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={styles.detailedView}>
            <Link href="/">Back to search</Link>
            <h1>{name ? name : ""}</h1>
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

                  <Line type="monotone" dataKey="2. high" stroke="#8884d8" />
                  <Line type="monotone" dataKey="3. low" stroke="#82ca9d" />
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
