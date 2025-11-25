import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authService.recuperarSenha(email);
      setSuccess(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setError('Não foi possível enviar o email de recuperação. Verifique se o endereço está correto.');
      toast.error('Falha ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-blue-100">
        <CardHeader className="space-y-1">
          <Link to="/login" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Login
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tributa.AI
                </h1>
                <p className="text-xs text-gray-500">Marketplace Universal</p>
              </div>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Informe seu email para receber instruções de recuperação
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <Alert variant="success" className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Email enviado com sucesso! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Voltar para login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 