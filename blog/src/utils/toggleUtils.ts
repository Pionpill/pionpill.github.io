export const togglePopup = (popupWindow: any, display: string = "flex") => {
    console.log(popupWindow)
    if (popupWindow.current.style.display !== display) {
        popupWindow.current.style.display = display;
    } else {
        popupWindow.current.style.display = "none";
    }
};