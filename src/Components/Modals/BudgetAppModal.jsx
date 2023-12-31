import React, { useState, useEffect } from 'react';
import './BudgetAppModal.css'
import {formatCurrency} from '../../Assets/CurrencyFormatter';

export function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function BudgetAppModal({ user }) {
    const [expenses, setExpenses] = useState(() => {
      const storedExpenses = localStorage.getItem(`expenses${user.username}`);
      return storedExpenses ? JSON.parse(storedExpenses) : [];
    });
  
    const [editingId, setEditingId] = useState(null);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  
    useEffect(() => {
       localStorage.setItem(`expenses${user.username}`, JSON.stringify(expenses));
    }, [expenses]);
  
    const handleAddExpense = () => {
      if (newExpense.description.trim() === '' || newExpense.amount.trim() === '') {
        return;
      }
  
      const newExpenseItem = {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount).toFixed(2), 
      };
  
      setExpenses([...expenses, newExpenseItem]);
      setNewExpense({ description: '', amount: '' });
    };
  
    const handleEdit = (id) => {
      setEditingId(id);
    };
  
    const handleSave = () => {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editingId ? { ...expense, ...newExpense, amount: parseFloat(newExpense.amount).toFixed(2) } : expense
      );
  
      setExpenses(updatedExpenses);
      setEditingId(null);
    };
  
    const handleDelete = (id) => {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(updatedExpenses);
    };
  
    const handleClearExpensesStorage = () => {
      localStorage.removeItem(`expenses${user.username}`);
      setExpenses([]);
    };
  
    const calculateTotalAmount = () => {
      return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
    };
  
    const formattedBalance = formatCurrency(user.balance);
  
    const lessExpensesBal = () => {
      return formatCurrency(user.balance - calculateTotalAmount());
    };

    function numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    return (
      <div className="budgetApp-modal">
        <h1>Budget App</h1>
        <h2>Hello, {user.username}!</h2>
        <div className="balance-window">
          <p>Available Balance: &nbsp;
            <input
              className="balance-input"
              type="text"
              placeholder="balance"
              value={formattedBalance}
            />
          </p>
          <p>Projected Balance: &nbsp;
          <input
              className={`balance-input ${(user.balance - calculateTotalAmount())<0 ? 'balance-negative':''}`}
              type="text"
              placeholder=""
              value={lessExpensesBal()}
            /> 
          </p>
        </div>
        <div>
          <input
            className="budgetApp-input"
            type="text"
            placeholder="Expense"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <input
            className="budgetApp-input"
            id="amount-expense"
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <button className="budgetApp-btn" onClick={handleAddExpense}>Add Expense</button>
        </div>
        <div className="expenses-table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th className="table-column">Description</th>
                <th className="table-column">Amount</th>
                <th className="table-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td id="expense-td">
                    {editingId === expense.id ? (
                      <input
                        type="text"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      />
                    ) : (
                      expense.description
                    )}
                  </td>
                  <td>
                    {editingId === expense.id ? (
                      <input
                        type="text"
                        value={numberWithCommas(newExpense.amount)}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                    ) : (
                      numberWithCommas(expense.amount)
                    )}
                  </td>
                  <td id="edit-delete-td">
                    {editingId === expense.id ? (
                      <button onClick={handleSave}>Save</button>
                    ) : (
                      <>
                        <button className="edit-delete-btn" onClick={() => handleEdit(expense.id)}><i class="fa-solid fa-pen-to-square"></i></button>
                        <button className="edit-delete-btn" onClick={() => handleDelete(expense.id)}><i class="fa-solid fa-trash"></i></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="total-expenses">Total Expenses: {formatCurrency(calculateTotalAmount())}</p>
        <br></br>
        <button className="budgetApp-btn" onClick={handleClearExpensesStorage}>Clear Expenses List</button>
      </div>
    );
  }
  
  export default BudgetAppModal;