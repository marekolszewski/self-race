'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { logo } from './content/birthdayAppLogo';
import { ethers } from 'ethers';

const RACE_CONTRACT_ADDRESS = "0x97d01A133c9Bfd77D6b7147d36bAA005b48735aa";

// Game rounds data
const ROUNDS = [
    {
        id: 1,
        title: "Ethereum Fork Wars",
        players: ["Vitalik Buterin", "Justin Sun", "Gavin Wood", "Charles Hoskinson"]
    },
    {
        id: 2,
        title: "Web2 Platform Rivals",
        players: ["Jack Dorsey", "Parag Agrawal", "Mark Zuckerberg", "Evan Spiegel"]
    },
    {
        id: 3,
        title: "Hollywood Superhero Overload",
        players: ["Robert Downey Jr.", "Chris Evans", "Ryan Reynolds", "Hugh Jackman"]
    },
    {
        id: 4,
        title: "Athlete GOAT Debate",
        players: ["Lionel Messi", "Cristiano Ronaldo", "LeBron James", "Michael Jordan"]
    },
    {
        id: 5,
        title: "Streaming Blood Feud",
        players: ["Reed Hastings", "Bob Iger", "Andy Jassy", "David Zaslav"]
    },
    {
        id: 6,
        title: "Billionaire Tech Bros",
        players: ["Elon Musk", "Jeff Bezos", "Bill Gates", "Mark Zuckerberg"]
    },
    {
        id: 7,
        title: "Political Titans",
        players: ["Donald Trump", "Joe Biden", "Barack Obama", "Hillary Clinton"]
    },
    {
        id: 8,
        title: "Hollywood Franchise Kings",
        players: ["Tom Cruise", "Dwayne Johnson", "Vin Diesel", "Arnold Schwarzenegger"]
    },
    {
        id: 9,
        title: "Space Race Redux (Final Bosses)",
        players: ["Elon Musk", "Jeff Bezos", "Richard Branson", "Yusaku Maezawa"]
    }
];

// Current round (can be changed to control active round)
const CURRENT_ROUND = 1;

