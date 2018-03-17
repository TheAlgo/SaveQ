contract MediaRegistry {
    
    address owner;
    struct Media {
        string name;
        address mediaAddr;
    }
    
    // mapping(string => uint32) store;
    Media[] media;
    
    function MediaStore() {
        owner = msg.sender;
    }
    
    function getAllMedia() public constant returns (Media[]) {
        return media;
    }
    
    function registerMedia(string name, address mediaAddr) public {
        media.push(Media(name, mediaAddr));
    }
    
}
