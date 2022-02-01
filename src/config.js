import { PublicKey, clusterApiUrl } from "@solana/web3.js";


export const programAddress = new PublicKey(
    '8hS16z59onCPBYDqbNnpCMjsMuoQYVe2vE7p3zZVoKxD'
);
  
export const pdaSeed = 'base_account22';
  
export const network = clusterApiUrl('devnet');
  
export const connectionsOptions = {
    preflightCommitment: 'processed',
};
