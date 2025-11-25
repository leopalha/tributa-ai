import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError('');

    try {
      await authService.registrar({
        nome: values.name,
        email: values.email,
        senha: values.password,
        confirmacaoSenha: values.confirmPassword,
        tipo: 'cliente'
      });
      
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no registro:', error);
      setError('Não foi possível criar sua conta. Verifique os dados e tente novamente.');
      toast.error('Falha no registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-blue-100">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Home
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
          
          <CardTitle className="text-2xl font-bold text-center">Crie sua conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para se registrar na plataforma
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <RegisterForm onSubmit={handleRegister} isLoading={loading} />
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
