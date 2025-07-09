// Configuração do modelo de embedding (escolher um modelo leve/eficiente)
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

// Cache da pipeline para evitar recarregar o modelo
let embeddingPipeline: any | null = null;
let transformersAvailable = false;

// Verificar se as transformers estão disponíveis
async function checkTransformersAvailability(): Promise<boolean> {
  try {
    const { pipeline } = await import('@xenova/transformers');
    return true;
  } catch (error) {
    console.warn('Transformers não disponíveis, usando fallback para embeddings:', error);
    return false;
  }
}

// Função para inicializar ou obter o pipeline de extração de features (embeddings)
async function getEmbeddingPipeline(): Promise<any> {
  if (!transformersAvailable) {
    transformersAvailable = await checkTransformersAvailability();
  }

  if (!transformersAvailable) {
    throw new Error('Transformers não disponíveis');
  }

  if (!embeddingPipeline) {
    console.log('Inicializando pipeline de embeddings...');
    const { pipeline } = await import('@xenova/transformers');
    embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME, {
      // Configurações opcionais:
      // device: 'webgpu', // Tentar usar WebGPU se disponível
      // quantized: true, // Usar modelo quantizado para menor tamanho/memória
    });
    console.log('Pipeline de embeddings inicializada.');
  }
  return embeddingPipeline;
}

/**
 * Gera embedding para um texto usando o modelo configurado.
 * @param text Texto de entrada.
 * @returns Array de números (embedding) ou null em caso de erro.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!text || text.trim().length === 0) {
    console.warn('generateEmbedding called with empty text.');
    return null;
  }

  try {
    // Fallback: usar hash simples se transformers não estiver disponível
    if (!transformersAvailable && !(await checkTransformersAvailability())) {
      console.warn('Usando fallback simples para embedding');
      return generateSimpleEmbedding(text);
    }

    const extractor = await getEmbeddingPipeline();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // A saída pode ter uma estrutura diferente dependendo da versão/modelo
    // Verifique a estrutura de `output.data`
    // console.log('Embedding output structure:', output);
    if (output && output.data && typeof output.data === 'object') {
      // Tenta acessar os dados do embedding (pode ser Float32Array)
      const embeddingData = Array.from(output.data as number[] | Float32Array);
      if (embeddingData.length > 0) {
        return embeddingData;
      }
    }
    console.warn('Estrutura inesperada da saída do embedding:', output);
    return null;
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    // Fallback para embedding simples
    return generateSimpleEmbedding(text);
  }
}

/**
 * Fallback simples para gerar embedding baseado em hash
 * @param text Texto de entrada
 * @returns Array de números simulando um embedding
 */
function generateSimpleEmbedding(text: string): number[] {
  // Criar um "embedding" simples baseado em características do texto
  const words = text.toLowerCase().split(/\s+/);
  const chars = text.toLowerCase().split('');

  // Gerar 384 dimensões (compatível com all-MiniLM-L6-v2)
  const embedding = new Array(384).fill(0);

  // Preencher com base em características do texto
  for (let i = 0; i < embedding.length; i++) {
    let value = 0;

    // Usar comprimento, palavras e caracteres para gerar valores
    if (i < words.length) {
      value += words[i].length * 0.1;
    }
    if (i < chars.length) {
      value += chars[i].charCodeAt(0) * 0.001;
    }

    // Adicionar alguma variação baseada na posição
    value += Math.sin(i * 0.1) * 0.05;
    value += text.length * 0.001;

    // Normalizar para range [-1, 1]
    embedding[i] = Math.tanh(value);
  }

  return embedding;
}

/**
 * Combina campos de texto relevantes para gerar um embedding representativo.
 * @param fields Objeto com campos de texto.
 * @returns String combinada ou string vazia.
 */
export function combineTextForEmbedding(...fields: (string | null | undefined)[]): string {
  return fields.filter(f => f && f.trim().length > 0).join(' \n\n '); // Separar campos com nova linha
}
