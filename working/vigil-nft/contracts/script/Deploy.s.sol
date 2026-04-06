// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TheVigil.sol";

/**
 * Deployment script for The Vigil NFT
 *
 * Usage:
 *   Testnet (Base Sepolia):
 *     forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify -vvvv
 *
 *   Mainnet (Base):
 *     forge script script/Deploy.s.sol --rpc-url base_mainnet --broadcast --verify -vvvv
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY   — deployer wallet private key
 *   BASE_METADATA_API_URL  — base URL for metadata API, e.g. https://api.thevigilnft.xyz/metadata/
 *   WHITELIST_MERKLE_ROOT  — bytes32 merkle root from whitelist generation script
 *   BASESCAN_API_KEY       — for contract verification
 */
contract DeployTheVigil is Script {
    function run() external {
        string memory baseURI = vm.envString("BASE_METADATA_API_URL");
        bytes32 merkleRoot    = vm.envBytes32("WHITELIST_MERKLE_ROOT");
        uint256 deployerKey   = vm.envUint("DEPLOYER_PRIVATE_KEY");

        address deployer = vm.addr(deployerKey);

        console.log("=== Deploying The Vigil ===");
        console.log("Deployer:    ", deployer);
        console.log("Base URI:    ", baseURI);
        console.log("Chain ID:    ", block.chainid);
        console.log("Merkle root: ");
        console.logBytes32(merkleRoot);

        vm.startBroadcast(deployerKey);

        TheVigil vigil = new TheVigil(baseURI, merkleRoot);

        console.log("=== Deployed ===");
        console.log("TheVigil address:", address(vigil));
        console.log("Max supply:      ", vigil.MAX_SUPPLY());
        console.log("Tier A supply:   ", vigil.TIER_A_SUPPLY());

        // Do NOT enable mint yet — enable via setMintActive after final checks
        // vigil.setWhitelistMintActive(true);

        vm.stopBroadcast();

        // Write deployed address to a file for reference
        string memory output = string(abi.encodePacked(
            "VIGIL_CONTRACT_ADDRESS=",
            vm.toString(address(vigil))
        ));
        vm.writeFile("deployed-address.env", output);
    }
}
