import React from 'react'

import { useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import roboPunksNFT from './RoboPunksNFT.json';

const roboPunksNFTAddress = "0x9e52b2e716E6d92f467943F0c42A65a8AEeffeCD";

export default function MainMint({ accounts, setAccounts }) {
    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                roboPunksNFTAddress,
                roboPunksNFT.abi,
                signer
            );
            try {
                const response = await contract.mint(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
                });
                console.log('response', response);
            } catch (err) {
                console.log("error", err);
                alert("Action Disabled")
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    }

    const handleIncrement = () => {
        if (mintAmount >= 3) return;
        setMintAmount(mintAmount + 1);
    }

  return (
    <div>
        <h1>RoboPunks</h1>
        <p>It's 2098. RoboPunks NFT's are finally here! Mint below!</p>
        {isConnected ? (
            <div>
                <div>
                    <button onClick={handleDecrement}>-</button>
                    <input type="number" value={mintAmount} />
                    <button onClick={handleIncrement}>+</button>
                </div>
                <button onClick={handleMint}>Mint Now</button>
            </div>
        ) : (
            <p>You must be connected to mint.</p>
        )}
    </div>
  )
}
