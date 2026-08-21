import dns from "dns";
// Use reliable public DNS servers to avoid Node.js SRV resolution errors when connecting to MongoDB Atlas.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { default: dotenv } = await import("dotenv");
dotenv.config();

// Import the configured Express app so we can start the HTTP server after the database connection is established.
const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/db.js");

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`App is listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });