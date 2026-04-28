const buttons = document.querySelectorAll(".sidebar-btn");
const panels = document.querySelectorAll(".panel");

// Toggle displaying
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document
      .getElementById("panel-" + btn.dataset.panel)
      .classList.add("active");
  });
});

// 2) Add information about a new Borrower. Do not provide the CardNo in your query. Output the card number as if you are giving a new library card.
const addBorrower = async () => {};

// 3) Add a new Book with publisher (use can use a publisher that already exists) and author information to all 5 branches with 5 copies for each branch. Submit your editable SQL query that your code executes.
const addBook = async () => {
  const title = document.querySelector("#book-title").value;
  const authorName = document.querySelector("#book-author").value;
  const publisher = document.querySelector("#book-publisher").value;

  const res = await fetch(`/api/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      authorName,
      publisher,
    }),
  });

  // TODO: Display data
  const data = await res.json();
  console.log(data);
};

// 4) Given a book title list the number of copies loaned out per branch.
const copiesPerBranch = async () => {
  const title = document.querySelector("#copies-title").value;

  const res = await fetch(`/api/copies?title=${title}`);

  // TODO: Display data
  const data = await res.json();
  console.log(data);
};
