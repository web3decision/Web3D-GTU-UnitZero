# Web3D-GTU-UnitZero
CrowdFunding DApp on Unit0 Blockchain

https://web3dunit0.vercel.app/ (online Dapp)


Features
•	Create a Campaign: Users can initiate a campaign with a title, description, target amount, and deadline.
•	View Active Campaigns: Users can explore ongoing campaigns.
•	Fund Campaigns: Users can contribute funds using cryptocurrency.
•	Manage Spending Requests: Campaign managers can request fund withdrawals.
•	Vote on Spending Requests: Contributors can approve or reject spending requests.
•	Withdraw Funds: Approved requests allow managers to withdraw funds.
•	Refund System: If a campaign fails, contributors can claim refunds.
Technologies Used
•	React.js: Frontend framework for UI development.
•	Ethers.js: Library for blockchain interactions.
•	Solidity: Smart contract language for Ethereum-compatible networks.
•	MetaMask: Wallet authentication and transaction handling.
•	Unit0 Blockchain Network: EVM-based blockchain for smart contract deployment.
Setup Instructions
If You Are Not a Developer ☹
1.	Add Unit0 Network to MetaMask (https://rpc-testnet.unit0.dev and Chain ID 88817).
2.	Request Some UNIT0 Tokens from the faucet: https://faucet-testnet.unit0.dev/
3.	Visit the Web3D Crowdfunding App: https://web3dunit0.vercel.app/
4.	Connect Your Wallet to the DApp.
5.	Explore and Interact with Campaigns.
If You Are a Developer 😊
1. Prerequisites
Ensure the following are installed:
•	Node.js (Latest LTS version)
•	MetaMask browser extension
•	Unit0 Blockchain Network added to MetaMask
2. Clone the Repository
git clone https://github.com/web3decision/Web3D-GTU-UnitZero.git
3. Install Dependencies
npm install
4. Deploy Smart Contract
•	Deploy the Solidity smart contract on the Unit0 blockchain using Remix IDE or another deployment tool.
•	Copy the deployed contract address and ABI.
•	Update util/ethers.js with the contract details.
•	Note: util/ethers.js is already updated; no changes are needed unless required.
5. Start the Application
npm start
Visit http://localhost:3000 in your browser.
Application Flow
1. Home Page
•	Displays active crowdfunding campaigns.
•	Shows the connected wallet address.
•	Allows users to navigate to campaign details.
2. Creating a Campaign
•	Users input Title, Description, Target (UNIT0), and Deadline.
•	The campaign is created via a smart contract.
•	The campaign list updates dynamically.
3. Viewing Campaigns
•	Lists all active campaigns with details.
•	Users can click on a campaign for more information.
4. Campaign Details
A detailed page where users can interact with a campaign based on their roles.
Displayed Information
•	Title & Description: Name and purpose of the campaign.
•	Target Amount: Goal set by the campaign manager.
•	Raised Amount: Total contributions received so far.
•	Manager Address: Ethereum address of the campaign creator.
•	Deadline: The campaign's expiration date.
User Interactions
•	Contribute to the Campaign: Users can donate funds.
•	View Spending Requests: Displays all spending requests created by the manager.
•	Vote on Requests: Contributors can approve or reject spending requests.
•	Withdraw Funds (Manager Only): If a spending request gets enough approvals, the manager can withdraw the requested amount.
•	Refund (If Campaign Fails): If the campaign does not meet its funding goal, contributors can claim refunds.
Conditions
Conditions to Withdraw Funds (Manager)
•	The deadline must have passed.
•	The target amount must be reached.
•	Funds must not have been withdrawn before.
•	Refunds must not have been activated.
Conditions to Enable Refunds (Manager)
•	The deadline must have passed.
•	The target was not reached.
•	Funds have not been withdrawn.
•	Refund activation has not already occurred.
Conditions to Withdraw Refunds (Contributor)
•	The manager has enabled refunds.
•	The contributor has contributed.
Troubleshooting
•	MetaMask Not Detected? Ensure it is installed and unlocked.
•	Smart Contract Calls Failing? Check if your wallet is connected to the correct Unit0 blockchain network.
•	Funds Not Updating? Refresh the page or check the blockchain explorer.
Contact
For questions, reach out to:
•	stopal@gtu.edu.tr
•	caglaozatar@gtu.edu.tr
•	d.ergul2020@gtu.edu.tr
Telegram: t.me/selcuktopal

