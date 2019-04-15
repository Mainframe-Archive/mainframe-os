pragma solidity >=0.4.21 <0.6.0;
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract ContactInvite is Ownable, Pausable {

  ERC20 public token;
  uint public requiredStake;
  uint public creationBlock;

  enum InviteState { NONE, PENDING, ACCEPTED, REJECTED }

  struct InviteRequest {
    uint stake;
    uint block;
    InviteState state;
    address senderAddress;
  }

  // Invites mapped to keys of recipient feed and eth address hashes

  mapping (bytes32 => mapping (bytes32 => InviteRequest)) public inviteRequests;

  constructor(address _tokenAddress) public {
    token = ERC20(_tokenAddress);
    requiredStake = 100 ether;
    creationBlock = block.number;
  }

  function getInviteState(
    bytes32 senderAddressHash,
    bytes32 senderFeedHash,
    bytes32 recipientAddressHash,
    bytes32 recipientFeedHash
  ) external view returns (bytes32) {
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    InviteState state = inviteRequests[senderHash][recipientHash].state;
    if (state == InviteState.PENDING) {
      return 'PENDING';
    } else if (state == InviteState.REJECTED) {
      return 'REJECTED';
    } else if (state == InviteState.ACCEPTED) {
      return 'ACCEPTED';
    }
    return 'NONE';
  }

  function pendingInviteStake(
    bytes32 senderAddressHash,
    bytes32 senderFeedHash,
    bytes32 recipientAddressHash,
    bytes32 recipientFeedHash
  ) external view returns (uint256) {
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    return inviteRequests[senderHash][recipientHash].stake;
  }

  function sendInvite(
    bytes32 recipientAddressHash,
    bytes32 recipientFeedHash,
    string calldata senderFeed
  ) external whenNotPaused {
    bytes32 senderFeedHash = keccak256(abi.encodePacked(senderFeed));
    bytes32 senderAddressHash = keccak256(abi.encodePacked(msg.sender));
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    InviteState state = inviteRequests[senderHash][recipientHash].state;
    require(token.allowance(msg.sender, address(this)) >= requiredStake, 'Insufficient balance to stake');
    require(state != InviteState.PENDING, 'Invite to this user already pending');
    require(state != InviteState.REJECTED, 'Invite to this user has been rejected');
    require(state != InviteState.ACCEPTED, 'Invite to this user has already been accepted');
    token.transferFrom(msg.sender, address(this), requiredStake);
    inviteRequests[senderHash][recipientHash].stake = requiredStake;
    inviteRequests[senderHash][recipientHash].block = block.number;
    inviteRequests[senderHash][recipientHash].state = InviteState.PENDING;
    inviteRequests[senderHash][recipientHash].senderAddress = msg.sender;
    emit Invited(recipientFeedHash, recipientAddressHash, senderFeed, msg.sender, requiredStake);
  }

  function declineAndWithdraw(
    bytes32 senderAddressHash,
    bytes32 senderFeedHash,
    bytes32 recipientFeedHash
  ) external whenNotPaused {
    bytes32 recipientAddressHash = keccak256(abi.encodePacked(msg.sender));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    require(inviteRequests[senderHash][recipientHash].stake > 0, 'No stake to withdraw');
    uint stake = inviteRequests[senderHash][recipientHash].stake;
    inviteRequests[senderHash][recipientHash].stake = 0;
    inviteRequests[senderHash][recipientHash].state = InviteState.REJECTED;
    token.transfer(msg.sender, stake);
    emit Declined(senderFeedHash, senderAddressHash, recipientFeedHash);
  }

  function retrieveStake(
    bytes32 recipientAddressHash,
    bytes32 recipientFeedHash,
    bytes32 senderFeedHash,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external whenNotPaused {
    bytes32 senderAddressHash = keccak256(abi.encodePacked(msg.sender));
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    require(inviteRequests[senderHash][recipientHash].stake > 0, 'No stake to withdraw');
    bytes32 verifiedSig = verifySig(senderAddressHash, v, r, s);
    require(verifiedSig == recipientAddressHash, 'Unable to verify recipient signature');
    uint stake = inviteRequests[senderHash][recipientHash].stake;
    inviteRequests[senderHash][recipientHash].stake = 0;
    inviteRequests[senderHash][recipientHash].state = InviteState.ACCEPTED;
    token.transfer(msg.sender, stake);
    emit StakeRetrieved(msg.sender, recipientFeedHash);
  }

  function verifySig(bytes32 addressHash, uint8 v, bytes32 r, bytes32 s) internal pure returns (bytes32) {
    bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n52MFOS Contact Accept:", addressHash));
    address _address = ecrecover(messageDigest, v, r, s);
    return keccak256(abi.encodePacked(_address));
  }

  function adminRefund(
    bytes32 senderAddressHash,
    bytes32 senderFeedHash,
    bytes32 recipientAddressHash,
    bytes32 recipientFeedHash
  ) external onlyOwner {
    bytes32 senderHash = keccak256(abi.encodePacked(senderAddressHash, senderFeedHash));
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddressHash, recipientFeedHash));
    uint stake = inviteRequests[senderHash][recipientHash].stake;
    require(stake > 0, 'No stake to refund');
    inviteRequests[senderHash][recipientHash].stake = 0;
    inviteRequests[senderHash][recipientHash].state = InviteState.NONE;
    token.transfer(inviteRequests[senderHash][recipientHash].senderAddress, stake);
    emit AdminRefunded(inviteRequests[senderHash][recipientHash].senderAddress, recipientFeedHash, stake);
  }

  function setStake(
    uint newStake
  ) external onlyOwner {
    uint oldStake = requiredStake;
    requiredStake = newStake;
    emit StakeChanged(oldStake, newStake);
  }

  // EVENTS

  event Invited(
    bytes32 indexed recipientFeedHash,
    bytes32 recipientAddressHash,
    string senderFeed,
    address senderAddress,
    uint stakeAmount
  );
  event Declined(
    bytes32 indexed senderFeedHash,
    bytes32 indexed senderAddressHash,
    bytes32 recipientFeedHash
  );
  event StakeRetrieved(
    address indexed senderAddress,
    bytes32 recipientFeedHash
  );
  event AdminRefunded(
    address indexed senderAddress,
    bytes32 recipientFeedHash,
    uint amount
  );
  event StakeChanged(
    uint oldStake,
    uint newStake
  );
}
