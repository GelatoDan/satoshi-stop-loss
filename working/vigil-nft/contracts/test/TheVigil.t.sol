// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheVigil.sol";

contract TheVigilTest is Test {
    TheVigil public vigil;

    address owner   = address(0x1);
    address alice   = address(0x2);
    address bob     = address(0x3);
    address charlie = address(0x4);

    bytes32 constant EMPTY_MERKLE_ROOT = bytes32(0);
    string  constant BASE_URI = "https://api.thevigilnft.xyz/metadata/";

    function setUp() public {
        vm.startPrank(owner);
        vigil = new TheVigil(BASE_URI, EMPTY_MERKLE_ROOT);
        vigil.setMintActive(true);
        vm.stopPrank();
    }

    // =========================================================
    // BASIC MINTING
    // =========================================================

    function test_MintSingle() public {
        vm.prank(alice);
        vigil.mint(1);

        assertEq(vigil.totalSupply(), 1);
        assertEq(vigil.ownerOf(1), alice);
        assertEq(vigil.balanceOf(alice), 1);
    }

    function test_MintMax() public {
        vm.prank(alice);
        vigil.mint(2);

        assertEq(vigil.totalSupply(), 2);
        assertEq(vigil.balanceOf(alice), 2);
    }

    function test_RevertMintOverWalletLimit() public {
        vm.startPrank(alice);
        vigil.mint(2);
        vm.expectRevert("Vigil: wallet limit reached");
        vigil.mint(1);
        vm.stopPrank();
    }

    function test_RevertMintWhenNotActive() public {
        vm.prank(owner);
        vigil.setMintActive(false);

        vm.expectRevert("Vigil: public mint not active");
        vm.prank(alice);
        vigil.mint(1);
    }

    function test_TokenStartsAtOne() public {
        vm.prank(alice);
        vigil.mint(1);
        assertEq(vigil.ownerOf(1), alice);
    }

    // =========================================================
    // TIER SYSTEM
    // =========================================================

    function test_TierAForFirst500() public {
        // Mint to different addresses to fill Tier A
        for (uint256 i = 0; i < 250; i++) {
            address addr = address(uint160(100 + i));
            vm.prank(addr);
            vigil.mint(2); // 2 per wallet = 500 tokens total
        }

        assertEq(vigil.totalSupply(), 500);

        // All first 500 should be Tier A
        assertEq(vigil.getTier(1),   1);
        assertEq(vigil.getTier(250), 1);
        assertEq(vigil.getTier(500), 1);
    }

    function test_TierBAfter500() public {
        // Fill up Tier A
        for (uint256 i = 0; i < 250; i++) {
            address addr = address(uint160(100 + i));
            vm.prank(addr);
            vigil.mint(2);
        }

        // Now mint into Tier B
        vm.prank(alice);
        vigil.mint(2);

        assertEq(vigil.getTier(501), 2);
        assertEq(vigil.getTier(502), 2);
    }

    function test_GetDiscountTierA() public {
        vm.prank(alice);
        vigil.mint(1); // Token #1 = Tier A

        assertEq(vigil.getDiscount(alice), 2000);
    }

    function test_GetDiscountTierB() public {
        // Fill Tier A first
        for (uint256 i = 0; i < 250; i++) {
            address addr = address(uint160(100 + i));
            vm.prank(addr);
            vigil.mint(2);
        }

        vm.prank(alice);
        vigil.mint(1); // Token #501 = Tier B

        assertEq(vigil.getDiscount(alice), 1000);
    }

    function test_GetDiscountNone() public {
        assertEq(vigil.getDiscount(alice), 0);
    }

    function test_DiscountFollowsTransfer() public {
        vm.prank(alice);
        vigil.mint(1); // Token #1 = Tier A, alice gets 2000 bps

        assertEq(vigil.getDiscount(alice), 2000);
        assertEq(vigil.getDiscount(bob),   0);

        // Alice transfers to Bob
        vm.prank(alice);
        vigil.transferFrom(alice, bob, 1);

        // Discount now follows the NFT to Bob
        assertEq(vigil.getDiscount(alice), 0);
        assertEq(vigil.getDiscount(bob),   2000);
    }

    // =========================================================
    // THE RECKONING
    // =========================================================

    function test_DeclareReckoning() public {
        vm.prank(owner);
        vigil.declareReckoning();

        assertTrue(vigil.reckoningDeclared());
        assertEq(vigil.reckoningBlock(), block.number);
    }

    function test_RevertDeclareReckoningTwice() public {
        vm.startPrank(owner);
        vigil.declareReckoning();
        vm.expectRevert("Vigil: reckoning already declared");
        vigil.declareReckoning();
        vm.stopPrank();
    }

    function test_VoteOnReckoning() public {
        vm.prank(alice);
        vigil.mint(2); // Gets 2 votes

        vm.prank(owner);
        vigil.declareReckoning();

        vm.prank(alice);
        vigil.voteOnReckoning(1); // Vote for The Storm

        assertEq(vigil.stormVotes(), 2);
        assertEq(vigil.dawnVotes(),  0);
    }

    function test_RevertVoteWithoutToken() public {
        vm.prank(owner);
        vigil.declareReckoning();

        vm.expectRevert("Vigil: must hold a Vigil to vote");
        vm.prank(alice);
        vigil.voteOnReckoning(1);
    }

    function test_RevertDoubleVote() public {
        vm.prank(alice);
        vigil.mint(1);

        vm.prank(owner);
        vigil.declareReckoning();

        vm.startPrank(alice);
        vigil.voteOnReckoning(2);
        vm.expectRevert("Vigil: already voted");
        vigil.voteOnReckoning(1);
        vm.stopPrank();
    }

    function test_FinalizeReckoningAfterVotingPeriod() public {
        vm.prank(alice);
        vigil.mint(2);
        vm.prank(bob);
        vigil.mint(2);

        vm.prank(owner);
        vigil.declareReckoning();

        vm.prank(alice);
        vigil.voteOnReckoning(1); // 2 votes Storm

        vm.prank(bob);
        vigil.voteOnReckoning(2); // 2 votes Dawn — tied, Storm wins (>=)

        // Fast forward 72 hours
        vm.warp(block.timestamp + 73 hours);

        vm.prank(owner);
        vigil.finalizeReckoning();

        // Tied goes to Storm (stormVotes >= dawnVotes)
        assertEq(vigil.reckoningVariant(), 1);
    }

    function test_RevertFinalizeBeforeVotingEnd() public {
        vm.prank(owner);
        vigil.declareReckoning();

        vm.warp(block.timestamp + 71 hours);

        vm.expectRevert("Vigil: voting period not ended");
        vm.prank(owner);
        vigil.finalizeReckoning();
    }

    // =========================================================
    // TOKEN URI
    // =========================================================

    function test_TokenURI() public {
        vm.prank(alice);
        vigil.mint(1);

        string memory uri = vigil.tokenURI(1);
        assertEq(uri, "https://api.thevigilnft.xyz/metadata/1");
    }

    function test_RevertTokenURIForNonexistentToken() public {
        vm.expectRevert("Vigil: token does not exist");
        vigil.tokenURI(999);
    }

    // =========================================================
    // SUPPLY HELPERS
    // =========================================================

    function test_RemainingSupply() public {
        assertEq(vigil.remainingSupply(), 2100);

        vm.prank(alice);
        vigil.mint(2);

        assertEq(vigil.remainingSupply(), 2098);
    }

    function test_TierARemaining() public {
        assertEq(vigil.tierARemaining(), 500);

        vm.prank(alice);
        vigil.mint(2);

        assertEq(vigil.tierARemaining(), 498);
    }

    // =========================================================
    // RESERVE MINT
    // =========================================================

    function test_ReserveMint() public {
        vm.prank(owner);
        vigil.reserveMint(owner, 5);

        assertEq(vigil.balanceOf(owner), 5);
    }

    function test_RevertReserveMintOverLimit() public {
        vm.expectRevert("Vigil: reserve limit exceeded");
        vm.prank(owner);
        vigil.reserveMint(owner, 101);
    }
}
