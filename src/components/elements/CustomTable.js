import React from "react";
import styles from "@/components/modules/CustomTable.module.css";

export default function CustomTable({ columns, data }) {
    return (
        <div className={styles["table-container"]}>
            <table className={styles["custom-table"]}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{row[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};