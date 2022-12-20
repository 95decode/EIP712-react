import Header from "components/Header";
import { useWeb3React } from '@web3-react/core';
import seaportAbi from "abi/seaport.json";
import { BigNumber, ethers } from "ethers";
import types from "lib/signTypedData";
import address from "lib/address";
import zero from "lib/zero";
import extraData from "lib/extraData";
import { useState } from "react";

function Buy() {
    const {
        account,
        library
    } = useWeb3React();

    const [inputs, setInputs] = useState({
        amount: '',
        tokenId: ''
    });

    const [signature, setSignature] = useState("");
    const [offerer, setOfferer] = useState("");

    const { amount, tokenId } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value 
        });
    };

    const consideration = async () => {
        const domain = {
            name: 'Seaport',
            version: '1.1',
            chainId: 5,
            verifyingContract: address.seaport
        };
        
        // fee : 1%
        const fee = BigNumber.from(amount).div(100);
        const price = BigNumber.from(amount).sub(fee);

        const message = {
            offerer: account,
            zone: address.zero,
            offer:[
                {
                    itemType: 2,
                    token: address.erc721,
                    identifierOrCriteria: tokenId,
                    startAmount: 1,
                    endAmount: 1
                }
            ],
            consideration:[
                {
                    itemType: 0,
                    token: address.zero,
                    identifierOrCriteria: 0,
                    startAmount: price.toString(),
                    endAmount: price.toString(),
                    recipient: account
                },{
                    itemType: 0,
                    token: address.zero,
                    identifierOrCriteria: 0,
                    startAmount: fee.toString(),
                    endAmount: fee.toString(),
                    recipient: address.feeReceipent
                }
            ],
            orderType: 0,
            startTime: 1,
            endTime: 100000000000000,
            zoneHash: zero.bytes32,
            salt: extraData.salt,
            conduitKey: extraData.conduitKey,
            counter: 0
        }

        const msgParams = JSON.stringify({
            domain: domain,
            message: message,
            primaryType: 'OrderComponents',
            types: types
        })

        setSignature(await library.provider.request({
            method: "eth_signTypedData_v4",
            params: [account, msgParams],
            from: account
        }));

        setOfferer(account as string);
    }

    const buy = async ()=> {
        // fee : 1%
        const fee = BigNumber.from(amount).div(100);
        const price = BigNumber.from(amount).sub(fee);

        try {
            const contract = new ethers.Contract(address.seaport, seaportAbi, library.getSigner());
            const basicOrderParameters = {
                considerationToken: address.zero,
                considerationIdentifier: 0,
                considerationAmount: price.toString(),
                offerer: offerer,
                zone: address.zero,
                offerToken: address.erc721,
                offerIdentifier: tokenId,
                offerAmount: 1,
                basicOrderType: 0,
                startTime: 1,
                endTime: 100000000000000,
                zoneHash: zero.bytes32,
                salt: extraData.salt,
                offererConduitKey: extraData.conduitKey,
                fulfillerConduitKey: extraData.conduitKey,
                totalOriginalAdditionalRecipients: 1,
                additionalRecipients: [{
                    amount: fee.toString(),
                    recipient: address.feeReceipent
                }],
                signature: signature
            };

            // MUST update channel to true

            const tx = await contract.fulfillBasicOrder(basicOrderParameters, {
                value: amount,
                gasLimit: 200000
            });

            const receipt = await tx.wait();

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
                <p>판매자 sign</p>
            </div>
            <div>
                <input name="amount" placeholder="amount" onChange={onChange} value={amount}/>
                <input name="tokenId" placeholder="tokenId" onChange={onChange} value={tokenId}/>
                <button type="button" onClick={consideration}>sign</button>
            </div>
            <div>
                <p>signature result : {signature}</p>
            </div>
            <div>
                <p>구매자 transaction</p>
            </div>
            <div>
                <button type="button" onClick={buy}>buy</button>
            </div>
        </div>
    );
}

export default Buy;