export function getTimeString(date: Date) {
    const timeString = date.toTimeString();
    const segments = timeString.split(":")
    return `${segments[0]}:${segments[1]}`;
}

export function constructDateFromUTCTime(time: string) {
    const date = new Date();
    const timeSegs = time.split(":")
    if (timeSegs.length > 1) {
        date.setUTCHours(Number(timeSegs[0]), Number(timeSegs[1]), 0, 0)
    }
    return date
}

export function constructDateFromLocalTime(time: string) {
    const date = new Date();
    const timeSegs = time.split(":")
    if (timeSegs.length > 1) {
        date.setHours(Number(timeSegs[0]), Number(timeSegs[1]), 0, 0)
    }
    return date
}
