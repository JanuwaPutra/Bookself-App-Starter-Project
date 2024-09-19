document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchBook');
  const checkboxIsComplete = document.getElementById('bookFormIsComplete');
  const submitButton = document.getElementById('bookFormSubmit');
  const submitButtonText = submitButton.querySelector('span');


  checkboxIsComplete.addEventListener('change', function () {
    if (checkboxIsComplete.checked) {
      submitButtonText.innerText = 'Selesai dibaca';
    } else {
      submitButtonText.innerText = 'Belum selesai dibaca';
    }
  });
  
 
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    clearForm();
  });
 
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); 
    searchBook(searchInput.value);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
 
  function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
 
   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year ,isComplete);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(); 
    alert('Buku Berhasil Ditambahkan');
  }
 
  function generateId() {
    return +new Date();
  }
   
  function generateBookObject(id, title, author,year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }
 
  const books = [];
const RENDER_EVENT = 'render-book';
 
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';
   
    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete)
        uncompletedBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }
  });
 
  function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;
    textTitle.setAttribute('data-testid', 'bookItemTitle');  
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Author: ' + bookObject.author;
    textAuthor.setAttribute('data-testid', 'bookItemAuthor'); 
    
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;
    textYear.setAttribute('data-testid', 'bookItemYear'); 
    
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);
    
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
    container.setAttribute('data-testid', 'bookItem');  
    container.setAttribute('data-bookid', bookObject.id); 

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.setAttribute('data-testid', 'bookItemDeleteButton'); 
    
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    
    if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton'); 
      
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(bookObject.id);
      });
      
   
      
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
      
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(bookObject.id);
      });
      
      container.append(checkButton, trashButton);
    }
    
    return container;
  }
 
  function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Buku Sudah Dibaca');
  }
 
 
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
 
  function removeTaskFromCompleted(bookId) {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus buku ini?');
 
    if (confirmation) {
        const bookTarget = findBookIndex(bookId);
       
        if (bookTarget === -1) return;
       
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}
   
  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Buku Belum Selesai Dibaca');
  }
 
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }
 
  function searchBook(keyword) {
    const filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(keyword.toLowerCase())
    );
    renderBooks(filteredBooks);
  }
  
  function renderBooks(bookList) {
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';
  
    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';
  
    for (const bookItem of bookList) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete)
        uncompletedBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }
  }
  
  document.addEventListener(RENDER_EVENT, function () {
    renderBooks(books); 
  });

  function clearForm() {
    document.getElementById('bookFormTitle').value = '';
    document.getElementById('bookFormAuthor').value = '';
    document.getElementById('bookFormYear').value = '';
    document.getElementById('bookFormIsComplete').checked = false;
  }