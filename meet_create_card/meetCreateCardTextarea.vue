<template>
    <div
            :class="['deals-card__input-wrp wrp-input dpinputs__input-wrapper', getInputInfo.sizeClass]"
            data-label-pos="top"
    >
        <label v-if="getInputInfo.name" class="dpinputs__label wrp-input__label">
            {{ getInputInfo.name }}
            <span class="require-data" v-if="getInputInfo.required">*</span>
        </label>
        <div class="wrp-input__input wrp-inputs-prices dpinputs__input-wrapper w-100" ref="container">
            <textarea
                    :name="'deals-card-textarea-' + inputType"
                    :class="[
                    'w-100',
                    {
                        'valid-filter': inputModel !== null && inputModel !== undefined && inputModel !== '' && inputModel !== 0,
                        'form-control': inputType === 'comment',
                        'error': needError !== '',
                    }
                ]"
                    v-model="inputModel"
                    :maxlength="getInputInfo.maxlength"
                    :placeholder="getInputInfo.placeholder"
                    :disabled="needDisable"
                    autocomplete="off"
                    ref="textarea"
                    @input="autoResize"
            ></textarea>
            <div v-if="needError !== ''" class="dpinputs__error-text">
                {{ needError }}
            </div>
        </div>
        <div v-if="inputType === 'invoice_total_cost'" class="deals-card__input-info">
            Сумма счета равна сумме платежей в этапах
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'meetCreateCardTextarea',
    props: {
        models: {
            type: [String, Number, Object, Array, BigInt],
            default: null,
        },
        inputType: {
            type: String,
            required: true,
        },
        needError: {
            type: String,
            default: '',
        },
        needDisable: {
            type: Boolean,
            default: false,
        },
        mask: {
            type: Object,
            default: null,
        },
    },
    mounted() {
        this.$nextTick(() => this.autoResize()); // Вызываем после монтирования DOM
    },
    updated() {
        this.$nextTick(() => this.autoResize()); // Пересчитываем высоту при обновлении
    },
    methods: {
        autoResize() {
            const textarea = this.$refs.textarea;
            const container = this.$refs.container;
            if (textarea && container) {
                // Сбрасываем высоту для пересчёта
                textarea.style.height = 'auto';
                container.style.height = 'auto';

                // Получаем высоту одной строки
                const singleLineHeight = 46; // Фиксированная высота для одной строки (включая padding)
                const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24; // Высота строки текста
                const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 0;
                const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom) || 0;
                const borderTop = parseFloat(getComputedStyle(textarea).borderTopWidth) || 0;
                const borderBottom = parseFloat(getComputedStyle(textarea).borderBottomWidth) || 0;

                // Вычисляем количество строк
                const text = textarea.value;
                const lines = text.split('\n').length;
                console.log('Text:', text, 'Lines:', lines, 'scrollHeight:', textarea.scrollHeight);

                if (!text || text.trim() === '') {
                    // Пустой textarea
                    textarea.style.height = `${singleLineHeight}px`;
                    container.style.height = `${singleLineHeight}px`;
                } else if (lines === 1) {
                    // Одна строка текста
                    textarea.style.height = `${singleLineHeight}px`;
                    container.style.height = `${singleLineHeight}px`;
                } else {
                    // Более одной строки
                    const totalHeight = textarea.scrollHeight + paddingTop + paddingBottom + borderTop + borderBottom;
                    textarea.style.height = `${totalHeight}px`;
                    container.style.height = `${totalHeight}px`;
                }
            } else {
                console.error('Textarea or container ref not found', { textarea, container });
            }
        }
    },
    computed: {
        ...mapGetters({
            checkTemplateVar: 'dealsCardModule/checkTemplateVar',
        }),
        getInputInfo() {
            const map = {
                comment_meet: {
                    name: '',
                    placeholder: 'Комментарий исполнителю',
                    maxlength: 500,
                    required: false,
                },
            };

            const defaults = {
                name: '',
                placeholder: '',
                sizeClass: 'dpwrapper-m',
                required: false,
                maxlength: 500,
            };

            // Найдём ключ, который начинается с той же подстроки, что и this.inputType
            const matchedKey = Object.keys(map).find(key => this.inputType.startsWith(key));

            return { ...defaults, ...(map[matchedKey] || {}) };
        },
        inputModel: {
            get() {
                return this.models || '';
            },
            set(value) {
                this.$emit('update:input-type', this.inputType, value);
                this.$nextTick(() => this.autoResize()); // Пересчитываем высоту после изменения
            },
        },
    },
};
</script>

<style scoped lang="scss">
.dpinputs-46 textarea {
  height: 46px;
  padding: 10px 12px 7px 12px;
  min-height: auto;
}
</style>