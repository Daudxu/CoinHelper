// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface TokenErc {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

 contract CoinTokenTools is Initializable, OwnableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __Ownable_init();
    }

    event LogTokenAirdrop(uint256 indexed total, address indexed token);
    event LogEtherAirdrop(uint256 indexed value, address indexed _address);

    using SafeMath for uint;
    // cashier Address
    address public  cashierAddress;
    // Supported token addresses
    address public tokenAddress;
    // Token required to open Vip
    uint256 public VIPTokenFee;
    // vip list mapping
    mapping(address => bool) public vipList;
    // vip sign time mapping
    mapping(address => uint) public vipSignUpTime;

   
    /*
     *  sigin up  VIP
     */
    function  registerVIP() external  {
        uint256 balanceOf = TokenErc(tokenAddress).balanceOf(msg.sender);
        require(balanceOf > VIPTokenFee, "Check the token balanceOf");
        uint256 allowance = TokenErc(tokenAddress).allowance(msg.sender, address(this));
        require(allowance > VIPTokenFee, "Check the token allowance");
        TokenErc(tokenAddress).transferFrom(msg.sender, cashierAddress, VIPTokenFee);
        vipList[msg.sender] = true;
        vipSignUpTime[msg.sender] = block.timestamp;
    }

    /*
     *  VIP list
     */
    function addToVIPList(address[] calldata _vipList) onlyOwner public {
        for (uint i = 0; i < _vipList.length; i++) {
            vipList[_vipList[i]] = true;
        }
    }

    /*
     * Remove VIP 
     */
    function removeFromVIPList(address[] calldata _vipList) onlyOwner public {
        for (uint i = 0; i < _vipList.length; i++) {
            vipList[_vipList[i]] = false;
        }
    }

    /*
     * Check isVIP
     */
    function isVIP(address _addr) public view returns(bool) {
        return  vipList[_addr];
    }
    /*
     * view VIP Time
     */
    function viewVIPTime(address _addr) public view returns(uint) {
        return  vipSignUpTime[_addr];
    }

    /*
     * set cashier address
     */
    function setCashierAddress(address _addr) onlyOwner public {
        require(_addr != address(0));
        cashierAddress = _addr;
    }

    /*
        * set vip Tokenfee
    */
    function setVIPTokenFee(uint256 _TokenFee) onlyOwner public {
        VIPTokenFee = _TokenFee;
    }

    /*
     * set vip Tokenfee
     */
    function setTokenAddress (address _tokenAddress) onlyOwner public {
        tokenAddress = _tokenAddress;
    }

    modifier hasFee() {
        bool vip = isVIP(msg.sender);
        if (!vip) {
            revert("You need to open a member");
        }
        _;
    }
    /**
    * token Airdrop
    */
    function tokenAirdrop(address token, address[] calldata _address, uint256[] calldata _amount) public hasFee payable {
         require(_address.length > 0 && _amount.length > 0 );
        if (token == 0x000000000000000000000000000000000000bEEF){
             etherAirdrop(_address, _amount);
        } else {
            uint256 total = 0;
            TokenErc erc20token = TokenErc(token);
            uint8 i = 0;
            for (i; i < _address.length; i++) {
                erc20token.transferFrom(msg.sender, _address[i], _amount[i]);
                total += _amount[i];
            }
            emit LogTokenAirdrop(total, token);
        }
    }
    /**
    * ether Airdrop
    */
    function etherAirdrop(address[] calldata _address, uint256[] calldata _amount) public hasFee payable {
        require(_address.length > 0 && _amount.length > 0 );
        uint256 i = 0;
        for (i; i < _address.length; i++) {
             payable(_address[i]).transfer(_amount[i]);
        }
    }

    /**
     */


    
    
}