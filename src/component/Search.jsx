import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';

function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content..."
            style={{
              width: '100%',
              padding: '12px 40px 12px 12px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#95a5a6'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <SearchIcon size={20} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} found for "{query}"
          </h3>
          
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              <SearchIcon size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p>No results found. Try different keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #ecf0f1'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      background: '#3498db',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {result.page_name}
                    </span>
                    <span style={{ color: '#95a5a6', fontSize: '12px' }}>
                      {result.section_name} / {result.content_key}
                    </span>
                  </div>
                  <div style={{ margin: 0, color: '#2c3e50', lineHeight: '1.6' }}>
                    {Array.isArray(result.content_value) 
                      ? result.content_value.map((item, i) => (
                          <div key={i} style={{ marginBottom: '8px' }}>
                            {typeof item === 'object' 
                              ? Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ')
                              : item}
                          </div>
                        ))
                      : typeof result.content_value === 'object'
                      ? Object.entries(result.content_value).map(([k, v]) => `${k}: ${v}`).join(', ')
                      : result.content_value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
