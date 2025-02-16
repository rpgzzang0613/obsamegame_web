import "./GameHeader.css";
import header_icon from "../assets/images/header_icon.ico";
import min_icon from "../assets/images/min_icon.png";
import max_icon from "../assets/images/max_icon.png";
import close_icon from "../assets/images/close_icon.png";

export default function GameHeader() {
  return (
    <div className="header">
      <div className="header-left">
        <img src={header_icon} alt="header_icon" />
        <span>OB SameGame</span>
      </div>
      <div className="header-right">
        <div>
          <img src={min_icon} />
        </div>
        <div>
          <img src={max_icon} className="px-16" />
        </div>
        <div>
          <img src={close_icon} />
        </div>
      </div>
    </div>
  );
}
