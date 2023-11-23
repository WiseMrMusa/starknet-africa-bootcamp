"use client"

import Image from 'next/image'
import { RpcProvider, Contract, AccountInterface } from 'starknet';
import our_contract_abi from '@/utils/abis/our_contract.json'
import { useEffect, useState } from 'react';
import { StarknetWindowObject, connect, disconnect } from 'get-starknet';

export default function Home() {
  const [balance, setBalance] = useState();
  const [account, setAccount] = useState<AccountInterface>();
  const [address, setAddress] = useState<string | undefined >();
  const [isConnected, setIsConnected] = useState<boolean>();
  const our_contract_address = "0x076F0fDC6f66b00B22f55780C4246fc922C2d1f7447Ed126C340E5Afb83AdD52"
  
  const connectWallet = async () => {
    try {
      const starknet = await connect();
      await starknet?.enable({ starknetVersion: 'v4' })
      if (!starknet) return;
      setAccount(starknet?.account);
      setAddress(starknet?.selectedAddress);
      setIsConnected(true);
    } catch (error ) {
      alert(error.message);
    }
  }

  const disconnectWallet = async () => {
    try {
      const starknet = await disconnect();
      setAccount(undefined);
      setAddress(undefined);
      setIsConnected(false);
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(()=> {
    const getBalance = async () => {
      const providerRPC = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC });
      const our_contract = new Contract(our_contract_abi,our_contract_address,account);
      const balance = await our_contract.get_balance();
      console.log(balance);
      setBalance(balance.toString())
    }
    getBalance()
  }
    , [account, setBalance])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     Hello from Starknet Africa 

      <p>Balance {balance} </p>
     
    {
      isConnected && <button onClick={ () => disconnectWallet()}>Disconnect</button>
    }
     <button onClick={ ()=> connectWallet()}> Connect Wallet </button>
    </main>
  )
}
