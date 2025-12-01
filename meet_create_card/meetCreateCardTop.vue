<template>
    <div class="meet-create-card__top meet-create-top">
        <div class="meet-create-top__left">
            Поиск исполнителя
        </div>
        <div class="meet-create-top__right">
            <div class="meet-create-top__client-location">
                Локация клиента:
                <span @click="showDropdownWithCoord($event,{show: true})">
                    {{ getMeetCreateFilter?.client?.location_prompt }}
                </span>
            </div>
            <div class="meet-create-top__operation dp-tooltip" title="Закрыть карточку" @click="handleCloseClick">
                <i class="ico-close"></i>
            </div>
            <OnClickOutside
                    v-if="getShowChangeCity.show"
                    class="meet-create-top__change-city change-city-meet"
                    @trigger="handleOutsideClick"
                    :style="{ position: 'fixed', right: getShowChangeCity.x + 'px', top: getShowChangeCity.y + 'px', zIndex: 10 }"
            >
                <meetCreateCardChangeCity></meetCreateCardChangeCity>
            </OnClickOutside>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import meetCreateCardChangeCity from "./meetCreateCardChangeCity";
import {OnClickOutside} from '@vueuse/components';

export default {
    name: "meetCreateCardTop",
    components: {
        meetCreateCardChangeCity,
        OnClickOutside
    },
    computed: {
        ...mapGetters({
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            getShowChangeCity: "meetCreateCardModule/getShowChangeCity",
            getCreateFromMeet: "meetCreateCardModule/getCreateFromMeet",
        }),
    },
    methods: {
        ...mapActions({
            toggleShowChangeCity: "meetCreateCardModule/toggleShowChangeCity"
        }),
        handleCloseClick() {
            VueCardManager.closeCard('meet_create_card');
        },
        showDropdownWithCoord(event, payload) {
            if (this.getCreateFromMeet.isCreate) return;
            const triggerElement = event.currentTarget;
            const triggerRect = triggerElement.getBoundingClientRect();
            // const width = triggerRect.width;
            console.log('triggerRect', triggerRect)
            console.log('triggerRect', window.scrollX)
            const coords = {
                x: Math.abs((triggerRect.left - window.innerWidth) / 2) - 60,
                y: (triggerRect.top) + 29
            };
            this.toggleShowChangeCity({...payload, coords});
        },
        handleOutsideClick(event) {
            // Проверяем, клик был ли вне .test-change-city И вне .meet-create-top__client-location
            const isInsideClientLocation = event.target.closest('.meet-create-top__client-location');
            const isInsideTestChangeCity = event.target.closest('.change-city-meet');

            if (!isInsideTestChangeCity && !isInsideClientLocation) {
                this.toggleShowChangeCity({show: false, coords: {x: null, y: null}});
            }
        }
    },
    mounted() {
        $('.dp-tooltip').tooltip();
    },
    unmounted() {
        $('.dp-tooltip').tooltip('hide');
    }
}
</script>

<style scoped lang="scss">
.meet-create-top {
  display: flex;
  height: 60px;
  padding: 12px 24px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  border-bottom: 1px solid $stroke;
  background: #FFF;

  &__change-city {
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-radius: 5px;
    border: 1px solid $stroke;
    background: $white;
  }

  &__left {
    color: $dark;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
  }

  &__client-location {
    color: $dark;
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;

    span {
      color: $blue-crm;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-decoration-line: underline;
      text-decoration-style: solid;
      text-decoration-skip-ink: none;
      text-decoration-thickness: auto;
      text-underline-offset: auto;
      text-underline-position: from-font;
    }
  }

  &__operation {
    line-height: 20px;
    text-align: center;
    color: $gray3;
    cursor: pointer;
    border: none;
    background-color: transparent;
    font-size: 20px;

    i {
      display: flex;
    }

    &:hover {
      color: $stroke-green !important;
    }
  }
}
</style>