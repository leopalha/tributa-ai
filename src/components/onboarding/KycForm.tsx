import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FileUploader } from '@/components/ui/file-uploader';
import { Spinner } from '@/components/spinner';
import { useToast } from '@/components/ui/use-toast';

type UserProfileType =
  | 'pf'
  | 'pj'
  | 'professional'
  | 'financial_institution'
  | 'qualified_investor';

interface KycFormProps {
  userId: string;
  profileType: UserProfileType;
}

// Validação básica para garantir que um arquivo foi selecionado
// Aceita FileList (do input) ou File (se manipulado individualmente)
const fileValidation = z.custom<FileList | File>(
  file => file instanceof File || (file instanceof FileList && file.length > 0),
  {
    message: 'Selecione um arquivo',
  }
);
// Zod não pode validar tipo/tamanho de File diretamente no schema de forma fácil.
// Usaremos a prop `accept` e validação server-side.

// Schema dinâmico baseado no tipo de perfil
const createKycSchema = (profileType: UserProfileType) => {
  let schemaFields: any = {
    addressProof: fileValidation, // Obrigatório para todos
  };

  if (profileType === 'pf') {
    schemaFields.identityFront = fileValidation;
    schemaFields.identityBack = fileValidation;
  } else if (profileType === 'pj') {
    schemaFields.socialContract = fileValidation;
    // TODO: Adicionar validação para documentos de sócios se necessário
  } else {
    // Definir regras para outros tipos de perfil se houver
    // Por exemplo, profissional pode precisar de OAB/CRC?
    // Por enquanto, exigiremos o mesmo que PF para outros tipos
    schemaFields.identityFront = fileValidation;
    schemaFields.identityBack = fileValidation;
  }

  return z.object(schemaFields);
};

// Tipagem inferida do Zod (vai variar com profileType, mas definimos campos comuns)
type KycFormValues = z.infer<ReturnType<typeof createKycSchema>>;

export function KycForm({ userId, profileType }: KycFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Cria o schema específico para o tipo de usuário
  const kycSchema = createKycSchema(profileType);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      // Inicializar campos conforme o schema
      addressProof: undefined,
      ...(profileType === 'pf' || profileType !== 'pj'
        ? { identityFront: undefined, identityBack: undefined }
        : {}),
      ...(profileType === 'pj' ? { socialContract: undefined } : {}),
    },
  });

  const onSubmit = async (values: KycFormValues) => {
    setIsLoading(true);
    console.log('Valores do formulário KYC:', values);

    const formData = new FormData();
    formData.append('userId', userId);

    // Anexar arquivos ao FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]); // Pega o primeiro arquivo da FileList
      } else if (value instanceof File) {
        formData.append(key, value);
      }
    });

    // Log para verificar o FormData (não é diretamente visível no console.log)
    console.log(`Preparando FormData para userId: ${userId}`);
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`FormData -> ${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`FormData -> ${key}: ${value}`);
      }
    });

    // TODO: Implementar chamada real para API de upload
    // try {
    //   const response = await fetch('/api/users/kyc-documents', {
    //     method: 'POST',
    //     body: formData,
    //     // Headers não precisam de Content-Type, o browser define para FormData
    //   });
    //   const result = await response.json();
    //   if (!response.ok) throw new Error(result.error || 'Falha no upload');
    //   toast({ title: "Sucesso", description: "Documentos enviados para análise." });
    //   // TODO: Redirecionar ou atualizar UI
    // } catch (error: any) {
    //   console.error("Erro no upload KYC:", error);
    //   toast({ variant: "destructive", title: "Erro no Upload", description: error.message });
    // } finally {
    //   setIsLoading(false);
    // }

    // Simulação de tempo de espera
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({ title: 'Simulação OK', description: 'Documentos (simulados) enviados.' });
  };

  // Definição dos campos a serem renderizados
  const fieldsConfig = [
    // Campos PF
    ...(profileType === 'pf' || profileType !== 'pj'
      ? [
          {
            name: 'identityFront',
            label: 'Documento de Identidade (Frente)',
            accept: 'image/*,.pdf',
          },
          {
            name: 'identityBack',
            label: 'Documento de Identidade (Verso)',
            accept: 'image/*,.pdf',
          },
        ]
      : []),
    // Campos PJ
    ...(profileType === 'pj'
      ? [
          { name: 'socialContract', label: 'Contrato Social / Última Alteração', accept: '.pdf' },
          // { name: 'partnerDocuments', label: 'Documento(s) Sócio(s)/Administrador(es)', accept: 'image/*,.pdf' }, // Adicionar depois
        ]
      : []),
    // Campo Comum
    { name: 'addressProof', label: 'Comprovante de Endereço', accept: 'image/*,.pdf' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fieldsConfig.map(fieldInfo => (
          <FormField
            key={fieldInfo.name}
            control={form.control}
            // @ts-ignore // Ignorar erro TS pois o nome é dinâmico mas existe no schema
            name={fieldInfo.name}
            render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
              <FormItem>
                {/* Não precisamos do FormLabel aqui pois o FileUploader já tem label */}
                <FormControl>
                  <FileUploader
                    label={fieldInfo.label}
                    accept={fieldInfo.accept}
                    onFileSelect={file => onChange(file)} // Passa o arquivo selecionado para o RHF
                    // Não estamos passando onBlur, name, ref diretamente aqui
                    // Poderia ser necessário para validação mais complexa
                    errorMessage={fieldState.error?.message}
                  />
                </FormControl>
                {/* FormMessage é redundante pois o erro é passado para FileUploader */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Enviando Documentos...
            </>
          ) : (
            'Enviar Documentos para Análise'
          )}
        </Button>
      </form>
    </Form>
  );
}
