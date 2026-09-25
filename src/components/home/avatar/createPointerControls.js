const DRAG_SENSITIVITY = 0.01;
const SPIN_FRICTION = 0.92;
// while held without moving, the fling fades so releasing doesn't spin from an old move
const HOLD_FRICTION = 0.6;
const SPIN_STOP_VELOCITY = 0.002;
const RETURN_EASING = 0.04;
const FULL_TURN = Math.PI * 2;
// a press that moves less than this, in css px, is a click rather than a drag
const TAP_DISTANCE = 5;

export const createCursorTracking = () => {
  const cursor = { x: null, y: null };
  const onPointerMove = (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
  };
  window.addEventListener('pointermove', onPointerMove);
  return { cursor, dispose: () => window.removeEventListener('pointermove', onPointerMove) };
};

const listenToDrag = (canvas, state, onTap) => {
  const onPointerDown = (event) => {
    state.isDragging = true;
    state.lastX = event.clientX;
    state.pressX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!state.isDragging) return;
    state.velocity = (event.clientX - state.lastX) * DRAG_SENSITIVITY;
    state.angle += state.velocity;
    state.lastX = event.clientX;
  };
  const onPointerUp = (event) => {
    if (state.isDragging && Math.abs(event.clientX - state.pressX) < TAP_DISTANCE) onTap();
    state.isDragging = false;
  };
  const onPointerCancel = () => { state.isDragging = false; };

  const listeners = { pointerdown: onPointerDown, pointermove: onPointerMove, pointerup: onPointerUp, pointercancel: onPointerCancel };
  Object.entries(listeners).forEach(([type, listener]) => canvas.addEventListener(type, listener));
  return () => Object.entries(listeners).forEach(([type, listener]) => canvas.removeEventListener(type, listener));
};

// spins with momentum, then settles back to facing front on the nearest full turn
export const createDragRotation = (canvas, { onTap = () => {} } = {}) => {
  const state = { angle: 0, velocity: 0, isDragging: false, lastX: 0, pressX: 0 };
  const dispose = listenToDrag(canvas, state, onTap);

  const update = () => {
    if (state.isDragging) {
      state.velocity *= HOLD_FRICTION;
      return state.angle;
    }

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
