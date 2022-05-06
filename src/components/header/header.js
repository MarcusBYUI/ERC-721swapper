import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./header.css";

const Header = () => {
  const [address, setaddress] = useState(0);
  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const add = await signer.getAddress();
    setaddress(add);
  };

  return (
    <>
      <div className="NavBar">
        <h3>ERC721 Transfer</h3>
        <button onClick={connect}>
          {" "}
          {address === 0 ? "Connect" : `${address.slice(0, 8)}....`}{" "}
        </button>
      </div>
    </>
  );
};

export default Header;
