import { useState, useEffect } from "react";

const useVideoPlayer = (videoElement, wrapperElement) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
    fullscreen: false,
  });

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    playerState.isPlaying
      ? videoElement.current.play()
      : videoElement.current.pause();
  }, [playerState.isPlaying, videoElement]);

  const handleOnTimeUpdate = () => {
    const progress =
      (videoElement.current.currentTime / videoElement.current.duration) * 100;
    setPlayerState({
      ...playerState,
      progress,
    });
  };

  const handleVideoProgress = (event) => {
    const manualChange = Number(event.target.value);
    videoElement.current.currentTime =
      (videoElement.current.duration / 100) * manualChange;
    setPlayerState({ ...playerState, progress: manualChange });
  };

  const handleVideoSpeed = (event) => {
    const speed = Number(event.target.value);
    videoElement.current.playbackRate = speed;
    setPlayerState({ ...playerState, speed });
  };

  const toggleMute = () => {
    setPlayerState({ ...playerState, isMuted: !playerState.isMuted });
  };

  useEffect(() => {
    playerState.isMuted
      ? (videoElement.current.muted = true)
      : (videoElement.current.muted = false);
  }, [playerState.isMuted, videoElement]);

  const toggleFullscreen = (show) => {
    if (show) {
      if (wrapperElement.current.requestFullscreen) {
        wrapperElement.current.requestFullscreen();
      } else if (wrapperElement.current.mozRequestFullScreen) {
        wrapperElement.current.mozRequestFullScreen();
      } else if (wrapperElement.current.webkitRequestFullscreen) {
        wrapperElement.current.webkitRequestFullscreen();
      } else if (wrapperElement.current.msRequestFullscreen) {
        wrapperElement.current.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }

    setPlayerState({ ...playerState, fullscreen: show });
  };

  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullscreen,
  };
};

export default useVideoPlayer;
