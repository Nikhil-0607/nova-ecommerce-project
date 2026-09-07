import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDebounce } from "../../hooks/useDebounce"
import { searchService } from "../../services/searchService"
import type { RecentSearch, SearchSuggestion, SearchSuggestionGroup, TrendingSearch } from "../../types/catalog"

type SearchAutocompleteProps = {
  value?: string
  onValueChange?: (value: string) => void
  onClose?: () => void
}

export default function SearchAutocomplete({ value, onValueChange, onClose }: SearchAutocompleteProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [internalValue, setInternalValue] = useState("")
  const query = value ?? internalValue
  const setQuery = onValueChange ?? setInternalValue
  const debouncedQuery = useDebounce(query, 250)
  const [groups, setGroups] = useState<SearchSuggestionGroup[]>([])
  const [recent, setRecent] = useState<RecentSearch[]>([])
  const [trending, setTrending] = useState<TrendingSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionId = "search-suggestions"
  const suggestions = useMemo(() => groups.flatMap((group) => group.suggestions), [groups])

  useEffect(() => {
    const loadDefaultSuggestions = async () => {
      const [recentSearches, trendingSearches] = await Promise.all([
        searchService.getRecentSearches(),
        searchService.getTrendingSearches(),
      ])
      setRecent(recentSearches)
      setTrending(trendingSearches)
    }
    void loadDefaultSuggestions()
  }, [location.pathname])

  useEffect(() => {
    if (!open || !debouncedQuery.trim()) {
      setGroups([])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    void searchService.getSuggestions(debouncedQuery).then((result) => {
      if (active) {
        setGroups(result)
        setLoading(false)
        setActiveIndex(-1)
      }
    }).catch(() => {
      if (active) {
        setGroups([])
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [debouncedQuery, open])

  const submit = useCallback((searchQuery: string) => {
    const normalized = searchQuery.trim()
    if (!normalized) return
    void searchService.saveRecentSearch(normalized)
    navigate(`/search?q=${encodeURIComponent(normalized)}`)
    setOpen(false)
    onClose?.()
  }, [navigate, onClose])

  const chooseSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "product" && suggestion.route) navigate(suggestion.route)
    else if (suggestion.route) navigate(suggestion.route)
    else submit(suggestion.label)
    setQuery(suggestion.label)
    setOpen(false)
    onClose?.()
  }

  const removeRecent = async (queryToRemove: string) => {
    await searchService.removeRecentSearch(queryToRemove)
    setRecent((current) => current.filter((item) => item.query.toLowerCase() !== queryToRemove.toLowerCase()))
  }

  const clearRecent = async () => {
    await searchService.clearRecentSearches()
    setRecent([])
  }

  const visibleDefaultItems = !query.trim() ? [
    ...recent.map((item) => ({ id: `recent-${item.query}`, label: item.query, type: "recent" as const })),
    ...trending.map((item) => ({ id: `trending-${item.query}`, label: item.label, type: "trending" as const })),
  ] : []

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const items = query.trim() ? suggestions : visibleDefaultItems
    if (event.key === "Escape") {
      setOpen(false)
      onClose?.()
    } else if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % items.length)
    } else if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + items.length) % items.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      const selected = items[activeIndex]
      if (selected && "type" in selected && selected.type === "product") chooseSuggestion(selected)
      else if (selected && "type" in selected && selected.type !== "recent" && selected.type !== "trending") chooseSuggestion(selected)
      else submit(selected?.label ?? query)
    }
  }

  const defaultItems = visibleDefaultItems
  return (
    <div className="search-autocomplete">
      <form onSubmit={(event) => { event.preventDefault(); submit(query) }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products, brands and more..."
          aria-label="Search products, brands and more"
          aria-controls={suggestionId}
          aria-expanded={open}
          aria-activedescendant={activeIndex >= 0 ? `${suggestionId}-${activeIndex}` : undefined}
          role="combobox"
        />
      </form>
      {open && <div className="search-suggestions" id={suggestionId} role="listbox">
        {loading && <p className="search-message">Finding suggestions…</p>}
        {!loading && query.trim() && groups.map((group) => (
          <section key={group.type} className="suggestion-group">
            <h3>{group.label}</h3>
            {group.suggestions.map((suggestion) => {
              const index = suggestions.indexOf(suggestion)
              return <button type="button" role="option" id={`${suggestionId}-${index}`} aria-selected={activeIndex === index} className="suggestion-item" key={suggestion.id} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(suggestion)}>
                <span>{suggestion.label}</span><small>{suggestion.subtitle}</small>
              </button>
            })}
          </section>
        ))}
        {!loading && !query.trim() && defaultItems.length > 0 && <section className="suggestion-group">
          <h3>{recent.length > 0 ? "Recent searches" : "Trending searches"}</h3>
          {defaultItems.map((item, index) => <div className="suggestion-item" role="option" id={`${suggestionId}-${index}`} aria-selected={activeIndex === index} key={item.id}>
            <button type="button" className="suggestion-select" onMouseDown={(event) => event.preventDefault()} onClick={() => submit(item.label)}><span>{item.label}</span><small>{item.type}</small></button>
            {item.type === "recent" && <button type="button" className="suggestion-remove" aria-label={`Remove recent search ${item.label}`} onMouseDown={(event) => event.preventDefault()} onClick={() => void removeRecent(item.label)}>×</button>}
          </div>)}
          {recent.length > 0 && <button type="button" className="text-btn" onClick={() => void clearRecent()}>Clear all recent searches</button>}
        </section>}
        {!loading && query.trim() && groups.length === 0 && <p className="search-message">No suggestions found</p>}
      </div>}
    </div>
  )
}
