CREATE TABLE PUBLISHER (
  publisher_name TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE BOOK (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  publisher_name TEXT NOT NULL,
  FOREIGN KEY (publisher_name) REFERENCES PUBLISHER(publisher_name)
);

CREATE TABLE LIBRARY_BRANCH (
  branch_id INT PRIMARY KEY,
  branch_name TEXT NOT NULL,
  branch_address TEXT NOT NULL
);

CREATE TABLE BORROWER (
  card_no INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT
);

CREATE TABLE BOOK_LOANS (
  book_id INT,
  branch_id INT,
  card_no INT,
  date_out DATE NOT NULL,
  due_date DATE NOT NULL,
  returned_date DATE,
  PRIMARY KEY (book_id, branch_id, card_no, date_out),
  FOREIGN KEY (book_id) REFERENCES BOOK(book_id),
  FOREIGN KEY (branch_id) REFERENCES LIBRARY_BRANCH(branch_id),
  FOREIGN KEY (card_no) REFERENCES BORROWER(card_no)
);

CREATE TABLE BOOK_COPIES (
  book_id INT,
  branch_id INT,
  no_of_copies INT NOT NULL,
  PRIMARY KEY (book_id, branch_id),
  FOREIGN KEY (book_id) REFERENCES BOOK(book_id),
  FOREIGN KEY (branch_id) REFERENCES LIBRARY_BRANCH(branch_id)
);

CREATE TABLE BOOK_AUTHORS (
  book_id INT,
  author_name TEXT,
  PRIMARY KEY (book_id, author_name),
  FOREIGN KEY (book_id) REFERENCES BOOK(book_id)
);
