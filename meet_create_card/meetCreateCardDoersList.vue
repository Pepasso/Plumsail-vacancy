<template>
    <div class="meet-create-card__doers-list meet-create-doers">
<!--        <div class="meet-create-doers__title">-->
<!--            Рекомендуемые исполнители-->
<!--        </div>-->
        <div class="meet-create-doers__content">
            <div class="wrp-spinner text-center" v-if="!getShowDoersList">
                <div class="spinner-border spinner-border text-green" role="status">
                    <span class="sr-only">Загрузка...</span>
                </div>
            </div>

            <div
                    v-if="getShowDoersList && getMeetCreateDoers.length"
                    v-for="(doer, doerIndex) in getMeetCreateDoers"
                    class="meet-create-doers__list w-100"
                    :key="doer.id+'-'+doerIndex"
            >
                <div class="meet-create-doers__wrp">
                    <div class="meet-create-doers__info-doer">
                        <div class="meet-create-doers__left">
                            <img class="meet-create-doers__avatar" :src="doer?.photo" :alt="doer?.name">
                        </div>
                        <div class="meet-create-doers__right">
                            <div class="meet-create-doers__top">
                                <div class="meet-create-doers__name">
                                    {{ doer?.name }}
                                </div>
                                <div class="meet-create-doers__desc">
                                    {{ doer?.desc }}
                                </div>
                            </div>
                            <div class="meet-create-doers__bottom">
                                <div class="dpui-badge rating-badge">
                                    <i class="ico-star2021"></i>
                                    {{ doer?.rating }}
                                </div>
                                <div class="dpui-badge karma-badge">
                                    <i class="ico-heart"></i>
                                    {{ doer?.karma }}
                                </div>
                                <div class="dpui-badge reviews-badge">
                                    {{ declineWord(doer?.reviews, ['отзыв', 'отзыва', 'отзывов']) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="meet-create-doers__slots">
                        <meetCreateCardOneDoerSlots :doer="doer"/>
                    </div>
                </div>
            </div>

            <meetCreateCardEmptyDoerList
                    v-else-if="getShowDoersList"
                    key="empty">
            </meetCreateCardEmptyDoerList>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import {declineWord} from "../../utils/declineWord";
import {formatNumber} from "../../utils/formatNumber";
import meetCreateCardOneDoerSlots from "./meetCreateCardOneDoerSlots";
import meetCreateCardEmptyDoerList from "./meetCreateCardEmptyDoerList";

export default {
    name: "meetCreateCardDoersList",
    components: {
        meetCreateCardOneDoerSlots,
        meetCreateCardEmptyDoerList
    },
    computed: {
        ...mapGetters({
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            getShowDoersList: "meetCreateCardModule/getShowDoersList",
            getMeetCreateDoers: "meetCreateCardModule/getMeetCreateDoers",
        }),
    },
    methods: {
        formatNumber,
        declineWord,
    },
}
</script>

<style scoped lang="scss">
.meet-create-doers {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  &__content {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    .wrp-spinner {
      align-self: center;
    }
  }

  &__wrp {
    border-radius: 14px;
    border: 0px solid $stroke-menu;
    background: $body-color;
    display: flex;
    padding: 22px;
    flex-direction: column;
    gap: 28px;
    align-self: stretch;
    align-items: flex-start;
  }

  &__info-doer {
    display: flex;
    gap: 18px;
  }

  &__name {
    color: $dark;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }

  &__desc {
    color: $dark;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }

  &__title {
    color: $dark;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
  }

  &__avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    content-visibility: auto;
    flex: 0 0 72px;
    overflow: hidden;
  }

  &__left {
    display: flex;
    max-width: 72px;
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__bottom {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__slots {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
  }
}
</style>