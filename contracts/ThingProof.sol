pragma solidity ^0.4.24;

contract ThingProof {

    event _newThing(bytes32 id);

    struct Thing {
        bytes32 id;
        // add additional props
    }
    address public owner = msg.sender;

    mapping (bytes32 => bool) private proofs;
    mapping (bytes32 => Thing) private things;

    modifier ownerOnly {
        if (msg.sender == owner) _;
    }

    // calculate and store the proof for a thing
    function notarize(bytes32 id) public ownerOnly {
        things[id] = Thing(id);
        proofs[id] = true;
        emit _newThing(id);
    }
}
