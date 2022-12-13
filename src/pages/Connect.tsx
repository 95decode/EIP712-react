import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import ABI from "abi/abi.json";
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

            const tx = await contract.A(3);

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
        let a = "0x44274669d47Ca48b20652a1Da0a9d52B7aa89b92";
        let b = ABI;
        return new ethers.Contract(a, b, library.getSigner());
    }

    const sign = async () => {
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

/*
        EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],...

        const method = "eth_signTypedData_v4";

        const msgParams = JSON.stringify({
            domain: domain,
            message: types,
            primaryType: 'Test',
            types: test
        })

        const params = [account, msgParams];

        await v.send({
            method,
            params,
            form: account
        });
        */

    return (
        <div>
            <div>
                <p>Account: {account}</p>
                <p>ChainId: {chainId}</p>
            </div>
            <div>
                <button type="button" onClick={handleConnect}>{active ? 'disconnect':'connect'}</button>
                <button type="button" onClick={test}>test</button>
                <button type="button" onClick={sign}>sign</button>
            </div>
        </div>
    );
}

export default Connect;