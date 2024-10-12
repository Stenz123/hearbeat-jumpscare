import { produce } from "immer";
import { BASE_URL, store } from ".."

export async function fetchHeartRate() {
  const data = await fetch('http://localhost:8000/heartrate')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        let next = produce(store.getValue(), (draft) => {
          draft.heartRate = data.heart_rate;
        });
        store.next(next);

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });




}