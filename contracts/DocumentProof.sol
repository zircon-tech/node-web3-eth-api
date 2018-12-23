pragma solidity ^0.4.24;

contract DocumentProof {
    struct Document {
        DocumentVersion[] versions;
    }

    struct DocumentVersion {
        string hash;
    }
    address public owner = msg.sender;

    // stored documents and versions
    mapping (string => mapping (string => bool)) private proofs;
    mapping (string => Document) private documents;

    modifier ownerOnly {
        if (msg.sender == owner) _;
    }

    // calculate and store the proof for a document
    function notarize(string id, string hash) external ownerOnly {
        DocumentVersion memory version = DocumentVersion({ hash: hash });
        documents[id].versions.push(version);
        proofs[id][hash] = true;
    }

    function exists(string id, string hash) public view returns (bool) {
        return proofs[id][hash];
    }
}
