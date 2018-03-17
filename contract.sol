contract Openart {
    string hash;
    uint256 cost;
    address owner;
    
    mapping(address => bool) is_buyer;
    address[] buyers;
    
    function Openart(string thash, uint256 tcost){
        hash = thash;
        cost = tcost;
        owner = msg.sender;
    }
    
    function buy() public payable {
        require(msg.value >= cost);
        is_buyer[msg.sender] = true;
        buyers.push(msg.sender);
    }
    
    function getBuyers() public constant returns (address[]) {
        require(msg.sender == owner);
        return buyers;
    }
    
    function getHash() public constant returns (string) {
        if(is_buyer[msg.sender]){
            return hash;
        }else{
            return "ACCESS DENIED";
        }
    }
    
    function getValue() public constant returns (uint256) {
        return cost;
    }
}
