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

const bookTitleInput = document.querySelector("#copies-title");

const copiesPerBranch = () => {
  console.log(bookTitleInput.value);
};
