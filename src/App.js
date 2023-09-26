import "./bootstrap-yeti.min.css";
import "./App.css";
import { useEffect, useState } from "react";
import useInterval from "./useInterval";
import C from "./constants";
import bathroomYes from "./bathroom-yes.png";
import bathroomNo from "./bathroom-no.jpg";
import tp from "./tp.png";

function App() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [elapsed, setElapsed] = useState(0);
  const [isMonday] = useState(new Date().getDay() === 1);
  const [margins, setMargins] = useState(null);
  const [isNoPottyTime, setIsNoPottyTime] = useState(false);

  const bells = isMonday ? C.schedule.mod : C.schedule.normal;
  const margin = C.margin;

  const breakUpTime = (time) => {
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(3, 5), 10);
    const seconds = parseInt(time.substring(6, 8), 10);
    return { hours, minutes, seconds };
  };
  const computeElapsed = ({ hours, minutes, seconds }) =>
    hours * 60 * 60 + minutes * 60 + seconds;

  const updateTime = () => {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    setHours(hours + "");
    setMinutes(minutes < 10 ? "0" + minutes : minutes + "");
    setSeconds(seconds < 10 ? "0" + seconds : seconds + "");
    setElapsed(computeElapsed({ hours, minutes, seconds }));
  };

  useInterval(updateTime, 1000);

  useEffect(() => {
    const margins = bells.map((period) => {
      const start = computeElapsed(breakUpTime(period.start));
      const end = computeElapsed(breakUpTime(period.end));
      return { start: start + margin, end: end - margin };
    });
    setMargins(margins);
  }, []);

  useEffect(() => {
    setIsNoPottyTime(
      margins &&
        margins.some(({ start, end }) => elapsed >= start && elapsed <= end),
    );
  }, [elapsed]);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-8 offset-2 text-center">
          <div className="card">
            <div className={`card-header ${isNoPottyTime ? "no-potty" : ""}`}>
              <h1 className="text-bold">{`The time is ${
                hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
              }:${minutes}:${seconds} ${hours >= 12 ? "PM" : "AM"}`}</h1>
              <h4>
                {isNoPottyTime
                  ? "The bathroom pass is not available"
                  : "The bathroom pass is available"}
              </h4>
            </div>
            <div className="card-body">
              {isNoPottyTime ? (
                <img className="sign" src={bathroomNo} />
              ) : (
                <img className="sign" src={bathroomYes} />
              )}
            </div>
            <div className="card-footer">
              <h6 className="footer">
                When-Can-I-Go is a public service provided by Mr. Jaffe
                <img src={tp} className="tp" />
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
