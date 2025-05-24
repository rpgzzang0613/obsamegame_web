import styles from './SoundToggle.module.css';

const SoundToggle = ({isBgmOn, setIsBgmOn, bgmRef}) => {
  // BGM 토글 시 재생/정지
  const toggleBgm = () => {
    setIsBgmOn(prev => {
      if (!prev) {
        // 음악이 켜질 때
        bgmRef.current.play();
      } else {
        // 음악이 꺼질 때
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
      return !prev;
    });
  };

  return (
    <div className={styles.controlBar}>
      <label className={styles.bgmToggle}>
        <input type="checkbox" checked={isBgmOn} onChange={toggleBgm} />
        BGM
      </label>
    </div>
  );
};

export default SoundToggle;
