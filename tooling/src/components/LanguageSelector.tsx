import i18next from "i18next";
import React from "react";
import styles from "../../styles/LanguageSelector.module.css";

const LanguageSelector = () => {
    return (
        <div className={styles.wrapper}>
            <button onClick={() => i18next.changeLanguage("en")}>🇬🇧 EN</button>
            <button onClick={() => i18next.changeLanguage("cn")}>🇨🇳 CN</button>
        </div>
    );
};

export default LanguageSelector;
