export const toggleComponent = (component: any, display: string = "flex") => {
    console.log(component)
    if (component.current.style.display !== display) {
        component.current.style.display = display;
    } else {
        component.current.style.display = "none";
    }
};

export const setFooterPosition = () => {
    // TODO: 加一层高度判断
    const footer = document.getElementById("footer");
    if (footer) {
        footer.style.position = "fixed";
        footer.style.bottom = "0";
    }
} 