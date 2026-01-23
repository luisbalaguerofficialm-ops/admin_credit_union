module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Admin dashboard connected");

    socket.on("disconnect", () => {
      console.log("Admin disconnected");
    });
  });
};
