/* eslint-disable */
import styles from "./resizeHandleVertical.module.css";

export default function ResizeHandleVertical() {
  return (
    <div className={styles["resize-handle-vertical"]}>
      {[1, 2, 3].map((e) => (
        <div className={styles["triple-dots"]} />
      ))}
    </div>
  );
}
