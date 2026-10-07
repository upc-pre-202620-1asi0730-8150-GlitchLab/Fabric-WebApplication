export function parseClockTime(value) {
    const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)?$/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();

    if (meridiem) {
        if (hours < 1 || hours > 12) return null;
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
    } else if (hours > 23) {
        return null;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}