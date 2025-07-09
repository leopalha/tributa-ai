import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './button';
import { botDataManagerService } from '../../services/bot-data-manager.service';
import { useToast } from './use-toast';

interface RefreshButtonProps {
  category: string;
  onRefreshComplete?: () => void;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  category,
  onRefreshComplete,
  size = 'default',
  variant = 'outline',
  className = ''
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await botDataManagerService.refreshData(category);
      
      // Notificar componente pai
      if (onRefreshComplete) {
        onRefreshComplete();
      }
      
      // Mostrar feedback usando o sistema de toast
      toast({
        title: "Atualização concluída",
        description: "Dados atualizados com sucesso",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      
      // Mostrar erro usando o sistema de toast
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <RefreshCw 
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      {size !== 'icon' && (isRefreshing ? 'Atualizando...' : 'Atualizar')}
    </Button>
  );
};

export default RefreshButton; 