import { combineReducers } from "redux";
import authSlice from "../slice/authSlice";
import profileSlice from "../slice/ProfileSlice";

const Rootreducer = combineReducers({
    auth: authSlice.reducer,
    profile:profileSlice.reducer,
})
export default Rootreducer;