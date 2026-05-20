import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  const formValues = Object.fromEntries(formData);
  const imageFile = formData.get("image");
  // picking out the uploaded image file from the object.
  const filePath = `guestbook/${Date.now()}-${imageFile.name}`;
  // creating a unique filename for each upload, using the current date and time + the original name for the file at the time of upload.
  const { data, error } = await supabase.storage
    .from("guestbookimagebucket")
    .upload(filePath, imageFile);
  const errorMessage = document.getElementById("customErrorMessage");
  if (error) {
    console.error("Upload failed, please try again.", error);
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
    return;
  }

  const imageUrl = supabase.storage
    .from("guestbookimagebucket")
    .getPublicUrl(data.path).data.publicUrl;
  // uploading image data to Supabase storage bucket.
  formValues.imageUrl = imageUrl;
  console.log(formValues);

  //  local host address needs to be changed when deploying project.
  const response = await fetch("http://localhost:8080/newEntry", {
    // WAIT for new entry to be saved to database.
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  const successMessage = document.getElementById("customSuccessMessage");
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
  getGuestbookEntries();
}

async function getGuestbookEntries() {
  const storedGuestbookEntries = await fetch(
    "http://localhost:8080/guestBookEntries"
  );
  console.log(storedGuestbookEntries);
  const guestbookEntriesData = await storedGuestbookEntries.json();
  console.log(guestbookEntriesData);
  allGuestbookEntriesContainer.textContent = "";
  // When calling the function, clear existing entries in the DOM.
  guestbookEntriesData.forEach(function (item) {
    // forEach item in the guestbookEntriesData array, perform a function and assign each entry in the database as 'item'.
    console.log(item);
    // log 'item' in the console
    const itemDiv = document.createElement("div");
    // the function will create a new DIV element for each entry in 'item'.
    itemDiv.classList.add("entry");
    // the function will add a CSS class.
    const itemImg = document.createElement("img");
    // the function will create an image element.
    itemImg.classList.add("entryImage");
    // the funtion will add a CSS class.
    itemImg.src = item.photo_url;
    //the source of the image element will come from the photo_url.
    const cleanDate = new Date(item.date).toLocaleDateString();
    // create a new object with a clean date dsiplay. ^ Removes time from date display DD/MM/YYY.
    itemDiv.textContent =
      item.name +
      ", " +
      "from" +
      " " +
      item.country +
      "says, " +
      item.your_message +
      " " +
      cleanDate;
    // put each item into the created div.
    itemDiv.appendChild(itemImg);
    // append the created image element to the item div.
    allGuestbookEntriesContainer.appendChild(itemDiv);
    // appends the created div element onto the parent element.
  });
}
getGuestbookEntries();
