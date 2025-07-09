// Mock do fabric-network para compatibilidade com Vite

export async function submitTransaction(
  userId: string,
  transactionName: string,
  ...args: string[]
): Promise<Buffer> {
  console.log(`[FABRIC MOCK] Submit: ${transactionName}(${args.join(', ')})`);

  const mockResponse = {
    success: true,
    transaction: transactionName,
    args,
    timestamp: new Date().toISOString(),
    userId,
  };

  return Buffer.from(JSON.stringify(mockResponse));
}

export async function evaluateTransaction(
  userId: string,
  transactionName: string,
  ...args: string[]
): Promise<Buffer> {
  console.log(`[FABRIC MOCK] Evaluate: ${transactionName}(${args.join(', ')})`);

  const mockResponse = {
    result: 'mock-query-result',
    transaction: transactionName,
    args,
    timestamp: new Date().toISOString(),
    userId,
  };

  return Buffer.from(JSON.stringify(mockResponse));
}

export async function getConnectedGateway(userId: string) {
  console.log(`[FABRIC MOCK] Gateway connected for user: ${userId}`);
  return {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    getNetwork: () => ({
      getContract: () => ({
        submitTransaction,
        evaluateTransaction,
      }),
    }),
  };
}

export async function disconnectGateway() {
  console.log('[FABRIC MOCK] Gateway disconnected');
}

export async function getWallet() {
  console.log('[FABRIC MOCK] Wallet instance');
  return {
    get: (label: string) => Promise.resolve({ label, type: 'mock' }),
  };
}
