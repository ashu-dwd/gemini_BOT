$(document).ready(function () {
  const chatDisplay = $("#chatDisplay");
  const chatInput = $("#chatInput");
  const sendButton = $("#sendButton");

  function appendMessage(message, isUser) {
    const messageDiv = $("<div>").addClass(
      isUser ? "flex justify-end mb-4" : "flex justify-start mb-4"
    );
    const messageContent = $("<div>")
      .addClass(
        isUser
          ? "bg-blue-500 text-white max-w-lg rounded-xl px-4 py-2.5 text-base shadow-md"
          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white max-w-lg rounded-xl px-4 py-2.5 text-base shadow-md"
      )
      .text(message);

    messageDiv.append(messageContent);
    chatDisplay.append(messageDiv);
    chatDisplay.scrollTop(chatDisplay[0].scrollHeight);
  }

  function sendMessage(e) {
    e.preventDefault();
    const message = chatInput.val().trim();

    if (!message) return;

    // Append user message
    appendMessage(message, true);
    chatInput.val("");

    // Send to server
    $.ajax({
      url: "/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ chat: message }),
      success: function (response) {
        appendMessage(response.response, false);
      },
      error: function (xhr, status, error) {
        appendMessage(
          "Sorry, there was an error processing your request.",
          false
        );
        console.error("Error:", error);
      },
    });
  }

  // Event listeners
  $("form").on("submit", sendMessage);
  sendButton.on("click", sendMessage);
});
