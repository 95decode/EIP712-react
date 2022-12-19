// TODO : refactoring

import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import ABI from "abi/abi.json";
import seaportAbi from "abi/seaport.json";
import injected from 'lib/connectors';

function Connect() {
    const {
        chainId,
        account,
        active,
        library,
        activate,
        deactivate
    } = useWeb3React();

    const handleConnect = () => {
        if(active) {
            deactivate();
            return;
        }

        activate(injected(), (error) => {
            if(error) {
                console.log(error);
                window.open('https://metamask.io/download.html');
            }
        });
    }

    const test = async () => {
        try {
            const contract = getContract();

            const tx = await contract.A(3, {
                value : "100000000000000000"
            });

            const receipt = await tx.wait();
            console.log(receipt);
            return receipt.transactionHash;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    const getContract = () => {
        // test contracts
        let a = "0xF6B2A43fCea7D73fDa9Df7D7b1f3A07490B0460C";
        let b = ABI;
        return new ethers.Contract(a, b, library.getSigner());
    }

    const signV3 = async () => {
        const domain = {
            name: 'SignTypedData Test',
            version: '1',
            chainId: 5,
            verifyingContract: '0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92'
        };

        const types = {
            Test: [
                { name: 'TYPE_A', type: 'A' },
                { name: 'TYPE_B', type: 'B' },
                { name: 'TYPE_C', type: 'C' }
            ],
            A: [
                { name: 'type_a', type: 'string' },
                { name: 'value', type: 'address' }
            ],
            B: [
                { name: 'type_b', type: 'string' },
                { name: 'value', type: 'uint256' }
            ],
            C: [
                { name: 'type_c', type: 'string' }
            ]
        };

        const test = {
            TYPE_A: {
                type_a: "this is type a",
                value: "0x2111111111111111111111111111111111111111"
            },
            TYPE_B: {
                type_b: "this is type b",
                value: 123456789
            },
            TYPE_C: {
                type_c: "this is type c"
            }
        };
        
        let v = library.getSigner();
        console.log(await v._signTypedData(domain, types, test));
        return
    }

    const signV4 = async () => {
        const domain = {
            name: 'SignTypedData Test V4',
            version: '1',
            chainId: 5,
            verifyingContract: '0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92'
        };

        const types = {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Test: [
                { name: 'TYPE_A', type: 'A' },
                { name: 'TYPE_B', type: 'B' },
                { name: 'TYPE_C', type: 'C' },
                { name: 'TYPE_D', type: 'D' },
            ],
            A: [
                { name: 'type_a', type: 'string' },
                { name: 'value', type: 'address' }
            ],
            B: [
                { name: 'type_b', type: 'string' },
                { name: 'value', type: 'uint256' }
            ],
            C: [
                { name: 'type_c', type: 'string' }
            ],
            D: [
                { name: 'type_d', type: 'uint256[]'}
            ]
        };

        const test = {
            TYPE_A: {
                type_a: "this is type a",
                value: "0x2111111111111111111111111111111111111111"
            },
            TYPE_B: {
                type_b: "this is type b",
                value: 123456789
            },
            TYPE_C: {
                type_c: "this is type c"
            },
            TYPE_D: {
                type_d: [1, 3, 5, 7]
            }
        }

        const msgParams = JSON.stringify({
            domain: domain,
            message: test,
            primaryType: 'Test',
            types: types
        })

        const params = [account, msgParams];

        /**
         * Represents the version of `signTypedData` being used.
         *
         * V1 is based upon [an early version of EIP-712](https://github.com/ethereum/EIPs/pull/712/commits/21abe254fe0452d8583d5b132b1d7be87c0439ca)
         * that lacked some later security improvements, and should generally be neglected in favor of
         * later versions.
         *
         * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
         *
         * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
         */
        console.log(await library.provider.request({
            method: "eth_signTypedData_v4",
            params: params,
            from: account
        }));

        //recoverTypedSignatureV4 from eth-sig-util

        return
    }

    const consideration = async () => {
        const domain = {
            name: 'Seaport',
            version: '1.1',
            chainId: 5,
            verifyingContract: '0x413Ae7516A0eEbebF4c33061c5f908F1CF8C8Ce5'
        };

        const types = {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            OrderComponents: [
                { name: "offerer", type: "address" },
                { name: "zone", type: "address" },
                { name: "offer", type: "OfferItem[]" },
                { name: "consideration", type: "ConsiderationItem[]" },
                { name: "orderType", type: "uint8" },
                { name: "startTime", type: "uint256" },
                { name: "endTime", type: "uint256" },
                { name: "zoneHash", type: "bytes32" },
                { name: "salt", type: "uint256" },
                { name: "conduitKey", type: "bytes32" },
                { name: "counter", type: "uint256" },
            ],
            OfferItem: [
                { name: "itemType", type: "uint8" },
                { name: "token", type: "address" },
                { name: "identifierOrCriteria", type: "uint256" },
                { name: "startAmount", type: "uint256" },
                { name: "endAmount", type: "uint256" },
            ],
            ConsiderationItem: [
                { name: "itemType", type: "uint8" },
                { name: "token", type: "address" },
                { name: "identifierOrCriteria", type: "uint256" },
                { name: "startAmount", type: "uint256" },
                { name: "endAmount", type: "uint256" },
                { name: "recipient", type: "address" },
            ],
        };
            
        const message = {
            offerer: "0x00000000879Cd60de9fEaC82452cead7a07E18df",
            zone: "0x0000000000000000000000000000000000000000",
            offer:[
                {
                    itemType: 2,
                    token: "0xc3D1Ecb231bBAe23A978aDBf3119E826E7Eb3828",
                    identifierOrCriteria: 0,
                    startAmount: 1,
                    endAmount: 1
                }
            ],
            consideration:[
                {
                    itemType: 0,
                    token: "0x0000000000000000000000000000000000000000",
                    identifierOrCriteria: 0,
                    startAmount: "48750000000000000",
                    endAmount: "48750000000000000",
                    recipient: "0x00000000879Cd60de9fEaC82452cead7a07E18df"
                },{
                    itemType: 0,
                    token: "0x0000000000000000000000000000000000000000",
                    identifierOrCriteria: 0,
                    startAmount: "1250000000000000",
                    endAmount: "1250000000000000",
                    recipient: "0x69f5b75D9e20921e07F7B3AD0751BB1C06D915CA"
                }
            ],
            orderType: 0,
            startTime: 1,
            endTime: 100000000000000,
            zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            salt: "0x0000000012345600000000000000000000000000000000000000000000000000",
            conduitKey: "0x00000000879Cd60de9fEaC82452cead7a07E18df000000000000000000000000",
            counter: 0
        }

        const msgParams = JSON.stringify({
            domain: domain,
            message: message,
            primaryType: 'OrderComponents',
            types: types
        })

        const params = [account, msgParams];

        console.log(await library.provider.request({
            method: "eth_signTypedData_v4",
            params: params,
            from: account
        }));

        // result : 0x0c4d8487295548f9bc5493c6cb0aaace2174f87612c8389daddd129a0b775bd040d79c3d535e79ce4ba657f607fb233f0b055ea0c51a7a4048e2d0c3bfc2f1211c
    }

    const buy = async ()=> {
        try {
            let seaport = "0x413Ae7516A0eEbebF4c33061c5f908F1CF8C8Ce5";
            let seaportABI = seaportAbi;

            let contract = new ethers.Contract(seaport, seaportABI, library.getSigner());

/*

struct BasicOrderParameters {
    // calldata offset
    address considerationToken; // 0x24
    uint256 considerationIdentifier; // 0x44
    uint256 considerationAmount; // 0x64
    address payable offerer; // 0x84
    address zone; // 0xa4
    address offerToken; // 0xc4
    uint256 offerIdentifier; // 0xe4
    uint256 offerAmount; // 0x104
    BasicOrderType basicOrderType; // 0x124
    uint256 startTime; // 0x144
    uint256 endTime; // 0x164
    bytes32 zoneHash; // 0x184
    uint256 salt; // 0x1a4
    bytes32 offererConduitKey; // 0x1c4
    bytes32 fulfillerConduitKey; // 0x1e4
    uint256 totalOriginalAdditionalRecipients; // 0x204
    AdditionalRecipient[] additionalRecipients; // 0x224
    bytes signature; // 0x244
    // Total length, excluding dynamic array data: 0x264 (580)
}

struct AdditionalRecipient {
    uint256 amount;
    address payable recipient;
}

*/

            //consideration 서명 내용 포함
            let basicOrderParameters = {
                considerationToken: "0x0000000000000000000000000000000000000000",
                considerationIdentifier: 0,
                considerationAmount: "48750000000000000",
                offerer: "0x00000000879Cd60de9fEaC82452cead7a07E18df",
                zone: "0x0000000000000000000000000000000000000000",
                offerToken: "0xc3D1Ecb231bBAe23A978aDBf3119E826E7Eb3828",
                offerIdentifier: 0,
                offerAmount: 1,
                basicOrderType: 0,
                startTime: 1,
                endTime: 100000000000000,
                zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                salt: "0x0000000012345600000000000000000000000000000000000000000000000000",
                offererConduitKey: "0x00000000879Cd60de9fEaC82452cead7a07E18df000000000000000000000000",
                fulfillerConduitKey: "0x00000000879Cd60de9fEaC82452cead7a07E18df000000000000000000000000",
                totalOriginalAdditionalRecipients: 1,
                additionalRecipients: [{
                    amount: "1250000000000000",
                    recipient: "0x69f5b75D9e20921e07F7B3AD0751BB1C06D915CA"
                }],
                signature: "0x0c4d8487295548f9bc5493c6cb0aaace2174f87612c8389daddd129a0b775bd040d79c3d535e79ce4ba657f607fb233f0b055ea0c51a7a4048e2d0c3bfc2f1211c"
            };

            // MUST update channel to true

            const tx = await contract.fulfillBasicOrder(basicOrderParameters, {
                value: "50000000000000000",
                gasLimit: 173292
            });

            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);

            return error;
        }
    }

    const consideration2 = async () => {
        const domain = {
            name: 'Seaport',
            version: '1.1',
            chainId: 5,
            verifyingContract: '0x413Ae7516A0eEbebF4c33061c5f908F1CF8C8Ce5'
        };

        const types = {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            OrderComponents: [
                { name: "offerer", type: "address" },
                { name: "zone", type: "address" },
                { name: "offer", type: "OfferItem[]" },
                { name: "consideration", type: "ConsiderationItem[]" },
                { name: "orderType", type: "uint8" },
                { name: "startTime", type: "uint256" },
                { name: "endTime", type: "uint256" },
                { name: "zoneHash", type: "bytes32" },
                { name: "salt", type: "uint256" },
                { name: "conduitKey", type: "bytes32" },
                { name: "counter", type: "uint256" },
            ],
            OfferItem: [
                { name: "itemType", type: "uint8" },
                { name: "token", type: "address" },
                { name: "identifierOrCriteria", type: "uint256" },
                { name: "startAmount", type: "uint256" },
                { name: "endAmount", type: "uint256" },
            ],
            ConsiderationItem: [
                { name: "itemType", type: "uint8" },
                { name: "token", type: "address" },
                { name: "identifierOrCriteria", type: "uint256" },
                { name: "startAmount", type: "uint256" },
                { name: "endAmount", type: "uint256" },
                { name: "recipient", type: "address" },
            ],
        };
            
        const message = {
            offerer: "0x00000000879Cd60de9fEaC82452cead7a07E18df",
            zone: "0x0000000000000000000000000000000000000000",
            offer:[
                {
                    itemType: 2,
                    token: "0xc3D1Ecb231bBAe23A978aDBf3119E826E7Eb3828",
                    identifierOrCriteria: 0,
                    startAmount: 1,
                    endAmount: 1
                }
            ],
            consideration:[
                {
                    itemType: 0,
                    token: "0x0000000000000000000000000000000000000000",
                    identifierOrCriteria: 0,
                    startAmount: "48750000000000000",
                    endAmount: "48750000000000000",
                    recipient: "0x00000000879Cd60de9fEaC82452cead7a07E18df"
                },{
                    itemType: 0,
                    token: "0x0000000000000000000000000000000000000000",
                    identifierOrCriteria: 0,
                    startAmount: "1250000000000000",
                    endAmount: "1250000000000000",
                    recipient: "0x69f5b75D9e20921e07F7B3AD0751BB1C06D915CA"
                }
            ],
            orderType: 0,
            startTime: 1,
            endTime: 100000000000000,
            zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            salt: "0x0000000012345600000000000000000000000000000000000000000000000000",
            conduitKey: "0x00000000879Cd60de9fEaC82452cead7a07E18df000000000000000000000000",
            counter: 0
        }

        const msgParams = JSON.stringify({
            domain: domain,
            message: message,
            primaryType: 'OrderComponents',
            types: types
        })

        const params = [account, msgParams];

        console.log(await library.provider.request({
            method: "eth_signTypedData_v4",
            params: params,
            from: account
        }));

        // result : 0x0c4d8487295548f9bc5493c6cb0aaace2174f87612c8389daddd129a0b775bd040d79c3d535e79ce4ba657f607fb233f0b055ea0c51a7a4048e2d0c3bfc2f1211c
    }

    const sell = async () => {
        try {
            let seaport = "0x413Ae7516A0eEbebF4c33061c5f908F1CF8C8Ce5";
            let seaportABI = seaportAbi;

            let contract = new ethers.Contract(seaport, seaportABI, library.getSigner());

/*

offerer:
    0x00000000879Cd60de9fEaC82452cead7a07E18df
offer:
    0:
        itemType:
            1
        token:
            0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        identifierOrCriteria:
            0  
        startAmount:
            1000000000000000
        endAmount:
            1000000000000000
consideration:
    0:
        itemType:
            2
        token:
            0x15987A0417D14cc6f3554166bCB4A590f6891B18
        identifierOrCriteria:
            213576
        startAmount:
            1
        endAmount:
            1
        recipient:
            0x00000000879Cd60de9fEaC82452cead7a07E18df
    1:
        itemType:
            1
        token:
            0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        identifierOrCriteria:
            0
        startAmount:
            25000000000000
        endAmount:
            25000000000000
        recipient:
            0x0000a26b00c1F0DF003000390027140000fAa719
    2:
        itemType:
            1
        token:
            0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        identifierOrCriteria:
            0
        startAmount:
            50000000000000
        endAmount:
            50000000000000
        recipient:
            0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F
startTime:
    1671420347
endTime:
    1671679543
orderType:
    0    
zone:
    0x0000000000000000000000000000000000000000
zoneHash:
    0x0000000000000000000000000000000000000000000000000000000000000000
salt:
    24446860302761739304752683030156737591518664810215442929804057035552702189998
conduitKey:
    0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000
counter:
    0

*/

            // offer 서명 내용 포함
            let basicOrderParameters = {

            };

            // MUST update channel to true

            const tx = await contract.fulfillBasicOrder(basicOrderParameters, {
                value: "50000000000000000",
                gasLimit: 173292
            });

            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div>
                <p>Account: {account}</p>
                <p>ChainId: {chainId}</p>
            </div>
            <div>
                <button type="button" onClick={handleConnect}>{active ? 'disconnect':'connect'}</button>
            </div>
            <div>
                <p>Contract: 0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92</p>
            </div>
            <div>
                <button type="button" onClick={test}>transact</button>
            </div>
            <div>
                <p>Sign typed data v3, v4</p>
            </div>
            <div>
                <button type="button" onClick={signV3}>signV3</button>
                <button type="button" onClick={signV4}>signV4</button>
            </div>
            <div>
                <p>make consideration</p>
            </div>
            <div>
                <button type="button" onClick={consideration}>sign</button>
                <button type="button" onClick={consideration2}>sign2</button>
            </div>
            <div>
                <p>transact</p>
            </div>
            <div>
                <button type="button" onClick={buy}>buy</button>
                <button type="button" onClick={sell}>sell</button>
            </div>
        </div>
    );
}

export default Connect;