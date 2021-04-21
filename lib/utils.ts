const openNewTab = (event: React.MouseEvent, link: string) => {
  event.preventDefault();
  window.open(link, "_blank", "noopener");
};

export { openNewTab };
