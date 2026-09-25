import { onScopeDispose, watch } from 'vue';

// closes a popover on a click outside it or on escape
export const useDismiss = (root, isOpen) => {
  const onPointerDown = (event) => {
    if (!root.value?.contains(event.target)) isOpen.value = false;
  };
  const onKeyDown = (event) => {
    if (event.key === 'Escape') isOpen.value = false;
  };
  const stopListening = () => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKeyDown);
  };

  watch(isOpen, (isNowOpen) => {
    stopListening();
    if (!isNowOpen) return;
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
  });
  onScopeDispose(stopListening);
};
