import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import solana_logo from "./logo-solana-white.svg"

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Card, Row, Col, Button, Image, Form, Container, InputGroup, FormControl } from "react-bootstrap";

import {
  connectWallet,
  getGifList,
  initialize,
  uploadGif,
  upVoteGif,
} from './chainClient';




const SolanaLink = 'https://solana.com/'

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);




  const updateGifList = async (gifList) => {
    if (gifList === undefined) {
      console.log('gifList is undefined');
      return;
    }

    try {
      setGifList(
        gifList
          .filter((item) => item.gifLink.includes('media'))
          .sort((a, b) => (b.votes > a.votes ? 1 : -1))
      );
    } catch (error) {
      console.log('Error in getGifList: ', error);
    }
  };

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log('No gif link given!');
      return;
    }
    console.log('Gif link:', inputValue);
    await uploadGif(inputValue);
    // REFACTOR with useEffect and avoid repeating same code
    const gifList = await getGifList();
    updateGifList(gifList);
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const connectToUserWallet = async () => {
    const { publicKey } = await connectWallet();
    setUserWalletAddress(publicKey);
  };

  const initializePDA = async () => {
    await initialize();
  }
  
  

  const renderNotConnectedContainer = () => (
    <button
      lassName="wallet-connect" variant="primary"
      onClick={connectToUserWallet}
    >
      Connect to your Solana DevNet Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't be initialized.
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button className="" onClick={initializePDA}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    } 
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return(
        <div className="connected-container">
          <Row xs={1} md={1} className="g-4"> 
          <Form noValidate
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
          <InputGroup className="mx-auto w-50 mt-3 mb-5">
              <FormControl
                aria-label="Enter gif link!"
                aria-describedby="basic-addon1"
                placeholder="Enter gif link!"
                value={inputValue}
                onChange={onInputChange}
              />
              <Button type="submit" variant="primary" id="button-addon1" >
                Submit
              </Button>
            </InputGroup>
          </Form>
          </Row>
          <Row xs={1} md={4} className="g-4">
            {gifList.map((item, idx) => (
              <Col key={idx}>
                <Card>
                  <Card.Header>
                      Rank #{ idx.toString() }
                    </Card.Header>
                    <Card.Img variant="top" src={item.gifLink} />
                    <Card.Body>
                      <Card.Title>
                        Votes: {item.votes.toString()}
                      </Card.Title>
                      <div className="d-grid gap-2">
                      <Button variant="secondary" size="lg" data={item.id} onClick={incrementVote.bind(this, item.id)}>Up Vote 👍</Button>
                      </div>
                    </Card.Body>
                  <Card.Footer>
                    <Button className="btn-money" size="lg" data={item.id} onClick={sendTip.bind(this, item.id)}>
                    Send a Tip to {item.userAddress.toString().substring(0, 6)} 💰
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }
  };



  const sendTip = async (id) => {
    console.log('Tipping:', id);

    const fromWallet = userWalletAddress;
    // could use a hashmap
    const toWallet = gifList
      .filter((x) => x.id === id)
      .map((x) => x.userAddress);
    const amount = 1;
    await await transferSolana(fromWallet, toWallet, amount);
  };
  
  /* Votes */
  const upVote = async (id) => {
    console.log('UpVoting GifID:', id);
    upVoteGif(id);
  };

  useEffect(() => {
    const onLoad = async () => {
      connectToUserWallet();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    async function initChainClient() {
      const gifList = await getGifList();
      updateGifList(gifList);
    }
    initChainClient();
  }, [userWalletAddress]);

  return (
    <div className="App">
      <div className="d-flex flex-column">
        <div id="page-content">
          <div class="container text-center">
            <Row class="row justify-content-center">
              <div class="container">
                <h1 class="mb-5 mt-5 fw-bold mt-4 text-white"> ⚽ Best Football GIFS</h1>
                <p class="mb-0 lead text-white">
            Upload and view the latest and best football <a href ="https://giphy.com/" style={{ color: 'white' }} > GIFS </a> on the metaverse ✨
                </p>
                <p class="lead text-white">
            Post the best GIFS and you can get upVotes 👍 or Tips 💰
                </p>

                {!walletAddress && renderNotConnectedContainer()}
                {walletAddress && renderConnectedContainer()}
              </div>
            </Row>
          </div>
        </div>
      </div>
      <div id="sticky-footer" class="footer flex-shrink-0 py-0 bg-dark">
        <span>Built on </span> <a href="https://solana.com"><Image alt="Solana Logo" className="logo-solana" src={solana_logo} fluid /></a> 
               <span>  <p> 
            <a href="https://twitter.com/IBRAKADABRAAAAA" style={{ color: 'white' }}
          > <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}fluid/> by @IBRAKADABRAAAAA </a> </p> </span> 
      </div>
    </div>
  );
};

export default App;
