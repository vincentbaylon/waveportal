import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import abi from './utils/WavePortal.json'

export default function App() {
	const [currentAccount, setCurrentAccount] = useState('')
	const [waveCount, setWaveCount] = useState(0)
	const { ethereum } = window
	const contractAddress = ''
	const contractABI = abi.abi

	useEffect(() => {
		checkIfWalletIsConnected()
	}, [])

	const checkIfWalletIsConnected = async () => {
		try {
			if (!ethereum) {
				console.log('Make sure you have metamask!')
				return
			} else {
				console.log('We have the ethereum object', ethereum)
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' })

			if (accounts.length !== 0) {
				const account = accounts[0]
				console.log('Found an authorized account:', account)
				setCurrentAccount(account)
			} else {
				console.log('No authorized account found')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const connect = async () => {
		try {
			if (!ethereum) {
				alert('Get MetaMask!')
				return
			}
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Connected', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log(error)
		}
	}

	const wave = async () => {
		try {
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				)

				let count = await wavePortalContract.getTotalWaves()
				console.log('Retrieved total wave count...', count.toNumber())
				setWaveCount(count.toNumber())

				const waveTxn = await wavePortalContract.wave()
				console.log('Mining...', waveTxn.hash)

				await waveTxn.wait()
				console.log('Mined --', waveTxn.hash)

				count = await wavePortalContract.getTotalWaves()
				console.log('Retrieved total wave count...', count.toNumber())
				setWaveCount(count.toNumber())
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	const detect = () => {
		if (typeof window.ethereum !== 'undefined') {
			console.log('MetaMask is installed!')
		}
	}

	return (
		<div className='mainContainer'>
			<div className='dataContainer'>
				<div className='header'>👋 Hey there!</div>
				{detect()}
				<div className='bio'>Connect your Ethereum wallet and wave at me!</div>
				<div className='bio'>Current wave count: {waveCount}</div>
				{!currentAccount && (
					<button className='waveButton' onClick={connect}>
						Connect your Wallet
					</button>
				)}

				<button className='waveButton' onClick={wave}>
					Wave at Me
				</button>
			</div>
		</div>
	)
}
