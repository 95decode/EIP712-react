import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import injected from 'lib/connectors';
import { Link } from "react-router-dom";
import address from "lib/address";
import erc20Abi from "abi/erc20.json";
import erc721Abi from "abi/erc721.json";
import extraData from 'lib/extraData';

function Header() {
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

    const mintERC20 = async () => {
        try {
            let contract = new ethers.Contract(address.erc20, erc20Abi, library.getSigner());

            const tx = await contract.mint();
            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);

            return error;
        }
    }

    const mintERC721 = async () => {
        try {
            let contract = new ethers.Contract(address.erc721, erc721Abi, library.getSigner());

            const tx = await contract.mint();
            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);
            
            return error;
        }
    }

    const approveERC20 = async () => {
        try {
            let contract = new ethers.Contract(address.erc20, erc20Abi, library.getSigner());

            const tx = await contract.approve(address.conduit, extraData.max);
            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);

            return error;
        }
    }

    const approveERC721 = async () => {
        try {
            let contract = new ethers.Contract(address.erc721, erc721Abi, library.getSigner());

            const tx = await contract.setApprovalForAll(address.conduit, true);
            const receipt = await tx.wait();
            console.log(receipt);

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);
            
            return error;
        }
    }

    return (
        <header>
            <div>
                <Link to={"/"}>main</Link>
            </div>
            <div>
                <Link to={"/buy"}>buy</Link>
            </div>
            <div>
                <Link to={"/sell"}>sell</Link>
            </div>
            <div>
                <p>Account: {account}</p>
                <p>ChainId: {chainId}</p>
            </div>
            <div>
                <button type="button" onClick={handleConnect}>{ active ? 'disconnect' : 'connect' }</button>
            </div>
            <div>
                <p>Token mint</p>
            </div>
            <div>
                <button type="button" onClick={mintERC20}>ERC20</button>
                <button type="button" onClick={mintERC721}>ERC721</button>
            </div>
            <div>
                <p>Approve to conduit</p>
            </div>
            <div>
                <button type="button" onClick={approveERC20}>ERC20</button>
                <button type="button" onClick={approveERC721}>ERC721</button>
            </div>
        </header>
    );
}

export default Header;