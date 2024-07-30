import React from 'react'
import { Line ,Pie} from '@ant-design/charts';

function ChartComponent({sortedTransactions}) {
    const data = sortedTransactions.map((item)=>{
        return {date: item.date, amount: item.amount}
    })
    
    const spendingData = sortedTransactions.filter((transaction)=>{
      if(transaction.type == 'expense') {
        return { tag: transaction.tag, amount: transaction.amount };
      }
    });

    const finalSpendings = spendingData.reduce((acc, obj) => {
      let key = obj.tag;
      if(!acc[key]) {
        acc[key] = { tag: obj.tag, amount: obj.amount}
      } else {
        acc[key].amount += obj.amount
      }
      return acc;
    }, {})

    let newSpending = [
      { tag: 'food', amount: 0 },
      { tag: 'education', amount: 0 },
      { tag: 'office', amount: 0 },
    ]

    spendingData.forEach(element => {
      if(element.tag == 'food') {
        newSpending[0].amount += element.amount;
      } else if (element.tag == 'education') {
        newSpending[1].amount += element.amount
      } else{
        newSpending[2].amount += element.amount;
      }
    });

      const config = {
        data: data,
        width: 600,
        autoFit: false,
        height: 300,
        xField: 'date',
        yField: 'amount',
        point: {
          size: 5,
          shape: 'diamond',
        },
        label: {
          style: {
            fill: '#aaa',
          },
        },
      };
      const spendingConfig ={
        data: Object.values(finalSpendings),
        width:400,
        height: 300,
        angleField:'amount',
        colorField:'tag',
      }
    
    let chart;
    let pieChart
    return (
     /* <>
      <div className='shadow-lg ms-5 me-5'>
      <div className='flex justify-around p-5'>
        <div className='mb-5 font-medium'>
          <h1>Finance Statistic</h1>
        </div>
        <div>
          <h2 className='font-medium'>Your Spendings</h2>
        </div>
      </div>
    <div className='flex flex-wrap p-2 m-2 justify-between'>
      */
      <div className="charts-wrapper">
        <div>
          <h2>Your Analytics</h2>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </div>
      
      <div>
      <h2>Your Spendings</h2>
      <Pie 
        {...spendingConfig}
        onReady={(chartInstance) => (pieChart = chartInstance)}
      />
      </div>
    </div>
    
  )
    
}

export default ChartComponent