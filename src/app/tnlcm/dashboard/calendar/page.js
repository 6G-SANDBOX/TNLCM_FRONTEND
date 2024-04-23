"use client"

import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useTrialNetworks from "@/hooks/useTrialNetworks";
import styles from "./Calendar.module.css";

export default function CalendarPage() {

    const [renderedOnce, setRenderedOnce] = useState(false);

    const {
        trialNetworks,
        loading,
        handleTrialNetworks
    } = useTrialNetworks();

    useEffect(() => {
        if (!renderedOnce) {
            setRenderedOnce(true);
            handleTrialNetworks();
        }
    }, []);
    
    const localizer = dayjsLocalizer(dayjs);
    const events = trialNetworks.map(trialNetwork => ({
        start: dayjs(trialNetwork.tn_date_created_utc).toDate(),
        end: dayjs(trialNetwork.tn_date_created_utc).toDate(),
        title: trialNetwork.tn_id
    }));

    return (
        <div className={styles["calendar-container"]}>
            <Calendar
                localizer={localizer}
                events={events}
            />
        </div>
    )
}