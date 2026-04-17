import { createServer } from "./server/index";

const port = process.env.PORT || 5000;
const app = createServer();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
