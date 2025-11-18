// This file will handle the data from the form

//Select the form from the DOM
const guestbookForm = document.getElementById("guestbookForm");

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
}