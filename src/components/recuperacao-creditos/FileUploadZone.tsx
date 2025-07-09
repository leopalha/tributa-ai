import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface FileUploadZoneProps {
  onFileSelect: (files: File[]) => void;
  loading?: boolean;
  progress?: number;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUploadZone({
  onFileSelect,
  loading = false,
  progress = 0,
  accept = '.pdf,.xml,.txt,.xls,.xlsx,.zip',
  maxSize = 50 * 1024 * 1024, // 50MB
  multiple = true,
  className = '',
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(file => {
          file.errors.forEach((error: any) => {
            if (error.code === 'file-too-large') {
              toast.error(`Arquivo muito grande: ${file.file.name}`);
            } else if (error.code === 'file-invalid-type') {
              toast.error(`Tipo de arquivo não suportado: ${file.file.name}`);
            } else {
              toast.error(`Erro no arquivo: ${file.file.name}`);
            }
          });
        });
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/xml': ['.xml'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize,
    multiple,
    disabled: loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
        ${
          isDragActive || dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
        ${loading ? 'pointer-events-none opacity-50' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />

      <div className="space-y-4">
        {/* Ícone de upload */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        {/* Texto principal */}
        <div>
          {isDragActive || dragActive ? (
            <p className="text-lg font-medium text-blue-600">Solte os arquivos aqui...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos aceitos: PDF, XML, TXT, XLS, XLSX, ZIP
              </p>
              <p className="text-xs text-gray-400">
                Tamanho máximo: {formatFileSize(maxSize)} por arquivo
              </p>
            </div>
          )}
        </div>

        {/* Botão de seleção */}
        {!isDragActive && !dragActive && (
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Selecionar Arquivos'}
          </button>
        )}

        {/* Barra de progresso */}
        {loading && progress > 0 && (
          <div className="w-full max-w-xs mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Enviando... {progress}%</p>
          </div>
        )}

        {/* Documentos recomendados */}
        <div className="bg-blue-50 p-4 rounded-lg text-left">
          <h4 className="font-medium text-blue-800 mb-2">📋 Documentos Recomendados:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
            <div className="space-y-1">
              <div>• DCTF (Declaração de Débitos e Créditos Tributários)</div>
              <div>• EFD-Contribuições</div>
              <div>• SPED Fiscal</div>
              <div>• GIA (Guia de Informação e Apuração)</div>
            </div>
            <div className="space-y-1">
              <div>• ECF (Escrituração Contábil Fiscal)</div>
              <div>• LALUR (Livro de Apuração do Lucro Real)</div>
              <div>• Demonstrações Contábeis</div>
              <div>• Livros Fiscais</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
