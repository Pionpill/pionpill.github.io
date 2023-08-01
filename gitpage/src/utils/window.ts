export const copyCurrentUrl = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
};

export const scrollToAnchor = (anchor: string) => {
  const element: HTMLElement | null = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: "instant", block: "start" });
  }
};