import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FileArchive,
  FilePdf,
  FileSpreadsheet,
  FileText,
  Link2,
  Upload,
  X,
  Download,
  Share,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
  usuario: string;
  url?: string;
}

interface AnexosManagerProps {
  anexos: Anexo[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onShare: (id: string) => Promise<void>;
  maxSize?: number; // em bytes
  allowedTypes?: string[];
}

export function AnexosManager({
  anexos,
  onUpload,
  onDelete,
  onShare,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['application/pdf', 'application/zip', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}: AnexosManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<Anexo | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setUploading(true);
      
      // Simular progresso de upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      await onUpload(acceptedFiles);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);

      toast.success('Arquivo(s) enviado(s) com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar arquivo(s)');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: allowedTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    disabled: uploading
  });

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'application/pdf':
        return <FilePdf className="w-4 h-4" />;
      case 'application/zip':
      case 'application/x-zip-compressed':
        return <FileArchive className="w-4 h-4" />;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <FileSpreadsheet className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handlePreview = (anexo: Anexo) => {
    if (!anexo.url) {
      toast.error('Preview não disponível');
      return;
    }
    setSelectedFile(anexo);
    setPreviewUrl(anexo.url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Anexos</CardTitle>
          <CardDescription>
            {anexos.length} arquivo(s) • {
              formatFileSize(anexos.reduce((acc, curr) => acc + curr.tamanho, 0))
            } total
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Link2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copiar link dos anexos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm">
              {isDragActive ? (
                <p>Solte os arquivos aqui...</p>
              ) : (
                <>
                  <p>Arraste arquivos ou clique para selecionar</p>
                  <p className="text-xs text-muted-foreground">
                    Máximo: {formatFileSize(maxSize)} por arquivo
                  </p>
                </>
              )}
            </div>
          </div>
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-center text-muted-foreground">
                Enviando... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-2">
            {anexos.map((anexo) => (
              <div
                key={anexo.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
              >
                <div className="flex items-center">
                  {getFileIcon(anexo.tipo)}
                  <div className="ml-3">
                    <div className="font-medium">{anexo.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(anexo.tamanho)} • Enviado por {anexo.usuario}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreview(anexo)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visualizar arquivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onShare(anexo.id)}
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Compartilhar arquivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(anexo.id)}
                          className="hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir arquivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedFile?.nome}</DialogTitle>
            <DialogDescription>
              {formatFileSize(selectedFile?.tamanho || 0)} • Enviado por {selectedFile?.usuario}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-lg"
                title={selectedFile?.nome}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 