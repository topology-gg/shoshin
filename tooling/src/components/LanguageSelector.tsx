import i18next from "i18next";
import React from "react";
import styles from "../../styles/LanguageSelector.module.css";

const LanguageSelector = () => {

    const button_style = {height:'1.5rem'}

    return (
        <div className={styles.wrapper}>
            <button style={button_style} onClick={() => i18next.changeLanguage("en")}>English</button>
            <button style={button_style} onClick={() => i18next.changeLanguage("cn")}>中文</button>
        </div>
    );
};

export default LanguageSelector;
