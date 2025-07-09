# Padronização de Componentes do Marketplace

## Objetivo

Este documento estabelece diretrizes para manter consistência visual e funcional em todos os componentes do módulo de Marketplace da plataforma Tributa.AI. Seguir estas diretrizes é essencial para garantir uma experiência de usuário coesa e profissional.

## Princípios Gerais

1. **Consistência Visual**: Todos os componentes devem seguir o mesmo padrão visual, incluindo espaçamento, cores, tipografia e elementos de UI.
2. **Responsividade**: Todos os componentes devem funcionar perfeitamente em dispositivos móveis, tablets e desktops.
3. **Acessibilidade**: Os componentes devem seguir as diretrizes WCAG para garantir acessibilidade.
4. **Performance**: Minimizar o uso de recursos pesados como imagens grandes ou não otimizadas.

## Cards e Listagens

### Cards de Créditos/Anúncios

1. **Estrutura Padrão**:
   - Título (limite de 2 linhas)
   - Badges de status/categoria
   - Informações de valor (original, venda, desconto)
   - Metadados (visualizações, interessados, tempo)
   - Ações (botões)

2. **Espaçamento**:
   - Padding interno: 16px (1rem)
   - Espaçamento entre elementos: 8px (0.5rem) ou 16px (1rem)
   - Altura consistente para todos os cards da mesma seção

3. **Botões e Ações**:
   - Posicionamento consistente (sempre no mesmo local em todos os cards)
   - Mesmo tamanho e estilo visual
   - Ícones padronizados (usar sempre os mesmos ícones para as mesmas ações)
   - Ordem consistente: ações primárias à direita, secundárias à esquerda

4. **Imagens**:
   - Não usar imagens que não carregam corretamente
   - Se usar imagens, garantir que todas tenham o mesmo tamanho e proporção
   - Usar placeholders consistentes quando não houver imagem

## Tabelas

1. **Cabeçalhos**:
   - Alinhamento consistente (textos à esquerda, números à direita)
   - Estilo visual padronizado

2. **Linhas**:
   - Altura consistente
   - Espaçamento entre colunas padronizado
   - Destacar linha em hover com a mesma cor em todas as tabelas

3. **Ações**:
   - Posicionamento consistente das ações em cada linha
   - Usar dropdown para múltiplas ações

## Formulários

1. **Campos**:
   - Mesmo tamanho e estilo para campos similares
   - Labels posicionados consistentemente (sempre acima ou sempre à esquerda)
   - Mensagens de erro no mesmo estilo e posição

2. **Botões**:
   - Posicionamento consistente (geralmente à direita para ações de submissão)
   - Hierarquia visual clara (botão primário destacado, secundário menos proeminente)

## Modais e Diálogos

1. **Estrutura**:
   - Cabeçalho com título e botão de fechar
   - Corpo com conteúdo
   - Rodapé com ações (cancelar à esquerda, confirmar à direita)

2. **Tamanho**:
   - Tamanho apropriado para o conteúdo
   - Responsivo em diferentes dispositivos

## Funcionalidades a Implementar

As seguintes funcionalidades devem ser implementadas seguindo os padrões acima:

1. **Dar Lance**: Interface para oferecer lances em leilões
   - Formulário com valor do lance
   - Visualização do lance mínimo e incremento
   - Confirmação antes de submeter

2. **Detalhes**: Visualização completa de um crédito/anúncio
   - Todas as informações organizadas em seções
   - Documentação disponível
   - Histórico de lances/ofertas

3. **Negociar**: Interface para fazer ofertas em créditos negociáveis
   - Campo para valor da oferta
   - Campo opcional para mensagem/justificativa
   - Termos e condições

4. **Comprar**: Fluxo de compra direta
   - Resumo da compra
   - Termos e condições
   - Confirmação de pagamento
   - Recibo/comprovante

## Checklist de Verificação

Antes de finalizar qualquer componente do marketplace, verifique:

- [ ] Todos os botões estão no mesmo padrão visual e posição
- [ ] Espaçamentos são consistentes em todo o componente
- [ ] Responsividade testada em diferentes tamanhos de tela
- [ ] Funcionalidade testada em diferentes cenários
- [ ] Mensagens de erro/sucesso são claras e consistentes
- [ ] Componente segue o padrão de cores da plataforma
- [ ] Acessibilidade verificada (contraste, navegação por teclado)
- [ ] Performance otimizada (especialmente em listagens grandes)

## Exemplos Visuais

Para cada novo componente, consulte os componentes existentes como referência para manter a consistência visual e funcional.

---

**Nota**: Este documento deve ser revisado e atualizado regularmente conforme a evolução da plataforma. 