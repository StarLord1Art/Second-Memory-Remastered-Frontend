import React from "react";
import {Layout} from 'antd';

const {Footer} = Layout;

function FooterAntd() {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Second Memory ©{new Date().getFullYear()} Created by MIPT Team
        </Footer>
    )
}

export default FooterAntd
