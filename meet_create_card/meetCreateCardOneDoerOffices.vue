<template>
    <globalSelect :selectConfig="createOneDoerOffice"/>
    <div
            v-if="oneDoerSlots(this.data.doerId).office_id"
            @click="getOfficeInfo({url: activeCompany(data.doerId)?.details_url, showModal: true})"
            class="one-slot-offices__show-info"
    >
        Подробнее об офисе
    </div>
</template>

<script>
import globalSelect from "../templates/selects/globalSelect";
import {createSelectConfig} from "../../utils/selectConfigBuilder";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "meetCreateCardOneDoerOffices",
    components: {
        globalSelect
    },
    props: ['data'],
    computed: {
        ...mapGetters({
            getShowOneDoerSlotOffices: "meetCreateCardModule/getShowOneDoerSlotOffices",
            getOneDoerSlots: "meetCreateCardModule/getOneDoerSlots",
            getActiveCompany: "meetCreateCardModule/getActiveCompany",
        }),
        oneDoerSlots() {
            return (doerId) => this.getOneDoerSlots(doerId, this.data.tab);
        },
        activeCompany() {
          // const offices = this.oneDoerSlots(this.data.doerId).offices;
          // const officeId = this.oneDoerSlots(this.data.doerId).office_id;
          //
          // return offices.find(office => office.id === officeId);
            return (doerId) => this.getActiveCompany(doerId, this.data.tab);
        },
        createOneDoerOffice() {
            const doerOffice = this.oneDoerSlots(this.data.doerId).offices || [];
            // 1. Преобразуем массив offices в объект { id: name }
            const officeItems = doerOffice.reduce((acc, office) => {
                acc[office.id] = office.name;
                return acc;
            }, {});

            // 3. Если тебе нужен объект вида { key: 'office', items: { id: name } }
            const transformedOffice = {
                key: 'office',
                items: officeItems
            };

            // Далее можно использовать transformedOffice.items как данные для селекта и т.д.
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
                select: transformedOffice.items, // используем преобразованный объект
                inputType: 'one_doer_offices' + this.data.doerId,
                models: this.oneDoerSlots(this.data.doerId).office_id,
                needDisable: false,
                needError: false,
                getters: {
                    showSelect: this.getShowOneDoerSlotOffices,
                },
                mutations: {
                    toggleShowCardSelect: (...args) => this.toggleShowOneDoerSlotOffices(...args),
                },
                actions: {
                    handleSelectItem: (...args) => this.handleSelectClick(...args), // Используем замыкание
                },
                placeholder: 'Выбрать'
            });
        },
    },
    methods: {
        ...mapActions({
            toggleShowOneDoerSlotOffices: 'meetCreateCardModule/toggleShowOneDoerSlotOffices',
            updateOneDoerSlot: 'meetCreateCardModule/updateOneDoerSlot',
            getOfficeInfo: 'meetCreateCardModule/getOfficeInfo',
        }),
        handleSelectClick(inputType, item, itemIndex) {
            this.toggleShowOneDoerSlotOffices({show: false, inputType: null, x: null, y: null});
            this.oneDoerSlots(this.data.doerId).office_id = itemIndex;
            this.updateOneDoerSlot({
                doerId: this.data.doerId,
                type_id: this.data.type_id,
                tab: this.data.tab,
                office_id: itemIndex,
                calendar: 1,
                offices: 1,
                updateSlots: true
            });
        },
    }
}
</script>

<style scoped lang="scss">
.one-slot-offices {
  &__show-info {
    color: $crm-blue2;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    cursor: pointer;
  }
}
</style>