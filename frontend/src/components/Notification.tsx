import { useEffect } from "react";
import "./Notification.css";

export default function Notification({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notif notif--${type}`}>
      {message}
    </div>
  );
}
