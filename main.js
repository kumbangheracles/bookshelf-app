document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const searchForm = document.getElementById("searchBook");
    const searchInput = document.getElementById("searchBookTitle");
  
    const STORAGE_KEY = "BOOKSHELF_APPS";
  
    let books = [];
  
    // Fungsi untuk menyimpan data ke localStorage
    function saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  
    // Fungsi untuk memuat data dari localStorage
    function loadFromLocalStorage() {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        books = JSON.parse(storedData);
        books.forEach((book) => renderBook(book));
      }
    }
  
    // Fungsi untuk membuat objek buku
    function createBookObject(title, author, year, isComplete) {
      return {
        id: +new Date(), // ID unik berdasarkan timestamp
        title,
        author,
        year,
        isComplete,
      };
    }
  
    // Fungsi untuk membuat elemen buku di DOM
    function createBookElement(book) {
      const bookContainer = document.createElement("div");
      bookContainer.setAttribute("data-testid", "bookItem");
      bookContainer.setAttribute("data-bookid", book.id);
  
      const bookTitle = document.createElement("h3");
      bookTitle.innerText = book.title;
      bookTitle.setAttribute("data-testid", "bookItemTitle");
  
      const bookAuthor = document.createElement("p");
      bookAuthor.innerText = `Penulis: ${book.author}`;
      bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  
      const bookYear = document.createElement("p");
      bookYear.innerText = `Tahun: ${book.year}`;
      bookYear.setAttribute("data-testid", "bookItemYear");
  
      const actionContainer = document.createElement("div");
  
      const completeButton = document.createElement("button");
      completeButton.innerText = book.isComplete
        ? "Belum selesai dibaca"
        : "Selesai dibaca";
      completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
      completeButton.addEventListener("click", () => toggleBookStatus(book.id));
  
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Hapus Buku";
      deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
      deleteButton.addEventListener("click", () => deleteBook(book.id));
  
      actionContainer.appendChild(completeButton);
      actionContainer.appendChild(deleteButton);
  
      bookContainer.appendChild(bookTitle);
      bookContainer.appendChild(bookAuthor);
      bookContainer.appendChild(bookYear);
      bookContainer.appendChild(actionContainer);
  
      return bookContainer;
    }
  
    // Fungsi untuk merender buku ke DOM
    function renderBook(book) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    }
  
    // Fungsi untuk menambah buku baru
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = document.getElementById("bookFormYear").value;
      const isComplete = document.getElementById("bookFormIsComplete").checked;
  
      const newBook = createBookObject(title, author, year, isComplete);
      books.push(newBook);
      saveToLocalStorage();
      renderBook(newBook);
  
      bookForm.reset();
    });
  
    // Fungsi untuk mengganti status buku (selesai/belum selesai)
    function toggleBookStatus(bookId) {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        book.isComplete = !book.isComplete;
        saveToLocalStorage();
        refreshBookList();
      }
    }
  
    // Fungsi untuk menghapus buku
    function deleteBook(bookId) {
      books = books.filter((b) => b.id !== bookId);
      saveToLocalStorage();
      refreshBookList();
    }
  
    // Fungsi untuk merefresh daftar buku di DOM
    function refreshBookList() {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach((book) => renderBook(book));
    }
  
    // Fungsi untuk mencari buku berdasarkan judul
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchQuery = searchInput.value.toLowerCase();
      refreshSearchResults(searchQuery);
    });
  
    function refreshSearchResults(query) {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      books
        .filter((book) => book.title.toLowerCase().includes(query))
        .forEach((book) => renderBook(book));
    }
  
    // Muat data dari localStorage saat halaman dimuat
    loadFromLocalStorage();
  });
  