function RaceGame() {
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

    const currentRound = ROUNDS.find(round => round.id === CURRENT_ROUND);

    const selfApp = address ? new SelfAppBuilder({
        appName: "Self Race",
        scope: "Self-Race-Protocol",
        endpoint: RACE_CONTRACT_ADDRESS,
        endpointType: "staging_celo",
        logoBase64: logo,
        userId: address,
        userIdType: "hex",
        disclosures: {
            full_name: true,
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
            {/* Intro Section */}
            <div className="terminal-box m-4 mb-6 p-6">
                <div className="text-center">
                    <div style={{ color: 'var(--terminal-cyan)' }} className="text-3xl mb-6 terminal-glow">
                        Welcome to Self-Race 🏁🔥
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-4 text-lg">
                        <div style={{ color: 'var(--terminal-white)' }}>
                            This ain't about winning.
                        </div>
                        <div style={{ color: 'var(--terminal-red)' }} className="terminal-glow">
                            It's about making sure your nemesis loses.
                        </div>
                        
                        <div style={{ color: 'var(--terminal-green)' }} className="mt-6">
                            In <span style={{ color: 'var(--terminal-cyan)' }} className="font-bold">Self-Race</span>, four arch-rivals line up to prove who they are with Self Protocol. The prize? A memecoin called <span style={{ color: 'var(--terminal-amber)' }} className="font-bold terminal-glow">RUN</span>.
                        </div>
                        
                        <div className="mt-6 space-y-2">
                            <div style={{ color: 'var(--terminal-amber)' }}>
                                Vitalik vs. Justin Sun.
                            </div>
                            <div style={{ color: 'var(--terminal-amber)' }}>
                                Elon vs. Jeff Bezos.
                            </div>
                            <div style={{ color: 'var(--terminal-amber)' }}>
                                Tom Cruise vs. Vin Diesel.
                            </div>
                        </div>
                        
                        <div className="mt-6 space-y-2">
                            <div style={{ color: 'var(--terminal-white)' }}>
                                Do they even want the tokens? Maybe.
                            </div>
                            <div style={{ color: 'var(--terminal-green)' }}>
                                But what they <em>really</em> want… is to stop their rival from getting them.
                            </div>
                        </div>
                        
                        <div style={{ color: 'var(--terminal-cyan)' }} className="mt-8 text-xl terminal-glow">
                            <span className="font-bold">Self-Race:</span> where grudges move faster than wallets.
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 m-4">
                {/* Rounds Sidebar */}
                <div className="lg:w-1/3">
                    <div className="terminal-box p-4">
                        <div style={{ color: 'var(--terminal-amber)' }} className="mb-4 text-xl terminal-glow">
                            RACE ROUNDS
                        </div>
                        <div className="space-y-3">
                            {ROUNDS.map((round) => (
                                <div key={round.id} className="terminal-box p-3" 
                                     style={{ 
                                         borderColor: round.id === CURRENT_ROUND ? 'var(--terminal-green)' : 'var(--terminal-gray)',
                                         backgroundColor: round.id === CURRENT_ROUND ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                                     }}>
                                    <div style={{ 
                                        color: round.id === CURRENT_ROUND ? 'var(--terminal-green)' : 'var(--terminal-amber)'
                                    }} className="font-bold">
                                        {round.id === CURRENT_ROUND && ">>> "}ROUND {round.id}{round.id === CURRENT_ROUND && " <<<"}
                                    </div>
                                    <div style={{ color: 'var(--terminal-white)' }} className="text-sm mb-2">
                                        {round.title}
                                    </div>
                                    <div className="text-xs space-y-1">
                                        {round.players.map((player, idx) => (
                                            <div key={idx} style={{ 
                                                color: round.id === CURRENT_ROUND ? 'var(--terminal-green)' : 'var(--terminal-gray)'
                                            }}>
                                                • {player}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    <div className="terminal-box p-4">

                        {/* Current Round Display */}
                        {currentRound && (
                            <div className="terminal-box p-4 mb-6" style={{ borderColor: 'var(--terminal-green)' }}>
                                <div style={{ color: 'var(--terminal-green)' }} className="text-lg mb-2 terminal-glow">
                                    CURRENT ROUND: {currentRound.id} - {currentRound.title.toUpperCase()}
                                </div>
                                <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">
                                    ACTIVE PLAYERS: {currentRound.players.join(" | ")}
                                </div>
                                <div style={{ color: 'var(--terminal-white)' }}>
                                    STATUS: LIVE - IDENTITY VERIFICATION REQUIRED
                                </div>
                            </div>
                        )}

                        {/* System Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="terminal-box p-3">
                                <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">SYSTEM STATUS</div>
                                <div style={{ color: 'var(--terminal-green)' }}>RUN TOKEN: ONLINE</div>
                                <div style={{ color: 'var(--terminal-green)' }}>SELF PROTOCOL: [ OK ]</div>
                                <div style={{ color: 'var(--terminal-green)' }}>CELO NETWORK: [ OK ]</div>
                                <div style={{ color: 'var(--terminal-red)' }}>IDENTITY VERIFY: [ PENDING ]</div>
                            </div>

                            <div className="terminal-box p-3">
                                <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">RACE STATISTICS</div>
                                <div>TOTAL SUPPLY: 1,000,000,000</div>
                                <div>REWARD POOL: 1,000,000 RUN</div>
                                <div>RIVALS COMPETING: 4</div>
                                <div>ROUND {CURRENT_ROUND}/9 ACTIVE</div>
                            </div>

                            <div className="terminal-box p-3">
                                <div style={{ color: 'var(--terminal-amber)' }} className="mb-2">SYSTEM TIME</div>
                                <div className="text-lg terminal-glow">{formatTime(currentTime)}</div>
                                <div>UTC {currentTime.toISOString().split('T')[0]}</div>
                                <div style={{ color: 'var(--terminal-green)' }}>RACE WINDOW: 24/7</div>
                            </div>
                        </div>

                        {/* Main Game Interface */}
                        <div className="terminal-box p-6">
                            <div className="mb-6">
                                <div style={{ color: 'var(--terminal-cyan)' }} className="text-xl mb-4 terminal-glow">
                                    &gt;&gt;&gt; SELF-RACE RIVALRY PROTOCOL &lt;&lt;&lt;
                                </div>
                                <div style={{ color: 'var(--terminal-amber)' }} className="mb-4">
                                    REQUIREMENTS: NAME MATCH + SELF PROTOCOL VERIFICATION
                                </div>
                                <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                                    REWARD: 1,000,000 RUN TOKENS TO WINNER
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

                            {/* Name Check Message */}
                            {currentRound && (
                                <div className="mb-6 p-4 terminal-box" style={{ borderColor: 'var(--terminal-amber)' }}>
                                    <div style={{ color: 'var(--terminal-amber)' }} className="text-lg terminal-glow">
                                        Is your name {currentRound.players.map((name, idx) => (
                                            <span key={idx}>
                                                <span style={{ color: 'var(--terminal-white)' }}>{name}</span>
                                                {idx < currentRound.players.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}?
                                    </div>
                                    <div style={{ color: 'var(--terminal-green)' }} className="mt-2">
                                        Redeem your RUN tokens now!
                                    </div>
                                </div>
                            )}

                            {selfApp && (
                                <div className="flex flex-col items-center mb-6">
                                    <div style={{ color: 'var(--terminal-amber)' }} className="mb-4 text-center">
                                        SCAN QR CODE TO VERIFY IDENTITY WITH SELF PROTOCOL
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
                                        ║    🏁 RACE VERIFICATION SUCCESS!       ║
                                    </div>
                                    <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                        ║     1,000,000 RUN TOKENS REDEEMED!     ║
                                    </div>
                                    <div style={{ color: 'var(--terminal-green)' }} className="text-xl mb-4 terminal-glow">
                                        ╚════════════════════════════════════════╝
                                    </div>
                                    
                                    <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                                        TRANSACTION STATUS: COMPLETED
                                    </div>
                                    <div style={{ color: 'var(--terminal-white)' }} className="mb-4">
                                        WINNER: {address}
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

                        {/* Footer */}
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
            </div>
        </div>
    );
}

export default RaceGame;