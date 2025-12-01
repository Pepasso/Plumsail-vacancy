<template>
    <div
            class="meet-create-doers__empty w-100"
    >
        <i class="ico-info"></i>
        <div class="meet-create-doers__empty-wrp">
            <div class="meet-create-doers__empty-text">
                Нет подходящих исполнителей
            </div>
            <div class="meet-create-doers__empty-note">
                Уточните параметры поиска, чтобы найти подходящего специалиста
            </div>
        </div>
    </div>
</template>

<script>
export default {
name: "meetCreateCardEmptyDoerList"
}
</script>

<style scoped lang="scss">
.meet-create-doers {
  &__empty {
    margin-top: 108px;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    .ico-info {
      font-size: 71.6px;
      color: $red2;
      display: flex;
    }
  }
  &__empty-wrp {
    display: flex;
    flex-direction: column;
  }
  &__empty-text {
    color: $dark;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
  }
  &__empty-note {
    align-self: stretch;
    color: $gray3;
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
}
</style>