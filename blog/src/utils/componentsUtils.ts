export const toggleComponent = (component: any, display: string = "flex") => {
    console.log(component)
    if (component.current.style.display !== display) {
        component.current.style.display = display;
    } else {
        component.current.style.display = "none";
    }
};