import axios from "axios";

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

export const checkLoginSession = async (token) => {
  try {
    let res = await axios.get(`/sam/v1/user-registration/logout`, {
      headers: { Authorization: token },
    });
    if (res.data === "Session expired or invalid user") {
      localStorage.removeItem("data");
      localStorage.removeItem("remainingTime");
      return "Invalid";
    } else {
      return "Valid";
    }
  } catch (error) {}
};
