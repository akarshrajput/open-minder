export const hideAlert = () => {
  const el = document.querySelector(".alert-window");
  if (el) el.parentElement.removeChild(el);
};

// type is "success" or "error"
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert-window alert-window-has-${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};
