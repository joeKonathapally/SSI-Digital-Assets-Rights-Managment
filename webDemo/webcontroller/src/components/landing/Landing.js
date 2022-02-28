const Landing = () => {
  return (
    <div>
      <h1>DECADE project 4 SSI-Platform demonstration</h1>
      <p>
        Welcome to the landing page for our demonstration; the full
        documentation for getting up and running with the demo is located within
        the{" "}
        <a href="https://github.com/ashleyfraser19/SSI-platform-development">
          Official SSI Platform Development repository
        </a>
        .
      </p>
      <h3>Links to all of the actors web-controllers:</h3>
      <ul>
        <li>
          Ruth's Controller:
          <a href={process.env.REACT_APP_MASTER_URL+"controller/ruth"} target="_blank">
            http://localhost:3000/ruth
          </a>
        </li>
        <li>
          Cavendish's Controller:
          <a href={process.env.REACT_APP_MASTER_URL+"controller/cavendish"} target="_blank">
            http://localhost:3000/cavendish
          </a>
        </li>
        <li>
          Thoday's Controller:
          <a href={process.env.REACT_APP_MASTER_URL+"controller/thoday"} target="_blank">
            http://localhost:3000/thoday
          </a>
        </li>
        <li>
          Franklin's Controller:
          <a href={process.env.REACT_APP_MASTER_URL+"controller/franklin"} target="_blank">
            http://localhost:3000/franklin
          </a>
        </li>
        <li>
          Thoday's Public Portal:
          <a href={process.env.REACT_APP_MASTER_URL+"public/thoday"} target="_blank">
            http://localhost:3000/public/thoday
          </a>
        </li>
        <li>
          Cavendish's Public Portal:
          <a href={process.env.REACT_APP_MASTER_URL+"public/cavendish"} target="_blank">
            http://localhost:3000/public/cavendish
          </a>
        </li>
        <li>
          Franklin's Art Competition:
          <a href={process.env.REACT_APP_MASTER_URL+"competition"} target="_blank">
            http://localhost:3000/competition
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Landing;
