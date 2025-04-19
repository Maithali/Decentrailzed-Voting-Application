const { ethers } = require("hardhat");

let WALLET_CONNECTED = "";
let contractAddress = "";
let contractAbi = [];

const connectMetaMask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  var element = document.getElementById("metamasknotification");
  element.innerHTML = "Metamask is connected " + WALLET_CONNECTED;
};

const getAllCandidates = async () => {
  var p3 = document.getElementById("p3");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  p3.innerHTML =
    "Please wait, getting all the candidates from voting smart contract";
  var candidates = await contractInstance.getAllVotesofCandidates();
  console.log(candidates);
  var table = document.getElementById("myTable");

  for (let i = 0; i < candidates.length; i++) {
    var row = table.insertRow();
    var idCell = row.insertCell();
    var nameCell = row.insertCell();
    var vc = row.insertCell();

    idCell.innerHTML = i;
    nameCell.innerHTML = candidates[i].name;
    vc.innerHTML = candidates[i].voteCount;
  }

  p3.innerHTML = "The candidate list is updated !!!";
};

const voteStatus = async () => {
  if (WALLET_CONNECTED != 0) {
    var status = document.getElementById("status");
    var remainingTime = document.getElementById("time");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const currentStatus = await contractInstance.getVotingStatus();
    const time = await contractInstance.getRemainingTime();
    status.innerHTML =
      currentStatus == 1 ? "Voting is currently Open" : "Voting is Completed";
    remainingTime.innerHTML = `Remaining time is ${parseInt(time, 16)} seconds`;
  } else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect metamask first";
  }
};

const addVote = async () => {
  if (WALLET_CONNECTED != 0) {
    var name = document.getElementById("vote");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please wait, adding a vote in the smart contract";
    const tx = await contractInstance.vote(name.value);
    await tx.wait();
    cand.innerHTML = "Vote added";
    const time = await contractInstance.getRemainingTime();
  } else {
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please connect  to Metamask first";
  }
};
