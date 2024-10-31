import { createRoot } from "react-dom/client";

interface ToastInstance {
  timer: NodeJS.Timeout;
  close: () => void;
}
let toastInstance: ToastInstance | null = null;
export function showToast(message: string, duration = 3000) {
  if (toastInstance) {
    clearTimeout(toastInstance.timer);
    toastInstance.close();
  }
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Toast message={message} />);
  document.body.appendChild(container);
  const close = () => {
    root.unmount();
    container.remove();
  }
  toastInstance = {
    timer: setTimeout(close, duration),
    close,
  }
}
function Toast({ message }: { message: string }) {
  return <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-50 bg-black p-2 rounded-lg shadow-lg">
    <p className="text-white">{message}</p>
  </div>
}