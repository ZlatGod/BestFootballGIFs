import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3, BN } from '@project-serum/anchor';

import { programAddress, pdaSeed, network, connectionsOptions } from './config';


// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

const connectWallet = async () => {
  try {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
      getGifList();
    }
    else { window.confirm('Solana object not found! Get a Phantom Wallet 👻. Click on OK to be redirected to the Phantom Wallet website. Phantom is the best wallet to hold Solana tokens. https://phantom.app/ ')
    } 
    } catch(error) {
    console.error(error);
  }
};

const initialize = async () => {
  const { pda, bump } = await getProgramDerivedAddress();
  const program = await getProgram();
  try {
    await program.rpc.initialize(new BN(bump), {
      accounts: {
        user: getProvider().wallet.publicKey,
        baseAccount: pda,
        systemProgram: web3.SystemProgram.programId,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const getConnectionProvider = () => {
  const connection = new Connection(
    endpoint,
    connectionsOptions.preflightCommitment
  );

  const provider = new Provider(
    connection,
    window.solana,
    connectionsOptions.preflightCommitment
  );
  return provider;
};

const getProgram = async () => {
  // Get metadata about your solana program
  const idl = await Program.fetchIdl(programAddress, getProvider());
  // Create a program that you can call

  return new Program(idl, programAddress, getProvider());
};

const getBaseAccount = async () => {
  const { pda } = await getProgramDerivedAddress();
  const program = await getProgram();
  try {
    return await program.account.baseAccount.fetch(pda);;
  } catch (error) {
    console.error(error);
  }
};

const getProgramDerivedAddress = async () => {
  const [pda, bump] = await PublicKey.findProgramAddress(
    // eslint-disable-next-line no-undef
    [Buffer.from(pdaSeed)],
    programAddress
  );
  console.log(`Got ProgramDerivedAddress: bump: ${bump}, pubkey: ${pda.toBase58()}`);
  return { pda, bump };
};

const uploadGif = async (gifLink) => {
  const { pda } = await getProgramDerivedAddress();
  const program = await getProgram();
  try {
    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: pda,
        user: getProvider().wallet.publicKey,
      },
    });
    console.log('GIF successfully sent to program', gifLink);
  } catch (error) {
    console.log('Error sending GIF:', error);
  }
};


const createTransaction = async(instructions) => {
  const anyTransaction = new web3.Transaction().add(instructions);
  anyTransaction.feePayer = getConnectionProvider().wallet.publicKey;
  console.log("Getting Recent Blockhash");
  anyTransaction.recentBlockhash = (
    await getConnectionProvider().connection.getRecentBlockhash()
  ).blockhash;
  return anyTransaction;
}

const createTransferTransaction = async (from, to, amount) => {
  return createTransaction(
    web3.SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: 100000 * amount,
  }));
}

const getGifList = async () => {
  return (await getBaseAccount())?.gifList;
};

const transferSolana = async (from, to, amount) => {
  try {
    console.log(`sending ${amount} from: ${from}, to: ${to}`);

    const { signature } = await getProvider().wallet.signAndSendTransaction(
      await createTransferTransaction(from, to, amount)
    );
    console.log(`Submitted transaction ${signature}, awaiting confirmation`);

    const r = await getProvider().connection.confirmTransaction(signature);
    console.log(`Transaction ${signature} confirmed`);
    return r;
  } catch (err) {
    console.warn(err);
    console.error(`Error: ${JSON.stringify(err)}`);
  }
};

export {
  connectWallet,
  initialize,
  getBaseAccount,
  getGifList,
  uploadGif,
  upVoteGif,
  transferSolana,
};

