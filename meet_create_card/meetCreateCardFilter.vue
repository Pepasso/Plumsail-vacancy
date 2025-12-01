<template>
    <div class="meet-create-card__filter-inner dpinputs-38 dpinputs-observer">
        <div class="dpinputs-grid-container dpinputs-grid-container-1">
            <div class="dpinputs__double">
                <globalSelect :selectConfig="createOfficeTypeConfig"/>
                <meetCreateCardDate :class="['half-width']" :input-time="'meet-create-card-time'"></meetCreateCardDate>
                <globalSelect :selectConfig="createDoersConfig"/>
                <div class="meet-create-card__btn-filter-wrp">
                    <button
                            :disabled="!filterActive"
                            class="btndp btndp-46 btndp-outlined w-100"
                            @click="acceptFilter"
                    >
                        Применить фильтр
                    </button>
                    <button
                            :disabled="isDefaultFilter"
                            class="btndp btndp-46 btndp-outlined-sec w-100"
                            @click="resetFilter"
                    >
                        Сбросить фильтр
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import globalSelect from "../templates/selects/globalSelect";
import meetCreateCardDate from "./meetCreateCardDate";
import {createSelectConfig} from "../../utils/selectConfigBuilder";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "meetCreateCardFilter",
    components: {
        globalSelect,
        meetCreateCardDate
    },
    computed: {
        ...mapGetters({
            getShowFilterSelect: "meetCreateCardModule/getShowFilterSelect",
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            getFilterDoerId: "meetCreateCardModule/getFilterDoerId",
            getDoerTypeId: "meetCreateCardModule/getDoerTypeId",
            getOfficeType: "meetCreateCardModule/getOfficeType",
            getFilterDateRange: "meetCreateCardModule/getFilterDateRange",
            cleanDoerId: "meetCreateCardModule/cleanDoerId",
            isFilterActive: "meetCreateCardModule/isFilterActive",
            isDefaultFilter: "meetCreateCardModule/isDefaultFilter",
        }),
        filterActive() {
            console.log('isFilterActive', this.isFilterActive)
            return this.isFilterActive;
        },
        clearedDoerId() {
            return (doerId) => this.cleanDoerId(doerId)
        },
        createOfficeTypeConfig() {
            const officeTypes = this.getMeetCreateFilter.office_types || [];

            // 1. Преобразуем массив объектов в объект вида { id: name }
            const selectOptions = officeTypes.reduce((acc, type) => {
                acc[type.id] = type.name;
                return acc;
            }, {});

            return createSelectConfig({
                selectType: 'single',
                labelConfig: {
                    sizeLabelClass: 'dpwrapper-s',
                    labelColorClass: 'dpinputs__label',
                    label: null,
                    additionalClass: 'half-width',
                    position: 'top',
                    isRequire: false
                },
                needSearch: false,
                select: selectOptions, // передаем объект вида { 1: "Онлайн", 2: "Офлайн", ... }
                inputType: 'office_types',
                models: this.getOfficeType,
                needDisable: false,
                needError: false,
                getters: {
                    showSelect: this.getShowFilterSelect,
                },
                mutations: {
                    toggleShowCardSelect: (...args) => this.toggleShowCardSelect(...args),
                },
                actions: {
                    handleSelectItem: (...args) => this.handleFilterOfficeTypeUpdate(...args),
                },
                placeholder: 'Выбрать'
            });
        },
        createDoersConfig() {
            const officeTypes = this.getMeetCreateFilter.doers || [];

            // 1. Преобразуем массив объектов в объект вида { id: name }
            const selectOptions = officeTypes.reduce((acc, type) => {
                // const cleanId = this.clearedDoerId(type.id);
                acc[type.id] = type.name;
                return acc;
            }, {});

            return createSelectConfig({
                selectType: 'single',
                labelConfig: {
                    sizeLabelClass: 'dpwrapper-s',
                    labelColorClass: 'dpinputs__label',
                    label: null,
                    additionalClass: 'full-width',
                    position: 'top',
                    isRequire: false
                },
                needSearch: true,
                select: selectOptions, // передаем объект вида { 1: "Онлайн", 2: "Офлайн", ... }
                inputType: 'meet_create_doers',
                models: this.getFilterDoerId,
                needDisable: false,
                needError: false,
                getters: {
                    showSelect: this.getShowFilterSelect,
                },
                bottomBtns: {
                    singleAction: false,
                    render: true,
                    right: {
                        text: 'Применить',
                        action: () => this.toggleShowCardSelect({show: false, inputType: null, x: null, y: null}),
                    }
                },
                mutations: {
                    toggleShowCardSelect: (...args) => this.toggleShowCardSelect(...args),
                },
                actions: {
                    handleSelectItem: (...args) => this.handleFilterDoerIdUpdate(...args),
                },
                placeholder: 'Рекомендуемые исполнители'
            });
        }
    },
    methods: {
        ...mapActions({
            toggleShowCardSelect: 'meetCreateCardModule/toggleShowCardSelect',
            acceptFilter: 'meetCreateCardModule/acceptFilter',
            updateDoerId: 'meetCreateCardModule/updateDoerId',
            updateDoerTypeId: 'meetCreateCardModule/updateDoerTypeId',
            updateOfficeType: 'meetCreateCardModule/updateOfficeType',
            resetFilter: 'meetCreateCardModule/resetFilter'
        }),
        handleFilterDoerIdUpdate(inputType, item, itemIndex) {
            this.toggleShowCardSelect({show: false, inputType: null, x: null, y: null});
            const doer = this.getMeetCreateFilter.doers.find(doer => doer.id === itemIndex)
            this.updateDoerId(itemIndex)
            this.updateDoerTypeId(parseInt(doer.type_id))

        },
        handleFilterOfficeTypeUpdate(inputType, item, itemIndex) {
            this.toggleShowCardSelect({show: false, inputType: null, x: null, y: null});
            const office = this.getMeetCreateFilter.office_types.find(office => parseInt(office.id) === parseInt(itemIndex))
            this.updateOfficeType(parseInt(office.id))
        },
    }
}
</script>

<style scoped lang="scss">
.meet-create-card {
  &__filter-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  &__btn-filter-wrp {
    display: flex;
    gap: 18px;
    align-items: center;
    width: 100%;
    max-width: 100%;

    .btndp {
      flex: 1 1 0;
      box-sizing: border-box;
      min-width: 0;
    }
  }
}


.dpinputs {
  &__double {
    gap: 18px;

    //.dpinputs__input-wrapper {
    //  &.half-width {
    //    flex: 1 1 45%;
    //  }
    //
    //  &.full-width {
    //    flex: 1 1 100%;
    //  }
    //}
  }
}
</style>