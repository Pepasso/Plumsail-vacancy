<template>
    <div class="meet-create-doers__one-slots doer-one-slots dpinputs-46 dpinputs-observer" :ref="`doerAboutContainer_${doer.id}`">
        <div v-if="!errorDoerSlot(doer.id)" class="dp-tabs-underline tabs-underline-size-s tabs-underline-color-blue">
            <div
                    v-for="tab in tabs"
                    :key="tab.type"
                    class="dp-tabs-underline__wrp"
                    :class="{ 'active-tab': currentTab === tab.type }"
                    @click="switchTab(tab.type)"
            >
                {{ tab.label }}
            </div>
        </div>
        <div class="wrp-spinner text-center" v-if="!isSlotsVisible(doer.id)">
            <div class="spinner-border spinner-border text-green" role="status">
                <span class="sr-only">Загрузка...</span>
            </div>
        </div>
        <div v-if="isSlotsVisible(doer.id) && !isDoerAboutShow(doer.id) && !errorDoerSlot(doer.id)" class="doer-one-slots__wrp">
            <div v-if="currentTab === 'offline' || doer?.type_id === 2" class="doer-one-slots__offices dpinputs-38 dpinputs-observer">
                <meetCreateCardOneDoerOffices
                        :data="{
                                    doerId: doer?.id,
                                    type_id: doer?.type_id,
                                    tab: currentTab,
                                    updateSlots: true
                                }"
                ></meetCreateCardOneDoerOffices>
            </div>
            <div class="doer-one-slots__cur-date">
                {{ currentMonthYear }}
            </div>
            <div class="time-slots__calendar-container">
                <!-- Стрелка влево с плавным переходом -->
                <transition name="fade">
                    <div
                            v-if="canScrollLeft"
                            class="calendar-arrow left"
                            @click="scrollCalendar(-1)"
                    >
                        <i class="ico-chevron-left"></i>
                    </div>
                </transition>

                <!-- Календарь с анимацией смены -->
                <transition name="slide-slots" mode="out-in">
                    <div :key="calendarOffset" class="time-slots__calendar">
                        <div
                                v-for="(doerCalendar, doerCalendarIndex) in visibleCalendar"
                                :key="doerCalendarIndex"
                                :class="[
                                    'time-slots__day-wrp',
                                    {
                                        'active-slot': isActiveDateSlot(doer.id, calendarOffset + doerCalendarIndex),
                                        'disabled-slot': !doerCalendar?.working
                                    }
                                ]"
                                @click="setActiveDateSlot({
                                    doerId: doer?.id,
                                    type_id: doer?.type_id,
                                    tab: currentTab,
                                    date: doerCalendar?.date,
                                    office_id: oneDoerSlots(doer?.id).office_id,
                                    index: calendarOffset + doerCalendarIndex,
                                    isWorking: doerCalendar?.working,
                                    updateSlots: true
                                })"
                        >
                            <div class="time-slots__day">
                                {{ doerCalendar.day }}
                            </div>
                            <div class="time-slots__day-week">
                                {{ doerCalendar.day_name }}
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Стрелка вправо с плавным переходом -->
                <transition name="fade">
                    <div
                            v-if="canScrollRight"
                            class="calendar-arrow right"
                            @click="scrollCalendar(1)"
                    >
                        <i class="ico-chevron-right"></i>
                    </div>
                </transition>
            </div>
            <div class="doer-one-slots__time-slots-wrp time-slots">
                <div class="wrp-spinner text-center" v-if="!isOneDaySlotsVisible(doer.id)">
                    <div class="spinner-border spinner-border text-green" role="status">
                        <span class="sr-only">Загрузка...</span>
                    </div>
                </div>

                <!-- Сообщение, если слоты есть, но пустые -->
                <div v-else-if="isOneDaySlotsVisible(doer.id) && (!visibleSlots || visibleSlots.length === 0)" class="time-slots__no-slots">
                    Нет слотов в офисе на выбранную дату
                </div>

                <!-- Основные слоты -->
                <div
                        v-if="isOneDaySlotsVisible(doer.id) && visibleSlots && visibleSlots.length"
                        v-for="(oneSlot, oneSlotIndex) in visibleSlots"
                        :key="oneSlotIndex"
                        :class="['time-slots__item', {'active-slot': activeDoerSlot(doer.id) === oneSlotIndex}]"
                        @click="setActiveDoerSlot({doerId: doer.id, index: oneSlotIndex})"
                >
                    {{ oneSlot.time_text }}
                </div>

                <!-- Дополнительные слоты -->
                <transition
                        name="slide"
                        @enter="onEnter"
                        @leave="onLeave"
                        @after-leave="onAfterLeave"
                        mode="out-in"
                >
                    <div
                            v-if="isExpanded(doer.id) && additionalSlots && additionalSlots.length"
                            ref="additionalSlots"
                            class="time-slots__additional"
                    >
                        <div
                                v-for="(oneSlot, oneSlotIndex) in additionalSlots"
                                :key="'additional-' + oneSlotIndex"
                                :class="['time-slots__item', {'active-slot': activeDoerSlot(doer.id) === (oneSlotIndex + (visibleSlots?.length || 0))}]"
                                @click="setActiveDoerSlot({doerId: doer.id, index: oneSlotIndex + (visibleSlots?.length || 0)})"
                        >
                            {{ oneSlot.time_text }}
                        </div>
                    </div>
                </transition>

                <!-- Кнопка раскрытия дополнительных слотов -->
                <div
                        v-if="hasMoreSlots && isOneDaySlotsVisible(doer.id) && visibleSlots && visibleSlots.length"
                        @click="toggleExpandedSlots(doer.id)"
                        class="time-slots__toggle"
                >
                    <i :class="[isExpanded(doer.id) ? 'ico-chevron-up' : 'ico-chevron-down']"></i>
                </div>
            </div>
            <div class="doer-one-slots__schedule-timezone">
                Расписание показано по времени клиента: {{ getMeetCreateFilter?.client?.location_prompt }}
            </div>
        </div>
        <div v-if="errorDoerSlot(doer.id)" class="doer-one-slots__error">
            <i class="ico-info-2021"></i>
            <span>{{ errorDoerSlot(doer.id) }}</span>
        </div>
        <div
                v-show="isSlotsVisible(doer.id) && isDoerAboutShow(doer.id)"
                class="doer-one-slots__about"
        >
            <div
                    :class="['doer-one-slots__about-text', {'ellipsis': isNeedTruncated(doer.id) && !isDoerAboutExpanded(doer.id)}]"
            >
                {{ doer?.about }}
            </div>

            <!-- Кнопка только если текст обрезан -->
            <div
                    v-if="isNeedTruncated(doer.id)"
                    class="doer-one-slots__toggle-btn"
                    @click="toggleDoerExpandedAbout({doerId: doer.id, value: !isDoerAboutExpanded(doer.id) })"
            >
                {{ isDoerAboutExpanded(doer.id) ? 'Скрыть' : 'Читать больше...' }}
            </div>
        </div>
        <transition name="fade">
            <meetCreateCardTextarea
                    v-if="buttonSetSlots(doer.id)"
                    :input-type="'comment_meet'+(doer.id)"
                    :models="uniqueCommentMeetCreate(doer.id)"
                    :class="['full-width']"
                    @update:input-type="handleAttributeUpdate"
            ></meetCreateCardTextarea>
        </transition>
        <transition name="fade">
            <button
                    v-if="buttonSetSlots(doer.id)"
                    :class="['btndp btndp-46 btndp-optional w-100', {'loading': uniqueDoerCreateLoader(doer.id)}]"
                    :disabled="isAnyDoerLoading"
                    @click="createMeet({doer: doer, tabType: currentTab})"
            >
                <span class="name-btn">{{ buttonSetSlots(doer.id) }}</span>
                <span class="spinner-border"></span>
            </button>
        </transition>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {estimateIfTruncated} from "../../utils/estimateIfTruncated"
