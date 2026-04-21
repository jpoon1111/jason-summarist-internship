import { createSlice } from "@reduxjs/toolkit";

//define Type declaration which is an object
interface SidebarState {
    isOpen: boolean;
}

// create an Object literal that reference blueprint from SidebarState
const initialState: SidebarState = {
    isOpen: false,
};


const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState, 
    reducers: {
        openSidebar: (state) => {
            state.isOpen = true;
        },
        closeSidebar: (state) => {
            state.isOpen = false;
        },
        toggleSidebar: (state)=> {
            state.isOpen = !state.isOpen;
        },
    },

});

export const {openSidebar, closeSidebar, toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;