const app = require("./app");

const PORT = 3000 || process.env.PORT;
// run the server on port 3000
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
