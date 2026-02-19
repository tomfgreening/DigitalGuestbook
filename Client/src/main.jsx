//Target the form from the DOM
const guestbookForm = document.getElementById("guestbookForm");

//Target the guestbook entries container in the DOM
const allGuestbookEntriesContainer = document.getElementById(
  "allGuestbookEntriesContainer"
);

//event listener
guestbookForm.addEventListener("submit", handleSubmit);

//event handler
async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  console.log(formData);
  const imageFile = formData.get("image");
  // picking out the uploaded image file from the object.
  const filePath = `guestbook/${Date.now()}-${imageFile.name}`;
  // creating a unique filename for each upload, using the current date and time + the original name fo the file at the time of upload.
  await supabase.storage.from("guestbookimagebucket").upload(filePath, imageFile);
  // uploading image data to Supabase storage bucket.
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
  guestbookEntriesData.forEach(function (item) {
    console.log(item);
    // forEach item in the guestbookEntriesData array, perform a function and assign each entry in the database as 'item'.
    const itemDiv = document.createElement("div");
    // the function will create a new DIV element for each item.
    itemDiv.textContent =
      item.name +
      ", " +
      "from" +
      " " +
      item.country +
      "says, " +
      item.your_message;
    // put each item into the created div as text.
    allGuestbookEntriesContainer.appendChild(itemDiv);
    // appends the created div element onto the parent element.
  });
}
getGuestbookEntries();
