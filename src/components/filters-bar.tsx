'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface FilterState {
  tags: string[]
  difficulty: number[]
  buildType: string[]
  minScore?: number
  maxScore?: number
  search?: string
}

interface FiltersBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableTags: string[]
  availableBuildTypes: string[]
}

export function FiltersBar({
  filters,
  onFiltersChange,
  availableTags,
  availableBuildTypes,
}: FiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search || '')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, search: searchValue })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleDifficultyToggle = (difficulty: number) => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty]
    onFiltersChange({ ...filters, difficulty: newDifficulty })
  }

  const handleBuildTypeToggle = (buildType: string) => {
    const newBuildTypes = filters.buildType.includes(buildType)
      ? filters.buildType.filter(bt => bt !== buildType)
      : [...filters.buildType, buildType]
    onFiltersChange({ ...filters, buildType: newBuildTypes })
  }

  const clearFilters = () => {
    setSearchValue('')
    onFiltersChange({
      tags: [],
      difficulty: [],
      buildType: [],
      search: '',
    })
  }

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.buildType.length > 0 ||
    filters.search ||
    filters.minScore !== undefined ||
    filters.maxScore !== undefined

  const difficultyLabels = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Medium',
    4: 'Hard',
    5: 'Very Hard',
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {filters.tags.length + filters.difficulty.length + filters.buildType.length}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Difficulty */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(difficultyLabels).map(([value, label]) => (
                <Button
                  key={value}
                  variant={filters.difficulty.includes(Number(value)) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDifficultyToggle(Number(value))}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Build Type */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Build Type</h4>
            <div className="flex flex-wrap gap-2">
              {availableBuildTypes.map((buildType) => (
                <Button
                  key={buildType}
                  variant={filters.buildType.includes(buildType) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBuildTypeToggle(buildType)}
                >
                  {buildType}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 20).map((tag) => (
                <Button
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Score Range</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={filters.minScore || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  minScore: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={filters.maxScore || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  maxScore: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}