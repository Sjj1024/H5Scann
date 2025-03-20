<template>
    <div class="scanCode">
        <div id="reader"></div>
        <div class="code">
            {{ codeContent }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const codeContent = ref('1024')

// This method will trigger user permissions
Html5Qrcode.getCameras()
    .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        // console.log(devices)
        const html5QrCode = new Html5Qrcode('reader')
        const width = window.innerWidth
        const height = window.innerHeight
        const aspectRatio = width / height
        const reverseAspectRatio = height / width

        const mobileAspectRatio =
            reverseAspectRatio > 1.5
                ? reverseAspectRatio + (reverseAspectRatio * 12) / 100
                : reverseAspectRatio
        if (devices && devices.length) {
            // .. use this to start scanning.
            html5QrCode
                .start(
                    { facingMode: { exact: 'environment' } },
                    {
                        fps: 10, // Optional, frame per seconds for qr code scanning
                        aspectRatio: aspectRatio + 1,
                        qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
                        videoConstraints: {
                            facingMode: 'environment',
                            aspectRatio:
                                width < 600 ? mobileAspectRatio : aspectRatio,
                        },
                    },
                    (decodedText, decodedResult) => {
                        // do something when code is read
                        console.log('decodedText', decodedText)
                        // console.log('decodedResult', decodedResult)
                        codeContent.value = decodedText
                    },
                    (errorMessage) => {
                        // parse error, ignore it.
                        // console.log('parse error, ignore it.', errorMessage)
                    }
                )
                .catch((err) => {
                    // Start failed, handle it.
                    console.log('Start failed, handle it.')
                })
        }
    })
    .catch((err) => {
        // handle err
        console.log(err)
    })
</script>

<style lang="scss" scoped>
.scanCode {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0);

    #reader {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
    }
}
</style>
