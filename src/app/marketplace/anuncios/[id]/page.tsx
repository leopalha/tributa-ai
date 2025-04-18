import { AnuncioDetalhes } from '@/components/marketplace/AnuncioDetalhes';

interface AnuncioPageProps {
  params: {
    id: string;
  };
}

export default function AnuncioPage({ params }: AnuncioPageProps) {
  return <AnuncioDetalhes anuncioId={params.id} />;
} 