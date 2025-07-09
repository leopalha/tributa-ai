/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

// Enum para Status do Token na Blockchain (pode espelhar ou complementar CreditStatus)
enum TokenStatus {
    CREATED = 'CREATED',       // Apenas criado no ledger
    ACTIVE = 'ACTIVE',         // Ativo e de posse do owner
    LOCKED_SALE = 'LOCKED_SALE', // Bloqueado para negociação no marketplace
    TRANSFERRED = 'TRANSFERRED', // Transferido para novo dono
    BURNED = 'BURNED',         // Exemplo: Adicionar status para "queima" ou liquidação
    // Outros status? Ex: LIQUIDATED
}

// Definição do Asset (Token) na Blockchain
interface CreditToken {
    docType?: 'CreditToken'; // Para CouchDB queries
    id: string; // ID único (mesmo ID do CreditTitle no banco relacional)
    ownerId: string; // ID do usuário proprietário (referência ao banco relacional)
    originalValue: number; // Valor original/nominal
    category: string; // Categoria (TRIBUTARIO, JUDICIAL, etc.)
    subtype: string; // Subtipo (PRECATORIO, ICMS, etc.)
    issuerName: string; // Nome do emissor original
    status: TokenStatus; // Status on-chain
    createdAt: string; // Timestamp ISO de criação on-chain
    updatedAt: string; // Timestamp ISO de última atualização on-chain
    metadataHash?: string; // Hash dos metadados off-chain (opcional, para integridade)
}

@Info({title: 'TributaTokenContract', description: 'Smart contract for managing credit tokens'})
export class TributaTokenContract extends Contract {

    // Inicializa o ledger (opcional, chamado na instanciação/upgrade)
    public async InitLedger(ctx: Context): Promise<void> {
        console.info('============= START : Initialize Ledger ===========');
        // Poderia adicionar alguns tokens iniciais para teste aqui, se desejado
        console.info('============= END : Initialize Ledger ===========');
    }

    @Transaction(false) // Não modifica o ledger
    @Returns('boolean')
    public async CreditTokenExists(ctx: Context, id: string): Promise<boolean> {
        const tokenJSON = await ctx.stub.getState(id);
        return tokenJSON && tokenJSON.length > 0;
    }

