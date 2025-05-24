import styles from './TitleBar.module.css';
import title_icon from '../../assets/images/title_icon.ico';
import min_icon from '../../assets/images/min_icon.png';
import max_icon from '../../assets/images/max_icon.png';
import close_icon from '../../assets/images/close_icon.png';

const TitleBar = ({isStarted, setIsStarted, setIsBgmOn, bgmRef, handleRestart}) => {
  return (
    <div className={styles.titleBar}>
      <div className={styles.left}>
        <img src={title_icon} alt="title_icon" />
        <span>OB SameGame</span>
      </div>
      <div className={styles.right}>
        <div>
          <img src={min_icon} />
        </div>
        <div>
          <img src={max_icon} className={styles.px16} />
        </div>
        <div
          className={styles.close}
          onClick={() => {
            if (!isStarted) {
              return;
            }

            setIsStarted(false);
            setIsBgmOn(false);
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            handleRestart();
          }}
        >
          <img src={close_icon} />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
