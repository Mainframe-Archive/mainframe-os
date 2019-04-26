pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract Token is ERC20, ERC20Detailed {
  constructor() public ERC20Detailed("Mainframe", "MFT", 18) {
    _mint(msg.sender, 10000000000 ether);
  }
}
