<template>
    <div class="meet-create-card__wrp">
        <transition name="meet-create-card">
            <div class="wrp-content" v-if="getShowMeetCreateCard.show">
                <div class="wrp-spinner text-center" v-if="!getShowContent">
                    <div class="spinner-border spinner-border text-green" role="status">
                        <span class="sr-only">Загрузка...</span>
                    </div>
                </div>
                <meetCreateCardTop v-if="getShowContent"></meetCreateCardTop>
                <meetCreateCardContent v-if="getShowContent"></meetCreateCardContent>
            </div>
        </transition>
    </div>
    <meetCreateCardModalAboutOffice v-if="getShowModalAboutOffice"></meetCreateCardModalAboutOffice>
<!--    <meetCreateModalCreate v-if="getShowModalCreate.show"></meetCreateModalCreate>-->
</template>

<script>
import {mapGetters} from "vuex";
import meetCreateCardTop from "../../components/meet_create_card/meetCreateCardTop";
import meetCreateCardContent from "../../components/meet_create_card/meetCreateCardContent";
import meetCreateCardModalAboutOffice from "../../components/meet_create_card/meetCreateCardModalAboutOffice";
// import meetCreateModalCreate from "../../components/meet_create_card/meetCreateModalCreate";

export default {
    name: "meetCreateCardBlock",
    components: {
        meetCreateCardTop,
        meetCreateCardContent,
        meetCreateCardModalAboutOffice,
        // meetCreateModalCreate,
    },
    computed: {
        ...mapGetters({
            getShowMeetCreateCard: 'meetCreateCardModule/getShowMeetCreateCard',
            getShowContent: 'meetCreateCardModule/getShowContent',
            getShowModalAboutOffice: 'meetCreateCardModule/getShowModalAboutOffice',
            // getShowModalCreate: 'meetCreateCardModule/getShowModalCreate',
        }),
    },
}
</script>

<style scoped lang="scss">
.meet-create-card {
  &__wrp {
    width: auto;
    min-width: 100vw;
    height: 100%;
    display: flex;
    position: relative;
    right: 0;
    transition: all 0.3s ease;
  }
}

.wrp-content {
  width: 680px;
  min-height: 100%;
  background-color: $white;
  position: relative;
  @media (max-width: 750px) {
    width: 100vw;
  }
}

.wrp-spinner {
  z-index: 9999;
  height: 100vh;
  position: absolute;
  width: 100%;
  background-color: #FFF;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 1rem;
}

.meet-create-card-enter-active, .meet-create-card-leave-active {
  transition: all 1s ease;
}

.meet-create-card-enter-from {
  transform: translateX(710px);
  opacity: 0;
}

.meet-create-card-leave-to {
  transform: translateX(710px);
  opacity: 0;
}

.meet-create-card-enter-to, .meet-create-card-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>