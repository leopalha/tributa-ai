import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { FiscalObligation } from '@prisma/client';

interface DeleteObligationDialogProps {
  obligation: FiscalObligation;
}

export function DeleteObligationDialog({ obligation }: DeleteObligationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/fiscal/obligations/${obligation.id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir obrigação');
      }

      toast.success('Obrigação excluída com sucesso');
      setIsOpen(false);
      router.refresh();
      router.push('/dashboard/gestao-fiscal');
    } catch (error) {
      toast.error('Erro ao excluir obrigação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Obrigação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a obrigação "{obligation.title}"? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
