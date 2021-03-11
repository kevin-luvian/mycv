const initialState = {
    token: "",
    expires: 0
};

export const actions = {
    clear: { type: "clear" },
    /**
     * @param {string} token 
     * @param {number} expires 
     */
    update: (token, expires) => {
        return {
            type: "update",
            payload: {
                token: token,
                expires: expires
            }
        }
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.clear.type:
            return initialState;
        case actions.update().type:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default reducer;