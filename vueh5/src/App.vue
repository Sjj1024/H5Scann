<template>
    <div class="scanCode">
        <div id="reader"></div>
    </div>
    <div class="header">
        <div class="left">
            <van-icon name="clear" />
        </div>
        <div class="center">{{ currentKa }}</div>
        <div class="right">
            <!-- <van-icon name="ellipsis" /> -->
            <view class="langSelect">
                <Select
                    :options="langOptions"
                    :value="[0]"
                    :showBorder="false"
                    labelColor="white"
                    selRadius="30rpx"
                    @change="langChange"
                ></Select>
            </view>
        </div>
    </div>
    <div class="footer">
        <div class="first">识别二维码完成打卡</div>
        <div class="second">打卡</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { Html5Qrcode } from 'html5-qrcode'
import Select from '@/components/select.vue'
import VConsole from 'vconsole'

const codeContent = ref('')

const currentKa = ref('关卡一')

// 语言选择
const langOptions = [
    { value: 0, text: '关卡一' },
    { value: 1, text: '关卡二' },
    { value: 2, text: '关卡三' },
    { value: 3, text: '关卡四' },
    { value: 4, text: '关卡五' },
    { value: 5, text: '通关核验' },
]

// lang change
const langChange = (e: any, value: any) => {
    console.log('langChange', e, value)
    currentKa.value = e[0].text
}

const init = () => {
    // This method will trigger user permissions
    Html5Qrcode.getCameras()
        .then((devices) => {
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
                                    width < 600
                                        ? mobileAspectRatio
                                        : aspectRatio,
                            },
                        },
                        (decodedText, decodedResult) => {
                            // do something when code is read
                            console.log('decodedText', decodedText)
                            // console.log('decodedResult', decodedResult)
                            codeContent.value = decodedText
                            showToast(decodedText)
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
}

onMounted(() => {
    const vConsole = new VConsole({ theme: 'dark' })
    console.log('Hello world')
    // init()
})
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 50px;
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    font-size: 20px;

    .center {
        margin-top: 30px;
        font-size: 16px;
    }

    .right {
        position: relative;
        margin-top: -20px;

        .langSelect {
            width: 100px;
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}

.footer {
    width: 100%;
    // height: 50px;
    color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .second {
        margin: 16px 0;
    }
}

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
