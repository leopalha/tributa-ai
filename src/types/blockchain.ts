export interface Transaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  status: 'success' | 'failed' | 'pending';
  method?: string;
  type?: string;
  nonce?: number;
}

export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  holders: number;
  price?: string;
  marketCap?: string;
  type: 'ERC20' | 'ERC721' | 'ERC1155' | string;
  contractAddress: string;
  creator?: string;
  createdAt: string | Date;
  balance?: string;
  imageUrl?: string;
  description?: string;
  verified?: boolean;
  stats: {
    transfers: number;
    holders: number;
    transactions: number;
    age: number;
  };
}

export interface Contract {
  id: string;
  address: string;
  name: string;
  type: string;
  owner: string;
  deployer: string;
  createdAt: string | Date;
  description?: string;
  verified: boolean;
  category?: string;
  version?: string;
  stats: {
    transactions: number;
    balance: number;
    age: number;
    uniqueCallers: number;
  };
}

export interface WalletBalance {
  address: string;
  balance: string;
  tokens: {
    token: Token;
    balance: string;
    value?: string;
  }[];
  transactions: Transaction[];
}

export interface NetworkStatus {
  name: string;
  latestBlock: number;
  gasPrice: string;
  tps: number;
  status: 'operational' | 'congested' | 'degraded';
  nodes: number;
}
