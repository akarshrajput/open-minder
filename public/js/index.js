import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateData, updatePassword } from "./updateSettings";
import { writeBlog } from "./writeBlog";

// DOM ELEMENTS
const loginForm = document.querySelector(".sign-in-link");
const signupForm = document.querySelector(".sign-up-link");
const logoutButton = document.querySelector(".account-logout-button");
const updateUserData = document.querySelector(".account-data-simple");
const updateUserPassword = document.querySelector(".account-data-password");
const saveWriteBlogButton = document.querySelector(
  ".save-write-content-button"
);
// VALUES

// DELEGATION

if (saveWriteBlogButton) {
  saveWriteBlogButton.addEventListener("click", async function () {
    const heading = document.querySelector(".write-blog-input-heading").value;
    const description = document.querySelector(
      ".write-blog-input-description"
    ).value;
    const categories = document.querySelector(
      ".write-blog-input-category"
    ).value;
    const tags = document.querySelector(".write-blog-input-tags").value;
    const content = document.querySelector(".write-blog-input-content").value;
    await writeBlog(heading, description, categories, tags, content);
    console.log(heading);
  });
}

if (loginForm) {
  loginForm.addEventListener("click", async function () {
    document.querySelector(".sign-in-link").textContent = "Logging";
    const email = document.querySelector(".login-email").value;
    const password = document.querySelector(".login-password").value;
    await login(email, password);
    document.querySelector(".sign-in-link").textContent = "SIGN IN";
  });
}

if (signupForm) {
  signupForm.addEventListener("click", async function () {
    document.querySelector(".sign-up-link").textContent = "Signing";
    const name = document.querySelector(".signup-name").value;
    const email = document.querySelector(".signup-email").value;
    const password = document.querySelector(".signup-password").value;
    const passwordConfirm = document.querySelector(
      ".signup-passwordConfirm"
    ).value;
    await signup(name, email, password, passwordConfirm);
    document.querySelector(".sign-up-link").textContent = "SIGN UP";
  });
}

if (logoutButton) logoutButton.addEventListener("click", logout);

if (updateUserData) {
  updateUserData.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector(".account-data-submit").textContent = "Updating";
    const form = new FormData();
    form.append("photo", document.getElementById("photo").files[0]);
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("bio", document.getElementById("bio").value);
    await updateData(form);
    document.querySelector(".account-data-submit").textContent = "Save";
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector(".account-password-submit").textContent = "Updating";
    const passwordCurrent = document.querySelector(
      ".account-data-form-current-password"
    ).value;
    const password = document.querySelector(
      ".account-data-form-new-password"
    ).value;
    const passwordConfirm = document.querySelector(
      ".account-data-form-confirm-password"
    ).value;
    await updatePassword(passwordCurrent, password, passwordConfirm);
    document.querySelector(".account-password-submit").textContent = "Save";
  });
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// For Account UI =>
const showSettingBtn = document.querySelector(".account-setting-button");
const showArticlesBtn = document.querySelector(".account-articles-button");
const showPasswordBtn = document.querySelector(".account-password-button");

const settingData = document.querySelector(".account-main-data");
const articlesData = document.querySelector(".account-articles-data");
const passwordData = document.querySelector(".account-password-data");

showSettingBtn.addEventListener("click", function () {
  settingData.style.display = "block";
  articlesData.style.display = "none";
  passwordData.style.display = "none";
});
showArticlesBtn.addEventListener("click", function () {
  settingData.style.display = "none";
  articlesData.style.display = "block";
  passwordData.style.display = "none";
});
showPasswordBtn.addEventListener("click", function () {
  settingData.style.display = "none";
  articlesData.style.display = "none";
  passwordData.style.display = "block";
});
/////////////////////////////////////////////////////////////////
