import '../styles/Toggle.css';

const Toggle = ({ covered, toggleCovered }) => {
  return (
    <>
      <div id="switch-container"
      onClick={toggleCovered}>
        <div id="pill"></div>
        <img id="peach" src="./peach.png" />
        <div id="circle"></div>
      </div>
      {JSON.stringify(covered)}
    </>
  );
};

export default Toggle;
