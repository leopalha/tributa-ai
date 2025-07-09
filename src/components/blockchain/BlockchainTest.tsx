import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, AlertTriangle, RefreshCw, Shield, Database, Server, FileText } from 'lucide-react';
import { StatusConexao } from './StatusConexao';
import { blockchainApi } from '@/services/api';
import {
  mockBlockchainStatus,
  mockBlockchainQuery,
  mockBlockchainInvoke,
} from '@/services/mock-api';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

export function BlockchainTest() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [functionName, setFunctionName] = useState('consultarInfo');
  const [args, setArgs] = useState('status');
  const [showResult, setShowResult] = useState(false);

  // Reset error when inputs change
  useEffect(() => {
    if (error) setError(null);
  }, [functionName, args]);

  // Function to test connection to blockchain
  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    setShowResult(false);

    try {
      // In development, use mock data directly for faster testing
      const response = isDevelopment ? mockBlockchainStatus : await blockchainApi.status();

      setTestResult({
        type: 'connection',
        status: response.status,
        message: response.message,
        data: response.networkInfo,
      });
      setShowResult(true);
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao testar conexão');
    } finally {
      setLoading(false);
    }
  };

  // Function to test a query (query) in chaincode
  const handleTestQuery = async () => {
    if (!functionName) {
      setError('Nome da função é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);
    setTestResult(null);
    setShowResult(false);

    try {
      const argsArray = args
        .split(',')
        .filter(arg => arg.trim())
        .map(arg => arg.trim());

      // In development, use mock data directly for faster testing
      const response = isDevelopment
        ? mockBlockchainQuery(functionName, argsArray)
        : await blockchainApi.consultar(functionName, argsArray);

      setTestResult({
        type: 'query',
        function: functionName,
        args: argsArray,
        result: response.data?.result || response.result,
      });
      setShowResult(true);
    } catch (err) {
      console.error('Erro ao executar consulta:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao executar consulta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Teste de Integração Blockchain
        </CardTitle>
        <CardDescription>
          Ferramentas para testar a conexão com a rede Hyperledger Fabric
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Status da Conexão</h3>
          <StatusConexao minimal />

          <div className="mt-4">
            <Button onClick={handleTestConnection} disabled={loading} variant="outline" size="sm">
              {loading && testResult?.type === 'connection' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Query Test */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Teste de Consulta</h3>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="functionName">Nome da Função</Label>
              <Input
                id="functionName"
                value={functionName}
                onChange={e => setFunctionName(e.target.value)}
                placeholder="Ex: consultarCompensacao"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="args">Argumentos (separados por vírgula)</Label>
              <Input
                id="args"
                value={args}
                onChange={e => setArgs(e.target.value)}
                placeholder="Ex: id1,valor2"
                disabled={loading}
              />
            </div>

            <Button onClick={handleTestQuery} disabled={loading || !functionName}>
              {loading && testResult?.type === 'query' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Executar Consulta
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Result */}
        {showResult && testResult && (
          <div className="p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Resultado do Teste
            </h3>

            <div className="mt-2 bg-muted p-3 rounded-md overflow-auto max-h-60">
              <pre className="text-xs md:text-sm whitespace-pre-wrap break-all">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Utilize estes testes apenas no ambiente de desenvolvimento ou homologação.
        </div>
      </CardFooter>
    </Card>
  );
}
