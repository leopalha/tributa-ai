import { db } from '../src/lib/db';
import { Prisma } from '@prisma/client';
import { generateEmbedding, combineTextForEmbedding } from '../src/lib/embeddings';

const BATCH_SIZE = 50;

function toSql(vector: number[]): string {
    return JSON.stringify(vector);
}

// Tipo esperado do resultado da query raw para TCs
interface CreditTitleForEmbedding {
    id: string;
    title: string | null;
    category: string;
    subtype: string;
    description: string | null;
    issuerName: string;
    debtorName: string | null;
}

async function backfillCreditTitleEmbeddings() {
  console.log('Iniciando backfill de embeddings para CreditTitle...');
  let processedCount = 0;
  let offset = 0; // Usar offset para paginação com queryRaw

  while (true) {
      // Usar queryRawUnsafe para buscar TCs sem embedding
    const batch = await db.$queryRawUnsafe<CreditTitleForEmbedding[]>(
        `SELECT id, title, category, subtype, description, "issuerName", "debtorName" 
         FROM "CreditTitle" 
         WHERE embedding IS NULL 
         ORDER BY id ASC 
         LIMIT $1 OFFSET $2`,
        BATCH_SIZE,
        offset
    );

    if (batch.length === 0) {
      console.log('Nenhum CreditTitle sem embedding encontrado para processar.');
      break;
    }

    console.log(`Processando lote de ${batch.length} CreditTitles (offset: ${offset})...`);
    for (const tc of batch) {
      try {
        const textToEmbed = combineTextForEmbedding(
          tc.title,
          tc.category,
          tc.subtype,
          tc.description,
          tc.issuerName,
          tc.debtorName
        );
        const embedding = await generateEmbedding(textToEmbed);

        if (embedding) {
          const embeddingString = toSql(embedding);
          // Usar executeRawUnsafe para atualizar tipo Unsupported
          await db.$executeRawUnsafe(
            `UPDATE "CreditTitle" SET embedding = $1::vector WHERE id = $2`,
            embeddingString,
            tc.id
          );
          processedCount++;
        } else {
          console.warn(`Embedding não gerado para CreditTitle ID: ${tc.id}`);
        }
      } catch (error) {
        console.error(`Erro ao processar CreditTitle ID: ${tc.id}`, error);
      }
    }

    offset += batch.length;
    console.log(`Lote concluído. Total processado: ${processedCount}`);
  }
  console.log(`Backfill de CreditTitle concluído. ${processedCount} registros atualizados.`);
}

// Tipo esperado do resultado da query raw para Anuncios
interface AnuncioForEmbedding {
    id: string;
    description: string | null;
    type: string; // TipoNegociacao é string no DB
    // Campos do TC associado
    tc_title: string | null;
    tc_category: string; 
    tc_subtype: string;
}

async function backfillAnuncioEmbeddings() {
  console.log('\nIniciando backfill de embeddings para Anuncio...');
  let processedCount = 0;
  let offset = 0;

  while (true) {
     // Usar queryRawUnsafe com JOIN para buscar Anuncios sem embedding e dados do TC
    const batch = await db.$queryRawUnsafe<AnuncioForEmbedding[]>(
        `SELECT a.id, a.description, a.type, 
                t.title as tc_title, t.category as tc_category, t.subtype as tc_subtype
         FROM "Anuncio" a 
         JOIN "CreditTitle" t ON a."creditTitleId" = t.id
         WHERE a.embedding IS NULL 
         ORDER BY a.id ASC 
         LIMIT $1 OFFSET $2`,
         BATCH_SIZE,
         offset
    );

    if (batch.length === 0) {
      console.log('Nenhum Anuncio sem embedding encontrado para processar.');
      break;
    }

    console.log(`Processando lote de ${batch.length} Anuncios (offset: ${offset})...`);
    for (const anuncio of batch) {
      try {
        const textToEmbed = combineTextForEmbedding(
          anuncio.tc_title,
          anuncio.tc_category,
          anuncio.tc_subtype,
          anuncio.description,
          anuncio.type
        );
        const embedding = await generateEmbedding(textToEmbed);

        if (embedding) {
          const embeddingString = toSql(embedding);
          await db.$executeRawUnsafe(
            `UPDATE "Anuncio" SET embedding = $1::vector WHERE id = $2`,
            embeddingString,
            anuncio.id
          );
          processedCount++;
        } else {
          console.warn(`Embedding não gerado para Anuncio ID: ${anuncio.id}`);
        }
      } catch (error) {
        console.error(`Erro ao processar Anuncio ID: ${anuncio.id}`, error);
      }
    }
    offset += batch.length;
    console.log(`Lote concluído. Total processado: ${processedCount}`);
  }
  console.log(`Backfill de Anuncio concluído. ${processedCount} registros atualizados.`);
}

async function main() {
  await backfillCreditTitleEmbeddings();
  await backfillAnuncioEmbeddings();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 