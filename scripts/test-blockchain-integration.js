/**
 * Script para testar a integração blockchain completa
 * 
 * Este script testa a integração completa com a blockchain, incluindo:
 * - Conexão com carteiras (MetaMask)
 * - Tokenização de ativos
 * - Swap de tokens
 * - Registro de transações
 */

const { ethers } = require('ethers');
require('dotenv').config();

// ABIs necessários
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const TOKENIZATION_ABI = [
  "function tokenize(string assetType, uint256 assetValue, string assetDescription) returns (uint256 tokenId)",
  "function getTokenDetails(uint256 tokenId) view returns (string assetType, uint256 assetValue, string assetDescription, address owner)"
];

const SWAP_ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)"
];

// Endereços de contratos para teste (usar testnet)
const TEST_ADDRESSES = {
  tokenization: '0x1234567890123456789012345678901234567890', // Substituir por endereço real
  swapRouter: '0x2345678901234567890123456789012345678901',   // Substituir por endereço real
  testToken1: '0x3456789012345678901234567890123456789012',   // Substituir por endereço real
  testToken2: '0x4567890123456789012345678901234567890123'    // Substituir por endereço real
};

// Função principal de teste
async function main() {
  try {
    console.log('=== INICIANDO TESTE DE INTEGRAÇÃO BLOCKCHAIN ===');
    
    // 1. Conectar ao provedor
    console.log('\n1. Conectando ao provedor...');
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'https://goerli.infura.io/v3/YOUR_INFURA_KEY');
    console.log('✅ Provedor conectado');
    
    // 2. Criar carteira de teste
    console.log('\n2. Criando carteira de teste...');
    const privateKey = process.env.TEST_PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`✅ Carteira de teste criada: ${wallet.address}`);
    
    // 3. Obter saldo de ETH
    console.log('\n3. Verificando saldo de ETH...');
    const balance = await provider.getBalance(wallet.address);
    console.log(`✅ Saldo ETH: ${ethers.utils.formatEther(balance)} ETH`);
    
    if (ethers.utils.formatEther(balance) === '0.0') {
      console.warn('⚠️ A carteira de teste não possui ETH. Algumas operações podem falhar.');
      console.warn('   Considere enviar ETH para esta carteira antes de continuar.');
    }
    
    // 4. Conectar aos contratos
    console.log('\n4. Conectando aos contratos...');
    const tokenizationContract = new ethers.Contract(
      TEST_ADDRESSES.tokenization,
      TOKENIZATION_ABI,
      wallet
    );
    
    const swapRouterContract = new ethers.Contract(
      TEST_ADDRESSES.swapRouter,
      SWAP_ROUTER_ABI,
      wallet
    );
    
    const token1Contract = new ethers.Contract(
      TEST_ADDRESSES.testToken1,
      ERC20_ABI,
      wallet
    );
    
    const token2Contract = new ethers.Contract(
      TEST_ADDRESSES.testToken2,
      ERC20_ABI,
      wallet
    );
    
    console.log('✅ Contratos conectados');
    
    // 5. Testar tokenização de ativo
    console.log('\n5. Testando tokenização de ativo...');
    try {
      console.log('   Enviando transação de tokenização...');
      const tx = await tokenizationContract.tokenize(
        'CREDITO_FISCAL',
        ethers.utils.parseUnits('1000', 18),
        'Crédito fiscal de ICMS para teste'
      );
      
      console.log('   Aguardando confirmação...');
      const receipt = await tx.wait();
      
      // Encontrar evento de tokenização
      const event = receipt.events.find(e => e.event === 'AssetTokenized');
      if (event) {
        const tokenId = event.args.tokenId.toString();
        console.log(`✅ Ativo tokenizado com sucesso! Token ID: ${tokenId}`);
        
        // Obter detalhes do token
        const tokenDetails = await tokenizationContract.getTokenDetails(tokenId);
        console.log('   Detalhes do token:');
        console.log(`   - Tipo: ${tokenDetails.assetType}`);
        console.log(`   - Valor: ${ethers.utils.formatUnits(tokenDetails.assetValue, 18)}`);
        console.log(`   - Descrição: ${tokenDetails.assetDescription}`);
        console.log(`   - Proprietário: ${tokenDetails.owner}`);
      } else {
        console.log('⚠️ Tokenização concluída, mas evento não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao tokenizar ativo:', error.message);
      console.log('   Continuando com o teste...');
    }
    
    // 6. Testar obtenção de cotação para swap
    console.log('\n6. Testando cotação para swap...');
    try {
      const amountIn = ethers.utils.parseUnits('10', 18);
      const path = [TEST_ADDRESSES.testToken1, TEST_ADDRESSES.testToken2];
      
      const amounts = await swapRouterContract.getAmountsOut(amountIn, path);
      const amountOut = amounts[1];
      
      console.log(`✅ Cotação obtida: 10 Token1 = ${ethers.utils.formatUnits(amountOut, 18)} Token2`);
    } catch (error) {
      console.error('❌ Erro ao obter cotação:', error.message);
      console.log('   Continuando com o teste...');
    }
    
    // 7. Testar aprovação e swap
    console.log('\n7. Testando aprovação e swap...');
    try {
      // Verificar saldo do token1
      const token1Balance = await token1Contract.balanceOf(wallet.address);
      console.log(`   Saldo Token1: ${ethers.utils.formatUnits(token1Balance, 18)}`);
      
      if (token1Balance.gt(0)) {
        // Aprovar gasto
        const amountToSwap = ethers.utils.parseUnits('1', 18); // Swap apenas 1 token
        console.log('   Aprovando gasto de tokens...');
        const approveTx = await token1Contract.approve(TEST_ADDRESSES.swapRouter, amountToSwap);
        await approveTx.wait();
        console.log('✅ Aprovação concluída');
        
        // Executar swap
        console.log('   Executando swap...');
        const path = [TEST_ADDRESSES.testToken1, TEST_ADDRESSES.testToken2];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos
        
        const swapTx = await swapRouterContract.swapExactTokensForTokens(
          amountToSwap,
          0, // Aceitar qualquer quantidade mínima para o teste
          path,
          wallet.address,
          deadline
        );
        
        console.log('   Aguardando confirmação do swap...');
        const swapReceipt = await swapTx.wait();
        console.log(`✅ Swap concluído! Hash: ${swapReceipt.transactionHash}`);
        
        // Verificar novos saldos
        const newToken1Balance = await token1Contract.balanceOf(wallet.address);
        const token2Balance = await token2Contract.balanceOf(wallet.address);
        
        console.log(`   Novo saldo Token1: ${ethers.utils.formatUnits(newToken1Balance, 18)}`);
        console.log(`   Saldo Token2: ${ethers.utils.formatUnits(token2Balance, 18)}`);
      } else {
        console.log('⚠️ Saldo insuficiente de Token1 para testar swap');
      }
    } catch (error) {
      console.error('❌ Erro ao executar swap:', error.message);
    }
    
    console.log('\n=== TESTE DE INTEGRAÇÃO BLOCKCHAIN CONCLUÍDO ===');
    
  } catch (error) {
    console.error('\n❌ ERRO FATAL NO TESTE DE INTEGRAÇÃO:', error);
    process.exit(1);
  }
}

// Executar o teste
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 