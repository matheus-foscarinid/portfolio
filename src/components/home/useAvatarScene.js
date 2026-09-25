import { onMounted, onUnmounted, ref } from 'vue';

// off-screen longer than this, the scene is torn down to free gpu memory and rebuilt on return
const RELEASE_DELAY = 8000;

export const useAvatarScene = ({ container, canvas }) => {
  const isReady = ref(false);
  const hasFailed = ref(false);
  // a released webgl context can't be reused, so each rebuild renders into a fresh canvas
  const canvasKey = ref(0);

  let scene = null;
  let pendingScene = null;
  let releaseTimer = null;
  let isVisible = false;
  let visibilityObserver = null;

  const mountScene = async () => {
    const { createAvatarScene } = await import('./avatar/createAvatarScene');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scene = await createAvatarScene(canvas.value, { isReducedMotion });

    if (!isVisible) {
      releaseScene();
      return;
    }
    scene.start();
    isReady.value = true;
  };

  const ensureScene = () => {
    if (scene || pendingScene) return;
    pendingScene = mountScene()
      .catch(() => { hasFailed.value = true; })
      .finally(() => { pendingScene = null; });
  };

  const releaseScene = () => {
    // a scene still loading releases itself once it finishes, if it's off-screen by then
    if (pendingScene && !scene) return;
    scene?.dispose();
    scene = null;
    isReady.value = false;
    canvasKey.value += 1;
  };

  const onVisibilityChange = ([entry]) => {
    isVisible = entry.isIntersecting;
    clearTimeout(releaseTimer);

    if (isVisible) {
      if (scene) scene.start();
      else ensureScene();
      return;
    }
    scene?.stop();
    releaseTimer = setTimeout(releaseScene, RELEASE_DELAY);
  };

  onMounted(() => {
    visibilityObserver = new IntersectionObserver(onVisibilityChange);
    visibilityObserver.observe(container.value);
  });

  onUnmounted(() => {
    isVisible = false;
    clearTimeout(releaseTimer);
    visibilityObserver?.disconnect();
    scene?.dispose();
  });

  return { isReady, hasFailed, canvasKey };
};
