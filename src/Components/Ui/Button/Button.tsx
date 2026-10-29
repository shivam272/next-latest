import styles from "./button.module.scss";

export const DummyButton = () => {
  return (
    <button
      className={`${styles.button} rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700`}
    >
      Continue
    </button>
  );
};
