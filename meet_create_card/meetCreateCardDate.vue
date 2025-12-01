<template>
    <div :class="['form-group black-label field-search-period dpinputs__input-wrapper inputs-with-ico dpwrapper-s w-100'
    , {'valid-filter': getFilterDateRange && needValidClass, 'set-width': !needLabel, 'ml-auto': needMargin, 'dont-need-validclass': !needValidClass}]"
         data-label-pos="left"
    >
        <div class="inputs-with-ico__wrp">
            <input type="text" :class="['date-create form-control meet-filter-date', {'valid-filter': getFilterDateRange && needValidClass}]"
                   placeholder="Выбрать период"
                   v-model="getFilterDateRange"
                   :ref="'dateInput'"
            >
            <i class="ico-calendar" @click="focusInput"></i>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "meetCreateCardDate",
    props: {
        index: {
            type: Number
        },
        needLabel: {
            type: Boolean,
            default: true
        },
        needValidClass: {
            type: Boolean,
            default: true
        },
        dontNeedAccept: {
            type: Boolean,
            default: false
        },
        needMargin: {
            type: Boolean,
            default: false
        }
    },
    async mounted() {
        this.$nextTick().then(() => {
            this.initMeetFilterDate();
        });
    },
    computed: {
        ...mapGetters({
            getFilterDateRange: "meetCreateCardModule/getFilterDateRange",
        }),
    },
    methods: {
        ...mapActions({
            acceptFilter: 'meetCreateCardModule/acceptFilter',
            updateDateRange: 'meetCreateCardModule/updateDateRange'
        }),
        initMeetFilterDate() {
            const block = this.$refs.dateInput;
            if (block) {
                $(block).daterangepicker({
                    autoUpdateInput: false,
                    autoApply: true,
                    singleDatePicker: false,
                    showDropdowns: true,
                    locale: {
                        format: 'DD.MM.YYYY',
                        daysOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                        monthNames: [
                            "Январь",
                            "Февраль",
                            "Март",
                            "Апрель",
                            "Май",
                            "Июнь",
                            "Июль",
                            "Август",
                            "Сентябрь",
                            "Октябрь",
                            "Ноябрь",
                            "Декабрь"
                        ],
                        firstDay: 1,
                        applyLabel: "Выбрать",
                        cancelLabel: "Очистить",
                    },
                    ranges: {
                        'Сегодня': [moment(), moment().endOf('day')],
                        'Вчера': [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
                        'Текущая неделя': [moment().startOf('week').add(1, 'days'), moment().endOf('week').add(1, 'days')],
                        'Прошлая неделя': [moment().subtract(1, 'week').startOf('week').add(1, 'days'), moment().subtract(1, 'week').endOf('week').add(1, 'days')],
                        'Текущий месяц': [moment().startOf('month'), moment().endOf('month')],
                        'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                        'Прошлые 3 месяца': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    },
                    linkedCalendars: false,
                    showCustomRangeLabel: false,
                    alwaysShowCalendars: true,
                    parentEl: 'body',
                    opens: 'right',
                    drops: 'auto',
                }, (start, end, label) => {
                    const selectedDate = start.format('DD.MM.YYYY') + ' - ' + end.format('DD.MM.YYYY');
                    this.handleDateChange(selectedDate);
                });

                $(block).on('apply.daterangepicker', (ev, picker) => {
                    const selectedDate = picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY');
                    ev.target.value = selectedDate;
                    ev.target.dispatchEvent(new Event('input'));
                    this.handleDateChange(selectedDate);
                });

                $(block).on('cancel.daterangepicker', () => {
                    this.handleDateChange(null);
                });
                // Обработка события focusout
                $(block).on('blur', () => {
                    const $input = $(this.$refs.dateInput);
                    const picker = $input.data('daterangepicker'); // Получаем экземпляр daterangepicker
                    if (picker && picker.startDate && picker.endDate) {
                        const selectedDate = picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY');
                        this.handleDateChange(selectedDate);
                    } else {
                        // Если даты не выбраны или picker не инициализирован
                        this.handleDateChange(null);
                    }
                });
            }
        },
        handleDateChange(selectedDate) {
            // this.filterData.value = selectedDate;
            this.updateDateRange(selectedDate);
            if (this.dontNeedAccept) {
                this.acceptFilter();
            }
        },
        focusInput() {
            this.$refs.dateInput.focus();
        }
    }
}
</script>

<style scoped lang="scss">
.set-width {
  max-width: 220px;
}
</style>