import React from 'react'


import { Box, Button, Flex, Input, Text} from '@chakra-ui/react';


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
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
            <Text fontSize="48px" textShadow="0 5px #000000">RoboPunksNFT</Text>
            <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px 2px #000000">A collection of 1000 RoboPunks living on the Ethereum blockchain. Mint below!</Text>
            </div>
            
            {isConnected ? (
                <div>
                    <Flex align="center" justify="center">
                        <Button
                        backgroundColor="#D6517D"
                        borderRadius="5px"
                        boxShadow="0px 2px 2px 1px #0F0F0F"
                        color="white"
                        curso="pointer"
                        fontFamily="inherit"
                        padding="15px"
                        marginTop="10px"
                        onClick={handleDecrement}>-</Button>
    
                        <Input
                            readOnly
                            fontFamily="inherit"
                            width="100px"
                            height="40px"
                            textAlign="center"
                            paddingLeft="19px"
                            marginTop="10px"
                            
                        type="number" value={mintAmount} />
    
                        <Button backgroundColor="#D6517D"
                        borderRadius="5px"
                        boxShadow="0px 2px 2px 1px #0F0F0F"
                        color="white"
                        curso="pointer"
                        fontFamily="inherit"
                        padding="15px"
                        marginTop="10px" onClick={handleIncrement}>+</Button>
                    </Flex>
                    <Button onClick={handleMint}>Mint Now</Button>
                </div>
            ) : (
                <p>You must be connected to mint.</p>
            )}
            </Box>
        </Flex>
      )
    }
    