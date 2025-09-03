// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfCircuitLibrary} from "@selfxyz/contracts/contracts/libraries/SelfCircuitLibrary.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SelfHappyBirthday is ERC20, SelfVerificationRoot, Ownable {
    string public dobReadable;

    // Default: 1000 tokens (18 decimals)
    uint256 public claimableAmount = 1000 * 10**18;

    mapping(uint256 => bool) internal _nullifiers;

    event TokensClaimed(address indexed claimer, uint256 amount);
    event ClaimableAmountUpdated(uint256 oldAmount, uint256 newAmount);

    error RegisteredNullifier();

    constructor(
        address _identityVerificationHub, 
        uint256 _scope, 
        uint256[] memory _attestationIds
    )
        ERC20("RACE", "RACE")
        SelfVerificationRoot(
            _identityVerificationHub, 
            _scope, 
            _attestationIds
        )
        Ownable(_msgSender())
    {
        // Mint 1 billion tokens to the deployer
        _mint(_msgSender(), 1_000_000_000 * 10**18);
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

        if (_nullifiers[proof.pubSignals[NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

        super.verifySelfProof(proof);

        if (_isWithinBirthdayWindow(
                getRevealedDataPacked(proof.pubSignals)
            )
        ) {
            _nullifiers[proof.pubSignals[NULLIFIER_INDEX]] = true;
            _transfer(owner(), address(uint160(proof.pubSignals[USER_IDENTIFIER_INDEX])), claimableAmount);
            emit TokensClaimed(address(uint160(proof.pubSignals[USER_IDENTIFIER_INDEX])), claimableAmount);
        } else {
            revert("Not eligible: Not within claimable window");
        }
    }

    function _isWithinBirthdayWindow(uint256[3] memory revealedDataPacked) internal returns (bool) {
        string memory dob = SelfCircuitLibrary.getDateOfBirth(revealedDataPacked);

        bytes memory dobBytes = bytes(dob);
        bytes memory dayBytes = new bytes(2);
        bytes memory monthBytes = new bytes(2);

        dayBytes[0] = dobBytes[0];
        dayBytes[1] = dobBytes[1];

        monthBytes[0] = dobBytes[3];
        monthBytes[1] = dobBytes[4];

        string memory day = string(dayBytes);
        string memory month = string(monthBytes);
        string memory dobInThisYear = string(abi.encodePacked("25", month, day));

        uint256 dobInThisYearTimestamp = SelfCircuitLibrary.dateToTimestamp(dobInThisYear);

        uint256 currentTime = block.timestamp;
        uint256 timeDifference;

        if (currentTime > dobInThisYearTimestamp) {
            timeDifference = currentTime - dobInThisYearTimestamp;
        } else {
            timeDifference = dobInThisYearTimestamp - currentTime;
        }

        uint256 claimableWindow = 1 days;

        return timeDifference <= claimableWindow;
    }

    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        _transfer(owner(), to, amount);
    }
}
