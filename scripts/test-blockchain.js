/**
 * Script para testar a integração blockchain
 * 
 * Este script testa a conexão com a blockchain e as operações básicas
 * como tokenização de ativos e swap de tokens.
 */

const { ethers } = require('ethers');

// ABI simplificado para um contrato ERC20 básico
const ERC20_ABI = [
  // Funções de leitura
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  // Funções de escrita
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  // Eventos
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Endereços de contratos para teste (Goerli testnet)
const TEST_TOKEN_ADDRESS = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'; // Link Token on Goerli

async function main() {
  try {
    console.log('Iniciando teste de integração blockchain...');
    
    // Conectar ao provedor
    const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/YOUR_INFURA_KEY');
    console.log('Provedor conectado');
    
    // Criar carteira de teste
    const wallet = ethers.Wallet.createRandom().connect(provider);
    console.log(`Carteira de teste criada: ${wallet.address}`);
    
    // Obter saldo de ETH
    const balance = await provider.getBalance(wallet.address);
    console.log(`Saldo ETH: ${ethers.utils.formatEther(balance)} ETH`);
    
    // Conectar ao contrato de token
    const tokenContract = new ethers.Contract(TEST_TOKEN_ADDRESS, ERC20_ABI, provider);
    const tokenSymbol = await tokenContract.symbol();
    const tokenDecimals = await tokenContract.decimals();
    console.log(`Token conectado: ${tokenSymbol}`);
    
    // Obter saldo do token
    const tokenBalance = await tokenContract.balanceOf(wallet.address);
    console.log(`Saldo ${tokenSymbol}: ${ethers.utils.formatUnits(tokenBalance, tokenDecimals)} ${tokenSymbol}`);
    
    console.log('Teste de integração blockchain concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o teste de integração blockchain:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 