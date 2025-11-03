import contractABI from "@/lib/contract/abi.json";

export const MUSE_NFT_CONTRACT = {
  address: "0x4A8F23ADdEA57Ba5f09e4345CE8D40883Cda0F61" as `0x${string}`,
  abi: contractABI,
  chainId: 8453, // Base Mainnet
} as const;

// Contract constants
export const HD_MINT_PRICE = "0.001"; // ETH

// Block explorer
export const BASESCAN_URL = "https://basescan.org";
export const getTransactionUrl = (hash: string) => `${BASESCAN_URL}/tx/${hash}`;
export const getContractUrl = () =>
  `${BASESCAN_URL}/address/${MUSE_NFT_CONTRACT.address}`;
export const getTokenUrl = (tokenId: number) =>
  `${BASESCAN_URL}/token/${MUSE_NFT_CONTRACT.address}?a=${tokenId}`;
