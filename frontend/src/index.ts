import "./components/app-component";
import {fetchHeartRate} from "./features/heartrate/heartrate-service";

setInterval(() => {
    fetchHeartRate()
}, 1000);