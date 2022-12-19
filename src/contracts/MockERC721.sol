// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 internal _tokenId;

    constructor() ERC721("MockERC721", "MockERC721") {}

    function mint() public {
        _mint(msg.sender, _tokenId);

        unchecked {
            _tokenId++;
        }
    }
}