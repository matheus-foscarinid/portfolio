import { Vector3 } from 'three';

export const getScreenPosition = (object, camera, rect) => {
  const point = object.getWorldPosition(new Vector3()).project(camera);
  return {
    x: rect.left + ((point.x + 1) / 2) * rect.width,
    y: rect.top + ((1 - point.y) / 2) * rect.height,
  };
};

// reading layout every frame is costly, so the rect only refreshes on scroll and resize
export const trackCanvasRect = (canvas) => {
  let rect = canvas.getBoundingClientRect();
  const refresh = () => { rect = canvas.getBoundingClientRect(); };
  window.addEventListener('scroll', refresh, { passive: true });
  return { getRect: () => rect, refresh, dispose: () => window.removeEventListener('scroll', refresh) };
};
