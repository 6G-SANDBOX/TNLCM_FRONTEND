"use client"

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.css";

export default function CalendarPage() {
    const localizer = dayjsLocalizer(dayjs);

    return (
        <div className={styles["calendar-container"]}>
            <Calendar
                localizer={localizer}
            />
        </div>
    )
}