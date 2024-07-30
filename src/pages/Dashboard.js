import React, { useState,useEffect } from 'react'
import Header from "../components/Header";
import Cards from "../components/Cards";
import {Modal} from "antd";
import AddIncome from '../components/Modals/AddIncome'
import AddExpense from '../components/Modals/AddExpense'
import {auth, db} from "../firebase";
import {toast} from 'react-toastify'
import { addDoc,collection,getDocs, query,deleteDoc } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth'
import TransactionTable from "../components/TransactionTable"
import ChartComponent from "../components/Charts"
import NoTransaction from "../components/NoTransaction"
function Dashboard() {
  const [user] = useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
const [transactions, setTransactions] = useState([])
const [loading, setLoading] = useState(false)
const [currentBalance, setCurrentBalance] = useState(0)
const [totalIncome, setTotalIncome] = useState(0)
const [totalExpense, setTotalExpense] = useState(0)

const showExpenseModal = ()=>{
  setIsExpenseModalVisible(true)
}
const showIncomeModal = ()=>{
  setIsIncomeModalVisible(true)
}
const handleExpenseCancel = ()=>{
  setIsExpenseModalVisible(false)
}
const handleIncomeCancel = ()=>{ 
  setIsIncomeModalVisible(false)
}

useEffect(()=> {
  fetchTransactions()
},[user])

// Calculate the initial balance, income, and expenses
useEffect(() => {
  calculateBalance();
}, [transactions]);

const calculateBalance=()=>{
  let incomeTotal = 0
  let expenseTotal = 0


  transactions.forEach((transaction)=> {
      if(transaction.type === 'income'){
          incomeTotal +=transaction.amount
      } else {
          expenseTotal += transaction.amount
      }
  })

  setTotalIncome(incomeTotal)
  setTotalExpense(expenseTotal);
  setCurrentBalance(incomeTotal - expenseTotal);
}




async function fetchTransactions() {
  setLoading(true);
  if (user) {
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      transactionsArray.push(doc.data());
    });
    setTransactions(transactionsArray);
    console.log(transactions)
    toast.success("Transactions Fetched!");
  }
  setLoading(false);
}
const onFinish = (values, type) => {
  const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
        
      if(!many)toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance()
      
    } catch (e) {
      console.error("Error adding document: ", e);
      
      if(!many) toast.error("Couldn't add transaction");
    }
      
    }
    let sortedTransactions =  transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      } );

      async function reset() {
        try {
          // First, delete all transactions in the database
          const transactionCollectionRef = collection(db, `users/${user.uid}/transactions`);
          const querySnapshot = await getDocs(transactionCollectionRef);
          
          // Iterate through the documents and delete them one by one
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
      
          // After deleting the data in the database, reset the state variables
          setTransactions([]);
          setTotalIncome(0);
          setTotalExpense(0);
          setCurrentBalance(0);
      
          toast.success("Data reset successfully");
        } catch (error) {
          console.error("Error resetting data: ", error);
          toast.error("Couldn't reset data");
        }
      }

  return (
    <div>
      <Header/>
      {loading ? (<p>Loading..</p>): (
        <>
        <Cards
         totalIncome={totalIncome}
         totalExpense={totalExpense}
         currentBalance={currentBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal = {showIncomeModal}
      reset={reset}
      />
      {transactions.length!=0?<ChartComponent sortedTransactions={sortedTransactions}/>:(<NoTransaction/>)}
      <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionTable transactions={transactions}  addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        
        </>
      )
      }
      
    </div>
    
  )
}

export default Dashboard
