$(function () {
	$(".typed").typed({
		strings: [
			"Got PetaBytes of Memory ?",
			"Need Instant Search and Encryption",
			"GODSPEED ..!!! ",
			" Welcome to the World of No-Bits",
			"WE TALK QUANTUM"
		],
		stringsElement: null,
		typeSpeed: 30,
		startDelay: 1200,
		backSpeed: 50,
		backDelay: 1000,
		loop: false,
		loopCount: 5,
		showCursor: false,
		cursorChar: "|",
		attr: null,
		contentType: 'html',
		callback: function () {},
		preStringTyped: function () {},
		onStringTyped: function () {},
		resetCallback: function () {}
	});
});

// Dropzone.options.myAwesomeDropzone = {
//     paramName: "file", // The name that will be used to transfer the file
//     maxFilesize: 2, // MB
//     accept: function(file, done) {
//         console.log("Accepted file");
//         done();
//     }
// };

var ipfsHost = "http://localhost:8080";
var selectedFile = undefined;

function upload() {
	const reader = new FileReader();
	reader.onloadend = function () {
		const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
		const buf = buffer.Buffer(reader.result) // Convert data into buffer
		ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
			if (err) {
				console.error(err)
				return
			}
			let url = `${ipfsHost}/ipfs/${result[0].hash}`
			console.log(`Url --> ${url}`)
			uploadHash($("#account").val(),result[0].hash, document.getElementById("valueInput").value);
			document.getElementById("downloadUrl").innerHTML = url
			document.getElementById("downloadUrl").href = url
			document.getElementById("fbShare").href += url
			$(".hashBox").css({
				"display": "flex"
			});
			$(".fileInputForm").css({
				"display": "none"
			});
		})
	}
	// const file = document.getElementById("file");
	// reader.readAsArrayBuffer(file.files[0]); // Read Provided File
	reader.readAsArrayBuffer(selectedFile);
}

function download() {
	var hash = downloadHash(
		$("#buyerAccount").val(),
		$("#address").val()
	);

	downloadURI(`${ipfsHost}/ipfs/${hash}`);
}

function abort() {
	var hash = abortHash(
		$("#aborterAccount").val(),
		$("#aborterAddress").val()
	);
}

function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	link.click();
}

function changeSelectedFile(event) {
	selectedFile = document.getElementById("hiddenFileField").files[0];
	$("#fileName").html(selectedFile.name);
}

function copyToClipboard() {
	var copyTextarea = document.querySelector('#hashKey');
	copyTextarea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}
}

function drop_handler(ev) {
	console.log("Drop");
	ev.preventDefault();
	// If dropped items aren't files, reject them
	var dt = ev.dataTransfer;
	var files = [];
	if (dt.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < dt.items.length; i++) {
			if (dt.items[i].kind == "file") {
				var f = dt.items[i].getAsFile();
				console.log("... file[" + i + "].name = " + f.name);
				files.push(f);
			}
		}
	} else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < dt.files.length; i++) {
			console.log("... file[" + i + "].name = " + dt.files[i].name);
			files.push(dt.files[i]);
		}
	}
	if (files.length != 1) return;

	selectedFile = files[0];
	$("#fileName").html(selectedFile.name);
}

function dragover_handler(ev) {
	console.log("dragOver");
	// Prevent default select and drag behavior
	ev.preventDefault();
}

function dragend_handler(ev) {
	console.log("dragEnd");
	// Remove all of the drag data
	var dt = ev.dataTransfer;
	if (dt.items) {
		// Use DataTransferItemList interface to remove the drag data
		for (var i = 0; i < dt.items.length; i++) {
			dt.items.remove(i);
		}
	} else {
		// Use DataTransfer interface to remove the drag data
		ev.dataTransfer.clearData();
	}
}

var web3;

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var myContract;
var address;
var Contract;
var contract;

$.getJSON('/js/Openart.json', function(data){
	Contract = data;

	myContract = web3.eth.contract(Contract);
})

function uploadHash(account,thash, tvalue) {
	web3.eth.defaultAccount = web3.eth.coinbase;
	var browser_mycontract_sol_purchaseContract = web3.eth.contract(Contract);
	var browser_mycontract_sol_purchase = browser_mycontract_sol_purchaseContract.new(
		thash,
		tvalue, {
			from: account,
			data: '0x6060604052341561000f57600080fd5b6040516106c53803806106c583398101604052808051820191906020018051906020019091905050816000908051906020019061004d9291906100b8565b508060018190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff021916908315150217905550505061015d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100f957805160ff1916838001178555610127565b82800160010185558215610127579182015b8281111561012657825182559160200191906001019061010b565b5b5090506101349190610138565b5090565b61015a91905b8082111561015657600081600090555060010161013e565b5090565b90565b6105598061016c6000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632096525514610067578063a6f2ae3a14610090578063d13319c41461009a578063f64bfaba14610128575b600080fd5b341561007257600080fd5b61007a610192565b6040518082815260200191505060405180910390f35b61009861019c565b005b34156100a557600080fd5b6100ad61028c565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100ed5780820151818401526020810190506100d2565b50505050905090810190601f16801561011a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561013357600080fd5b61013b6103c4565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561017e578082015181840152602081019050610163565b505050509050019250505060405180910390f35b6000600154905090565b60015434101515156101ad57600080fd5b60011515600260149054906101000a900460ff1615151415156101cf57600080fd5b6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506004805480600101828161023b91906104b4565b9160005260206000209001600033909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6102946104e0565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156103885760008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561037c5780601f106103515761010080835404028352916020019161037c565b820191906000526020600020905b81548152906001019060200180831161035f57829003601f168201915b505050505090506103c1565b6040805190810160405280600d81526020017f4143434553532044454e4945440000000000000000000000000000000000000081525090505b90565b6103cc6104f4565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561042857600080fd5b60048054806020026020016040519081016040528092919081815260200182805480156104aa57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610460575b5050505050905090565b8154818355818115116104db578183600052602060002091820191016104da9190610508565b5b505050565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b61052a91905b8082111561052657600081600090555060010161050e565b5090565b905600a165627a7a723058204a1f9df10a290ec425e42d8f8404a48115ed1a5fcc0303780b7c87ca3c64d4440029', 
			gas: '4700000'
		},
		function (e, c) {
			contract = c;
			console.log(e, contract);

			if (typeof contract.address !== 'undefined') {
				console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
				$("#hashKey").val(contract.address);
			}
		})
}

function downloadHash(account, address) {
	var myContract = web3.eth.contract(Contract);
	var contract = myContract.at(address);

	var value = contract.getValue().toString();

	console.log("Value required : "+value);
	
	contract.buy.sendTransaction({
		from: account,
		value: value
	});

	var hash = contract.getHash({
		from: account
	});
	console.log("Recevied hash : "+hash);

	return hash;
}

function old_downloadHash(account, address) {
	var myContract = web3.eth.contract(Contract);
	var contract = myContract.at(address);
	console.log(contract);
	var result = contract.getHash.sendTransaction({
		from: account
	});
	console.log("Result : ", result);
	return result;
}

function abortHash(account, address) {
	var myContract = web3.eth.contract(Contract);
	var contract = myContract.at(address);
	web3.eth.defaultAccount = account;
	contract.abort.call();
}