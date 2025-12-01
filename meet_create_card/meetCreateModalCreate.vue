<template>
    <div class="vue-modal-dp__wrapper" @click="handleWrapperClick">
        <div
                ref="modalContent"
                class="wrp-dp-modal"
                @click.stop
        >
            <div v-if="getModalCreateLoader" class="wrp-spinner w-100 text-center">
                <div class="spinner-border spinner-border text-green" role="status">
                    <span class="sr-only">Загрузка...</span>
                </div>
            </div>
            <div v-if="!getModalCreateLoader" class="modal-dp-ui__top w-100">
                <div v-if="getShowModalCreate.step === 0" class="modal-dp-ui__title-wrp">
                    <div class="modal-dp-ui__title">
                        Убедитесь, что всё правильно
                    </div>
                </div>
                <div class="modal-dp-ui__ico-wrp">
                    <div @click="handleWrapperClick" class="modal-dp-ui__close">
                        <i class="ico-close"></i>
                    </div>
                </div>
            </div>
            <div v-if="!getModalCreateLoader" class="modal-dp-ui__content need-top w-100">
                <SimpleBar class="modal-dp-ui__scroll">
                    <div class="modal-dp-ui__text dpinputs-46 dpinputs-observer">
                        <div v-if="getShowModalCreate.step === 1" class="meet-create-modal__background">
                            <img src="/img/meet_create_success.png" alt="">
                        </div>
                        <div v-if="getShowModalCreate.step === 1" class="meet-create-modal__title">
                            Встреча успешно создана!
                        </div>
                        <div
                                v-for="(item, index) in infoItems"
                                :key="index"
                                class="meet-create-modal__list"
                        >
                            <span>{{ item.label }}</span> {{ item.value }}
                        </div>
                        <meetCreateCardTextarea
                                v-if="getShowModalCreate.step === 0"
                                :input-type="'comment_meet'"
                                :models="getCommentMeetCreate"
                                :class="['full-width']"
                                @update:input-type="handleAttributeUpdate"
                        ></meetCreateCardTextarea>
                    </div>
                </SimpleBar>
            </div>
            <div v-if="!getModalCreateLoader" class="modal-dp-ui__footer w-100">
                <button
                        v-if="buttonConfig"
                        class="btndp btndp-50 btndp-primary w-100"
                        @click="buttonConfig.action"
                >
                    {{ buttonConfig.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import {OnClickOutside} from '@vueuse/components';
import SimpleBar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import meetCreateCardTextarea from "./meetCreateCardTextarea";

export default {
    name: "meetCreateModalCreate",
    components: {
        OnClickOutside,
        SimpleBar,
        meetCreateCardTextarea
    },
    computed: {
        ...mapGetters({
            getShowModalCreate: "meetCreateCardModule/getShowModalCreate",
            getAddressMeetCreate: "meetCreateCardModule/getAddressMeetCreate",
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            getActiveDoerTab: "meetCreateCardModule/getActiveDoerTab",
            getDateInfoModal: "meetCreateCardModule/getDateInfoModal",
            getCommentMeetCreate: "meetCreateCardModule/getCommentMeetCreate",
            getModalCreateLoader: "meetCreateCardModule/getModalCreateLoader",
        }),
        currentTab() {
            return this.getActiveDoerTab(this.getShowModalCreate.doer?.id) || null;
        },
        dateInfoModal() {
            return (doerId) => this.getDateInfoModal(doerId, this.getShowModalCreate.tabType);
        },
        meetingFormat() {
            return this.currentTab === 'online' ? 'Онлайн' : 'В офисе';
        },
        buttonConfig() {
            const step = this.getShowModalCreate.step;

            if (step === 0) {
                return {
                    label: 'Создать встречу',
                    action: () => this.createMeet({
                        doer: this.getShowModalCreate.doer,
                        tabType: this.currentTab
                    })
                };
            }

            if (step === 1) {
                return {
                    label: 'Отлично!',
                    action: () => this.closeModalAndCard()
                };
            }

            return null; // ничего не показывать
        },
        infoItems() {
            return [
                {label: 'Дата и время:', value: this.dateInfoModal(this.getShowModalCreate.doer?.id)},
                {label: 'Исполнитель:', value: this.getShowModalCreate.doer?.name},
                {label: 'Клиент:', value: this.getMeetCreateFilter.client.name},
                {label: 'Формат встречи:', value: this.meetingFormat},
                {label: 'Адрес:', value: this.getAddressMeetCreate},
                // комментарий показываем только если step === 1
                this.getShowModalCreate.step === 1 && this.getCommentMeetCreate
                    ? {label: 'Комментарий:', value: this.getCommentMeetCreate}
                    : null
            ].filter(Boolean); // убираем null
        }
    },
    methods: {
        ...mapActions({
            toggleModalShowModalCreate: 'meetCreateCardModule/toggleModalShowModalCreate',
            createMeet: 'meetCreateCardModule/createMeet',
            closeModalAndCard: 'meetCreateCardModule/closeModalAndCard',
        }),
        ...mapMutations({
            setCommentMeetCreate: 'meetCreateCardModule/setCommentMeetCreate'
        }),
        handleWrapperClick(event) {
            // Если загрузка идёт, не закрываем модалку
            if (this.getModalCreateLoader) {
                return;
            }
            if (this.getShowModalCreate.step === 0) {
                this.toggleModalShowModalCreate({ show: false, doer: {}, tabType: null });
            } else if (this.getShowModalCreate.step === 1) {
                this.closeModalAndCard();
            }
        },
        handleAttributeUpdate(attributeName, value, key) {
            console.log('attributeName, value, key', attributeName, value, key)
            // Проверяем существование attributes
            this.setCommentMeetCreate(value);
        }
    }
}
</script>

<style scoped lang="scss">
.vue-modal-dp {
  &__wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2050;
    color: $dark;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: $modal-backdrop-bg;
      backdrop-filter: blur(12px);
      opacity: 0.75;
      z-index: 0;
    }

    .wrp-dp-modal {
      display: flex;
      width: 590px;
      flex-direction: column;
      align-items: flex-start;
      flex-shrink: 0;
      border-radius: 15px;
      border: 1px solid $stroke;
      background: $white;
      z-index: 2051;

      .modal-dp-create-ui__title-wrp {
        flex-direction: row;
        align-items: center;
        gap: 16px;
      }
    }
  }
}

