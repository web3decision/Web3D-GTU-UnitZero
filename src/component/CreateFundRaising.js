import React, { useState } from "react";
import contract from "../util/ethers";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateFundRaising({ refreshFundRaisings }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [dateTime, setDateTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const timestamp = Math.floor(new Date(dateTime).getTime() / 1000);

      toast.info("Transaction started...");

      const tx = await contract.createFundRaising(
        title,
        description,
        ethers.utils.parseEther(target),
        timestamp
      );

      toast.info(
        <a
          href={`https://explorer-testnet.unit0.dev/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Transaction on Unit0 Explorer
        </a>
      );

      await tx.wait();

      toast.dismiss();
      toast.success("Fundraising campaign created successfully!");
      refreshFundRaisings();
    } catch (error) {
      console.error("Error creating fundraising:", error);
      toast.dismiss();
      toast.error("Transaction failed!");
    }
  };

  return (
    <div className="create-fund-raising">
      <h2>Create Fundraising Campaign</h2>
      <form onSubmit={handleSubmit} className="fund-raising-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Target (UNIT0)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="form-input"
        />
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="submit-button">
          Create Campaign
        </button>
      </form>
    </div>
  );
}

export default CreateFundRaising;
