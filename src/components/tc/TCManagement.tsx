'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TCList } from "./TCList";
import { TCEmissao } from "./TCEmissao";
import { TCDetails } from "./TCDetails";
import { TCTransactions } from "./TCTransactions";
import { useTC } from "@/hooks/useTC";
import { TC } from "@/types/tc";

interface TCManagementProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
  selectedTC?: TC | null;
  onTCSelect?: (tc: TC) => void;
}

export function TCManagement({ 
  initialTab = "lista",
  onTabChange,
  selectedTC,
  onTCSelect
}: TCManagementProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const handleTCSelect = (tc: TC) => {
    onTCSelect?.(tc);
    handleTabChange("detalhes");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="lista">Lista de TCs</TabsTrigger>
        <TabsTrigger value="emissao">Emissão</TabsTrigger>
        {selectedTC && (
          <>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="lista">
        <TCList onSelect={handleTCSelect} />
      </TabsContent>

      <TabsContent value="emissao">
        <TCEmissao />
      </TabsContent>

      {selectedTC && (
        <>
          <TabsContent value="detalhes">
            <TCDetails tc={selectedTC} />
          </TabsContent>

          <TabsContent value="transacoes">
            <TCTransactions tc={selectedTC} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
} 