import React from "react";

function FundRaisingList({ fundRaisings, selectFund }) {
  return (
    <div className="fund-raising-list">
      <h2>Fund Raisings</h2>
      <ul>
        {fundRaisings.map((fund, index) => (
          <li key={index} onClick={() => selectFund(fund.id)} className="fund-item">
            <div className="fund-content">
              <h3>{fund[0]}</h3>
              <p>{fund[1]}</p>
            </div>
            <span className="fund-arrow">→</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FundRaisingList;