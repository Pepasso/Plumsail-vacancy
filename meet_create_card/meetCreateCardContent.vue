<template>
    <SimpleBar class="meet-create-card__scroll">
        <div class="meet-create-card__main-content">
            <meetCreateCardFilter v-if="!getCreateFromMeet.isCreate"/>
            <meetCreateCardDoersList/>
        </div>
    </SimpleBar>
</template>

<script>
import meetCreateCardFilter from "./meetCreateCardFilter";
import meetCreateCardDoersList from "./meetCreateCardDoersList";
import SimpleBar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import {mapGetters} from "vuex";

export default {
    name: "meetCreateCardContent",
    components: {
        meetCreateCardFilter,
        meetCreateCardDoersList,
        SimpleBar
    },
    computed: {
        ...mapGetters({
            getCreateFromMeet: "meetCreateCardModule/getCreateFromMeet",
        }),
    }
}
</script>

<style scoped lang="scss">
.meet-create-card {
  &__main-content {
    display: flex;
    padding: 24px 0px 16px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    flex: 1 0 0;
    align-self: stretch;
  }
}

.meet-create-card__scroll {
  max-height: 90vh;
  scroll-behavior: smooth;
  min-height: 70px;
  padding: 0px 24px 0px 0px;
  width: 100%;
  //margin-bottom: 40px;
}
</style>