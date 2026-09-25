const DRAG_SENSITIVITY = 0.01;
const SPIN_FRICTION = 0.92;
const SPIN_STOP_VELOCITY = 0.002;
const RETURN_EASING = 0.04;
const FULL_TURN = Math.PI * 2;

export const createCursorTracking = () => {
  const cursor = { x: null, y: null };
  const onPointerMove = (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
  };
  window.addEventListener('pointermove', onPointerMove);
  return { cursor, dispose: () => window.removeEventListener('pointermove', onPointerMove) };
};

const listenToDrag = (canvas, state) => {
  const onPointerDown = (event) => {
    state.isDragging = true;
    state.lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!state.isDragging) return;
    state.velocity = (event.clientX - state.lastX) * DRAG_SENSITIVITY;
    state.angle += state.velocity;
    state.lastX = event.clientX;
  };
  const onPointerUp = () => { state.isDragging = false; };

  const listeners = { pointerdown: onPointerDown, pointermove: onPointerMove, pointerup: onPointerUp, pointercancel: onPointerUp };
  Object.entries(listeners).forEach(([type, listener]) => canvas.addEventListener(type, listener));
  return () => Object.entries(listeners).forEach(([type, listener]) => canvas.removeEventListener(type, listener));
};

// spins with momentum, then settles back to facing front on the nearest full turn
export const createDragRotation = (canvas) => {
  const state = { angle: 0, velocity: 0, isDragging: false, lastX: 0 };
  const dispose = listenToDrag(canvas, state);

  const update = () => {
    if (state.isDragging) return state.angle;

    state.angle += state.velocity;
    state.velocity *= SPIN_FRICTION;
    if (Math.abs(state.velocity) < SPIN_STOP_VELOCITY) {
      const front = Math.round(state.angle / FULL_TURN) * FULL_TURN;
      state.angle += (front - state.angle) * RETURN_EASING;
    }
    return state.angle;
  };

  return { update, dispose };
};
