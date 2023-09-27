import "./bootstrap-yeti.min.css";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import useInterval from "./useInterval";
import C from "./constants";
import bathroomYes from "./bathroom-yes.png";
import bathroomNo from "./bathroom-no.jpg";
import tp from "./tp.png";

const isMonday = new Date().getDay() === 1;
const bells = isMonday ? C.schedule.mod : C.schedule.normal;

function App() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    elapsed: 0,
  });
  const [isNoPottyTime, setIsNoPottyTime] = useState(false);
  const [countdown, setCountdown] = useState(-1);

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
    const _time = new Date();
    const hours = _time.getHours();
    const minutes = _time.getMinutes();
    const seconds = _time.getSeconds();
    setTime({
      hours: hours + "",
      minutes: minutes < 10 ? "0" + minutes : minutes + "",
      seconds: seconds < 10 ? "0" + seconds : seconds + "",
      elapsed: computeElapsed({ hours, minutes, seconds }),
    });
  };

  useInterval(updateTime, 1000);

  const margins = useMemo(() => {
    return bells.map((period) => {
      const start = computeElapsed(breakUpTime(period.start));
      const end = computeElapsed(breakUpTime(period.end));
      return { start: start + margin, end: end - margin };
    });
  }, [margin]);

  useEffect(() => {
    setIsNoPottyTime(
      margins &&
        margins.some(
          ({ start, end }) => time.elapsed >= start && time.elapsed <= end,
        ),
    );
  }, [time.elapsed, margins]);

  useEffect(() => {
    if (!margins) return;
    const period = margins.find(
      ({ start, end }) => start < time.elapsed && time.elapsed < end,
    );
    if (period) {
      const timeLeft = period.end - time.elapsed;
      if (timeLeft < 0) return setCountdown(-1);
      const m = Math.trunc(timeLeft / 60);
      const s = timeLeft % 60;
      setCountdown(`${m}:${s < 10 ? "0" + s : s}`);
    } else {
      setCountdown(-1);
    }
  }, [margins, time.elapsed]);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-8 offset-2 text-center">
          <div className="card">
            <div className={`card-header ${isNoPottyTime ? "no-potty" : ""}`}>
              <h1 className="text-bold">{`The time is ${
                time.hours > 12
                  ? time.hours - 12
                  : time.hours === 0
                  ? 12
                  : time.hours
              }:${time.minutes}:${time.seconds} ${
                time.hours >= 12 ? "PM" : "AM"
              }`}</h1>
              <h4>
                {isNoPottyTime
                  ? `${
                      countdown < 0
                        ? "Updating..."
                        : "The bathroom pass will be available in " + countdown
                    }`
                  : "The bathroom pass is available"}
              </h4>
            </div>
            <div className="card-body">
              {isNoPottyTime ? (
                <img className="sign" src={bathroomNo} alt="No bathroom" />
              ) : (
                <img className="sign" src={bathroomYes} alt="Bathroom OK" />
              )}
            </div>
            <div className="card-footer">
              <h6 className="footer">
                When-Can-I-Go is a public service provided by Mr. Jaffe
                <img src={tp} className="tp" alt="TP roll" />
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
