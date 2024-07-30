import React from 'react'
import "./styles.css";
import {Row, Card} from "antd";
import Button from "../Button";
function Cards({
  currentBalance, totalIncome, totalExpense,showExpenseModal,showIncomeModal,reset}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" bordered={true}>
          <h2>Current Balance</h2>
          <p>{currentBalance}</p>
          <div class="btn btn-blue" onClick={reset}>
            Reset Balance
            </div>
        </Card>
        <Card className="my-card" bordered={true}>
          <h2>Total Income</h2>
          <p>{totalIncome}</p>
          <div class="btn btn-blue" onClick={showIncomeModal}>
            Add Income
            </div>
        </Card>
        <Card className="my-card" bordered={true}>
          <h2>Total Expenses</h2>
          <p>{totalExpense}</p>
          <div class="btn btn-blue" onClick={showExpenseModal}>
           Add Expense
            </div>
        </Card>
      </Row>

    </div>
  )
}

export default Cards