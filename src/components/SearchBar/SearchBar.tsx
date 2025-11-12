import css from './SearchBar.module.css';
import toast, { Toaster } from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (value: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSearch = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (query.trim() === '') {
      toast('Please enter your search query.');
      return;
    }
    onSubmit(query.trim());
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form action={handleSearch} className={css.form}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
      <Toaster />
    </header>
  );
}
