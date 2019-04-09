pragma solidity >=0.4.21 <0.6.0;
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ContactInvite is Ownable, Pausable {

  ERC20 public token;
  uint public requiredStake;
  uint public creationBlock;

  enum InviteState { NONE, PENDING, ACCEPTED, REJECTED }

  struct InviteRequest {
    uint stake;
    uint block;
    InviteState state;
  }

  // Invites mapped to keys of recipient feed and eth address hashes

  mapping (address => mapping (bytes32 => InviteRequest)) public inviteRequests;

  constructor(address _tokenAddress) public {
    token = ERC20(_tokenAddress);
    requiredStake = 10 ether;
    creationBlock = block.number;
  }

  function getInviteState(
    address senderAddr,
    address recipientAddr,
    string calldata recipientFeed
  ) external view returns (bytes32) {
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddr, recipientFeed));
    InviteState state = inviteRequests[senderAddr][recipientHash].state;
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
    address senderAddress,
    address recipientAddr,
    string calldata recipientFeed
  ) external view returns (uint256) {
    bytes32 recipientHash = keccak256(
      abi.encodePacked(recipientAddr, recipientFeed)
    );
    return inviteRequests[senderAddress][recipientHash].stake;
  }

  function sendInvite(
    address recipientAddr,
    string calldata recipientFeed,
    string calldata senderFeed
  ) external whenNotPaused {
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddr, recipientFeed));
    InviteState state = inviteRequests[msg.sender][recipientHash].state;
    require(token.allowance(msg.sender, address(this)) >= requiredStake, 'Insufficient balance to stake');
    require(state != InviteState.PENDING, 'Invite to this user already pending');
    require(state != InviteState.REJECTED, 'Invite to this user has been rejected');
    require(state != InviteState.ACCEPTED, 'Invite to this user has already been accepted');
    token.transferFrom(msg.sender, address(this), requiredStake);
    inviteRequests[msg.sender][recipientHash].stake = requiredStake;
    inviteRequests[msg.sender][recipientHash].block = block.number;
    inviteRequests[msg.sender][recipientHash].state = InviteState.PENDING;
    emit Invited(recipientAddr, recipientFeed, senderFeed, msg.sender, requiredStake);
  }

  function declineAndWithdraw(
    address senderAddress,
    string calldata senderFeed,
    string calldata recipientFeed
  ) external whenNotPaused {
    bytes32 recipientHash = keccak256(abi.encodePacked(msg.sender, recipientFeed));
    require(inviteRequests[senderAddress][recipientHash].stake > 0, 'No stake to withdraw');
    token.transfer(msg.sender, inviteRequests[senderAddress][recipientHash].stake);
    inviteRequests[senderAddress][recipientHash].stake = 0;
    inviteRequests[senderAddress][recipientHash].state = InviteState.REJECTED;
    emit Declined(senderFeed, senderAddress, recipientFeed);
  }

  function retrieveStake(
    address recipientAddr,
    string calldata recipientFeed,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external whenNotPaused {
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddr, recipientFeed));
    require(inviteRequests[msg.sender][recipientHash].stake > 0, 'No stake to withdraw');
    require(verifySig(v,r,s) == recipientAddr, 'Unable to verify recipient signature');
    token.transfer(msg.sender, inviteRequests[msg.sender][recipientHash].stake);
    inviteRequests[msg.sender][recipientHash].stake = 0;
    inviteRequests[msg.sender][recipientHash].state = InviteState.ACCEPTED;
    emit StakeRetrieved(msg.sender, recipientAddr);
  }

  function verifySig(uint8 v, bytes32 r, bytes32 s) internal view returns (address) {
    bytes32 hashedAddress = keccak256(abi.encodePacked(msg.sender));
    bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedAddress));
    address _address = ecrecover(messageDigest, v, r, s);
    return _address;
  }

  function adminRefund(
    address senderAddress,
    address recipientAddress,
    string calldata recipientFeed
  ) external onlyOwner {
    bytes32 recipientHash = keccak256(abi.encodePacked(recipientAddress, recipientFeed));
    uint stake = inviteRequests[senderAddress][recipientHash].stake;
    require(stake > 0, 'No stake to refund');
    token.transfer(senderAddress, inviteRequests[senderAddress][recipientHash].stake);
    inviteRequests[senderAddress][recipientHash].stake = 0;
    inviteRequests[senderAddress][recipientHash].state = InviteState.NONE;
    emit AdminRefunded(senderAddress, recipientFeed, stake);
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
    address indexed recipientAddress,
    string indexed recipientFeed,
    string senderFeed,
    address senderAddress,
    uint stakeAmount
  );
  event Declined(
    string indexed senderFeed,
    address indexed senderAddress,
    string recipientFeed
  );
  event StakeRetrieved(
    address indexed sender,
    address recipient
  );
  event AdminRefunded(
    address indexed senderAddress,
    string recipientFeed,
    uint amount
  );
  event StakeChanged(
    uint oldStake,
    uint newStake
  );
}
