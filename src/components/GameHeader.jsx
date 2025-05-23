import styles from './GameHeader.module.css';
import header_icon from '../assets/images/header_icon.ico';
import min_icon from '../assets/images/min_icon.png';
import max_icon from '../assets/images/max_icon.png';
import close_icon from '../assets/images/close_icon.png';

const GameHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={header_icon} alt="header_icon" />
        <span>OB SameGame</span>
      </div>
      <div className={styles.headerRight}>
        <div>
          <img src={min_icon} />
        </div>
        <div>
          <img src={max_icon} className={styles.px16} />
        </div>
        <div>
          <img src={close_icon} />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
