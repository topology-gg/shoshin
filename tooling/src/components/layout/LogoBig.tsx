import React from 'react';
import s from './LogoBig.module.css';

const LogoBig = () => {
    return (
        <img
            src="/images/logo/shoshin-logo-big.png"
            alt="Shoshin by Topology"
            className={s.logoImageBig}
        />
    );
};

export default LogoBig;
