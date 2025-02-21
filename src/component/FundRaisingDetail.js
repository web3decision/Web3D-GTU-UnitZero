import React, { useState, useEffect } from "react";
import contract from "../util/ethers";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FundRaisingDetail({ fundId, account, refreshFundRaisings }) {
  const [fund, setFund] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [requests, setRequests] = useState([]);
  const [hasContributed, setHasContributed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch fund details and requests
  useEffect(() => {
    async function loadFund() {
      setLoading(true);
      try {
        const fundDetails = await contract.getFundDetails(fundId);
        const formattedFund = {
          title: fundDetails[0],
          description: fundDetails[1],
          target: fundDetails[2],
          raisedAmount: fundDetails[3],
          deadline: fundDetails[4],
          completed: fundDetails[5],
          manager: fundDetails[6],
          noOfContributors: fundDetails[7],
          refunded: fundDetails[9],
          numRequests: fundDetails[8],
        };
        setFund(formattedFund);

        const contributionStatus = await contract.getContribution(
          fundId,
          account
        );
        setHasContributed(contributionStatus.toNumber() > 0);

        const fetchedRequests = [];
        for (let i = 0; i < formattedFund.numRequests; i++) {
          const request = await contract.getRequestDetails(fundId, i);
          fetchedRequests.push(request);
        }
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error loading fund:", error);
        toast.error("Failed to load fund details.");
      } finally {
        setLoading(false);
      }
    }

    loadFund();
  }, [fundId, account]);

  const currentTime = Math.floor(Date.now() / 1000);
  const isDeadlinePassed =
    fund && fund.deadline ? fund.deadline.toNumber() < currentTime : false;

  // const isDeadlinePassed = fund && Date.now() / 1000 > fund.deadline.toNumber();

  // Handle contribution
  const contribute = async () => {
    if (!contributionAmount) {
      toast.error("Please enter a contribution amount.");
      return;
    }

    toast.dismiss();
    const toastId = toast.loading("Processing...");

    try {
      const tx = await contract.contribute(fundId, {
        value: ethers.utils.parseEther(contributionAmount),
      });
      await tx.wait();

      toast.update(toastId, {
        render: "Contribution successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();

      refreshFundRaisings();
    } catch (error) {
      console.error("Error contributing:", error);

      toast.update(toastId, {
        render: "Failed to contribute",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();
    }
  };

  // Handle creating a spending request
  const createRequest = async () => {
    if (!requestDescription || !requestValue || !requestRecipient) {
      toast.error("Please fill all fields.");
      return;
    }

    toast.dismiss();
    const toastId = toast.loading("Processing...");

    try {
      const tx = await contract.createRequest(
        fundId,
        requestDescription,
        requestRecipient,
        ethers.utils.parseEther(requestValue)
      );

      await tx.wait();
      toast.update(toastId, {
        render: "Spending request created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();

      refreshFundRaisings();
    } catch (error) {
      console.error("Error creating request:", error);
      toast.update(toastId, {
        render: `Failed to create spending request: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();
    }
  };

  // Handle voting for a request
  const voteRequest = async (requestId) => {
    const toastId = toast.loading("Processing vote...");

    try {
      const tx = await contract.voteRequest(fundId, requestId);
      await tx.wait();

      toast.update(toastId, {
        render: "Vote submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      toast.dismiss();

      refreshFundRaisings();
    } catch (error) {
      console.error("Error voting:", error);
      toast.update(toastId, {
        render: `Failed to vote: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();
    }
  };

  // Handle withdrawing funds (manager only)
  const withdrawFunds = async () => {
    try {
      const tx = await contract.withdrawFunds(fundId);
      await tx.wait();
      toast.success("Funds withdrawn successfully!");
      refreshFundRaisings();
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error(`Failed to withdraw funds: ${error.message}`);
    }
  };

  // Handle enabling refunds (manager only)
  const enableRefunds = async () => {
    try {
      const tx = await contract.enableRefunds(fundId);
      await tx.wait();
      toast.success("Refunds enabled successfully!");
      refreshFundRaisings();
    } catch (error) {
      console.error("Error enabling refunds:", error);
      toast.error(`Failed to enable refunds: ${error.message}`);
    }
  };

  // Handle making payment for a request (manager only)
  const makePayment = async (requestId) => {
    const toastId = toast.loading("Processing payment...");

    try {
      const tx = await contract.makePayment(fundId, requestId);
      await tx.wait();

      toast.update(toastId, {
        render: "Payment made successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      toast.dismiss();

      refreshFundRaisings();
    } catch (error) {
      console.error("Error making payment:", error);
      toast.update(toastId, {
        render: `Failed to make payment: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      toast.dismiss();
    }
  };

  // Handle withdrawing refund (contributor only)
  const withdrawRefund = async () => {
    try {
      const tx = await contract.withdrawRefund(fundId);
      await tx.wait();
      toast.success("Refund withdrawn successfully!");
      refreshFundRaisings();
    } catch (error) {
      console.error("Error withdrawing refund:", error);
      toast.error(`Failed to withdraw refund: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!fund) {
    return <div className="loading">Fund not found.</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="fund-raising-detail">
        <h2>{fund.title}</h2>
        <p className="description">{fund.description}</p>

        {/* Fund Stats */}
        <div className="fund-stats">
          <div className="stat">
            <span>Target</span>
            <span>{ethers.utils.formatEther(fund.target)} UNIT0</span>
          </div>
          <div className="stat">
            <span>Raised</span>
            <span>{ethers.utils.formatEther(fund.raisedAmount)} UNIT0</span>
          </div>
          <div className="stat">
            <span>Deadline</span>
            <span>
              {new Date(fund.deadline.toNumber() * 1000).toLocaleString()}
            </span>
          </div>
          <div className="stat">
            <span>Manager</span>
            <span>
              {fund.manager
                ? `${fund.manager.slice(0, 5)}.....${fund.manager.slice(-5)}`
                : ""}
            </span>
          </div>
          <div className="stat">
            <span>Contributors</span>
            <span>{fund.noOfContributors?.toNumber()}</span>
          </div>
          <div className="stat">
            <span>Status</span>
            <span>{fund.completed ? "Completed" : "Active"}</span>
          </div>
        </div>

        <div className="action-section">
          <h3>Contribute to this Campaign</h3>
          {isDeadlinePassed ? (
            <p className="error-message">
              Contributions are closed as the deadline has passed.
            </p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Amount (UNIT0)"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="form-input"
              />
              <button onClick={contribute} className="action-button">
                Contribute
              </button>
            </>
          )}
        </div>

        <div className="action-section">
          <h3>Create a Spending Request</h3>
          <input
            type="text"
            placeholder="Description"
            value={requestDescription}
            onChange={(e) => setRequestDescription(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Value (UNIT0)"
            value={requestValue}
            onChange={(e) => setRequestValue(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Recipient Address"
            value={requestRecipient}
            onChange={(e) => setRequestRecipient(e.target.value)}
            className="form-input"
          />
          <button onClick={createRequest} className="action-button">
            Create Request
          </button>
        </div>

        <div className="action-section">
          <h3>Spending Requests</h3>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <div key={index} className="request-item">
                <div className="request-details">
                  <p>
                    Request {index + 1}: {request[0]}
                  </p>
                  <p>Amount: {ethers.utils.formatEther(request[2])} UNIT0</p>
                  <p>Recipient: {request[1]}</p>
                  <p>Votes: {request[4]?.toNumber()}</p>
                  <p>Completed: {request[3] ? "Yes" : "No"}</p>
                </div>
                <div className="request-actions">
                  {hasContributed && !request[3] && (
                    <button
                      onClick={() => voteRequest(index)}
                      className="action-button"
                    >
                      Vote
                    </button>
                  )}
                  {account.toLowerCase() === fund.manager.toLowerCase() && (
                    <button
                      onClick={() => makePayment(index)}
                      className="action-button"
                    >
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No spending requests yet.</p>
          )}
        </div>

        {/* Manager Actions Section */}
        {account.toLowerCase() === fund.manager.toLowerCase() && (
          <div className="action-section">
            <h3>Manager Actions</h3>
            <button onClick={withdrawFunds} className="action-button">
              Withdraw Funds
            </button>
            <button onClick={enableRefunds} className="action-button">
              Enable Refunds
            </button>
          </div>
        )}

        {/* Contributor Actions Section */}
        <div className="action-section">
          <h3>Contributor Actions</h3>
          <button onClick={withdrawRefund} className="action-button">
            Withdraw Refund
          </button>
        </div>
      </div>
    </>
  );
}

export default FundRaisingDetail;
