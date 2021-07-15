import { Button } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default styled(({ className, children }) => {
    const { account, onboard } = useWeb3();
    const [validAddress, setValidAddress] = useState(false);

    useEffect(() => {
        if (whitelist.includes(account?.toLowerCase() ?? 'not-in-whitelist')) {
            setValidAddress(true);
        } else {
            setValidAddress(false);
        }
    }, [account]);

    if (validAddress) {
        return <>{children}</>;
    } else {
        if (account) {
            return (
                <div className={className}>
                    <p>
                        Unfortunately the interface is not accessible by this address at this time. <br />
                        If you believe this is a mistake please reach out to the Mycelium Team via Discord.
                    </p>
                </div>
            );
        } else {
            return (
                <div className={className}>
                    <p>
                        Connect your wallet to get
                        <br />
                        started with Tracer
                    </p>
                    <Button onClick={() => onboard?.walletSelect()}>Connect Wallet</Button>
                </div>
            );
        }
    }
})<{
    className?: string;
    children: any;
}>`
    font-size: var(--font-size-medium);
    color: #fff;
    background: var(--color-background);
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    > ${Button} {
        margin: 1rem auto;
        border-color: #fff;
        color: #fff;
    }
`;

const whitelist = [
    // '0x2804f1308e0423d893f181f4e63b6fa2a6e9cf1e',
    // '0x0029ab135b5be72168bf80f140d60a9264dbd0c5',
    // '0xb7518905149eb3dbdb22d022afc071e633d06aa1',
    // '0xf3bd1eb50951b9ef78d4e35d75601ad8ba7da59e',
    // '0x5eea91e130df8767c847d36e7139dc5dd648bd43',
    // '0x50689e276febc646e13476ace96e1fb287b1c2e9',
    // '0x628a5245e8e824f6acf49006ed034c2094010245',
    // '0xe5adf94c39f3c96732ef66b1b94d1e5c99cde805',
    // '0xfdbf424146e39e5f420e116903af75f23328c8b1',
    // '0x01974549c9b9a30d47c548a16b120b1caa7b586c',
    // '0x79df0010ae0434534e75321bea2b858036c661bb',
    // '0xe943398da56744435f094bc1478c203fb0045e20',
    // '0x2a9b9db94aeaecac20787856b33cb3129777f053',
    // '0x76accffd0a86c0c9d547a1fd79cc9f270429e15d',
    // '0x727d5c62cf2bd163603e5210bcdf5f556cb16df0',
    // '0xbce50232dc5dd9de266c76ace00fe2b43d6df431',
    // '0x788ca7f1d7f9deea0a09ca0157da1f8e54036066',
    // '0x56899f9c75ddd8611f27feb3168f37278ef4b496',
    // '0x46b8ffc41f26cd896e033942caf999b78d10c277',
    // '0xca4140ca2c4e457db32c8c54b061d1c36b2df3e1',
    // '0xbee3752a1e1d837c92ef1f794ad21121eb1d82c4',
    // '0x93842d58fdf43d1bb64685ed4c7ba7766ac2b6d5',
    // '0xf817554cc4ca4fe435dbf43bd1bacf0d7b0f38d7',
    // '0xd7988b659063352a3867979f8f35181a5835b439',
    // '0xd84e11bee5d555ccd905817cb8cbbd5b6e6c4f0d',
    // '0x29c4b9d93473ce3631eb7815b00419b0146db18f',
    // '0x7cb3b0598624204c73317fdaef64daa2a2cada23',
    // '0x42e792cf54bdf57bbf0592c3f02d2b3f3b27d8c2',
    // '0x1a8a67603eacb511b6aad692061bb8184bf0c5d1',
    // '0x322d19eb471f8e6380d200aaae9632593cfd1b80',
    // '0x83fc330807dfb3c2fdd3fc9ecb8529b1d8509a94',
    // '0x61a1fe521232ed09433616136d6ccc24ca01d6c5',
    // '0x0f280fdc1f719528a67d5353dc438f73ca814f4c',
    // '0x79eb92be992b88e80ab2d9e96fb0cf0fecd84fa4',
    // '0xbccf9f2b76c7e2460d0acb9763ae8b779675e568',
    // '0x722e895a12d2a11be99ed69dbc1fedbb9f3cd8fe',
    // '0xfd42ad1ff493eeb0cf9a6d58f02642fb76755849',
    // '0x00c030d1a4ae0c144021ca4e30705d8075aa827a',
    // '0x2f4ec21984ce14f7da1cb0ca37d11dd477d75995',
    // '0x560c8110b2c2f85261c0f761e329235194daa6b9',
    // '0x4f66f66b916142c055da9cca02036aba430a8dce',
    // '0xde0f7b7959d6a2733175bd67cad991dbd0a1df07',
    // '0x0877570a694b00d11f6c16c95ddbe2d50d4a7707',
    // '0x5dbb9ac850b1da38c332b68e2045186f1339caf4',
    // '0x10959926fb4926d181a2ea46ceb234150ab70c9b',
    // '0xefae1190444aae8cff4915eb7d5054bfcdfedce6',
    // '0xcf81c184061e2cc15bc504ee2d3475a62beb8fd9',
    // '0x583ca5dbcdb58b1bc3b107c6c6a87fbe933d461d',
    // '0x6cd68e8f04490cd1a5a21cc97cc8bc15b47dc9eb',
    // '0xae2690b62a99f595b3c78e4d60a4e87a0f277333',
    // '0xb9d2acf2c5db82348a5ef0008287a2fe60d1b0f0',
    // '0xe3347f8e662583d6eeee6c3117a7dddace070984',
    // '0xa76f9db8546a9bd4c02faa8dbfd12910008f04ff',
    // '0x27412e76f372bd30400d6883b010c50909d5258d',
    // '0x6cf51fdef74d02296017a1129086ee9c3477dc01',
    // '0xab5f2b1328c0f8c6c306d54ec31a029d2d5d60e4',
    // '0xab57ad01ef6c420089c2bac26f204a28406f73e0',
    // '0x7867c5f717a833f9c29790b3424e69f8c1d164fa',
    // '0x09212c58107c8da21b0f67a63e2144bb68bee4eb',
    // '0xe085327c5ad2f77147f10973fed45fb19d734f7e',
    // '0x1f2a94b02d8303614ba629854180125e4b4fe1d8',
    // '0x35b0fc0ca3e2378bb52aac56a2178e59e617f6ef',
    // '0xd4e9464660eb9c5f18a44e3d9dba9403da3f3a6b',
    // '0x3a8c0181845c2c183ffe1bd92a0c676d1b523596',
    // '0x9b183e10fab65823749381caaead6eccfe63c348',
    // '0xaf2a34a7f3cbe9473c6bd016b8198b3a0345e9cd',
    // '0x8ff997b9463401d84a4bbfa2d1e4a1a4c34a046f',
    // '0xb5041a23d31fe96b160c829c41ef41a7944262e6',
    // '0x18f1df93aa25d034f06f539d0fe3b23c6a5b049c',
    // '0x0242b6cc997fc1c438d01421bef7839932d9de26',
    // '0xf50242724bc4f4d9abba9660c0e64db9c4e3ec7c',
    // '0xd31c4835c58d28ec57d51e303b146f89324a3b57',
    // '0x59ebb0c68ea105dc1fecd5a37a64e8b435757a1c',
    // '0xf35d426c97dba704b44d77ada1463dfda373269a',
    // '0xac12f4a822091f8eda66afc71b2f0edc45bc3266',
    // '0x8f51a2a3138921f0d5d6fa6f5ad86e5880869674',
    // '0x9a8d375d20f54e7e0500e13bcb0b9a1cf36ff62d',
    // '0xbaf3c5958f0c073feb9312816edca59fe070a2d7',
    // '0xca6a7ee70bc1a817751601d6ba7caecea748342b',
    // '0x27aea25f12f766103d2ee71143349952e480ab0f',
    // '0xe84d3290e7026849365107a0af0746055e3f9603',
    // '0x3d1c6674d5506282fdfc8c42f3d0174d01c964ee',
    // '0x854058553df87ef1be2c1d8f24eea8af52a81ff1',
    // '0x0c2ea600d8bece889f998d6a22332298e879940b',
    // '0x565f6f12688332f43c35706ac77aeed36f1ef5e3',
    // '0x7046fd611be89023e20f4f8711c38cb31692c7f3',
    // '0x1668c9725e27bf5943bbd43886e1fb5afe75c46c',
    // '0x63ff66b94b87a724bc6d2772ad9b1538bb1ab238',
    // '0x44c51816d2b75cbd5cf63b2c8107e6f8d9a39529',
    // '0x372e68e5f7848feab4d846a4f5eedaaa9d99ff74',
    // '0x0e1c46258a646cb045164606b88ae0aa965da67d',
    // '0x217917e355855fdf1bb22c52b6fdb7d89133aeec',
    // '0x6e3674ab23fea3968e0e859ff89c2667c9c4cc74',
    // '0x638321992570dfff36482c5040bade38767e5a1b',
    // '0xd1f0494cf8ee37fa8b826d8a1f3d47c28b9edb73',
    // '0x96126905354188d54fde07af311747e83fcb3a50',
    // '0x5bbbb4a44c709aa4b53efac6caa14ad5cece2014',
    // '0x142ae08b246845cec2386b5eacb2d3e98a1e04e3',
    // '0xfb59b91646cd0890f3e5343384feb746989b66c7',
    // '0x23fdecc1b7d71c51a30fce442fe2c8f6bfe8c179',
    // '0xa530e31995ea13db8f7bbc27cca07cb701e1a77d',
    // '0xcd234fbab4173f7e63a813d2aafaf5b2ae12dead',
    // '0x30c648196541159bdd77dd35e0b203bc4b6e7822',
    // '0x6ffa4693fed2a564081f05de211f212bffd7ee74',
    // '0xc9530b1640cc254d3c0337b532f8a9b14e44344c',
    // '0xf62b5220001c0e491dc7ebd5ca72b161e59eca65',
    // '0x0f9aa60c9194dfb91a34a69b8b3c2d545e8e8645',
    // '0x9b7a417cde9d1e116958e4aaef6c09928e0fe5bd',
    // '0x7656901efcd6e179e7e13ae93cfb8373689f4160',
    // '0x759ffc37876fea188660e881baa6333aac024f00',
    // '0x8cdbebeee5b70749be0fad211cada13bd07c9f9f',
    // '0x61f5a3d36c10d7ea1d797e70f7486eb7ad177481',
    // '0x5aef242ec5d13b4c0dc255c09522b95178cc6467',
    // '0x62e2301441a117aef332cacb8de280df7eed14b7',
    // '0xaee33d473c68f9b4946020d79021416ff0587005',
    // '0xbce50232dc5dd9de266c76ace00fe2b43d6df431',
    // '0xbfa87a09169330c1a84045c3250b96e9f5a0d2f8',
    // '0x3b85ed76a2aff1775eb93a57cbfe66fe1e32f0fc',
    // '0x4f66f66b916142c055da9cca02036aba430a8dce',
    '0x217917e355855fdf1bb22c52b6fdb7d89133aeec',
    '0x4f66f66b916142c055da9cca02036aba430a8dce',
    '0xb5baffb036576b46f45544174208faa5b7dc1cfb',
    '0xa530e31995ea13db8f7bbc27cca07cb701e1a77d', // start
    '0xcd234fbab4173f7e63a813d2aafaf5b2ae12dead',
    '0x30c648196541159bdd77dd35e0b203bc4b6e7822',
    '0x6ffa4693fed2a564081f05de211f212bffd7ee74',
    '0xc9530b1640cc254d3c0337b532f8a9b14e44344c',
    '0x759ffc37876fea188660e881baa6333aac024f00',
    '0xf62b5220001c0e491dc7ebd5ca72b161e59eca65',
    '0x0f9aa60c9194dfb91a34a69b8b3c2d545e8e8645',
    '0x9b7a417cde9d1e116958e4aaef6c09928e0fe5bd',
    '0x9b7a417cde9d1e116958e4aaef6c09928e0fe5bd',
    '0x7656901efcd6e179e7e13ae93cfb8373689f4160',
    '0x62e2301441a117aef332cacb8de280df7eed14b7',
    '0xc1fc80e6a85388da3263ea6ac008db1ed6e4162b',
    '0xc23c9b17581c9fdfcc786466a74808213b74be12',
    '0x110af92ba116fd7868216aa794a7e4da3b9d7d11',
    '0x55ea772a66db39a90004b12628884fd89ec9449b',
    '0xa83fde98c89c74b6b92ce24e2fc6b914b88d0d1c',
];
