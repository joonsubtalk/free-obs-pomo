import './Clock.scss';
const Clock = ({ counter }) => {
    // given a counter in seconds, portray an hour:minute:seconds ui clock
    const minutes = Math.floor((counter % 3600) / 60);
    const seconds = counter % 60;
    return (
        <div className="clock">
            <div className="clock__container">
                <span className="clock__digit">{minutes.toString().padStart(2, '0')}</span>
                <span className="clock__digit">:</span>
                <span className="clock__digit">{seconds.toString().padStart(2, '0')}</span>
            </div>
        </div>
    );
}
export default Clock;