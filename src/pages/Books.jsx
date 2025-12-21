import { useState, useEffect } from 'react';
import BooksTable from '../components/books/BooksTable';
import BookForm from '../components/books/BookForm';
import CategoriesSection from '../components/categories/CategoriesSection';
import EtiquettesSection from '../components/etiquettes/EtiquettesSection';
import AuthorsSection from '../components/authors/AuthorsSection';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import { getBooks, createBook, updateBook, deleteBook } from '../mock/mockApi';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((book) => book.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'price') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredBooks(result);
  }, [searchQuery, books, sortBy, statusFilter]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const result = await getBooks(1, '', 100);
      setBooks(result.data);
      setFilteredBooks(result.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id);
        setDeleteConfirmOpen(false);
        setBookToDelete(null);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const cancelDeleteBook = () => {
    setDeleteConfirmOpen(false);
    setBookToDelete(null);
  };

  const handleSubmitForm = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await createBook(bookData);
      }
      setIsFormOpen(false);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleExport = () => {
    console.log('Export triggered for books');
    // TODO: Implement export logic
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Livres</h1>
        <p className="text-gray-600 mt-1">Gérez votre inventaire de livres</p>
      </div>

      <BooksTable
        books={filteredBooks}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddBook={handleAddBook}
        onExport={handleExport}
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
