import "../styles/loader.css";

function Loader({ size = "md", text = "Загрузка..." }) {
  return (
    <div className={`loader-wrapper loader-${size}`}>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;