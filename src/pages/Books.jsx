import { useState, useEffect, useRef, useCallback } from 'react';
import BooksTable from '../components/books/BooksTable';
import BookForm from '../components/books/BookForm';
import CategoriesSection from '../components/categories/CategoriesSection';
import EtiquettesSection from '../components/etiquettes/EtiquettesSection';
import AuthorsSection from '../components/authors/AuthorsSection';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import { useDebounce } from '../hooks/useDebounce';
import * as booksApi from '../services/booksApi';

const Books = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [sortBy, setSortBy] = useState('date_desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Refs for request cancellation
  const abortControllerRef = useRef(null);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  /**
   * Fetch books with current filters and pagination
   * Uses AbortController to cancel in-flight requests
   */
  const fetchBooks = useCallback(async (showFilterLoading = false) => {
    try {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Show appropriate loading state
      if (showFilterLoading) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Build query parameters
      const params = {
        page: pagination.page,
        size: pagination.size,
      };

      // Add search query if present
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }

      // Map frontend sortBy to backend sort format
      if (sortBy === 'title') {
        params.sort = 'title,asc';
      } else if (sortBy === 'price') {
        params.sort = 'price,desc';
      } else if (sortBy === 'date_asc') {
        params.sort = 'createdAt,asc';
      } else if (sortBy === 'date_desc') {
        params.sort = 'createdAt,desc';
      }

      const response = await booksApi.getBooks(params, abortControllerRef.current.signal);

      // Update state with response data
      setBooks(response.content || response.data || []);
      setPagination({
        page: response.number || response.page || 0,
        size: response.size || 20,
        totalElements: response.totalElements || response.total || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (err) {
      // Ignore cancelled requests
      if (err.message === 'REQUEST_CANCELLED') {
        return;
      }

      console.error('Error fetching books:', err);
      setError(err.response?.data?.message || 'Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [pagination.page, pagination.size, debouncedSearchQuery, sortBy]);

  /**
   * Initial load and refetch when dependencies change
   */
  useEffect(() => {
    fetchBooks(pagination.page > 0); // Show filter loading for page changes
  }, [fetchBooks]);

  /**
   * Clean up abort controller on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Handle search query changes
   * Reset to page 0 when searching
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  /**
   * Handle sort changes
   * Reset to page 0 when sort changes to show first page of sorted results
   */
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  /**
   * Handle status filter changes
   * Note: Current backend doesn't have status filter in books endpoint
   * This is kept for UI consistency
   */
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    // If backend supports status filtering, add it to fetchBooks params
  };

  /**
   * Handle page changes
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  /**
   * Handle page size changes
   */
  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  /**
   * Open form for adding new book
   */
  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  /**
   * Open form for editing book
   * Fetches latest book data from API to ensure accuracy
   */
  const handleEditBook = async (book) => {
    try {
      // Fetch latest book data from API
      const latestBook = await booksApi.getBookById(book.id);

      // Transform backend data to form format
      const formData = {
        id: latestBook.id,
        title: latestBook.title,
        authorId: latestBook.author?.id || null,
        categoryId: latestBook.tags?.find(t => t.type === 'CATEGORY')?.id || null,
        language: latestBook.language || '',
        price: latestBook.price || '',
        stockQuantity: latestBook.stockQuantity || '',
        description: latestBook.description || '',
        active: latestBook.active !== false,
        coverImage: null, // Don't prefill image (keep existing on backend)
      };

      setEditingBook(formData);
      setIsFormOpen(true);
    } catch (err) {
      console.error('Error fetching book for edit:', err);
      setError('Failed to load book details. Please try again.');
    }
  };

  /**
   * Open delete confirmation modal
   */
  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setDeleteConfirmOpen(true);
  };

  /**
   * Confirm and execute book deletion
   * Uses optimistic update pattern - updates UI immediately
   * Performs SOFT DELETE (sets active=false)
   */
  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;

    const bookId = bookToDelete.id;

    try {
      // Optimistic update - remove from UI immediately
      setBooks(books.filter(b => b.id !== bookId));
      setDeleteConfirmOpen(false);
      setBookToDelete(null);

      // Execute soft deletion (sets active=false)
      await booksApi.deleteBook(bookId);

      // Update pagination count
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements - 1,
      }));

      // If current page is now empty and not the first page, go back one page
      if (books.length === 1 && pagination.page > 0) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else if (books.length <= 1) {
        // If last item on first page, refetch to get accurate count
        fetchBooks();
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err.response?.data?.message || 'Failed to delete book. Please try again.');
      // Revert optimistic update by refetching
      fetchBooks();
    }
  };

  /**
   * Cancel deletion
   */
  const cancelDeleteBook = () => {
    setDeleteConfirmOpen(false);
    setBookToDelete(null);
  };

  /**
   * Handle book form submission (create or update)
   * Uses differential update - only updates the changed item
   */
  const handleSubmitForm = async (bookData, coverImage = null, categoryId = null) => {
    try {
      let savedBook;

      if (editingBook) {
        // Update existing book
        savedBook = await booksApi.updateBook(editingBook.id, bookData, coverImage);

        // Update category tag if changed
        if (categoryId) {
          await booksApi.addTagsToBook(savedBook.id, [categoryId]);
          // Refetch to get updated tags
          savedBook = await booksApi.getBookById(savedBook.id);
        }

        // Differential update - replace only the updated book
        setBooks(books.map(b => b.id === savedBook.id ? savedBook : b));
      } else {
        // Create new book
        savedBook = await booksApi.createBook(bookData, coverImage);

        // Assign category tag if selected
        if (categoryId) {
          await booksApi.addTagsToBook(savedBook.id, [categoryId]);
          // Refetch to get updated tags
          savedBook = await booksApi.getBookById(savedBook.id);
        }

        // Add new book to the list (prepend to show at top)
        setBooks([savedBook, ...books]);

        // Update total count
        setPagination(prev => ({
          ...prev,
          totalElements: prev.totalElements + 1,
        }));
      }

      setIsFormOpen(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error saving book:', err);
      throw err; // Let form handle error display
    }
  };

  /**
   * Handle export functionality
   * TODO: Implement actual export logic
   */
  const handleExport = () => {
    console.log('Export triggered for books');
    // TODO: Implement export logic
  };

  // Apply client-side status filter
  // Note: Backend doesn't support status filtering, so we filter by stockQuantity on frontend
  const filteredBooks = books.filter(book => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && book.stockQuantity === 0) return false;
      if (statusFilter === 'out_of_stock' && book.stockQuantity > 0) return false;
    }
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state with retry
  if (error && books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Error Loading Books</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button
          onClick={() => fetchBooks()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Livres</h1>
        <p className="text-gray-600 mt-1">Gérez votre inventaire de livres</p>
      </div>

      {/* Error banner (non-blocking) */}
      {error && books.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      <BooksTable
        books={filteredBooks}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onAddBook={handleAddBook}
        onExport={handleExport}
        loading={filterLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Categories Management Section */}
      <CategoriesSection />

      {/* Authors Management Section */}
      <AuthorsSection />

      {/* Etiquettes Management Section */}
      <EtiquettesSection />

      <BookForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editingBook}
      />

      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDeleteBook}
        onCancel={cancelDeleteBook}
        itemName={bookToDelete?.title || "ce livre"}
      />
    </div>
  );
};

export default Books;
