import { useEffect } from "react";

const useShortcut = (
  shortcuts = [
    {
      keyCombo: { ctrlKey: false, key: null },
      action: () => console.log("Performing action"),
    }
  ]
) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      shortcuts.forEach(({ keyCombo, action }) => {
        const { ctrlKey, key } = event;

        if (
          (keyCombo.ctrlKey === ctrlKey || !keyCombo.ctrlKey) &&
          keyCombo.key === key
        ) {
          action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
};

export default useShortcut;
