import React from 'react';
import Link from '@/components/ui/custom-link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Receipt,
  BarChart3,
  ArrowRight,
  PieChart,
  Briefcase,
  Shield,
  GitMerge,
  Calculator,
  Wallet,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusConexao } from '../blockchain/StatusConexao';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkHref: string;
  linkText: string;
  badgeText?: string;
  color: string;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  icon,
  linkHref,
  linkText,
  badgeText,
  color,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className={`bg-${color}-50 dark:bg-${color}-950/30`}>
          <div className="flex justify-between items-start">
            <div
              className={`p-3 rounded-md bg-${color}-100 dark:bg-${color}-900/50 text-${color}-600 dark:text-${color}-400`}
            >
              {icon}
            </div>
            {badgeText && (
              <Badge
                variant="outline"
                className={`border-${color}-200 text-${color}-700 dark:text-${color}-300 dark:border-${color}-700`}
              >
                {badgeText}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-4 text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm list-disc pl-5">
            {getFeatureList(title).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-0">
          <Button asChild variant="ghost" className="w-full justify-between">
            <Link href={linkHref}>
              {linkText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Função para gerar lista de características para cada recurso
function getFeatureList(featureTitle: string): string[] {
  switch (featureTitle) {
    case 'Tokenização de Créditos':
      return [
        'Transforme créditos em tokens blockchain',
        'Segurança e imutabilidade garantidas',
        'Processo transparente e auditável',
        'Compatível com diferentes tipos de créditos',
      ];
    case 'Gestão de Débitos':
      return [
        'Visualize todos os débitos fiscais',
        'Controle de vencimentos',
        'Alertas automáticos',
        'Histórico de pagamentos',
      ];
    case 'Marketplace':
      return [
        'Compra e venda de créditos',
        'Leilões e ofertas públicas',
        'Negociação direta entre partes',
        'Ambiente seguro e transparente',
      ];
    case 'Compensação Multilateral':
      return [
        'Use créditos para compensar débitos',
        'Simulação de compensações',
        'Validação automática',
        'Registro em blockchain',
      ];
    case 'Análise e Relatórios':
      return [
        'Dashboards personalizados',
        'Relatórios gerenciais',
        'Análises preditivas',
        'Exportação de dados',
      ];
    case 'Gestão Tributária':
      return [
        'Calendário fiscal',
        'Planejamento tributário',
        'Gestão de obrigações acessórias',
        'Controle de declarações',
      ];
    default:
      return [];
  }
}

export function FeatureHighlight() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recursos Principais</h2>
          <p className="text-muted-foreground">
            Descubra as principais funcionalidades da plataforma Tributa.AI
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/ajuda">Ver Guia Completo</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calculator className="h-5 w-5 text-blue-500 mr-2" />
              Compensação Multilateral
            </CardTitle>
            <CardDescription>Automatize a compensação de débitos fiscais</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Utilize seus créditos tokenizados para compensar débitos fiscais de forma segura e
                rastreável.
              </p>
              <div className="flex gap-1.5 mt-3">
                <Badge variant="secondary">Novo</Badge>
                <Badge variant="outline">Blockchain</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/recuperacao/compensacao-bilateral">
                Iniciar Compensação
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Wallet className="h-5 w-5 text-orange-500 mr-2" />
              Tokenização de Créditos
            </CardTitle>
            <CardDescription>Transforme seus créditos em ativos digitais</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tokenize créditos tributários, precatórios e outros ativos para negociação em nossa
                plataforma.
              </p>
              <div className="flex gap-1.5 mt-3">
                <Badge variant="outline">Seguro</Badge>
                <Badge variant="outline">Rastreável</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/tokenizacao/wizard">
                Tokenizar Crédito
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              Blockchain
            </CardTitle>
            <CardDescription>Status da infraestrutura blockchain</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <StatusConexao minimal />
            <p className="text-sm text-muted-foreground mt-2">
              Nossa rede blockchain Hyperledger Fabric garante segurança e imutabilidade nas
              transações.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/blockchain">
                Explorar Blockchain
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
