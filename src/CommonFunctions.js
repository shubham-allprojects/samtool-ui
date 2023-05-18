export const toggleClassOfNextPrevPageItems = () => {
  let activePageItem = document.querySelector(".page-item.active");
  if (activePageItem) {
    let nextPageItem = activePageItem.nextElementSibling;
    if (nextPageItem.textContent === "Next") {
      nextPageItem.classList.add("disabled");
    } else {
      document.querySelectorAll(".page-item").forEach((item) => {
        if (item.textContent === "Next") {
          item.classList.remove("disabled");
        }
      });
    }

    let prevPageItem = activePageItem.previousElementSibling;
    if (prevPageItem.textContent === "Prev") {
      prevPageItem.classList.add("disabled");
    } else {
      document.querySelectorAll(".page-item").forEach((item) => {
        if (item.textContent === "Prev") {
          item.classList.remove("disabled");
        }
      });
    }
  }
};

export const rootTitle = document.getElementById("root-title");