    @Transaction()
    public async CreateCreditToken(
        ctx: Context,
        id: string,
        ownerId: string,
        originalValueStr: string,
        category: string,
        subtype: string,
        issuerName: string,
        metadataHash: string = '' // Parâmetro opcional com valor padrão
    ): Promise<void> {
        const exists = await this.CreditTokenExists(ctx, id);
        if (exists) {
            throw new Error(`O CreditToken ${id} já existe.`);
        }
        
        // Validação de Permissão (Exemplo - apenas uma Org específica pode criar?)
        // const clientMSPID = ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'Org1MSP') { // Ajustar conforme necessário
        //     throw new Error('Organização não autorizada a criar tokens.');
        // }

        const originalValue = parseFloat(originalValueStr);
        if (isNaN(originalValue) || originalValue <= 0) {
             throw new Error('Valor original inválido.');
        }

        const token: CreditToken = {
            docType: 'CreditToken',
            id,
            ownerId,
            originalValue,
            category,
            subtype,
            issuerName,
            status: TokenStatus.ACTIVE, // Iniciar como ativo após criação?
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadataHash,
        };

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(token))));
        console.info(`Token ${id} criado para ${ownerId}`);
    }

    @Transaction(false)
    @Returns('string')
    public async QueryCreditToken(ctx: Context, id: string): Promise<string> {
        const tokenJSON = await ctx.stub.getState(id);
        if (!tokenJSON || tokenJSON.length === 0) {
            throw new Error(`O CreditToken ${id} não existe.`);
        }
        // TODO: Verificar permissão de leitura? Dono ou Org específica?
        return tokenJSON.toString();
    }

    @Transaction()
    public async UpdateCreditTokenStatus(ctx: Context, id: string, newStatusStr: string): Promise<void> {
        const exists = await this.CreditTokenExists(ctx, id);
        if (!exists) {
            throw new Error(`O CreditToken ${id} não existe.`);
        }

        if (!(newStatusStr in TokenStatus)) {
             throw new Error(`Status inválido: ${newStatusStr}.`);
        }
        const newStatus = newStatusStr as TokenStatus;

        const tokenString = await this.QueryCreditToken(ctx, id); // Reutiliza a query (e sua verificação de existência)
        const token: CreditToken = JSON.parse(tokenString);
        
        // Validação de Permissão (Exemplo: apenas o dono pode mudar certos status?)
        // const submittingUserId = this.getUserIdFromContext(ctx); // Função auxiliar
        // if (token.ownerId !== submittingUserId) {
        //     throw new Error(`Usuário ${submittingUserId} não autorizado a mudar status do token ${id}.`);
        // }
        
        // Lógica de transição de status (Exemplo)
        if (token.status === TokenStatus.LOCKED_SALE && newStatus !== TokenStatus.ACTIVE && newStatus !== TokenStatus.TRANSFERRED) {
            //throw new Error('Token bloqueado para venda só pode voltar para ativo ou ser transferido.');
        }
        if (token.status === TokenStatus.TRANSFERRED || token.status === TokenStatus.BURNED) {
            // throw new Error('Não é possível alterar o status de um token já transferido ou queimado.');
        }

        token.status = newStatus;
        token.updatedAt = new Date().toISOString();

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(token))));
        console.info(`Status do Token ${id} atualizado para ${newStatus}`);
    }

    @Transaction()
    public async TransferCreditToken(ctx: Context, id: string, newOwnerId: string): Promise<void> {
        const tokenString = await this.QueryCreditToken(ctx, id); // Reutiliza a query (e sua verificação de existência)
        const token: CreditToken = JSON.parse(tokenString);

        // Validação de Permissão (Exemplo: Apenas o dono atual pode transferir?)
        // const submittingUserId = this.getUserIdFromContext(ctx);
        // if (token.ownerId !== submittingUserId) {
        //     throw new Error(`Usuário ${submittingUserId} não autorizado a transferir o token ${id}.`);
        // }

        if (token.ownerId === newOwnerId) {
             throw new Error('O novo proprietário é o mesmo que o atual.');
        }
        
        // Status check
        // if (token.status !== TokenStatus.ACTIVE && token.status !== TokenStatus.LOCKED_SALE) {
        //    throw new Error(`Token ${id} não pode ser transferido no status ${token.status}`);
        // }

        const oldOwner = token.ownerId;
        token.ownerId = newOwnerId;
        token.status = TokenStatus.ACTIVE; // Definir como ativo para o novo dono
        token.updatedAt = new Date().toISOString();

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(token))));
        console.info(`Token ${id} transferido de ${oldOwner} para ${newOwnerId}`);
        
        // Emitir evento (opcional)
        const transferEvent = { oldOwner, newOwner: newOwnerId, tokenId: id, timestamp: token.updatedAt };
        ctx.stub.setEvent('TransferCreditToken', Buffer.from(JSON.stringify(transferEvent)));
    }

    @Transaction(false)
    @Returns('string')
    public async QueryAllCreditTokens(ctx: Context): Promise<string> {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            try {
                const record = JSON.parse(strValue);
                if (record.docType === 'CreditToken') {
                    allResults.push(record);
                }
            } catch (err) { /* Ignorar erros de parse */ }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    
    @Transaction(false)
    @Returns('string')
    public async QueryCreditTokensByOwner(ctx: Context, ownerId: string): Promise<string> {
        // Implementação simplificada por iteração (ineficiente para muitos dados)
        const allTokensString = await this.QueryAllCreditTokens(ctx);
        const allTokens: CreditToken[] = JSON.parse(allTokensString);
        const ownerTokens = allTokens.filter(token => token.ownerId === ownerId);
        return JSON.stringify(ownerTokens);
        
        // Implementação com Rich Query (CouchDB):
        // const queryString = `{"selector":{"docType":"CreditToken","ownerId":"${ownerId}"}}`;
        // const resultsIterator = await ctx.stub.getQueryResult(queryString);
        // const results = await this._GetAllResults(resultsIterator, false);
        // return JSON.stringify(results);
    }
    
    @Transaction(false)
    @Returns('string')
    public async GetCreditTokenHistory(ctx: Context, id: string): Promise<string> {
        const history = [];
        const promiseOfIterator = ctx.stub.getHistoryForKey(id);
        for await (const keyMod of promiseOfIterator) {
            const resp = { timestamp: keyMod.timestamp, txid: keyMod.txId } as any;
            resp.value = keyMod.isDelete ? 'deleted' : keyMod.value.toString(); 
            history.push(resp);
        }
        return JSON.stringify(history);
    }
    
    // Função auxiliar privada para processar resultados de iteradores (ex: para Rich Queries)
    // async _GetAllResults(iterator, isHistory) {
    //     const allResults = [];
    //     let res = await iterator.next();
    //     while (!res.done) {
    //         // ... processar res.value ...
    //         allResults.push(processedValue);
    //         res = await iterator.next();
    //     }
    //     await iterator.close();
    //     return allResults;
    // }
    
    // Função auxiliar para obter ID do usuário do contexto (exemplo)
    // private getUserIdFromContext(ctx: Context): string {
    //     // A implementação depende de como a identidade é configurada (atributos X.509, etc.)
    //     // Exemplo simples (NÃO SEGURO PARA PRODUÇÃO):
    //     return ctx.clientIdentity.getID(); 
    // }

} 