.meet-create-modal {
  &__list {
    color: $dark;

    span {
      font-weight: 600;
    }
  }

  &__background {
    position: relative;
    //height: auto;
    //min-height: 264px;
    display: flex;
    justify-content: center;
    //flex-direction: column;
    width: 100%;
    align-items: center;
    //background: url(/img/tips_success.webp) no-repeat top center;
  }

  &__title {
    color: $dark;
    text-align: center;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    //margin: 175px 0px 0px 0px;
    //width: 44%;
  }
}

.modal-dp-ui {
  &__ico-wrp {
    width: 100%;
  }

  &__close {
    margin-left: auto;
    display: flex;
  }
}

//.meet-create-modal {
//  &__wrapper {
//    position: fixed;
//    inset: 0;
//    z-index: 20;
//    display: flex;
//    justify-content: center;
//    align-items: center;
//    background: rgba(30, 30, 30, 0.25);
//    color: $dark;
//
//    .wrp-dp-modal {
//      display: flex;
//      width: 800px;
//      flex-direction: column;
//      align-items: flex-start;
//      flex-shrink: 0;
//      border-radius: 15px;
//      border: 1px solid $stroke;
//      background: $white;
//
//      .modal-dp-ui__title-wrp {
//        flex-direction: row;
//        align-items: center;
//        gap: 16px;
//      }
//    }
//  }
//
//  &__time-tab {
//    display: flex;
//    height: 28px;
//    padding: 4px 12px;
//    justify-content: center;
//    align-items: center;
//    gap: 4px;
//    border-radius: 57px;
//    border: 1px solid $blue-crm;
//    background: $blue4;
//    color: $blue-crm;
//    font-size: 13px;
//    font-style: normal;
//    font-weight: 500;
//    line-height: 20px;
//  }
//}

//.office-info-modal {
//  display: flex;
//  flex-direction: column;
//  gap: 16px;
//
//  &__name {
//    border-radius: 12px;
//    background: $body-color;
//    display: flex;
//    padding: 12px;
//    flex-direction: column;
//    align-items: flex-start;
//    gap: 6px;
//    align-self: stretch;
//  }
//  &__top-text {
//    color: $grey-placeholder3;
//    font-size: 15px;
//    font-style: normal;
//    font-weight: 500;
//    line-height: 22px;
//  }
//  &__bottom-text {
//    color: $dark;
//    font-size: 15px;
//    font-style: normal;
//    font-weight: 500;
//    line-height: 22px;
//  }
//}
</style>