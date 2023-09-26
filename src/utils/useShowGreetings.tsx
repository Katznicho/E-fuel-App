import React from "react";

export const useShowGreeting = () => {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
        return "Good Morning";
    } else if (curHr < 18) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}