import meetCreateCardOneDoerOffices from "./meetCreateCardOneDoerOffices";
import meetCreateCardTextarea from "./meetCreateCardTextarea";

export default {
    name: "meetCreateCardOneDoerSlots",
    components: {
        meetCreateCardOneDoerOffices,
        meetCreateCardTextarea
    },
    data() {
        return {
            isFirstLoad: true,
            calendarOffset: 0, // текущее смещение календаря
            visibleDaysCount: 11 // сколько дней показывать
        };
    },
    props: ['doer'],
    computed: {
        ...mapGetters({
            getShowDoerSlots: "meetCreateCardModule/getShowDoerSlots",
            getOneDoerSlots: "meetCreateCardModule/getOneDoerSlots",
            getActiveDoerTab: "meetCreateCardModule/getActiveDoerTab",
            getMeetCreateFilter: "meetCreateCardModule/getMeetCreateFilter",
            isSlotsExpanded: "meetCreateCardModule/isSlotsExpanded",
            getShowDoerAbout: "meetCreateCardModule/getShowDoerAbout",
            getNeedTruncated: "meetCreateCardModule/getNeedTruncated",
            getExpandedDoerAbout: "meetCreateCardModule/getExpandedDoerAbout",
            getActiveDoerDateSlot: "meetCreateCardModule/getActiveDoerDateSlot",
            getActiveDoerSlot: "meetCreateCardModule/getActiveDoerSlot",
            getShowOneDayDoerSlots: "meetCreateCardModule/getShowOneDayDoerSlots",
            getShowDoerSlotsError: "meetCreateCardModule/getShowDoerSlotsError",
            getOfficeType: "meetCreateCardModule/getOfficeType",
            getButtonSetSlots: "meetCreateCardModule/getButtonSetSlots",
            getCurrentFilter: "meetCreateCardModule/getCurrentFilter",
            getShowModalCreate: "meetCreateCardModule/getShowModalCreate",
            getCommentMeetCreate: "meetCreateCardModule/getCommentMeetCreate",
            getUniqueCommentMeetCreate: "meetCreateCardModule/getUniqueCommentMeetCreate",
            getDoerCreateLoader: "meetCreateCardModule/getDoerCreateLoader",
            getAllDoerCreateLoader: "meetCreateCardModule/getAllDoerCreateLoader",
        }),
        hasMoreSlots() {
            return this.oneDoerSlots(this.doer.id)?.slots.length > 8;
        },
        visibleSlots() {
            return this.oneDoerSlots(this.doer.id)?.slots.slice(0, 8);
        },
        additionalSlots() {
            return this.oneDoerSlots(this.doer.id)?.slots.slice(8);
        },
        isExpanded() {
            return (doerId) => this.isSlotsExpanded(doerId);
        },
        isSlotsVisible() {
            return (doerId) => this.getShowDoerSlots(doerId);
        },
        isOneDaySlotsVisible() {
            return (doerId) => this.getShowOneDayDoerSlots(doerId);
        },
        isDoerAboutShow() {
            return (doerId) => this.getShowDoerAbout(doerId)
        },
        oneDoerSlots() {
            return (doerId) => this.getOneDoerSlots(doerId, this.currentTab);
        },
        isDoerAboutExpanded() {
            return (doerId) => this.getExpandedDoerAbout(doerId)
        },
        isNeedTruncated() {
            return (doerId) => this.getNeedTruncated(doerId)
        },
        currentTab() {
            return this.getActiveDoerTab(this.doer.id) || this.tabs[0]?.type || null;
        },
        activeDoerDateSlot() {
            return (doerId) => this.getActiveDoerDateSlot(doerId)
        },
        activeDoerSlot() {
            return (doerId) => this.getActiveDoerSlot(doerId)
        },
        errorDoerSlot() {
            return (doerId) => this.getShowDoerSlotsError(doerId)
        },
        uniqueCommentMeetCreate() {
            return (doerId) => this.getUniqueCommentMeetCreate(doerId)
        },
        uniqueDoerCreateLoader() {
            return (doerId) => this.getDoerCreateLoader(doerId)
        },
        isAnyDoerLoading() {
            const loaders = this.getAllDoerCreateLoader || {};
            return Object.values(loaders).some(value => value === true);
        },
        currentMonthYear() {
            const activeIndex = this.activeDoerDateSlot(this.doer.id);
            if (activeIndex === undefined) return '';

            const calendar = this.oneDoerSlots(this.doer.id)?.calendar || [];
            const activeDay = calendar[activeIndex];
            if (!activeDay) return '';

            console.log('activeDay', activeDay)

            return `${activeDay.month} ${activeDay.year}`;
        },
        buttonSetSlots() {
            // const activeIndex = this.activeDoerDateSlot(this.doer.id);
            // const activeSlotIndex = this.activeDoerSlot(this.doer.id);
            // if (activeIndex === undefined) return '';
            // if (activeSlotIndex === undefined) return '';
            //
            // const calendar = this.oneDoerSlots(this.doer.id)?.calendar || [];
            // const activeDay = calendar[activeIndex];
            // if (!activeDay) return '';
            //
            // const slots = this.oneDoerSlots(this.doer.id)?.slots || [];
            // const activeSlot = slots[activeSlotIndex];
            //
            // if (!activeSlot) return '';
            // console.log('activeDay', activeDay)
            // console.log('activeSlot', activeSlot)
            //
            // return `Создать встречу онлайн на ${activeDay?.date}; ${activeSlot?.time_text}`;
            return (doerId) => this.getButtonSetSlots(doerId, this.currentTab);
        },
        // Извлекаем доступные табы из slots_urls
        tabs() {
            const slotsUrls = this.doer?.slots_urls || {};
            const availableTabs = [];


            // Проверяем наличие онлайн и оффлайн табов
            if (slotsUrls.online && this.getCurrentFilter.office_type !== 2) {
                availableTabs.push({type: 'online', label: 'Слоты онлайн', url: slotsUrls.online});
            }
            if (slotsUrls.offline && this.getCurrentFilter.office_type !== 1) {
                availableTabs.push({type: 'offline', label: 'Слоты в офисе', url: slotsUrls.offline});
            }
            if (this.doer?.about) {
                availableTabs.push({type: 'about', label: 'Об исполнителе'})
            }

            return availableTabs;
        },
        visibleCalendar() {
            const calendar = this.oneDoerSlots(this.doer.id)?.calendar || [];
            return calendar.slice(this.calendarOffset, this.calendarOffset + this.visibleDaysCount);
        },
        canScrollLeft() {
            return this.calendarOffset > 0;
        },
        canScrollRight() {
            const calendar = this.oneDoerSlots(this.doer.id)?.calendar || [];
            return this.calendarOffset + this.visibleDaysCount < calendar.length;
        }
    },
    methods: {
        ...mapActions({
            fetchOneDoerSlots: 'meetCreateCardModule/fetchOneDoerSlots',
            toggleShowDoerAbout: 'meetCreateCardModule/toggleShowDoerAbout',
            isLongText: 'meetCreateCardModule/isLongText',
            toggleDoerExpandedAbout: 'meetCreateCardModule/toggleDoerExpandedAbout',
            setActiveDateSlot: 'meetCreateCardModule/setActiveDateSlot',
            toggleModalShowModalCreate: 'meetCreateCardModule/toggleModalShowModalCreate',
            createMeet: 'meetCreateCardModule/createMeet',
        }),
        ...mapMutations({
            toggleExpandedSlots: 'meetCreateCardModule/toggleExpandedSlots',
            setNeedTruncated: 'meetCreateCardModule/setNeedTruncated',
            setActiveDoerSlot: 'meetCreateCardModule/setActiveDoerSlot',
            setUniqueCommentMeetCreate: 'meetCreateCardModule/setUniqueCommentMeetCreate',
        }),
        scrollCalendar(direction) {
            console.log('scrollCalendar вызван с direction =', direction);
            console.log('Текущий offset:', this.calendarOffset);

            const calendar = this.oneDoerSlots(this.doer.id)?.calendar || [];
            const totalDays = calendar.length;

            const newOffset = this.calendarOffset + direction * this.visibleDaysCount;

            console.log('Новый offset:', newOffset);
            console.log('Всего дней:', totalDays);

            if (newOffset >= 0 && newOffset < totalDays) {
                this.calendarOffset = newOffset;
                console.log('offset обновлён:', this.calendarOffset);
            } else {
                console.warn('Нельзя листать дальше');
            }
        },
        switchTab(tab) {
            if (!this.isFirstLoad && this.currentTab === tab) {
                return;
            }

            // this.currentTab = tab;

            if (tab === 'about') {
                this.toggleDoerExpandedAbout({doerId: this.doer.id, value: false})
                this.toggleShowDoerAbout({doerId: this.doer.id, tab});

                const text = this.doer.about;


                if (!text) {
                    this.setNeedTruncated({doerId: this.doer.id, value: false});
                    return;
                }

                const container = document.querySelector('.doer-one-slots__about-text');
                const style = window.getComputedStyle(container);
                const lineHeight = parseInt(style.lineHeight, 10); // например: "20px" → 20
                const fontSize = parseInt(style.fontSize, 10); // например: "20px" → 20
                const containerWidth = container.clientWidth;

                const {truncatedByLines, truncatedByHeight} = estimateIfTruncated(text.trim(), {
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    containerWidth: containerWidth ? containerWidth : 588,
                    maxLines: 6,
                    maxHeight: 120
                });
                const isTruncated = truncatedByLines || truncatedByHeight;
                console.log('isTruncated', isTruncated)
                this.setNeedTruncated({doerId: this.doer.id, value: isTruncated});
            } else {
                this.fetchOneDoerSlots({
                    doerId: this.doer.id,
                    // url: this.tabs.find(oneTab => oneTab.type === tab).url,
                    type_id: this.doer.type_id,
                    offices: this.doer.type_id === 2 ? 1 : 0,
                    calendar: 1,
                    tab
                });
            }

            this.isFirstLoad = false;
        },
        estimateIfTruncated,
        onEnter(el) {
            // Устанавливаем начальную высоту в 0
            el.style.maxHeight = '0';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';

            // Получаем реальную высоту содержимого
            const height = el.scrollHeight + 'px';

            // Принудительно перерисовываем
            el.offsetHeight;

            // Анимируем к реальной высоте
            el.style.maxHeight = height;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';

            // Сохраняем высоту для CSS переменной
            el.style.setProperty('--slide-height', height);
        },
        onLeave(el) {
            // Устанавливаем начальную высоту
            el.style.maxHeight = el.scrollHeight + 'px';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';

            // Принудительно перерисовываем
            el.offsetHeight;

            // Анимируем к 0
            el.style.maxHeight = '0';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
        },
        onAfterLeave(el) {
            // Очищаем стили после завершения анимации
            el.style.maxHeight = '';
            el.style.opacity = '';
            el.style.transform = '';
            el.style.removeProperty('--slide-height');
        },
        isActiveDateSlot(doerId, index) {
            const activeIndex = this.activeDoerDateSlot(doerId);

            // Если уже есть активный слот — проверяем
            if (activeIndex !== undefined) {
                return activeIndex === index;
            }

            // Ищем первый доступный день
            const calendar = this.oneDoerSlots(doerId)?.calendar || [];
            const firstActiveIndex = calendar.findIndex(day => day?.working);

            // Если нашли — делаем его активным
            if (firstActiveIndex !== -1) {
                this.setActiveDateSlot({doerId, index: firstActiveIndex, isWorking: true});
                return firstActiveIndex === index;
            }

            return false;
        },
        initIntersectionObserver() {
            const doer = this.doer;
            const element = this.$refs[`doerAboutContainer_${doer.id}`];

            if (!element) {
                console.warn(`Ref для doer ${doer.id} не найден`);
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleFirstVisible(doer);
                        observer.unobserve(entry.target); // больше не отслеживаем
                    }
                });
            }, {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.3 // 50% элемента в зоне видимости
            });

            observer.observe(element);
        },
        handleFirstVisible(doer) {
            const types = {
                1: 'online',
                2: 'offline'
            };
            const tab = types[this.getOfficeType] || this.tabs[0]?.type;

            console.log('payloadFeth', this.getOfficeType);

            this.fetchOneDoerSlots({
                doerId: doer.id,
                type_id: doer.type_id,
                calendar: 1,
                offices: doer.type_id === 2 ? 1 : 0,
                tab
            });
        },
        handleAttributeUpdate(attributeName, value, key) {
            console.log('attributeName, value, key', attributeName, value, key)
            // Проверяем существование attributes
            this.setUniqueCommentMeetCreate({doerId: this.doer.id, comment: value});
        },
    },
    mounted() {
        // this.fetchOneDoerSlots({doerId: this.doer.id, type_id: this.doer.type_id})
        // Устанавливаем первый таб по умолчанию
        // if (this.tabs.length > 0) {
        //     this.switchTab(this.tabs[0].type);
        // }
        this.initIntersectionObserver();
    }
}
</script>

