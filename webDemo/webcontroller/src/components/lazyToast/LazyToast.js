const LazyToast = ({ from, message, clearMessage }) => (
  <div
    style={{
      textAlign: "center",
      width: "90%",
      background: "#ADD8E6",
      marginLeft: "5%",
      border: "1px solid black",
    }}
    onClick={() => clearMessage()}
  >
    <div style={{ width: "100%", background: "grey", color: "white" }}>
      Incoming Message (click to dismiss)
    </div>
    <p style={{ color: "white", fontWeight: "bold", marginBottom: "0" }}>
      From: {from}
    </p>
    <p>{message}</p>
  </div>
);

export default LazyToast;
