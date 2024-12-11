import "../style/NotFound404.css";

function NotFound() {
  return (
    <div className="not-found">
      <div className="containerNotFound">
        <h2>404</h2>
        <div className="contentNotFound">
          <p>Page not found!</p>
          <span>
            The desired page that you are trying to access is not available or
            not found
          </span>
          <a href="/">Go to Homepage</a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
