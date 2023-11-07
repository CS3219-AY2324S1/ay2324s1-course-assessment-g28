/* eslint-disable */
import styles from "./resizeHandleHorizonal.module.css";

export default function ResizeHandleHorizontal() {
  return (
    <div className={styles["resize-handle-horizontal"]}>
      {[1, 2, 3].map((e) => (
        <div key={e} className={styles["triple-dots"]} />
      ))}
    </div>
  );
}
