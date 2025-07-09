import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form'; // Para integração futura

interface FileUploaderProps {
  label: string;
  accept?: string; // ex: "image/*,.pdf"
  // Props para integração com react-hook-form (opcional por enquanto)
  // register?: UseFormRegisterReturn;
  // name?: string;
  onFileSelect: (file: File | null) => void;
  // Adicionar mais props conforme necessário (ex: maxSize, required)
  className?: string;
  errorMessage?: string; // Para exibir erros de validação
}

export function FileUploader({
  label,
  accept,
  onFileSelect,
  className,
  errorMessage,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    // TODO: Adicionar validação de tamanho/tipo aqui se necessário
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = ''; // Limpa o input
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Estilo visual opcional ao arrastar sobre
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      // TODO: Validar tipo de arquivo aqui baseado no `accept` prop
      setSelectedFile(file);
      onFileSelect(file);
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files; // Atualiza o input
      }
    }
  };
  // --- Fim Drag and Drop ---

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer',
          'border-muted-foreground/30 hover:border-primary/50',
          'bg-background hover:bg-muted/50 transition-colors',
          isDragging && 'border-primary bg-primary/10',
          errorMessage && 'border-destructive hover:border-destructive/80 bg-destructive/5'
        )}
        onClick={handleButtonClick} // Clicar na área abre o seletor
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden" // Esconde o input padrão
          // {...register} // Descomentar para usar com react-hook-form
        />
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadCloud
              className={cn(
                'w-8 h-8 mb-3 text-muted-foreground',
                errorMessage && 'text-destructive'
              )}
            />
            <p
              className={cn(
                'mb-1 text-sm text-muted-foreground',
                errorMessage && 'text-destructive'
              )}
            >
              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
            </p>
            {accept && (
              <p className="text-xs text-muted-foreground/80">
                {accept.replace('image/*', 'Imagens').replace('.pdf', 'PDF').replace(/,/g, ', ')}
              </p>
            )}
            {/* TODO: Exibir limite de tamanho */}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center space-x-2 overflow-hidden">
              <FileIcon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-foreground truncate" title={selectedFile.name}>
                {selectedFile.name}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
              onClick={e => {
                e.stopPropagation(); // Evita abrir o seletor ao clicar no X
                handleRemoveFile();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remover arquivo</span>
            </Button>
          </div>
        )}
      </div>
      {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
    </div>
  );
}
