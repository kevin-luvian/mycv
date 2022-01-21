import { useRef } from "react";
import useVideoPlayer from "../../util/hooks/videoPlayerHook";
import styles from "./styles.module.scss";

/**
 * @param {{
 * source: string
 * }} param0
 */
const CustomPlayer = ({ source, maxHeight = "2rem" }) => {
  const videoElement = useRef(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  } = useVideoPlayer(videoElement);
  return (
    <div
      className={styles.customVideoContainer}
      style={{ maxHeight: maxHeight }}
    >
      <div className={styles.wrapper}>
        <video
          src={source}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
        />
        <div className={styles.controls}>
          <div className={styles.actions}>
            <button onClick={togglePlay}>
              {!playerState.isPlaying ? (
                <i className="bx bx-play"></i>
              ) : (
                <i className="bx bx-pause"></i>
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={playerState.progress}
            onChange={(e) => handleVideoProgress(e)}
          />
          <select
            className="velocity"
            value={playerState.speed}
            onChange={(e) => handleVideoSpeed(e)}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button className="mute-btn" onClick={toggleMute}>
            {!playerState.isMuted ? (
              <i className="bx bxs-volume-full"></i>
            ) : (
              <i className="bx bxs-volume-mute"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
