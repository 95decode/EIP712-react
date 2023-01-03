// TODO : refactoring

import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import ABI from "abi/abi.json";
import Header from 'components/Header';
import address from 'lib/address';

function Connect() {
    const {
        account,
        library
    } = useWeb3React();

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
        return new ethers.Contract(address.test, ABI, library.getSigner());
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
            MainType: [
                { name: "SubTypeAKey", type: "SubTypeA" },
                { name: "SubTypeBKey", type: "SubTypeB[]" },
            ],
            SubTypeA: [
                { name: "stringKey", type: "string" },
                { name: "addressKey", type: "address" },
            ],
            SubTypeB: [
                { name: "uint256Key", type: "uint256" },
                { name: "addressKey", type: "address" },
            ],
        };

        const test = {
            SubTypeAKey: {
                stringKey: "testString",
                addressKey: "0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92"
            },
            SubTypeBKey: [{
                uint256Key: 100,
                addressKey: "0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92"
            },{
                uint256Key: 200,
                addressKey: "0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92"
            }]
        }

        const msgParams = JSON.stringify({
            domain: domain,
            message: test,
            primaryType: 'MainType',
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

    return (
        <div>
            <Header />
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
        </div>
    );
}

export default Connect;