import { useWeb3React } from '@web3-react/core';
import injected from 'lib/connectors';
import { Link } from "react-router-dom";

function Header() {
    const {
        chainId,
        account,
        active,
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
        </header>
    );
}

export default Header;