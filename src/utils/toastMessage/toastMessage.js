export function showMessage(message, type = "success") {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: type === "success" ? "light-blue" : "orange",
        fontWeight: "bold"
      },
      onClick: function () {}
    }).showToast();
  }
  