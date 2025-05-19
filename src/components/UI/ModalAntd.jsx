import React from "react";
import {Modal} from "antd";

function ModalAntd(props) {

    return (
        <Modal
            title={props.title}
            open={props.open}
            onOk={props.onOk}
            confirmLoading={props.confirmLoading}
            onCancel={props.onCancel}
            footer={props.footer}
        >
            {props.children}
        </Modal>
    )
}

export default ModalAntd;
