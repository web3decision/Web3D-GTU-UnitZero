// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract CrowdFunding {
    struct FundRaising {
        string title;
        string description;
        uint target;
        uint raisedAmount;
        uint deadline;
        bool completed;
        address manager;
        uint noOfContributors;
        uint numRequests;
        mapping(address => uint) contributors;
        mapping(uint => Request) requests;
        bool refunded;
    }

    struct Request {
        string description;
        address payable recipient;
        uint value;
        bool completed;
        uint noOfVoters;
        mapping(address => bool) voters;
    }

    mapping(uint => FundRaising) public fundRaisings;
    uint public fundCount;

    modifier onlyManager(uint _fundId) {
        require(
            msg.sender == fundRaisings[_fundId].manager,
            "Only manager can call this function"
        );
        _;
    }

    modifier onlyContributor(uint _fundId) {
        require(
            fundRaisings[_fundId].contributors[msg.sender] > 0,
            "You must be a contributor"
        );
        _;
    }

    function createFundRaising(
        string memory _title,
        string memory _description,
        uint _target,
        uint _deadline
    ) public {
        FundRaising storage newFund = fundRaisings[fundCount];
        newFund.title = _title;
        newFund.description = _description;
        newFund.target = _target;
        // newFund.deadline = block.timestamp + _deadline;
        newFund.deadline = _deadline;
        newFund.raisedAmount = 0;
        newFund.completed = false;
        newFund.manager = msg.sender;
        newFund.noOfContributors = 0;
        newFund.numRequests = 0;
        newFund.refunded = false;
        fundCount++;
    }

    function contribute(uint _fundId) public payable {
        require(
            block.timestamp < fundRaisings[_fundId].deadline,
            "Deadline has passed"
        );
        require(msg.value > 0, "Contribution must be greater than 0");

        FundRaising storage fund = fundRaisings[_fundId];
        require(!fund.refunded, "Funds have been refunded");

        if (fund.contributors[msg.sender] == 0) {
            fund.noOfContributors++;
        }
        fund.contributors[msg.sender] += msg.value;
        fund.raisedAmount += msg.value;
    }

    function getFundDetails(
        uint _fundId
    )
        public
        view
        returns (
            string memory,
            string memory,
            uint,
            uint,
            uint,
            bool,
            address,
            uint,
            uint,
            bool
        )
    {
        FundRaising storage fund = fundRaisings[_fundId];
        return (
            fund.title,
            fund.description,
            fund.target,
            fund.raisedAmount,
            fund.deadline,
            fund.completed,
            fund.manager,
            fund.noOfContributors,
            fund.numRequests,
            fund.refunded
        );
    }

    function hasVoted(
        uint _fundId,
        uint _requestNo,
        address _voter
    ) public view returns (bool) {
        return fundRaisings[_fundId].requests[_requestNo].voters[_voter];
    }

    function getRequestDetails(
        uint _fundId,
        uint _requestNo
    ) public view returns (string memory, address, uint, bool, uint) {
        FundRaising storage fund = fundRaisings[_fundId];
        Request storage thisRequest = fund.requests[_requestNo];
        return (
            thisRequest.description,
            thisRequest.recipient,
            thisRequest.value,
            thisRequest.completed,
            thisRequest.noOfVoters
        );
    }

    function getContribution(
        uint _fundId,
        address _contributor
    ) public view returns (uint) {
        return fundRaisings[_fundId].contributors[_contributor];
    }

    function createRequest(
        uint _fundId,
        string memory _description,
        address payable _recipient,
        uint _value
    ) public onlyManager(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(!fund.refunded, "Funds have been refunded");

        Request storage newRequest = fund.requests[fund.numRequests];
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;
        fund.numRequests++;
    }

    function voteRequest(
        uint _fundId,
        uint _requestNo
    ) public onlyContributor(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(!fund.refunded, "Funds have been refunded");

        Request storage thisRequest = fund.requests[_requestNo];
        require(!thisRequest.voters[msg.sender], "You have already voted");

        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
    }

    function makePayment(
        uint _fundId,
        uint _requestNo
    ) public onlyManager(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(fund.raisedAmount >= fund.target, "Target not reached");
        require(!fund.refunded, "Funds have been refunded");

        Request storage thisRequest = fund.requests[_requestNo];
        require(
            !thisRequest.completed,
            "The request has already been completed"
        );
        require(
            thisRequest.noOfVoters > fund.noOfContributors / 2,
            "Majority does not support"
        );

        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
    }

    function withdrawFunds(uint _fundId) public onlyManager(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(
            block.timestamp > fund.deadline,
            "Cannot withdraw before deadline"
        );
        require(fund.raisedAmount >= fund.target, "Target not reached");
        require(!fund.completed, "Funds already withdrawn");
        require(!fund.refunded, "Funds have been refunded");

        payable(fund.manager).transfer(fund.raisedAmount);
        fund.completed = true;
    }

    function enableRefunds(uint _fundId) public onlyManager(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(
            block.timestamp > fund.deadline,
            "Cannot refund before deadline"
        );
        require(
            fund.raisedAmount < fund.target,
            "Target was met, cannot refund"
        );
        require(!fund.completed, "Funds already withdrawn");
        require(!fund.refunded, "Funds already refunded");

        fund.refunded = true;
    }

    function withdrawRefund(uint _fundId) public onlyContributor(_fundId) {
        FundRaising storage fund = fundRaisings[_fundId];
        require(fund.refunded, "Refunds not enabled");
        require(fund.contributors[msg.sender] > 0, "No contribution to refund");

        uint refundAmount = fund.contributors[msg.sender];
        fund.contributors[msg.sender] = 0;
        payable(msg.sender).transfer(refundAmount);
    }
}
