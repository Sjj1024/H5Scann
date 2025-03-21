<template>
    <!-- <view class="uni-select-dc" :style="{ 'z-index': zindex }"> -->
    <view class="uni-select-dc" @blur="onBlur" :style="{ 'z-index': zindex }">
        <view
            class="uni-select-dc-select"
            :style="{
                color: labelColor,
                borderRadius: selRadius,
                backgroundColor: bgColor,
            }"
            :class="{ active: active, showBorder: showBorder }"
            @click.stop="handleSelect"
        >
            <!-- 禁用mask -->
            <view class="uni-disabled" v-if="disabled"></view>
            <!-- 清空 -->
            <view
                class="close-icon close-postion"
                v-if="realValue.length && !active && !disabled && showClearIcon"
            >
                <span @click.stop="handleRemove(null)"></span>
            </view>
            <!-- 显示框 -->
            <view class="uni-select-multiple" v-show="realValue.length">
                <view
                    class="uni-select-multiple-item"
                    v-if="multiple"
                    v-for="(item, index) in changevalue"
                    :key="index"
                >
                    {{ item.text }}
                    <view class="close-icon" v-if="showValueClear">
                        <span @click.stop="handleRemove(index)"> </span>
                    </view>
                </view>
                <!-- 单选时展示内容 -->
                <view
                    v-else
                    class="single-text"
                    :style="{ color: labelColor ? labelColor : 'black' }"
                >
                    <!-- {{ changevalue.length ? changevalue[0].text : '' }} -->
                    <van-icon name="ellipsis" style="font-size: 20px" />
                </view>
            </view>
            <!-- 为空时的显示文案 -->
            <view v-if="realValue.length === 0 && showplaceholder">
                {{ placeholder }}
            </view>
            <!-- 右边的下拉箭头 -->
            <view
                :class="{
                    disabled: disabled,
                    'uni-select-dc-icon': !downInner,
                    'uni-select-dc-inner': downInner,
                }"
            >
                <span
                    :style="{
                        borderColor: `transparent transparent ${labelColor} ${labelColor}`,
                    }"
                ></span>
            </view>
        </view>
        <!-- 下拉选项 -->
        <div class="uni-select-dc-options" :scroll-y="true" v-if="active">
            <view
                class="uni-select-dc-item"
                v-for="(item, index) in options"
                :key="index"
                :class="{ activeOpt: realValue.includes((item as any)[svalue]) }"
                @click.stop="handleChange(index, item)"
            >
                {{ (item as any)[slabel] }}
            </view>
        </div>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

// 选择框失去焦点后收回
const onBlur = () => {
    console.log('收回折叠筐')
}

const props = defineProps({
    // 是否显示全部清空按钮
    showClearIcon: {
        type: Boolean,
        default: false,
    },
    // 是否多选
    multiple: {
        type: Boolean,
        default: false,
    },
    // 下拉箭头是否在框内
    downInner: {
        type: Boolean,
        default: true,
    },
    // 是否显示单个删除
    showValueClear: {
        type: Boolean,
        default: true,
    },
    zindex: {
        type: Number,
        default: 99,
    },
    // 禁用选择
    disabled: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default() {
            return []
        },
    },
    value: {
        type: Array,
        default() {
            return []
        },
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    showplaceholder: {
        type: Boolean,
        default: true,
    },
    // 默认取text
    slabel: {
        type: String,
        default: 'text',
    },
    // 选中的label颜色
    labelColor: {
        type: String,
        default: '#bbb',
    },
    // 圆角边框
    selRadius: {
        type: String,
        default: '10rpx',
    },
    // 默认取value
    svalue: {
        type: String,
        default: 'value',
    },
    // 背景色
    bgColor: {
        type: String,
        default: '',
    },
    // 是否展示边框
    showBorder: {
        type: Boolean,
        default: true,
    },
})
const emit = defineEmits(['change'])
const active = ref<boolean>(false) // 组件是否激活，
let changevalue = reactive<Record<any, any>>([])
let realValue = reactive<Record<string, any>>([0])

// 初始化函数
const init = () => {
    if (props.value.length > 0) {
        props.options.forEach((item) => {
            props.value.forEach((i) => {
                if ((item as any)[props.svalue] === i) {
                    changevalue.push(item)
                }
            })
        })
        realValue = props.value
        console.log('props---', changevalue, realValue)
    } else {
        changevalue = []
        realValue = []
    }
}

// 点击展示选项
const handleSelect = () => {
    if (props.disabled) return
    active.value = !active.value
}

// 移除数据
const handleRemove = (index: any) => {
    if (index === null) {
        realValue = []
        changevalue = []
    } else {
        realValue.splice(index, 1)
        changevalue.splice(index, 1)
    }
    emit('change', changevalue, realValue)
}
// 点击组件某一项
const handleChange = (index: any, item: any) => {
    console.log('选中了某一项', index, item)
    // 如果是单选框，选中一项后直接关闭
    if (!props.multiple) {
        console.log('关闭下拉框')
        changevalue.length = 0
        realValue.length = 0
        changevalue.push(item)
        realValue.push(item[props.svalue])
        active.value = !active.value
    } else {
        // 多选操作
        const arrIndex = realValue.indexOf(item[props.svalue])
        if (arrIndex > -1) {
            // 如果该选项已经选中，当点击后就不选中
            changevalue.splice(arrIndex, 1)
            realValue.splice(arrIndex, 1)
        } else {
            // 否则选中该选项
            changevalue.push(item)
            realValue.push(item[props.svalue])
        }
    }
    // 触发回调函数
    emit('change', changevalue, realValue)
}

