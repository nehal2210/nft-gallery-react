import react, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./styles.css";
import Spinner from "react-bootstrap/Spinner";
import rightIcon from "./images/right.png";
import cp from "./images/cp.png";
// import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [tags, setTags] = useState([
    {
      tagName: "CryptoPunks",
      value: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    },
    {
      tagName: "Bored Ape",
      value: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    },
    {
      tagName: "Doodls",
      value: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    },
    {
      tagName: "Moonbirds",
      value: "0x23581767a106ae21c074b2276d25e5c3e136a68b",
    },
    {
      tagName: "otherdeeds",
      value: "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
    },
  ]);
  let copiedTimeoutHandler;
  const [walletAddress, setWalletAddress] = useState(null);
  const [searchNft, setSearchNft] = useState("");
  const [wallet, setWallet] = useState("");
  const [spinner1, setSpinner1] = useState(false);
  const [spinner2, setSpinner2] = useState(false);

  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [copied, setCopied] = useState([]);
  // const search = () => {
  //   console.log("value", searchNft);
  // };

  // useEffect(() => {
  //   checkIfWalletIsConnected();
  //   walletChangeListener();

  //   // fetchNfts();
  // }, []);

  const copy = (address, index) => {
    if (copiedTimeoutHandler) {
      clearTimeout(copiedTimeoutHandler);
      setCopied([]);
    }

    navigator.clipboard.writeText(address);

    let copied = [];
    copied[index] = true;

    setCopied(copied);

    copiedTimeoutHandler = setTimeout(() => {
      setCopied([]);
    }, 1500);
  };
  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const { ethereum } = window;

        const accounts = await ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    } catch (err) {
      console.error("Please install metamask");
    }
  };

  const connectWallet = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (window.ethereum) {
          const { ethereum } = window;

          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);

            resolve(accounts[0]);
          } else {
            alert("No address found");
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const walletChangeListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            // Disconnected
            setWalletAddress(null);
          } else {
            setWalletAddress(accounts[0]);
          }
        });
      }
    } catch (err) {}
  };

  const fetchNFTsForCollection = async () => {
    console.log(collection);
    setSpinner2(true);
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
        setSpinner2(false);
      }
    }
  };

  const shortenAddress = (address) => {
    if (address.length === 0) {
      return "";
    }

    return `${address.substr(0, 6)}...${address.substr(address.length - 6, 6)}`;
  };

  const fetchNFTs = async () => {
    let nfts;
    setSpinner1(true);
    console.log("fetching nfts");
    const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
    setSpinner1(false);
  };

  const setMyAddress = async () => {
    if (!walletAddress) {
      console.log("waallet");
      setWallet(await connectWallet());
    } else {
      console.log("waallet else");

      setWallet(walletAddress);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>NFT's Gallery</h1>
        <p>
          Real-world things such as artwork and real estate can be represented
          with NFTs.
        </p>
      </div>
      <div className="body">
        <div className="search-box">
          <div className="m-2">
            <p>Connect Wallet</p>
            <InputGroup>
              <Form.Control
                value={wallet}
                placeholder="Wallet Address."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={(e) => setWallet(e.target.value)}
              />

              <Button variant="primary" id="button-addon2" onClick={fetchNFTs}>
                {spinner1 ? (
                  <Spinner size="sm me-2" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : null}
                Search
              </Button>
            </InputGroup>
          </div>
          <div className="tags m-2">
            <Button variant="secondary" size="sm" onClick={setMyAddress}>
              Get My Adress With MetaMask
            </Button>
          </div>
          <div className="m-2">
            <p>Search</p>
            <InputGroup>
              {collection ? (
                <Form.Control
                  value={collection}
                  onChange={(e) => setCollectionAddress(e.target.value)}
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
              ) : (
                <Form.Control
                  onChange={(e) => setCollectionAddress(e.target.value)}
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
              )}
              <Button
                variant="primary"
                id="button-addon2"
                onClick={() => {
                  console.log("hello");
                  fetchNFTsForCollection();
                }}
              >
                {spinner2 ? (
                  <Spinner size="sm me-2" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : null}
                Search
              </Button>
            </InputGroup>
          </div>
          <div className="tags">
            {tags.map((tag, i) => {
              return (
                <Button
                  key={tag.value}
                  variant="secondary"
                  size="sm m-1"
                  onClick={() => {
                    setCollectionAddress(tag.value);
                  }}
                >
                  {tag.tagName}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="gallery">
          {NFTs.length != 0 ? (
            NFTs.map((nft, index) => {
              return (
                <div key={nft.id.tokenId} className="img-container">
                  <img src={nft.media[0].gateway} />
                  <p className="text-xl text-gray-800 bold">{nft.title}</p>
                  <div className="nft-content">
                    <h5 className="text-md text-slate-500 group-hover:text-slate-600">
                      {shortenAddress(nft.contract.address)}
                      {!copied[index] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline-block ml-2 relative cursor-pointer text-slate-500"
                          height="18"
                          viewBox="0 0 24 24"
                          width="18"
                          onClick={() => copy(nft.contract.address, index)}
                        >
                          <path d="M0 0h24v24H0V0z" fill="none"></path>
                          <path
                            fill="currentColor"
                            d="M15 1H4c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V4c0-.55.45-1 1-1h10c.55 0 1-.45 1-1s-.45-1-1-1zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"
                          ></path>
                        </svg>
                      )}

                      {copied[index] && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline-block ml-2 relative cursor-pointer text-slate-500"
                        >
                          <path fill="none" d="M0 0h24v24H0V0Z" />
                          <path
                            fill="currentColor"
                            d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0 -.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41 -.39-.39-1.02-.39-1.41 0L9 16.17Z"
                          />
                        </svg>
                      )}
                    </h5>
                    {/* <CopyToClipboard
                    text={nft.contract.address}
                    onClick={() => setCopy({ copied: true })}
                  >
                    <p className="italic">
                      {nft.contract.address.slice(1, 6) +
                        "..." +
                        nft.contract.address.slice(-6, -1)}
                    </p>
    
                  </CopyToClipboard>

                  {copy.copied ? (
                    <img className="cp" src={cp} />
                  ) : (
                    <img className="cp" src={rightIcon} />
                  )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <h2 style={{ color: "white" }}>No Wallet found</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
