import React from 'react';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  thcRange: [number, number];
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableCategories: string[];
  availableBrands: string[];
  priceBounds: [number, number];
  thcBounds: [number, number];
}

export function ProductFilters({
  filters,
  onFilterChange,
  availableCategories,
  availableBrands,
  priceBounds,
  thcBounds
}: ProductFiltersProps) {

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleThcChange = (value: number[]) => {
    onFilterChange({ ...filters, thcRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: priceBounds,
      thcRange: thcBounds,
      inStockOnly: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-slate-900">Filters</h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-slate-500 hover:text-emerald-600 h-8 px-2"
        >
            Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
            <Checkbox 
                id="in-stock" 
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => onFilterChange({ ...filters, inStockOnly: checked === true })}
            />
            <Label htmlFor="in-stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                In Stock Only
            </Label>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'brand', 'price', 'thc']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold text-slate-800">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer text-slate-600">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-semibold text-slate-800">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-2">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer text-slate-600">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold text-slate-800">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-1 space-y-4">
              <Slider
                defaultValue={[priceBounds[0], priceBounds[1]]}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={1}
                onValueChange={handlePriceChange}
                className="my-4"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="thc">
            <AccordionTrigger className="text-sm font-semibold text-slate-800">THC Content</AccordionTrigger>
            <AccordionContent>
                <div className="pt-4 px-1 space-y-4">
                    <Slider
                        defaultValue={[thcBounds[0], thcBounds[1]]}
                        value={[filters.thcRange[0], filters.thcRange[1]]}
                        min={thcBounds[0]}
                        max={thcBounds[1]}
                        step={1}
                        onValueChange={handleThcChange}
                        className="my-4"
                    />
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                        <span>{filters.thcRange[0]}mg</span>
                        <span>{filters.thcRange[1]}mg</span>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
