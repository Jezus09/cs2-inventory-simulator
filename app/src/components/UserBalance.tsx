import React, { useState } from 'react';
import axios from 'axios';

const UserBalance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const depositMoney = (userId: string) => {
    axios.post(`/users/${userId}/deposit`, { amount })
      .then(response => {
        alert('Deposit successful');
        setBalance(balance + amount);
        setAmount(0);
      })
      .catch(error => {
        alert('Deposit failed: ' + error.response.data);
      });
  };

  return (
    <div>
      <h1>User Balance</h1>
      <p>Current Balance: ${balance}</p>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        placeholder="Amount to deposit"
      />
      <button onClick={() => depositMoney('user-id')}>Deposit</button>
    </div>
  );
};

export default UserBalance;