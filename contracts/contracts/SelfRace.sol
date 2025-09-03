// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfCircuitLibrary} from "@selfxyz/contracts/contracts/libraries/SelfCircuitLibrary.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SelfRace is ERC20, SelfVerificationRoot, Ownable {
    // Default: 1,000,000 tokens (18 decimals)
    uint256 public claimableAmount = 1_000_000 * 10**18;
    
    // Current active round (1-9)
    uint256 public currentRound = 1;
    
    // Track which rounds have been won
    mapping(uint256 => bool) public roundCompleted;
    mapping(uint256 => address) public roundWinner;
    
    // Track nullifiers to prevent double claims
    mapping(uint256 => bool) internal _nullifiers;
    
    // Round data - player names for each round
    mapping(uint256 => string[4]) public roundPlayers;
    
    event RoundWon(uint256 indexed round, address indexed winner, string playerName, uint256 amount);
    event RoundAdvanced(uint256 indexed newRound);
    event ClaimableAmountUpdated(uint256 oldAmount, uint256 newAmount);

    error RegisteredNullifier();
    error RoundAlreadyCompleted();
    error InvalidRound();
    error NameNotInCurrentRound();

    constructor(
        address _identityVerificationHub, 
        uint256 _scope, 
        uint256[] memory _attestationIds
    )
        ERC20("RUN", "RUN")
        SelfVerificationRoot(
            _identityVerificationHub, 
            _scope, 
            _attestationIds
        )
        Ownable(_msgSender())
    {
        // Mint 1 billion tokens to the deployer
        _mint(_msgSender(), 1_000_000_000 * 10**18);
        
        // Initialize all rounds with player names
        _initializeRounds();
    }
    
    function _initializeRounds() internal {
        // Round 1: Ethereum Fork Wars
        roundPlayers[1] = ["Vitalik Buterin", "Justin Sun", "Gavin Wood", "Charles Hoskinson"];
        
        // Round 2: Web2 Platform Rivals
        roundPlayers[2] = ["Jack Dorsey", "Parag Agrawal", "Mark Zuckerberg", "Evan Spiegel"];
        
        // Round 3: Hollywood Superhero Overload
        roundPlayers[3] = ["Robert Downey Jr.", "Chris Evans", "Ryan Reynolds", "Hugh Jackman"];
        
        // Round 4: Athlete GOAT Debate
        roundPlayers[4] = ["Lionel Messi", "Cristiano Ronaldo", "LeBron James", "Michael Jordan"];
        
        // Round 5: Streaming Blood Feud
        roundPlayers[5] = ["Reed Hastings", "Bob Iger", "Andy Jassy", "David Zaslav"];
        
        // Round 6: Billionaire Tech Bros
        roundPlayers[6] = ["Elon Musk", "Jeff Bezos", "Bill Gates", "Mark Zuckerberg"];
        
        // Round 7: Political Titans
        roundPlayers[7] = ["Donald Trump", "Joe Biden", "Barack Obama", "Hillary Clinton"];
        
        // Round 8: Hollywood Franchise Kings
        roundPlayers[8] = ["Tom Cruise", "Dwayne Johnson", "Vin Diesel", "Arnold Schwarzenegger"];
        
        // Round 9: Space Race Redux (Final Bosses)
        roundPlayers[9] = ["Elon Musk", "Jeff Bezos", "Richard Branson", "Yusaku Maezawa"];
    }

    function setVerificationConfig(
        ISelfVerificationRoot.VerificationConfig memory newVerificationConfig
    ) external onlyOwner {
        _setVerificationConfig(newVerificationConfig);
    }

    function setClaimableAmount(uint256 newAmount) external onlyOwner {
        uint256 oldAmount = claimableAmount;
        claimableAmount = newAmount;
        emit ClaimableAmountUpdated(oldAmount, newAmount);
    }

    function verifySelfProof(
        ISelfVerificationRoot.DiscloseCircuitProof memory proof
    )
        public
        override
    {
        // Check if round is still active
        if (roundCompleted[currentRound]) {
            revert RoundAlreadyCompleted();
        }

        if (_nullifiers[proof.pubSignals[NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

        super.verifySelfProof(proof);

        // Get the verified name from the proof
        string memory verifiedName = _getVerifiedName(getRevealedDataPacked(proof.pubSignals));
        
        // Check if name matches one of the current round's players
        if (_isNameInCurrentRound(verifiedName)) {
            _nullifiers[proof.pubSignals[NULLIFIER_INDEX]] = true;
            
            // Mark round as completed and record winner
            roundCompleted[currentRound] = true;
            roundWinner[currentRound] = address(uint160(proof.pubSignals[USER_IDENTIFIER_INDEX]));
            
            // Transfer tokens to winner
            _transfer(owner(), address(uint160(proof.pubSignals[USER_IDENTIFIER_INDEX])), claimableAmount);
            
            emit RoundWon(currentRound, address(uint160(proof.pubSignals[USER_IDENTIFIER_INDEX])), verifiedName, claimableAmount);
        } else {
            revert NameNotInCurrentRound();
        }
    }

    function _getVerifiedName(uint256[3] memory revealedDataPacked) internal pure returns (string memory) {
        // Extract the full name from the revealed data
        return SelfCircuitLibrary.getFullName(revealedDataPacked);
    }

    function _isNameInCurrentRound(string memory name) internal view returns (bool) {
        string[4] memory players = roundPlayers[currentRound];
        
        for (uint256 i = 0; i < 4; i++) {
            if (keccak256(abi.encodePacked(players[i])) == keccak256(abi.encodePacked(name))) {
                return true;
            }
        }
        
        return false;
    }

    // Admin functions for round management
    function advanceToNextRound() external onlyOwner {
        if (currentRound >= 9) {
            revert InvalidRound();
        }
        
        currentRound++;
        emit RoundAdvanced(currentRound);
    }
    
    function setCurrentRound(uint256 _round) external onlyOwner {
        if (_round < 1 || _round > 9) {
            revert InvalidRound();
        }
        
        currentRound = _round;
        emit RoundAdvanced(currentRound);
    }
    
    // View functions
    function getCurrentRoundPlayers() external view returns (string[4] memory) {
        return roundPlayers[currentRound];
    }
    
    function getRoundPlayers(uint256 _round) external view returns (string[4] memory) {
        if (_round < 1 || _round > 9) {
            revert InvalidRound();
        }
        return roundPlayers[_round];
    }
    
    function isRoundCompleted(uint256 _round) external view returns (bool) {
        return roundCompleted[_round];
    }
    
    function getRoundWinner(uint256 _round) external view returns (address) {
        return roundWinner[_round];
    }
    
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        _transfer(owner(), to, amount);
    }
}
