<template>
    <div v-if="getShowChangeCity.step === 0" class="change-city-meet__top" v-html="getTopClientText"></div>
    <div v-if="getShowChangeCity.step === 1" class="change-city-meet__top with-gap">
        <i @click="toggleShowChangeCity({show: false, coords: {x: null, y: null}})" class="ico-arrow-l"></i>
        <span>Выберите локацию</span>
    </div>
    <div v-if="getShowChangeCity.step === 0" class="change-city-meet__bottom">
        <button
                class="btndp btndp-36 btndp-primary cancel-change-meet-city"
                @click="toggleShowChangeCity({show: false, coords: {x: null, y: null}})"
        >
            Да
        </button>
        <div
                class="change-city-meet__go-to-change"
                @click="setChangeCityStep(1)"
        >
            Выбрать другой
        </div>
    </div>
    <div v-if="getShowChangeCity.step === 1" class="change-city-meet__bottom dpinputs-38 dpinputs-observer">
        <div class="dpinputs__input-wrapper w-100 autocomplete-wrapper">
            <input
                    type="text"
                    v-model="changeCityInput"
                    placeholder="Страна или город"
                    autocomplete="off"
                    @input="changeCityMeetCreate({cityName: changeCityInput})"
                    class="w-100 mb-3"
            >

            <!-- Список подсказок -->
            <OnClickOutside
                    v-if="getShowSuggestions && getSuggestions.length" class="change-city-meet__autocomplete-list"
                    @trigger="closeAutocomplete"
            >
                <SimpleBar class="change-city-meet__scroll">
                    <div
                            v-for="suggestion in getSuggestions"
                            :key="suggestion.data"
                            @click="changeCity(suggestion.value)"
                            class="change-city-meet__autocomplete-item"
                    >
                        {{ suggestion.value }}
                    </div>
                </SimpleBar>
            </OnClickOutside>

            <div class="change-city-meet__btn-wrp">
                <transition name="fade">
                    <button
                            v-if="changeCityInput.length"
                            :class="['btndp btndp-36 btndp-primary', {'loading': getChangeCityLoading}]"
                            @click="sendCityToChange({city: changeCityInput})"
                    >
                        <span>Подтвердить</span>
                        <span class="spinner-border"></span>
                    </button>
                </transition>
                <button
                        class="btndp btndp-36 btndp-outlined-sec"
                        @click="toggleShowChangeCity({show: false, coords: {x: null, y: null}})"
                >
                    Оставить прежнюю локацию
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {OnClickOutside} from '@vueuse/components';
import SimpleBar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

export default {
    data() {
        return {
            changeCityInput: ''
        };
    },
    name: "meetCreateCardChangeCity",
    components: {
        OnClickOutside,
        SimpleBar
    },
    // data() {
    //     return {
    //         cityName: '',
    //     };
    // },
    // watch: {
    //     cityName(newVal) {
    //         this.$emit('update:city', newVal);
    //     }
    // },
    computed: {
        ...mapGetters({
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            getShowMeetCreateCard: 'meetCreateCardModule/getShowMeetCreateCard',
            getShowChangeCity: "meetCreateCardModule/getShowChangeCity",
            getSuggestions: "meetCreateCardModule/getSuggestions",
            getShowSuggestions: "meetCreateCardModule/getShowSuggestions",
            getChangeCityToCity: "meetCreateCardModule/getChangeCityToCity",
            getChangeCityLoading: "meetCreateCardModule/getChangeCityLoading",
        }),
        getTopClientText() {
            const cityName = this.getMeetCreateFilter?.client?.city_name || '';
            return `Локация клиента <span>${cityName}</span>?`;
        }
    },
    methods: {
        ...mapActions({
            toggleShowChangeCity: "meetCreateCardModule/toggleShowChangeCity",
            changeCityMeetCreate: "meetCreateCardModule/changeCityMeetCreate",
            sendCityToChange: "meetCreateCardModule/sendCityToChange",
            closeAutocomplete: "meetCreateCardModule/closeAutocomplete",
        }),
        ...mapMutations({
            setChangeCityStep: "meetCreateCardModule/setChangeCityStep",

        }),
        changeCity(selectedCity) {
            // Обновляем локальное значение инпута
            this.changeCityInput = selectedCity;
            this.closeAutocomplete();
        },
    }
}
</script>

<style scoped lang="scss">
.change-city-meet {

  &__scroll {
    max-height: 450px;
  }

  &__top {
    color: $dark;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;

    &.with-gap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    span {
      color: $dark;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
    }

    i {
      font-size: 24px;
      display: flex;
      color: $gray3;
      cursor: pointer;
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 8px;

    .cancel-change-meet-city {
      max-width: 90px;
      min-width: 90px;
    }
  }

  &__go-to-change {
    color: $blue-gray;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    cursor: pointer;
    height: 36px;
    padding: 8px 16px;
  }

  &__btn-wrp {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;

    .btndp {
      width: 100%;
    }
  }

  &__autocomplete-list {
    position: absolute;
    top: 30%;
    background: $white;
    width: 100%;
    border-radius: 5px;
    border: 1px solid $stroke;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.05);
    padding: 8px 16px 8px 8px !important;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }

  &__autocomplete-item {
    padding: 4px 8px;
    cursor: pointer;
    gap: 8px;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    &:hover {
      border-radius: 10px;
      background: $stroke-menu;
    }
  }
}

.autocomplete-wrapper {
  position: relative;
}

/* Плавное появление/исчезновение стрелок */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>