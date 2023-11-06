import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useRef } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

function Html5QrcodePlugin(props) {
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        function createConfig(props) {
            const config = {};
            if (props.fps) {
                config.fps = props.fps;
            }
            if (props.qrbox) {
                config.qrbox = props.qrbox;
            }
            if (props.aspectRatio) {
                config.aspectRatio = props.aspectRatio;
            }
            if (props.disableFlip !== undefined) {
                config.disableFlip = props.disableFlip;
            }
            return config;
        }

        const config = createConfig(props);
        const verbose = props.verbose === true;

        // Success callback is required.
        if (!props.qrCodeSuccessCallback) {
            throw new Error("qrCodeSuccessCallback is a required callback.");
        }

        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
            qrcodeRegionId,
            config,
            verbose
        );
        html5QrcodeScannerRef.current.render(
            props.qrCodeSuccessCallback,
            props.qrCodeErrorCallback
        );

        return () => {
            // componentWillUnmount logic
            if (html5QrcodeScannerRef.current) {
                html5QrcodeScannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, []);

    return <div id={qrcodeRegionId} />;
}

export default Html5QrcodePlugin;
