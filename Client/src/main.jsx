// This file will handle the data from the form

//Target the form from the DOM
const guestbookForm = document.getElementById("guestbookForm");

//Target the guestbook entries container in the DOM
const allGuestbookEntriesContainer = document.getElementById(
  "allGuestbookEntriesContainer"
);

//event listener
guestbookForm.addEventListener("submit", handleSubmit);

//event handler
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  console.log(formData);
  const formValues = Object.fromEntries(formData);
  console.log(formValues);
  alert("Guestbook successfully signed!");

  //  local host address needs to be changed when deploying project
  fetch("http://localhost:8080/newEntry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formValues }),
  });
}

async function getGuestbookEntries() {
  const storedGuestbookEntries = await fetch(
    "http://localhost:8080/guestBookEntries"
  );
  console.log(storedGuestbookEntries);
  const guestbookEntriesData = await storedGuestbookEntries.json();
  console.log(guestbookEntriesData);
  guestbookEntriesData.forEach(function(item) {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = item.name + item.country + item.your_message;
    allGuestbookEntriesContainer.appendChild(itemDiv);
  });
  }
getGuestbookEntries();