<style scoped lang="scss">
.doer-one-slots {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__error {
    color: #EE505A;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      font-size: 20px;
      display: flex;
    }
  }

  .wrp-spinner {
    min-height: 176px;
  }

  &__offices {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__about-text {
    color: $dark;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    transition: max-height 0.3s ease-out;
    overflow: hidden;
    max-height: 1000px; /* или значение больше, чем возможная высота текста */

    &.ellipsis {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 120px;
      transition: max-height 0.3s ease-in;
    }
  }

  &__toggle-btn {
    color: $blue-crm;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
  }

  &__wrp {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__date {
    color: $dark;
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  }

  &__schedule-timezone {
    color: $dark;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
}

.time-slots {
  border-radius: 0px 10px 10px 10px;
  background: $blue-stroke;
  display: flex;
  padding: 12px;
  align-items: flex-start;
  align-content: flex-start;
  gap: 10px;
  align-self: stretch;
  flex-wrap: wrap;
  position: relative;
  transition: all 0.3s ease;

  .wrp-spinner {
    min-height: auto;
  }

  &__no-slots {
    color: #EE505A;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__calendar-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: -14px;

    .calendar-arrow {
      cursor: pointer;

      i {
        color: $dark;
        font-size: 16px;
        display: flex;
      }
    }
  }

  &__calendar {
    display: flex;
    width: 100%;
    gap: 2px;
  }

  &__day-wrp {
    border-radius: 8px 8px 0px 0px;
    display: flex;
    width: 50px;
    height: 48px;
    padding: 2px 0px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;

    &.active-slot, &:hover {
      background: $blue-stroke;
    }

    &.disabled-slot {
      cursor: not-allowed;

      .time-slots__day, .time-slots__day-week {
        color: #DBDEE1;
      }
    }
  }

  &__day {
    color: $dark;
    text-align: center;
    text-overflow: ellipsis;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  &__day-week {
    color: $dark;
    text-align: center;
    text-overflow: ellipsis;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__additional {
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    gap: 10px;
    align-self: stretch;
    flex-wrap: wrap;
    position: relative;
    will-change: height;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
  }

  &__toggle {
    position: absolute;
    right: 2%;
    border-radius: 8px;
    border: 1px solid $dark;
    background: rgba(255, 255, 255, 0.00);
    display: flex;
    width: 52px;
    height: 32px;
    padding: 14px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
  }

  &__item {
    border-radius: 8px;
    border: 1px solid $dark;
    background: $white;
    display: flex;
    width: 54px;
    height: 32px;
    padding: 14px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: $dark;
    text-align: center;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;

    &:hover, &.active-slot {
      border-radius: 8px;
      border: 1px solid $crm-blue2;
      background: $crm-blue2;
      color: $white;
    }
  }
}

.meet-create-doers {
  &__tabs {
    display: flex;
    align-items: center;
    gap: 20px;
    align-self: stretch;
    border-bottom: 2px solid $stroke-menu;
    padding-bottom: 8px;
  }

  &__tab {
    color: $dark;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    position: relative;
    cursor: pointer;

    &:hover {
      &:after {
        content: "";
        width: 100%;
        display: block;
        position: absolute;
        bottom: -8px;
        left: 0;
        border-bottom: 2px solid $crm-blue2;
      }
    }

    &.active-tab {
      &:after {
        content: "";
        width: 100%;
        display: block;
        position: absolute;
        bottom: -8px;
        left: 0;
        border-bottom: 2px solid $crm-blue2;
      }
    }
  }
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

/* Плавная смена календаря */
.slide-slots-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-slots-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-slots-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}


.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to {
  max-height: var(--slide-height, auto);
  opacity: 1;
  transform: translateY(0);
}

.slide-leave-from {
  max-height: var(--slide-height, auto);
  opacity: 1;
  transform: translateY(0);
}

.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>