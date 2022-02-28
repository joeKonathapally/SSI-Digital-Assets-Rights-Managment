import { Link } from "react-router-dom";

const Error404 = () => (
  <div>
    <h1 style={{ color: "red" }}>ERROR 404: Page not found!!</h1>
    <p>
      Please navigate back to the <Link to="/">landing page</Link> for a list of
      all valid web-pages.
    </p>
  </div>
);

export default Error404;
