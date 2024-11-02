import React from "react";
import { Table, Select, Radio } from "antd";
import { useState } from "react";
import { parse } from "papaparse";
import { unparse } from "papaparse";
import { toast } from "react-toastify";
import searchImg from "../../assets/search.svg";
import "./styles.css";

const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
}) => {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      //   responsive: ["md"], // Hide on small screens
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      //   responsive: ["lg"], // Hide on medium and small screens
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (item.type ? item.type.includes(typeFilter) : false)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    var csv = unparse({
      fields: ["name", "type", "tag", "amount", "date"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.value = null; // Reset the input value
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="input-flex">
          <img src={searchImg} width="16" alt="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="table-actions">
        <h2> My Transactions</h2>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Date</Radio.Button>
          <Radio.Button value="amount">Amount</Radio.Button>
        </Radio.Group>
        <div className="action-buttons">
          <button className="btn" onClick={exportCSV}>
            Export to CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <Table
        dataSource={sortedTransactions}
        columns={columns}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }} // Allow horizontal scrolling on small screens
      />
    </div>
  );
};

export default TransactionsTable;
