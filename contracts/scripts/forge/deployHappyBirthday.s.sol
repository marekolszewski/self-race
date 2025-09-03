// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Script } from "forge-std/src/Script.sol";
import { console } from "forge-std/src/console.sol";
import { SelfHappyBirthday } from "../../contracts/HappyBirthday.sol";

/**
 * @title DeployHappyBirthday
 * @notice Deployment script for the SelfHappyBirthday contract
 *
 * To run this script:
 * 1. Set the PRIVATE_KEY environment variable:
 *    export PRIVATE_KEY=your_private_key_here
 *
 * 2. Set the HASHED_SCOPE environment variable (calculated from the TypeScript SDK):
 *    export HASHED_SCOPE=your_calculated_scope
 *    - You can use the hashEndpointWithScope function from the Self SDK (selfxyz/core) in TypeScript:
 *      Example: const scope = hashEndpointWithScope("your_endpoint", "your_scope_name");
 *
 * 3. Set the CELOSCAN_API_KEY environment variable for verification:
 *    export CELOSCAN_API_KEY=your_api_key_here
 *
 * 4. Run the forge script with auto-verification:
 *    forge script contracts/scripts/forge/deployHappyBirthday.s.sol --rpc-url celo --broadcast --verify
 *
 *    For testnet (Alfajores):
 *    forge script contracts/scripts/forge/deployHappyBirthday.s.sol --rpc-url celo-alfajores --broadcast --verify
 *
 * Note: This script uses both the RPC endpoints and Etherscan API configurations from foundry.toml.
 * The --verify flag automatically handles contract verification using the appropriate Etherscan API
 * based on the network you're deploying to.
 */
contract DeployHappyBirthday is Script {
    function run() public {
        // Get the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("CELO_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Log the deployer address
        console.log("Deploying contracts with the account:", deployerAddress);

        // Calculate the nonce and future address (for informational purposes)
        uint64 nonce = vm.getNonce(deployerAddress);
        console.log("Account nonce:", nonce);

        // For prod environment
        // address identityVerificationHub = 0x9AcA2112D34Ef021084264F6f5eef2a99a5bA7b1;
        // For staging environment
        address identityVerificationHub = 0xDCAa9D9b8E8Bb5696c5d4b47da84aD37b8DEb9A8;

        // Note: The scope is the hash of the endpoint and the scope name
        uint256 scope = vm.envUint("HASHED_SCOPE");
        console.log("Using scope from environment:", scope);

        uint256[] memory attestationIds = new uint256[](1);
        attestationIds[0] = 1;

        console.log("Deploying SelfHappyBirthday (RACE Token)...");

        // Deploy the contract
        SelfHappyBirthday selfHappyBirthday = new SelfHappyBirthday(
            identityVerificationHub,
            scope,
            attestationIds
        );

        // Stop broadcasting
        vm.stopBroadcast();

        // Log the deployed address
        console.log("SelfHappyBirthday (RACE Token) deployed to:", address(selfHappyBirthday));
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract: SelfHappyBirthday (RACE Token)");
        console.log("Address: %s", address(selfHappyBirthday));
        console.log("Token Name: RACE");
        console.log("Token Symbol: RACE");
        console.log("Total Supply: 1,000,000,000 RACE");
        console.log("Identity Hub: %s", identityVerificationHub);
        console.log("Scope: %s", scope);
    }
}
