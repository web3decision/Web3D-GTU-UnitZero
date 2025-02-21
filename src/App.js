import React, { useEffect, useState } from "react";
import contract from "./util/ethers";
import FundRaisingList from "./component/FundRaisingList";
import FundRaisingDetail from "./component/FundRaisingDetail";
import CreateFundRaising from "./component/CreateFundRaising";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [account, setAccount] = useState("");
  const [fundRaisings, setFundRaisings] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    console.log(contract);
    async function loadAccount() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }

    async function loadFundRaisings() {
      const fundCount = await contract.fundCount();
      console.log(fundCount.toNumber());
      const fundRaisings = [];

      for (let i = 0; i < fundCount; i++) {
        const fund = await contract.getFundDetails(i);
        fundRaisings.push({ ...fund, id: i });
      }

      setFundRaisings(fundRaisings);
    }

    loadAccount();
    loadFundRaisings();
  }, []);

  const selectFund = (fundId) => {
    setSelectedFund(fundId);
  };

  console.log(fundRaisings);

  const refreshFundRaisings = async () => {
    const fundCount = await contract.fundCount();
    const fundRaisings = [];

    for (let i = 0; i < fundCount; i++) {
      const fund = await contract.getFundDetails(i);
      fundRaisings.push({ ...fund, id: i });
    }

    setFundRaisings(fundRaisings);
  };

  return (
    <div>
      <div className="menu">
        <img
          src="img/logo.png"
          alt="crowdFunding"
          style={{ width: "500px", marginBottom: "2rem" }}
        />
        <div
          className="menu-items"
          style={{ width: "100%", position: "relative" }}
        >
          <h1 style={{ textAlign: "center" }}>
            Web3d CrowdFunding DApp in UNIT0
          </h1>
          <p
            style={{
              textAlign: "right",
              marginRight: "3rem",
              position: "absolute",
              top: "0",
              right: "0",
            }}
          >
            Account:{" "}
            {account ? `${account.slice(0, 5)}.....${account.slice(-5)}` : ""}
          </p>
        </div>
      </div>

      <CreateFundRaising refreshFundRaisings={refreshFundRaisings} />
      <FundRaisingList fundRaisings={fundRaisings} selectFund={selectFund} />
      {selectedFund !== null && (
        <FundRaisingDetail
          fundId={selectedFund}
          account={account}
          refreshFundRaisings={refreshFundRaisings}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
