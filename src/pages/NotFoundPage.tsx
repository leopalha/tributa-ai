import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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

          {/* 404 Message */}
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
            <p className="text-gray-600 mb-8">
              A página que você está procurando não existe ou foi movida.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="mr-2 h-4 w-4" />
                Ir para Início
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </button>
            </div>

            {/* Quick links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Links rápidos</h3>
              <div className="space-y-2">
                <Link to="/dashboard" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Dashboard
                </Link>
                <Link to="/login" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Login
                </Link>
                <Link to="/register" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Registrar
                </Link>
                <Link to="/recuperar-senha" className="block text-blue-600 hover:text-blue-500 text-sm">
                  Recuperar Senha
                </Link>
                <Link
                  to="/dashboard/marketplace"
                  className="block text-blue-600 hover:text-blue-500 text-sm"
                >
                  Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
