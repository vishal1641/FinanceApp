import React from "react";
import { Line, Pie } from "@ant-design/charts";
import "./styles.css";

const ChartComponent = ({ sortedTransactions }) => {
  // Ensure sortedTransactions is an array
  const transactionsArray = Array.isArray(sortedTransactions)
    ? sortedTransactions
    : [];

  const data = transactionsArray.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const spendingData = transactionsArray.filter(
    (transaction) => transaction.type === "expense"
  );

  const finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const lineConfig = {
    data: data,
    height: 400,
    xField: "date",
    yField: "amount",
    point: {
      size: 5,
      shape: "circle",
    },
  };

  const pieConfig = {
    data: Object.values(finalSpendings),
    height: 400,
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div className="charts-wrapper">
      <div>
        <h2>Your Analytics</h2>
        <Line {...lineConfig} />
      </div>
      <div>
        <h2>Your Spendings</h2>
        <Pie {...pieConfig} />
      </div>
    </div>
  );
};

export default ChartComponent;
