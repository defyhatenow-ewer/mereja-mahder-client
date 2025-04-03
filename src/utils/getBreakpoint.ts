const getBreakpoint = () => {
  if (window.innerWidth < 768) {
    return "sm";
  }
  if (window.innerWidth < 1536) {
    return "md";
  }
  return "xl";
};

export default getBreakpoint;
