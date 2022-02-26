import { useRef } from "react";
import useVideoPlayer from "../../util/hooks/videoPlayerHook";
import { ButtonIcon } from "../button/ButtonIcon";
import styles from "./styles.module.scss";
import Slider from "@material-ui/core/Slider";
import FullscreenIcon from "@material-ui/icons/FullscreenRounded";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExitRounded";
import { concat } from "../../util/utils";

/**
 * @param {{
 * source: string
 * height: string
 * }} param0
 */
const CustomPlayer = ({ source, height = "20rem" }) => {
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
    <div className={styles.customVideoContainer} style={{ height: height }}>
      <div className={styles["vid-wrapper"]} ref={wrapperElement}>
        <video
          src={source}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
          onEnded={() => togglePlay(false)}
          autoPlay={false}
        />
        <div className={styles.controls}>
          <div className={styles.box}>
            <ButtonIcon className="pl-1 pr-3" onClick={() => togglePlay()}>
              {!playerState.isPlaying ? (
                <i className="fa fa-play" />
              ) : (
                <i className="fa fa-pause" />
              )}
            </ButtonIcon>
            <Slider
              min={0}
              max={100}
              step={1}
              value={playerState.progress}
              className={styles.progress}
              onChange={(_, val) => handleVideoProgress(val)}
            />
            <ButtonIcon className="pl-2" onClick={() => toggleFullscreen()}>
              {!playerState.fullscreen ? (
                <FullscreenIcon />
              ) : (
                <FullscreenExitIcon />
              )}
            </ButtonIcon>
            {/* <input
              className={styles.progress}
              type="range"
              min="0"
              max="100"
              value={playerState.progress}
              onChange={handleVideoProgress}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
