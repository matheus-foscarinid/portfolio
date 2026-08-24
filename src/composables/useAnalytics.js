// umami loads async from index.html, the guard keeps clicks working before it loads
export const trackEvent = (name, data) => {
  window.umami?.track(name, data);
};
