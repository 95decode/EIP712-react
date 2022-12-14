// TODO : Modify offer and consideration

import Header from "components/Header";
import { useWeb3React } from '@web3-react/core';
import seaportAbi from "abi/seaport.json";
import { ethers } from "ethers";
import types from "lib/signTypedData";
import address from "lib/address";

function Sell() {
    const {
        account,
        library
    } = useWeb3React();

    const consideration = async () => {
        const domain = {
            name: 'Seaport',
            version: '1.1',
            chainId: 5,
            verifyingContract: address.seaport
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

    const sell = async ()=> {
        try {
            let contract = new ethers.Contract(address.seaport, seaportAbi, library.getSigner());

            //consideration ?????? ?????? ??????
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

    return (
        <div>
            <Header />
            <div>
                <p>Seaport : {address.seaport}</p>
                <p>Conduit : {address.conduit}</p>
                <p>ERC20 : {address.erc20}</p>
                <p>ERC721 : {address.erc721}</p>
            </div>
            <div>
                <p>????????? sign </p>
            </div>
            <div>
                <button type="button" onClick={consideration}>sign</button>
            </div>
            <div>
                <p>????????? transaction</p>
            </div>
            <div>
                <button type="button" onClick={sell}>sell</button>
            </div>
        </div>
    );
}

export default Sell;