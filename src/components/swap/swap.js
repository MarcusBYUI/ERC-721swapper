import { React, useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import swapAbi from "../swapabi.json";
import nftAbi from "../abi.json";

import "./style.css";

const Swap = () => {
  //variables
  //
  //
  //
  //
  //
  const swapContract = "0x3B3761d4365342de5513DD019BF7D96D36Fa0301";
  const targetContract = "0x01dC3387EdFA21ADd33ABFdd9a37546cF64a8f92";

  //states
  //
  //
  //
  //
  //
  const [click, setClick] = useState(0);
  const [approve, setApprove] = useState(false);
  const [tokenId, settokenId] = useState([]);

  //functions
  //
  //
  //
  //
  //
  const handleIds = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, nftAbi, signer);
      const address = await signer.getAddress().then((response) => {
        return response;
      });
      const idSet = [];
      let i = 0;

      try {
        //debugger;

        const Bigbalance = await contract.balanceOf(address);
        const balance = BigNumber.from(Bigbalance._hex).toNumber();
        while (i < balance) {
          const tokenID = await contract.tokenOfOwnerByIndex(address, i);
          idSet.push(BigNumber.from(tokenID._hex).toNumber());
          i++;
        }
        console.log(idSet);

        settokenId(idSet);
      } catch (error) {
        console.log("Error", error);
      }
    }
  };
  const swapHandler = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(swapContract, swapAbi, signer);

      try {
        const response = await contract.swap(targetContract, tokenId);
        response.wait().then((data) => {
          handleIds();
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  const approveHandler = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, nftAbi, signer);

      try {
        //debugger;
        const response = await contract.setApprovalForAll(swapContract, true);
        response.wait().then(() => {
          setApprove(true);
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  const checkApprove = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(targetContract, nftAbi, signer);

      const address = await signer.getAddress().then((response) => {
        return response;
      });
      try {
        //debugger;
        const response = await contract.isApprovedForAll(address, swapContract);
        response ? setApprove(true) : setApprove(false);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const clickHandler = () => {
    setClick((prevState) => prevState + 1);
  };

  //useEffects
  //
  //
  //
  //
  //
  useEffect(() => {
    if (approve) {
      click !== 0 && swapHandler();
    } else {
      click !== 0 && approveHandler();
    }
  }, [click]);

  useEffect(() => {
    checkApprove();
    handleIds();
  }, []);

  // Return
  //
  //
  //
  //
  //
  return (
    <div className="transfer-container">
      {tokenId.length > 0 ? (
        <div className="swap-container">
          <h2>Transfer NFTs</h2>
          <button onClick={clickHandler}>
            {approve ? "Transfer" : "Approve"}
          </button>
        </div>
      ) : (
        <h2 className="no-swap">No NFTs To Send</h2>
      )}
    </div>
  );
};

export default Swap;
