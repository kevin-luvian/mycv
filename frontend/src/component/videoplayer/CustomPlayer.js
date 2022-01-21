import { useRef } from "react";
import useVideoPlayer from "../../util/hooks/videoPlayerHook";
import styles from "./styles.module.scss";

/**
 * @param {{
 * source: string
 * }} param0
 */
const CustomPlayer = ({ source, maxHeight = "3rem" }) => {
  const videoElement = useRef(null);
  const wrapperElement = useRef(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer(videoElement, wrapperElement);
  return (
    <div className={styles.customVideoContainer}>
      <div
        className={styles["vid-wrapper"]}
        ref={wrapperElement}
        style={{ maxHeight: playerState.fullscreen ? "" : "20rem" }}
      >
        <video
          src={source}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
          autoPlay={false}
        />
        <div className={styles.controls}>
          <div className={styles.actions}>
            <button onClick={togglePlay}>
              {!playerState.isPlaying ? (
                <i className="fa fa-play" />
              ) : (
                <i className="fa fa-pause" />
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={playerState.progress}
            onChange={handleVideoProgress}
          />
          <select
            className={styles.velocity}
            value={playerState.speed}
            onChange={handleVideoSpeed}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button className={styles["mute-btn"]} onClick={toggleMute}>
            {!playerState.isMuted ? (
              <i className="fa fa-volume-up"></i>
            ) : (
              <i className="fa fa-volume-mute"></i>
            )}
          </button>
          <button onClick={() => toggleFullscreen(true)}>
            <i className="fa fa-home" />
          </button>
          <button onClick={() => toggleFullscreen(false)}>
            <i className="fa fa-home fa-spin" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
