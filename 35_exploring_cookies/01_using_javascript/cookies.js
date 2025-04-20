// This sets a cookie with the name username and value JohnDoe.
document.cookie =
  "username=JohnDoe; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; SameSite=None";
// console.log(document.cookie); // Output: username=JohnDoe; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; SameSite=None

// This sets a cookie with the name sessionId and value 1234567890.
document.cookie =
  "sessionId=1234567890; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; SameSite=None";

// This retrieves the value of the cookie named username.
const username = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  .split("=")[1];
// console.log(username); // Output: JohnDoe

// This deletes the cookie named username.
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // This will not work in a real browser environment, as the cookie is already deleted.
document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // This will also delete the sessionId cookie.
console.log(document.cookie); // Output: (empty string)

// This sets a cookie with the name username and value JohnDoe, and sets the expiration date to 1 day from now.
// const d = new Date();
// d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
// const expires = "expires=" + d.toUTCString();
// document.cookie = "username=JohnDoe; " + expires + "; path=/";
// console.log(document.cookie); // Output: username=JohnDoe; expires=...; path=/

// Set dark mode preference
document.cookie = "theme=dark; max-age=" + 60 * 60 * 24 * 30 + "; path=/"; // 30 days

// Read theme cookie
// let allCookies = document.cookie;
// console.log(allCookies); // theme=light

// delete theme cookie
// document.cookie = "theme=; expires=Thu, max-age=0; path=/; SameSite=None"; // This will not work in a real browser environment, as the cookie is already deleted.

// let theme = allCookies.split(";").find(row => row.startsWith("theme=")).split("=")[1]; // light
// console.log(theme); // light

// document.body.style.backgroundColor = theme === "dark" ? "#333" : "#fff"; // Set background color based on theme

// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// function getCookie(name) {
//   let nameEQ = name + "=";
//   let ca = document.cookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == " ") c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// setCookie("lang", "English", 7);
// console.log(getCookie("lang")); // English
// setCookie("lang", "Spanish", 7);
// console.log(getCookie("lang")); // Spanish

// ✅ Set a cookie
function setCookie(name, value, options = {}) {
  let cookieStr = `${name}=${value || ""}`;

  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieStr += `; expires=${date.toUTCString()}`;
  }

  if (options.maxAge) {
    cookieStr += `; max-age=${options.maxAge}`;
  }

  cookieStr += `; path=${options.path || "/"}`;

  document.cookie = cookieStr;
}

// ✅ Get a cookie
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith(name + "=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}

// ✅ Delete a cookie
function deleteCookie(name, path = "/") {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  document.cookie = `${name}=; max-age=0; path=${path};`;
}

// Set cookie for 2 days
setCookie("username", "JohnDoe", 2);
// setCookie("theme", "dark", 2); // Set theme cookie for 2 days
setCookie("lang", "English", 2); // Set language cookie for 2 days

// Get cookie
console.log(getCookie("username")); // "JohnDoe"
// console.log(getCookie("theme")); // "dark"
console.log(getCookie("lang")); // "English" // Updated to reflect the correct value

// Delete cookie
deleteCookie("username"); // deleteCookie("username, theme, lang");
deleteCookie("theme");
deleteCookie("lang");

// Check if it's deleted
console.log(getCookie("username")); // null
console.log(getCookie("theme")); // null
console.log(getCookie("lang")); // null
