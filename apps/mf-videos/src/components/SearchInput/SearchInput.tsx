import { useState, type SubmitEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "../Button/Button";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchInput({ onSearch, isLoading = false }: SearchInputProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    if (value.length < 2 || isLoading) {
      return;
    }

    onSearch(value);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="video-search" className="sr-only">
          Pesquisar vídeos
        </label>

        <Search
          size={20}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
        />

        <input
          id="video-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="O que você quer assistir?"
          required
          minLength={2}
          maxLength={100}
          className="w-full rounded-xl border border-border-ui bg-surface py-3 pr-4 pl-12 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!query.trim()}
        className="bg-brand text-background hover:bg-brand-hover"
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </Button>
      <Search size={18} aria-hidden="true" />
      {isLoading ? "Buscando..." : "Buscar"}
    </form>
  );
}
