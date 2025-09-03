'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { logo } from './content/birthdayAppLogo';
import { ethers } from 'ethers';

const HAPPY_BIRTHDAY_CONTRACT_ADDRESS = "0x97d01A133c9Bfd77D6b7147d36bAA005b48735aa";

function Birthday() {
    const [input, setInput] = useState('');
    const [address, setAddress] = useState('');
    const [claimSuccess, setClaimSuccess] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (ethers.isAddress(input)) {
            setAddress(input);
        }
    }, [input]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const selfApp = address ? new SelfAppBuilder({
        appName: "Self Birthday",
        scope: "Self-Birthday-Example",
        endpoint: HAPPY_BIRTHDAY_CONTRACT_ADDRESS,
        endpointType: "staging_celo",
        logoBase64: logo,
        userId: address,
        userIdType: "hex",
        disclosures: {
            date_of_birth: true,
        },
        devMode: true,
    } as Partial<SelfApp>).build() : null;

    const handleSuccess = async (data?: any) => {
        console.log('Verification successful', data);
        setClaimSuccess(true);
        if (data?.txHash) {
            setTxHash(data.txHash);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--terminal-bg)', color: 'var(--terminal-green)' }}>
            <div className="terminal-box m-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="terminal-glow">
                        <div style={{ color: 'var(--terminal-cyan)' }} className="text-xl font-bold">
                            ╔═══════════════════════════════════════════════════════════════════════╗
                        </div>
                        <div style={{ color: 'var(--terminal-cyan)' }}>
                            ║                          🏁 SELF-RACE TERMINAL v2.0 🏁                ║
                        </div>
                        <div style={{ color: 'var(--terminal-cyan)' }}>
                            ╚═══════════════════════════════════════════════════════════════════════╝
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="terminal-box p-3">
                        <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">SYSTEM STATUS</div>
                        <div style={{ color: 'var(--terminal-green)' }}>RACE TOKEN: ONLINE</div>
                        <div style={{ color: 'var(--terminal-green)' }}>SELF PROTOCOL: [ OK ]</div>
                        <div style={{ color: 'var(--terminal-green)' }}>CELO NETWORK: [ OK ]</div>
                        <div style={{ color: 'var(--terminal-red)' }}>BIRTHDAY VERIFY: [ PENDING ]</div>
                    </div>

                    <div className="terminal-box p-3">
                        <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">RACE STATISTICS</div>
                        <div>TOTAL SUPPLY: 1,000,000,000</div>
                        <div>REWARD POOL: 1,000 RACE</div>
                        <div>PLAYERS ACTIVE: 1,337</div>
                        <div>CLAIMS TODAY: 42</div>
                    </div>

                    <div className="terminal-box p-3">
                        <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">SYSTEM TIME</div>
                        <div className="text-lg terminal-glow">{formatTime(currentTime)}</div>
                        <div>UTC {currentTime.toISOString().split('T')[0]}</div>
                        <div style={{ color: 'var(--terminal-green)' }}>BIRTHDAY WINDOW: 24H</div>
                    </div>
                </div>

                <div className="terminal-box p-6">
                    <div className="mb-6">
                        <div style={{ color: 'var(--terminal-cyan)' }} className="text-xl mb-4 terminal-glow">
                            &gt;&gt;&gt; BIRTHDAY RACE TOKEN CLAIM PROTOCOL &lt;&lt;&lt;
                        </div>
                        <div style={{ color: 'var(--terminal-amber)' }} className="mb-4">
                            REQUIREMENTS: VALID BIRTHDAY + SELF PROTOCOL VERIFICATION
                        </div>
                        <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                            REWARD: 1,000 RACE TOKENS TO YOUR WALLET
                        </div>
                    </div>

                    <div className="mb-6">
                        <div style={{ color: 'var(--terminal-green)' }} className="mb-2">
                            ENTER WALLET ADDRESS:
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="0x..."
                            className="w-full p-3 bg-black border-2 text-green-400 font-mono"
                            style={{ 
                                borderColor: 'var(--terminal-green)',
                                backgroundColor: 'var(--terminal-bg)',
                                color: 'var(--terminal-green)',
                                boxShadow: '0 0 5px var(--terminal-green)'
                            }}
                        />
                        {address && (
                            <div style={{ color: 'var(--terminal-green)' }} className="mt-2">
                                [ OK ] VALID ADDRESS DETECTED: {address.slice(0, 10)}...
                            </div>
                        )}
                    </div>

                    {selfApp && (
                        <div className="flex flex-col items-center mb-6">
                            <div style={{ color: 'var(--terminal-amber)' }} className="mb-4 text-center">
                                SCAN QR CODE TO VERIFY BIRTHDAY WITH SELF PROTOCOL
                            </div>
                            <div className="terminal-box p-4">
                                <SelfQRcodeWrapper
                                    selfApp={selfApp}
                                    type='websocket'
                                    onSuccess={handleSuccess}
                                />
                            </div>
                            <div style={{ color: 'var(--terminal-green)' }} className="mt-4 text-center">
                                WAITING FOR VERIFICATION...
                                <span className="animate-pulse">█</span>
                            </div>
                        </div>
                    )}

                    {!address && (
                        <div className="text-center">
                            <div style={{ color: 'var(--terminal-red)' }}>
                                ERROR: WALLET ADDRESS REQUIRED TO PROCEED
                            </div>
                            <div style={{ color: 'var(--terminal-gray)' }}>
                                Please enter a valid Ethereum address above
                            </div>
                        </div>
                    )}

                    {claimSuccess && (
                        <div className="terminal-box p-6 mt-6" style={{ borderColor: 'var(--terminal-green)' }}>
                            <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                ╔════════════════════════════════════════╗
                            </div>
                            <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                ║    🎉 BIRTHDAY VERIFICATION SUCCESS!   ║
                            </div>
                            <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                ║       1,000 RACE TOKENS CLAIMED!       ║
                            </div>
                            <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                ╚════════════════════════════════════════╝
                            </div>
                            
                            <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                                TRANSACTION STATUS: COMPLETED
                            </div>
                            <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                                DESTINATION: {address}
                            </div>
                            
                            <div className="space-y-2">
                                {txHash ? (
                                    <a
                                        href={`https://alfajores.celoscan.io/tx/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block terminal-glow hover:underline"
                                        style={{ color: 'var(--terminal-cyan)' }}
                                    >
                                        &gt;&gt;&gt; VIEW TRANSACTION ON CELOSCAN &lt;&lt;&lt;
                                    </a>
                                ) : (
                                    <a
                                        href={`https://alfajores.celoscan.io/address/${address}#tokentxns`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block terminal-glow hover:underline"
                                        style={{ color: 'var(--terminal-cyan)' }}
                                    >
                                        &gt;&gt;&gt; VIEW YOUR TOKEN TRANSFERS &lt;&lt;&lt;
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <div style={{ color: 'var(--terminal-gray)' }}>
                        SELF-RACE PROTOCOL © 2025 | POWERED BY SELF PROTOCOL | 
                        <a 
                            href="https://self.xyz" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 terminal-glow hover:underline"
                            style={{ color: 'var(--terminal-cyan)' }}
                        >
                            SELF.XYZ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Birthday;