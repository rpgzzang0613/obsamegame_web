import { useState, useRef } from "react";
import bgm from "../assets/sounds/bgm.mp3";
import "./SoundControl.css";

const SoundControl = () => {
  const [isBgmOn, setIsBgmOn] = useState(false);
  const audioRef = useRef(null);

  // BGM 토글 시 재생/정지
  const toggleBgm = () => {
    setIsBgmOn((prev) => {
      if (!prev) {
        // 음악이 켜질 때
        audioRef.current.play(); // MP3 파일 재생
      } else {
        // 음악이 꺼질 때
        audioRef.current.pause(); // MP3 파일 일시 정지
        audioRef.current.currentTime = 0; // 음악을 처음으로 되돌리기
      }
      return !prev;
    });
  };

  return (
    <div className="control-bar">
      <label className="bgm-toggle">
        <input
          type="checkbox"
          checked={isBgmOn}
          onChange={toggleBgm}
        />
        BGM
      </label>

      {/* MP3 파일을 audio 태그로 재생 */}
      <audio ref={audioRef} loop>
        <source src={bgm} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SoundControl;
