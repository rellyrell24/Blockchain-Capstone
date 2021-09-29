pragma solidity ^0.5.0;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

contract SolnSquareVerifier is POVToken {
    struct Solution {
        uint256 index;
        address solutionAddress;
    }

    Verifier private _verifier;

    Solution[] private _solutions;

    mapping(bytes32 => Solution) private _uniqueSolutions;

    event SolutionAdded(uint256 index, address solutionAddress);

    constructor(address verifierAddress) public {
        _verifier = Verifier(verifierAddress);
    }

    function addSolution(uint256 index, address solutionAddress, bytes32 solutionKey) internal {
        Solution memory solution = Solution(index, solutionAddress);
        _solutions.push(solution);
        _uniqueSolutions[solutionKey] = solution;
        emit SolutionAdded(index, solutionAddress);
    }

    function mintVerifiedToken(address to, uint256 index, uint256[2] calldata a, uint256[2][2] calldata b, uint256[2] calldata c, uint256[2] calldata inputs)
    external
    returns(bool)
    {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, inputs));
        require(_uniqueSolutions[solutionKey].solutionAddress == address(0), "Solution should be unique");
        require(_verifier.verifyTx(a, b, c, inputs), "Solution could not be verified");
        addSolution(index, to, solutionKey);
        return mint(to, index, "VerifiedToken");
    }
}

























