import axios from "axios";
import { useEffect, useState } from "react";


function Modal({ children, onclose }) {
  return (
    <div>
      <div>
        {children}
        <button onClick={onclose}>閉じる</button>
      </div>
    </div>
  );
}

export default function Schedule()
{
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectdDate, setSelectedDate] = useState(null);

    const [type, setType] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
      axios.get("/api/schedules")
      .then((res) => {
        const events = res.date.map((s) => ({
          
        }));
      })
    })

}