onMounted(() => {
    init()
})
</script>

<style lang="scss" scoped>
.uni-select-dc {
    position: relative;
    z-index: 99;

    .uni-select-mask {
        width: 100%;
        height: 100%;
    }

    /* 删除按钮样式*/
    .close-icon {
        height: 100%;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        // z-index: 3;
        cursor: pointer;

        text {
            position: relative;
            background: #c0c4cc;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 1px solid #bbb;

            &::before,
            &::after {
                content: '';
                position: absolute;
                left: 20%;
                top: 50%;
                height: 1px;
                width: 60%;
                transform: rotate(45deg);
                background-color: #909399;
            }

            &::after {
                transform: rotate(-45deg);
            }
        }
    }

    //所有情空的定位
    .close-postion {
        position: absolute;
        right: 35px;
        top: 0;
        height: 100%;
        width: 15px;
    }

    /* 多选盒子 */
    .uni-select-multiple {
        display: flex;
        flex-wrap: nowrap;
        overflow: scroll;

        .single-text {
            color: #333;
        }

        .uni-select-multiple-item {
            background: #f4f4f5;
            margin-right: 5px;
            padding: 2px 4px;
            border-radius: 4px;
            color: #909399;
            display: flex;
            flex-shrink: 0;
        }
    }

    .showBorder {
        border: 1px solid rgb(229, 229, 229);
    }

    // select部分
    .uni-select-dc-select {
        user-select: none;
        position: relative;
        z-index: 3;
        height: 30px;
        // padding: 0 30px 0 10px;
        box-sizing: border-box;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
        color: #999;
        min-width: 10px;

        .uni-disabled {
            position: absolute;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 19;
            cursor: no-drop;
            background: rgba(255, 255, 255, 0.5);
        }

        .uni-select-dc-input {
            font-size: 14px;
            color: #999;
            display: block;
            width: 96%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 30px;
            box-sizing: border-box;

            &.active {
                color: #333;
            }
        }

        .uni-select-dc-icon {
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid rgb(229, 229, 229);

            text {
                display: block;
                width: 0;
                height: 0;
                border-width: 12rpx 12rpx 0;
                border-style: solid;
                border-color: #bbb transparent transparent;
                transition: 0.3s;
            }

            &.disabled {
                cursor: no-drop;

                text {
                    width: 20rpx;
                    height: 20rpx;
                    border: 2px solid #ff0000;
                    border-radius: 50%;
                    transition: 0.3s;
                    position: relative;
                    z-index: 999;

                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        margin-top: -1px;
                        background-color: #ff0000;
                        transform: rotate(45deg);
                    }
                }
            }
        }

        .uni-select-dc-inner {
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            text {
                display: block;
                width: 16rpx;
                height: 16rpx;
                position: absolute;
                right: 20rpx;
                top: 12rpx;
                border: 2rpx solid #bbb;
                transform: rotate(-45deg);
                border-color: transparent transparent#bbb #bbb;
                transition: 0.3s;
            }

            &.disabled {
                cursor: no-drop;

                text {
                    width: 20rpx;
                    height: 20rpx;
                    border: 2px solid #ff0000;
                    border-radius: 50%;
                    transition: 0.3s;
                    position: relative;
                    z-index: 999;

                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        margin-top: -1px;
                        background-color: #ff0000;
                        transform: rotate(45deg);
                    }
                }
            }
        }

        // 激活之后，图标旋转180度
        &.active .uni-select-dc-icon {
            text {
                transform: rotate(180deg);
            }
        }

        &.active .uni-select-dc-inner {
            text {
                position: absolute;
                right: 10px;
                top: 12px;
                transform: rotate(-225deg);
            }
        }
    }

    // options部分
    .uni-select-dc-options {
        user-select: none;
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        width: 100%;
        // height: 400rpx;
        max-height: 400rpx;
        border-radius: 4px;
        border: 1px solid rgb(229, 229, 229);
        background: #fff;
        padding: 5px 0;
        box-sizing: border-box;
        z-index: 9;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;

        .uni-select-dc-item {
            padding: 0 10px;
            box-sizing: border-box;
            cursor: pointer;
            line-height: 2.5;
            transition: 0.3s;
            font-size: 14px;
            color: #333;
            // 取消长按的背景色
            user-select: none;
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
            -moz-user-focus: none;
            -moz-user-select: none;

            &.activeOpt {
                color: #409eff;
                background-color: #f5f7fa;

                &:hover {
                    color: #409eff;
                    background-color: #f5f7fa;
                }
            }

            &:hover {
                background-color: #f5f5f5;
            }
        }
    }
}
</style>
