{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      filters: '.filters'
    },
    all: {
      bookImages: '.book__image',
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML)
  };

  const classNames = {
    bookFavorite: 'favorite'
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.bookList = document.querySelector(select.containerOf.books);
      thisBooksList.dom.allFilters = document.querySelector(select.containerOf.filters);
    }

    render() {
      const thisBooksList = this;

      for (let bookData of thisBooksList.data) {
        bookData.ratingBgc = thisBooksList.determineRatingBgc(bookData.rating);
        bookData.ratingWidth = bookData.rating * 10;

        const generatedHTML = templates.book(bookData); // text
        const generatedElement = utils.createDOMFromHTML(generatedHTML); // HTML element <li></li>
        thisBooksList.dom.bookList.appendChild(generatedElement); // container (<ul></ul>) for above HTML
      }
    }

    initActions() {
      const thisBooksList = this;

      // Add to favorites

      const favoriteBooks = thisBooksList.favoriteBooks;
      const filters = thisBooksList.filters;

      thisBooksList.dom.bookList.addEventListener('dblclick', function(event) {
        event.preventDefault();

        const clickedElementParent = event.target.offsetParent;

        if(clickedElementParent.classList.contains('book__image')) {
          const bookId = clickedElementParent.getAttribute('data-id');

          if (!favoriteBooks.includes(bookId)) {
            clickedElementParent.classList.add(classNames.bookFavorite);
            favoriteBooks.push(bookId);
          } else {
            clickedElementParent.classList.remove(classNames.bookFavorite);
            const bookIdIndex = favoriteBooks.indexOf(bookId);
            favoriteBooks.splice(bookIdIndex, 1);
          }
        }
      });

      // Filter

      thisBooksList.dom.allFilters.addEventListener('click', function(event) {
        const clickedElement = event.target;

        if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter') {

          if (clickedElement.checked) {
            filters.push(clickedElement.value);
          } else {
            const filterIndex = filters.indexOf(clickedElement.value);
            filters.splice(filterIndex, 1);
          }
        }
        thisBooksList.filterBooks();
      });

    }

    filterBooks() {
      const thisBooksList = this;

      for (let bookData of thisBooksList.data) {
        let shouldBeHidden = false;
        const bookId = bookData.id;
        let matchingBook = document.querySelector('a[data-id="' + bookId + '"]');

        for (let filter of thisBooksList.filters) {
          if (!bookData.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        if (shouldBeHidden) {
          matchingBook.classList.add('hidden');
        } else {
          matchingBook.classList.remove('hidden');
        }

      }
    }

    determineRatingBgc(rating) {
      let background = '';

      if (rating <= 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }

      return background;
    }

  }

  const app = new BooksList();
  console.log(app);

}




// FUNCTION VERSION

//   /* SHOW BOOKS */
//
//   function render() {
//     const allBooks = this;
//
//     allBooks.data = dataSource;
//
//     for (let bookData of allBooks.data.books) {
//       bookData.ratingBgc = determineRatingBgc(bookData.rating);
//       console.log(bookData.ratingBgc);
//       bookData.ratingWidth = bookData.rating * 10;
//
//       const generatedHTML = templates.book(bookData); // text
//       const generatedElement = utils.createDOMFromHTML(generatedHTML); // HTML element <li></li>
//       const booksContainer = document.querySelector(select.containerOf.books); // container (<ul></ul>) for above HTML
//       booksContainer.appendChild(generatedElement);
//     }
//   }
//
//   render();
//
//
//   /* LIKE OR DISLIKE BOOKS, FILTER BOOKS */
//
//   let favoriteBooks = [];
//   let filters = [];
//
//   function initActions() {
//
//     // const allCovers = document.querySelectorAll(select.all.bookImages);
//     //
//     // for (let cover of allCovers) {
//     //   console.log(cover);
//     //   cover.addEventListener('dblclick', function(event) {
//     //     event.preventDefault();
//     //
//     //     const bookId = cover.getAttribute('data-id');
//     //
//     //     if (!favoriteBooks.includes(bookId)) {
//     //       cover.classList.add(classNames.bookFavorite);
//     //       favoriteBooks.push(bookId);
//     //     } else {
//     //       cover.classList.remove(classNames.bookFavorite);
//     //       const bookIdIndex = favoriteBooks.indexOf(bookId);
//     //       favoriteBooks.splice(bookIdIndex, 1);
//     //     }
//     //     console.log(favoriteBooks);
//     //   });
//     // }
//
//     // zamiast dodawac listener na kazda ksiazke osobno, mozna dodac na caly container i sprawdzac co w HTML zostalo klikniete za pomoca event.target
//     const allBooks = document.querySelector(select.containerOf.books);
//
//     allBooks.addEventListener('dblclick', function(event) {
//       event.preventDefault();
//
//       // console.log(event.target); // clicked element
//       const clickedElementParent = event.target.offsetParent; // clicked element's parent - klikajac w HTML zaznacza sie img wiec trzeba dostac sie do parenta <a href=...> <img> </a>
//       // console.log(clickedElementParent);
//
//       if(clickedElementParent.classList.contains('book__image')) {
//         // console.log('book cover clicked');
//         const bookId = clickedElementParent.getAttribute('data-id');
//         if (!favoriteBooks.includes(bookId)) {
//           clickedElementParent.classList.add(classNames.bookFavorite);
//           favoriteBooks.push(bookId);
//         } else {
//           clickedElementParent.classList.remove(classNames.bookFavorite);
//           const bookIdIndex = favoriteBooks.indexOf(bookId);
//           favoriteBooks.splice(bookIdIndex, 1);
//         }
//         // console.log(favoriteBooks);
//       }
//     });
//
//     const allFilters = document.querySelector(select.containerOf.filters);
//     // console.log(allFilters);
//
//     allFilters.addEventListener('click', function(event) {
//       const clickedElement = event.target;
//       // console.log(clickedElement);
//
//       if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter') {
//
//         if (clickedElement.checked) {
//           filters.push(clickedElement.value);
//         } else {
//           const filterIndex = filters.indexOf(clickedElement.value);
//           filters.splice(filterIndex, 1);
//         }
//         // console.log(filters);
//
//       }
//       filterBooks();
//     });
//
//   }
//
//   initActions();
//
//
//   /* FILTER BOOKS */
//
//   function filterBooks() {
//     const allBooks = this;
//
//     allBooks.data = dataSource;
//
//     for (let bookData of allBooks.data.books) {
//       let shouldBeHidden = false;
//       const bookId = bookData.id;
//       let matchingBook = document.querySelector('a[data-id="' + bookId + '"]');
//
//       for (let filter of filters) {
//         // console.log('checking', filter);
//         // console.log('book type',filter, bookData.details[filter]);
//         if (!bookData.details[filter]) {
//           shouldBeHidden = true;
//           // console.log('shouldBeHidden', shouldBeHidden);
//           break;
//         }
//       }
//       if (shouldBeHidden) {
//         matchingBook.classList.add('hidden');
//       } else {
//         matchingBook.classList.remove('hidden');
//       }
//     }
//   }
//
//
//   /* COLOR RATING */
//
//   function determineRatingBgc(rating) {
//     let background = '';
//
//     if (rating <= 6) {
//       background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
//     } else if (rating > 6 && rating <= 8) {
//       background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
//     } else if (rating > 8 && rating <= 9) {
//       background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
//     } else {
//       background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
//     }
//
//     return background;
//   }
//
// }
