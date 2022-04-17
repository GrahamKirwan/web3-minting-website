import React from 'react'

export default function NavBar({ accounts, setAccounts }) {

    const isConnected = Boolean(accounts[0]);

    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts);
        }
    }

  return (
    <div>
        {/* Left Side - Socials */}
        <div>Facebook</div>
        <div>Twitter</div>
        <div>Email</div>

        {/* Right Side - Sections and connect */}
        <div>About</div>
        <div>Mint</div>
        <div>Team</div>

        {/* Cnnect */}
        {isConnected ? (
            <p>Connected</p>
        ) : (
            <button onClick={connectAccount}>Connect</button>
        )}

    </div>
  )
}
