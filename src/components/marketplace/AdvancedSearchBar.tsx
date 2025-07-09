import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import our safe Radix UI components
import { SafePopover, SafePopoverTrigger } from '@/components/ui/safe-radix-components';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface SearchFilters {
  categories: string[];
  priceRange: { min: number; max: number };
  dateRange?: { from: Date; to: Date } | null;
  isTokenized?: boolean | null;
  sortBy: string;
}

interface AdvancedSearchBarProps {
  onSearch: (query: string, filters: SearchFilters, isAISearch: boolean) => void;
  categories: Category[];
  suggestedSearches?: string[];
}

export function AdvancedSearchBar({
  onSearch,
  categories,
  suggestedSearches = [],
}: AdvancedSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showingFilters, setShowingFilters] = useState(false);
  const [isAISearch, setIsAISearch] = useState(false);

  // Estado para filtros
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    dateRange: null,
    isTokenized: null,
    sortBy: 'relevance',
  });

  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Número de filtros ativos
  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 1000000 ? 1 : 0) +
    (filters.isTokenized !== null ? 1 : 0) +
    (filters.sortBy !== 'relevance' ? 1 : 0);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(categoryId);

      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter(c => c !== categoryId)
          : [...prev.categories, categoryId],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      dateRange: null,
      isTokenized: null,
      sortBy: 'relevance',
    });
  };

  const handleSearch = () => {
    onSearch(searchQuery, filters, isAISearch);
    setShowingFilters(false);
  };

  const handleSuggestedSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query, filters, false);
  };

  // Componente de filtros que será utilizado tanto no Popover quanto no Drawer
  const FiltersContent = React.memo(
    ({ showFooter = false, onClose }: { showFooter?: boolean; onClose?: () => void }) => (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categories">Categorias</Label>
          <ScrollArea className="h-[200px] rounded-md border">
            <div className="p-4 space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center cursor-pointer"
                  >
                    <Badge
                      variant="outline"
                      className={`mr-2 bg-${category.color}-100 text-${category.color}-800 border-${category.color}-200`}
                    >
                      {category.name}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <Label>Faixa de Preço</Label>
          <div className="pt-4 px-2">
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={value => {
                handleFilterChange('priceRange', { min: value[0], max: value[1] });
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatCurrency(filters.priceRange.min)}</span>
              <span>{formatCurrency(filters.priceRange.max)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select
            value={filters.sortBy}
            onValueChange={value => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevância</SelectItem>
              <SelectItem value="price_asc">Menor Preço</SelectItem>
              <SelectItem value="price_desc">Maior Preço</SelectItem>
              <SelectItem value="date_desc">Mais Recentes</SelectItem>
              <SelectItem value="date_asc">Mais Antigos</SelectItem>
              <SelectItem value="discount_desc">Maior Desconto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="tokenized">Apenas Créditos Tokenizados</Label>
          <Switch
            id="tokenized"
            checked={filters.isTokenized === true}
            onCheckedChange={checked => handleFilterChange('isTokenized', checked ? true : null)}
          />
        </div>

        {showFooter && (
          <div className="flex justify-between pt-4 border-t">
            <Button variant="ghost" onClick={resetFilters} disabled={activeFilterCount === 0}>
              Limpar Filtros
            </Button>
            <Button
              onClick={() => {
                handleSearch();
                if (onClose) onClose();
              }}
            >
              Aplicar Filtros
            </Button>
          </div>
        )}
      </div>
    )
  );
  FiltersContent.displayName = 'FiltersContent';

  // Fix for onOpenChange to prevent infinite loop
  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      // Only update state when closing to prevent re-render loops
      setShowingFilters(false);
    }
  }, []);

  // Renderização condicional do componente de filtros, baseado no tamanho da tela
  const FiltersTrigger = isDesktop ? (
    <SafePopover open={showingFilters} onOpenChange={handleOpenChange}>
      <SafePopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center"
          onClick={() => setShowingFilters(true)}
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SafePopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <FiltersContent showFooter={true} onClose={() => setShowingFilters(false)} />
      </PopoverContent>
    </SafePopover>
  ) : (
    <Drawer open={showingFilters} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center"
          onClick={() => setShowingFilters(true)}
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtros de Busca</DrawerTitle>
          <DrawerDescription>
            Refine os resultados para encontrar créditos específicos
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <FiltersContent />
        </div>
        <DrawerFooter>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
            >
              Limpar Filtros
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                handleSearch();
                setShowingFilters(false);
              }}
            >
              Aplicar Filtros
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // Memoize handler functions to prevent recreation on each render
  const handleSearchButtonClick = React.useCallback(() => {
    handleSearch();
  }, [searchQuery, filters, isAISearch]);

  const handleClearSearch = React.useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por créditos, precatórios, tipos específicos..."
            className="pl-10 pr-20" // Espaço para o ícone de busca e o botão de limpar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={handleSearchButtonClick}>
            Buscar
          </Button>
          {FiltersTrigger}
        </div>
      </div>

      {/* Buscas sugeridas */}
      {suggestedSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sugestões:</span>
          {suggestedSearches.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSuggestedSearch(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      {/* Chips de filtros ativos */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.categories.length}{' '}
              {filters.categories.length === 1 ? 'categoria' : 'categorias'}
              <button
                type="button"
                onClick={() => handleFilterChange('categories', [])}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.priceRange.min > 0 || filters.priceRange.max < 1000000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {formatCurrency(filters.priceRange.min)} - {formatCurrency(filters.priceRange.max)}
              <button
                type="button"
                onClick={() => handleFilterChange('priceRange', { min: 0, max: 1000000 })}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.isTokenized === true && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tokenizados
              <button
                type="button"
                onClick={() => handleFilterChange('isTokenized', null)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.sortBy !== 'relevance' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.sortBy === 'price_asc'
                ? 'Menor Preço'
                : filters.sortBy === 'price_desc'
                  ? 'Maior Preço'
                  : filters.sortBy === 'date_desc'
                    ? 'Mais Recentes'
                    : filters.sortBy === 'date_asc'
                      ? 'Mais Antigos'
                      : filters.sortBy === 'discount_desc'
                        ? 'Maior Desconto'
                        : 'Ordenado'}
              <button
                type="button"
                onClick={() => handleFilterChange('sortBy', 'relevance')}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button type="button" variant="ghost" size="sm" className="h-7" onClick={resetFilters}>
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
}

// Checkbox component for the categories
function Checkbox({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={`h-4 w-4 rounded border flex items-center justify-center ${
        checked ? 'bg-primary border-primary' : 'border-input'
      }`}
      onClick={() => onCheckedChange(!checked)}
    >
      {checked && <Check className="h-3 w-3 text-primary-foreground" />}
    </div>
  );
}
