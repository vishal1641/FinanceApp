import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Cards from "../components/cards";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import moment from "moment";
import { addDoc, query, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/charts";
import NoTransactions from "../components/NoTransaction";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount), // Ensure this is a number
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many = false) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount); // Ensure amount is a number
      console.log("Transaction Amount:", amount); // Debugging
      if (transaction.type === "income") {
        incomeTotal += amount;
      } else if (transaction.type === "expense") {
        expensesTotal += amount;
      }
    });

    console.log("Total Income:", incomeTotal); // Debugging
    console.log("Total Expenses:", expensesTotal); // Debugging

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        const transactionData = doc.data();
        // Ensure amount is parsed as a float
        transactionData.amount = parseFloat(transactionData.amount);
        transactionsArray.push(transactionData);
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <>
      <div>
        <Header />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Cards
              income={income}
              expense={expense}
              totalBalance={totalBalance}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal}
            />
            {transactions && transactions.length != 0 ? (
              <ChartComponent sortedTransactions={sortedTransactions} />
            ) : (
              <>
                <NoTransactions />
              </>
            )}
            <AddExpenseModal
              isExpenseModalVisible={isExpenseModalVisible}
              handleExpenseCancel={handleExpenseCancel}
              onFinish={onFinish}
            />
            <AddIncomeModal
              isIncomeModalVisible={isIncomeModalVisible}
              handleIncomeCancel={handleIncomeCancel}
              onFinish={onFinish}
            />
            <TransactionsTable
              transactions={transactions}
              addTransaction={addTransaction}
              fetchTransactions={fetchTransactions}
            />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
