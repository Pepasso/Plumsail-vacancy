<template>
    <div class="meet-create-modal__wrapper" @click="handleWrapperClick">
        <div
                ref="modalContent"
                class="wrp-dp-modal"
                @click.stop
        >
            <div class="modal-dp-ui__top with-border-bottom w-100">
                <div class="modal-dp-ui__title-wrp">
                    <div class="modal-dp-ui__title">
                        Информация об офисе
                    </div>
<!--                    <div v-if="getMeetCreateFilter?.client?.time" class="meet-create-modal__time-tab">-->
<!--                        Время клиента: {{ getMeetCreateFilter?.client?.time }}-->
<!--                    </div>-->
                </div>
                <div class="modal-dp-ui__ico-wrp">
                    <div @click="toggleModalShowModalAboutOffice({show: false})" class="modal-dp-ui__close">
                        <i class="ico-close"></i>
                    </div>
                </div>
                <div class="modal-dp-ui__bottom-border"></div>
            </div>
            <div class="modal-dp-ui__content need-top w-100">
                <SimpleBar class="modal-dp-ui__scroll">
                    <div class="modal-dp-ui__text">
                        <div class="meet-create-modal__office-info office-info-modal">
                            <template v-for="field in officeFields" :key="field.key">
                                <!-- Обычные поля -->
                                <div
                                        v-if="getFieldValue(getModalAboutOfficeData, field) || (field.nested && getNestedValue(getModalAboutOfficeData, field.nested))"
                                        class="office-info-modal__name"
                                >
                                    <span class="office-info-modal__top-text">
                                        {{ field.label }}
                                    </span>
                                    <span class="office-info-modal__bottom-text">
                                        {{
                                            field.formatter
                                                    ? field.formatter(getModalAboutOfficeData)
                                                    : field.nested
                                                    ? getNestedValue(getModalAboutOfficeData, field.nested)
                                                    : getModalAboutOfficeData[field.key]
                                        }}
                                    </span>
                                </div>
                            </template>

                            <!-- Транспорт отдельно (т.к. это объект с подполями) -->

                            <template v-if="getModalAboutOfficeData.transport">
                                <div
                                        v-for="(value, key) in filteredTransport"
                                        :key="key"
                                        class="office-info-modal__name"
                                >
                                    <span class="office-info-modal__top-text">
                                        {{ transportLabel(key) }}
                                    </span>
                                    <span class="office-info-modal__bottom-text">
                                        № {{ value }}
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </SimpleBar>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {OnClickOutside} from '@vueuse/components';
import SimpleBar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

export default {
    name: "meetCreateCardModalAboutOffice",
    components: {
        OnClickOutside,
        SimpleBar
    },
    computed: {
        ...mapGetters({
            getModalAboutOfficeData: "meetCreateCardModule/getModalAboutOfficeData",
            // getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
        }),
        officeFields() {
            return [
                { key: 'name', label: 'Название' },
                { key: 'adress', label: 'Адресс' },
                { key: 'description', label: 'Описание' },
                { nested: 'city.name', label: 'Город' },
                { nested: 'office_type.name', label: 'Способ работы оффиса' },
                { key: 'phone_str', label: 'Номера телефонов' }
            ];
        },
        filteredTransport() {
            const transport = this.getModalAboutOfficeData.transport;
            if (!transport) return {};

            const filtered = {};
            Object.keys(transport).forEach(key => {
                if (transport[key]) { // Проверяем, что значение не пустое
                    filtered[key] = transport[key];
                }
            });
            return filtered;
        }
    },
    methods: {
        ...mapActions({
            toggleModalShowModalAboutOffice: 'meetCreateCardModule/toggleModalShowModalAboutOffice'
        }),
        handleWrapperClick() {
            // Любой клик по wrapper (но не по stop) — закрываем модалку
            this.toggleModalShowModalAboutOffice({ show: false });
        },
        transportLabel(key) {
            const labels = {
                bus: 'Автобус',
                trolleybus: 'Троллейбус',
                minibus: 'Маршрутка',
                tram: 'Трамвай',
                subway: 'Метро',
                stop: 'Остановка'
            };
            return labels[key] || key;
        },
        getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => current?.[key], obj);
        },

        getFieldValue(data, field) {
            if (field.nested) {
                return this.getNestedValue(data, field.nested);
            }
            return data[field.key];
        },

    }
}
</script>

<style scoped lang="scss">
.meet-create-modal {
  &__wrapper {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(30, 30, 30, 0.25);
    color: $dark;

    .wrp-dp-modal {
      display: flex;
      width: 800px;
      flex-direction: column;
      align-items: flex-start;
      flex-shrink: 0;
      border-radius: 15px;
      border: 1px solid $stroke;
      background: $white;

      .modal-dp-ui__title-wrp {
        flex-direction: row;
        align-items: center;
        gap: 16px;
      }
    }
  }

  &__time-tab {
    display: flex;
    height: 28px;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 57px;
    border: 1px solid $blue-crm;
    background: $blue4;
    color: $blue-crm;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
}

.office-info-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__name {
    border-radius: 12px;
    background: $body-color;
    display: flex;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    align-self: stretch;
  }
  &__top-text {
    color: $grey-placeholder3;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
  }
  &__bottom-text {
    color: $dark;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
  }
}
</style>