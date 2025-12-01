import axios from "axios";
// import {delay} from "../../utils/promiseDelay";
import {switchLeadCardTab} from "../../utils/switchLeadCardTab";

const getInitialState = () => ({
    showMeetCreateCard: {
        show: false,
        lead_id: null,
        lead_card_key: null,
    },
    xhrCancel: null,
    showContent: false,
    meetCreateFilter: {
        client: null,
        doers: [],
        office_types: []
    },
    showFilterSelect: {
        show: false,
        index: null,
        x: null,
        y: null
    },
    showDoersList: false,
    meetCreateDoers: {},
    // Все вложенные поля тоже включаем
    showDoerSlots: {},
    activeDoerTab: {},
    oneDoerSlots: {},
    expandedSlots: {},
    showDoerAbout: {},
    needTruncated: {},
    expandedDoerAbout: {},
    activeDoerDateSlot: {},
    activeDoerSlot: {},
    showOneDayDoerSlots: {},
    showChangeCity: {
        show: false,
        x: null,
        y: null,
        step: 0
    },
    suggestions: [],
    showSuggestions: false,
    changeCityToCity: '',
    changeCityLoading: false,
    showOneDoerSlotOffices: {
        show: false,
        doerId: null,
        x: null,
        y: null
    },
    showModalAboutOffice: false,
    showModalCreate: {
        step: 0,
        show: false,
        doer: null,
        tabType: null
    },
    modalAboutOfficeData: {},
    showDoerSlotsError: {},
    filter: {
        doerId: null,
        doer_type_id: null,
        office_type: 3,
        dateRange: null
    },
    cleanedDoerId: null,
    addressMeetCreate: '',
    commentMeetCreate: '',
    modalCreateLoader: false,
    createFromMeet: false,
    currentFilter: {
        doerId: null,
        doer_type_id: null,
        office_type: 3,
        dateRange: null
    },
    uniqueCommentMeetCreate: {},
    doerCreateLoader: {}
});

export const meetCreateCardModule = {
    namespaced: true,

    state: getInitialState,

    getters: {
        getShowMeetCreateCard(state) {
            return state.showMeetCreateCard;
        },
        getXhrCancel(state) {
            return state.xhrCancel;
        },
        getShowContent(state) {
            return state.showContent;
        },
        getMeetCreateFilter(state) {
            return state.meetCreateFilter;
        },
        getShowFilterSelect(state) {
            return state.showFilterSelect;
        },
        getShowDoersList(state) {
            return state.showDoersList;
        },
        getMeetCreateDoers(state) {
            return state.meetCreateDoers;
        },
        getShowDoerSlots: (state) => (doerId) => {
            return Boolean(state.showDoerSlots[doerId]);
        },
        getShowOneDayDoerSlots: (state) => (doerId) => {
            return Boolean(state.showOneDayDoerSlots[doerId]);
        },
        getActiveDoerTab: (state) => (doerId) => {
            return state.activeDoerTab[doerId] || 'online'; // По умолчанию: 'office'
        },
        getOneDoerSlots: (state) => (doerId, tab) => {
            return state.oneDoerSlots?.[doerId]?.[tab] || null;
        },
        isSlotsExpanded: (state) => (doerId) => {
            return Boolean(state.expandedSlots[doerId]);
        },
        getShowDoerAbout: (state) => (doerId) => {
            return Boolean(state.showDoerAbout[doerId]);
        },
        getNeedTruncated: (state) => (doerId) => {
            return Boolean(state.needTruncated[doerId]);
        },
        getExpandedDoerAbout: (state) => (doerId) => {
            return Boolean(state.expandedDoerAbout[doerId])
        },
        getActiveDoerDateSlot: (state) => (doerId) => {
            return state.activeDoerDateSlot[doerId];
        },
        getActiveDoerSlot: (state) => (doerId) => {
            return state.activeDoerSlot[doerId];
        },
        getShowChangeCity(state) {
            return state.showChangeCity;
        },
        getSuggestions(state) {
            return state.suggestions;
        },
        getShowSuggestions(state) {
            return state.showSuggestions;
        },
        getChangeCityToCity(state) {
            return state.changeCityToCity;
        },
        getChangeCityLoading(state) {
            return state.changeCityLoading;
        },
        getShowOneDoerSlotOffices(state) {
            return state.showOneDoerSlotOffices;
        },
        getShowModalAboutOffice(state) {
            return state.showModalAboutOffice;
        },
        getShowModalCreate(state) {
            return state.showModalCreate;
        },
        getModalAboutOfficeData(state) {
            return state.modalAboutOfficeData;
        },
        getShowDoerSlotsError: (state) => (doerId) => {
            return state.showDoerSlotsError[doerId];
        },
        getFilterDoerId(state) {
            return state.filter.doerId;
        },
        getDoerTypeId(state) {
            return state.filter.doer_type_id;
        },
        getOfficeType(state) {
            return state.filter.office_type;
        },
        getFilterDateRange(state) {
            return state.filter.dateRange;
        },
        getCleanedDoerId(state) {
            return state.cleanedDoerId;
        },
        cleanDoerId: (state) => (doerId) => {
            if (!doerId) return doerId;
            const cleaned = doerId.toString().replace(/^(staff_|company_)/, '');
            return parseInt(cleaned, 10) || 0; // Возвращаем число или 0 если NaN
        },
        isFilterActive: (state) => {
            const isEqual = (obj1, obj2) => {
                return JSON.stringify(obj1) === JSON.stringify(obj2);
            };

            const filtersEqual = isEqual(state.filter, state.currentFilter);
            return !filtersEqual;
        },
        isDefaultFilter(state) {
            const defaultFilter = {
                doerId: null,
                doer_type_id: null,
                office_type: 3,
                dateRange: null
            };
            const filter = state.filter;

            // сравниваем поле к полю
            return filter.doerId === defaultFilter.doerId &&
                filter.doer_type_id === defaultFilter.doer_type_id &&
                filter.office_type === defaultFilter.office_type &&
                filter.dateRange === defaultFilter.dateRange;
        },
        getActiveCompany: (state) => (doerId, tab) => {
            const doer = state.oneDoerSlots?.[doerId]?.[tab];
            if (!doer || !doer.offices) return null;

            const { offices, office_id } = doer;
            return offices.find(office => parseInt(office.id) === parseInt(office_id)) || null;
        },
        getAddressMeetCreate(state) {
            return state.addressMeetCreate;
        },
        getActiveDaySlot: (state) => (doerId, tab) => {
            const activeIndex = state.activeDoerDateSlot[doerId];
            const activeSlotIndex = state.activeDoerSlot[doerId];

            if (activeIndex === undefined || activeSlotIndex === undefined) return null;

            const calendar = state.oneDoerSlots?.[doerId]?.[tab]?.calendar || [];
            const slots = state.oneDoerSlots?.[doerId]?.[tab]?.slots || [];

            const activeDay = calendar[activeIndex];
            const activeSlot = slots[activeSlotIndex];

            if (!activeDay || !activeSlot) return null;

            return { activeDay, activeSlot };
        },

        getButtonSetSlots: (state, getters) => (doerId, tab) => {
            const data = getters.getActiveDaySlot(doerId, tab);

            if (!data) return '';

            const meetingType = tab === 'online' ? 'онлайн' : 'в офисе';
            return `Создать встречу ${meetingType} на ${data.activeDay.date}; ${data.activeSlot.time_text}`;
        },

        getDateInfoModal: (state, getters) => (doerId, tab) => {
            const data = getters.getActiveDaySlot(doerId, tab);
            if (!data) return '';
            return `${data.activeDay.date}; ${data.activeSlot.time_text} (по времени клиента)`;
        },
        getCommentMeetCreate(state) {
            return state.commentMeetCreate;
        },
        getModalCreateLoader(state) {
            return state.modalCreateLoader;
        },
        getCreateFromMeet(state) {
            return state.createFromMeet;
        },
        getCurrentFilter(state) {
            return state.currentFilter;
        },
        getUniqueCommentMeetCreate: (state) => (doerId) => {
            return state.uniqueCommentMeetCreate?.[doerId] || null;
        },
        getDoerCreateLoader: (state) => (doerId) => {
            return state.doerCreateLoader?.[doerId] || null;
        },
        getAllDoerCreateLoader(state) {
            return state.doerCreateLoader;
        }
    },

    mutations: {
        setShowMeetCreateCard(state, payload) {
            state.showMeetCreateCard = {
                ...state.showMeetCreateCard, // сохраняем текущие значения
                ...payload // перезаписываем только переданные свойства
            };
        },
        setXhrCancel(state, value) {
            state.xhrCancel = value;
        },
        setShowContent(state, value) {
            state.showContent = value;
        },
        setMeetCreateFilter(state, payload) {
            state.meetCreateFilter = {
                ...state.meetCreateFilter, // сохраняем текущие значения
                ...payload // перезаписываем только переданные свойства
            };
        },
        setShowFilterSelect(state, payload) {
            const {show, inputType, coords} = payload;
            // Если список уже открыт и индекс совпадает с текущим, закрываем список
            if (state.showFilterSelect.show && state.showFilterSelect.inputType === inputType) {
                state.showFilterSelect.show = false;
                state.showFilterSelect.inputType = null;
                state.showFilterSelect.x = null;
                state.showFilterSelect.y = null;
            }

            // Иначе открываем список для нового элемента
            else {
                state.showFilterSelect.show = show;
                state.showFilterSelect.inputType = inputType;

                // Устанавливаем координаты, если они предоставлены
                if (coords) {
                    state.showFilterSelect.x = coords.x;
                    state.showFilterSelect.y = coords.y;
                }
                // Если координаты не предоставлены, сбрасываем их
                else {
                    state.showFilterSelect.x = null;
                    state.showFilterSelect.y = null;
                }
            }
        },
        setShowDoersList(state, value) {
            state.showDoersList = value;
        },
        setMeetCreateDoers(state, doers) {
            state.meetCreateDoers = doers;
        },
        setShowDoerSlots(state, {doerId, value}) {
            state.showDoerSlots = {
                ...state.showDoerSlots,
                [doerId]: value,
            };
        },
        setShowOneDayDoerSlots(state, {doerId, value}) {
            state.showOneDayDoerSlots = {
                ...state.showOneDayDoerSlots,
                [doerId]: value,
            };
        },
        setActiveDoerTab(state, {doerId, tab}) {
            state.activeDoerTab = {
                ...state.activeDoerTab,
                [doerId]: tab
            };
        },
        setOneDoerSlots(state, {doerId, tab, payload}) {
            // Инициализируем объект doerId, если его ещё нет
            const doerSlots = {
                online: null,
                offline: null,
                ...(state.oneDoerSlots[doerId] || {})
            };

            // Обновляем только нужный таб
            doerSlots[tab] = payload;

            // Обновляем state
            state.oneDoerSlots = {
                ...state.oneDoerSlots,
                [doerId]: doerSlots
            };
        },
        setOneDoerSlotsSlots(state, {doerId, tab, payload}) {
            // Проверяем, существует ли doerId в state
            if (!state.oneDoerSlots[doerId]) {
                console.warn(`doerId ${doerId} не найден в oneDoerSlots`);
                return;
            }
            // Проверяем, существует ли нужный tab (online / offline)
            if (!state.oneDoerSlots[doerId][tab]) {
                console.warn(`tab ${tab} не найден у doerId ${doerId}`);
                return;
            }

            if (payload?.calendar) {
                delete state.activeDoerDateSlot[doerId];
                // Обновляем только calendar
                state.oneDoerSlots = {
                    ...state.oneDoerSlots,
                    [doerId]: {
                        ...state.oneDoerSlots[doerId],
                        [tab]: {
                            ...state.oneDoerSlots[doerId][tab],
                            calendar: payload?.calendar
                        }
                    }
                };
            }

            // Обновляем только slots
            state.oneDoerSlots = {
                ...state.oneDoerSlots,
                [doerId]: {
                    ...state.oneDoerSlots[doerId],
                    [tab]: {
                        ...state.oneDoerSlots[doerId][tab],
                        slots: payload?.slots
                    }
                }
            };
        },
        toggleExpandedSlots(state, doerId) {
            state.expandedSlots = {
                ...state.expandedSlots,
                [doerId]: !state.expandedSlots[doerId]
            };
        },
        setShowDoerAbout(state, {doerId, value}) {
            state.showDoerAbout = {
                ...state.showDoerAbout,
                [doerId]: value
            };
        },
        setNeedTruncated(state, {doerId, value}) {
            state.needTruncated = {
                ...state.needTruncated,
                [doerId]: value
            };
        },
        setExpandedDoerAbout(state, {doerId, value}) {
            state.expandedDoerAbout = {
                ...state.expandedDoerAbout,
                [doerId]: value
            };
        },
        setActiveDoerDateSlot(state, {doerId, index}) {
            state.activeDoerDateSlot = {
                ...state.activeDoerDateSlot,
                [doerId]: index
            }
        },
        setActiveDoerSlot(state, {doerId, index}) {
            const current = state.activeDoerSlot?.[doerId] ?? null;

            if (current === index) {
                // Если уже установлен тот же индекс — убираем его
                state.activeDoerSlot = {
                    ...state.activeDoerSlot,
                    [doerId]: null // или delete для полного удаления
                };

                // Альтернатива: удалить ключ полностью
                /*
                const newState = { ...state.activeDoerSlot };
                delete newState[doerId];
                state.activeDoerSlot = newState;
                */

            } else {
                // Устанавливаем новый индекс
                state.activeDoerSlot = {
                    ...state.activeDoerSlot,
                    [doerId]: index
                };
            }
        },
        /**
         * закрытие карточки
         * @param state
         */
        closeMeetCreateCard(state) {
            const initialState = getInitialState(); // Получаем "чистое" состояние

            // Полностью заменяем каждое поле state
            Object.keys(initialState).forEach(key => {
                state[key] = initialState[key];
            });
        },
        setShowChangeCity(state, payload) {
            const {show, coords, step = 0} = payload;

            if (state.showChangeCity.show && state.showChangeCity.step === step) {
                // Закрываем, если тот же шаг и уже открыт
                state.showChangeCity.show = false;
                state.showChangeCity.x = null;
                state.showChangeCity.y = null;
            } else {
                // Открываем и устанавливаем шаг
                state.showChangeCity.show = show;
                state.showChangeCity.step = step;

                if (coords) {
                    state.showChangeCity.x = coords.x;
                    state.showChangeCity.y = coords.y;
                } else {
                    state.showChangeCity.x = null;
                    state.showChangeCity.y = null;
                }
            }
        },
        setChangeCityStep(state, step) {
            state.showChangeCity.step = step;
        },
        setSuggestions(state, suggestions) {
            state.suggestions = suggestions;
        },
        setShowSuggestions(state, show) {
            state.showSuggestions = show;
        },
        setChangeCityToCity(state, city) {
            state.changeCityToCity = city;
        },
        setChangeCityLoading(state, value) {
            state.changeCityLoading = value;
        },
        setShowOneDoerSlotOffices(state, payload) {
            const {show, inputType, coords} = payload;
            // Если список уже открыт и индекс совпадает с текущим, закрываем список
            if (state.showOneDoerSlotOffices.show && state.showOneDoerSlotOffices.inputType === inputType) {
                state.showOneDoerSlotOffices.show = false;
                state.showOneDoerSlotOffices.inputType = null;
                state.showOneDoerSlotOffices.x = null;
                state.showOneDoerSlotOffices.y = null;
            }

            // Иначе открываем список для нового элемента
            else {
                state.showOneDoerSlotOffices.show = show;
                state.showOneDoerSlotOffices.inputType = inputType;

                // Устанавливаем координаты, если они предоставлены
                if (coords) {
                    state.showOneDoerSlotOffices.x = coords.x;
                    state.showOneDoerSlotOffices.y = coords.y;
                }
                // Если координаты не предоставлены, сбрасываем их
                else {
                    state.showOneDoerSlotOffices.x = null;
                    state.showOneDoerSlotOffices.y = null;
                }
            }
        },
        setShowModalAboutOffice(state, value) {
            state.showModalAboutOffice = value;
        },
        setShowModalCreate(state, payload) {
            // дефолтное состояние
            const defaultState = {
                step: 0,
                show: false,
                doer: null,
                tabType: null
            };

            // если явно передали show = false → сбрасываем
            if (payload?.show === false) {
                state.showModalCreate = { ...defaultState };
                return;
            }

            if (typeof payload === 'number') {
                // если передали просто step → меняем только step
                state.showModalCreate.step = payload;
            } else if (typeof payload === 'object' && payload !== null) {
                // если передали объект → перезаписываем полностью
                state.showModalCreate = {
                    step: payload.step ?? 0,
                    show: payload.show ?? false,
                    doer: payload.doer ?? null,
                    tabType: payload.tabType ?? null
                };
            } else {
                // сброс на дефолт
                state.showModalCreate = { ...defaultState };
            }
        },
        setModalAboutOfficeData(state, data) {
            state.modalAboutOfficeData = data;
        },
        setShowDoerSlotsError(state, {doerId, value}) {
            state.showDoerSlotsError = {
                ...state.showDoerSlotsError,
                [doerId]: value,
            };
        },
        setFilterDoerId(state, value) {
            state.filter.doerId = value
        },
        setFilterDoerTypeId(state, value) {
            state.filter.doer_type_id = value
        },
        setFilterOfficeType(state, values) {
            state.filter.office_type = values
        },
        setFilterDateRange(state, values) {
            state.filter.dateRange = values
        },
        setFilterReset(state) {
            state.filter = {
                doerId: null,
                doer_type_id: null,
                office_type: 3,
                dateRange: null
            }
        },
        clearOneDoerTabAndSlots(state, doerId) {
            delete state.activeDoerDateSlot[doerId];
            delete state.activeDoerTab[doerId];
        },
        // Очистка всех сразу
        clearAllDoerTabsAndSlots(state) {
            state.activeDoerDateSlot = {};
            state.activeDoerTab = {};
            state.showDoerSlots = {};
            state.oneDoerSlots = {};
        },
        setCleanedDoerId(state, doerId) {
            state.cleanedDoerId = doerId;
        },
        setAddressMeetCreate(state, address) {
            state.addressMeetCreate = address;
        },
        setCommentMeetCreate(state, comment) {
            state.commentMeetCreate = comment;
        },
        setModalCreateLoader(state, value) {
            state.modalCreateLoader = value;
        },
        setCreateFromMeet(state, value) {
            state.createFromMeet = value;
        },
        setCurrentFilter(state, payload) {
            state.currentFilter = payload;
        },
        setUniqueCommentMeetCreate(state, {doerId, comment}) {
            state.uniqueCommentMeetCreate = {
                ...state.uniqueCommentMeetCreate,
                [doerId]: comment
            };
        },
        setDoerCreateLoader(state, {doerId, loading}) {
            console.log('setDoerCreateLoader', doerId, loading)
            state.doerCreateLoader = {
                ...state.doerCreateLoader,
                [doerId]: loading
            };
        },
    },

    actions: {
        /**
         * открытие карточки
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async openMeetCreateCard(context, payload) {
            const selectedLeadCard = leadcard_block2.$store.getters['leadcard2/getSelectedLeadCard'];
            const leadCardKey = selectedLeadCard?.card_key || null;

            console.log('payload123', payload)
            // Добавляем lead_card_key в payload
            const updatedPayload = {
                ...payload,
                lead_card_key: leadCardKey
            };

            if (payload?.createFromMeet) {
                context.commit('setCreateFromMeet', {isCreate: true, meet_id: payload.createFromMeet?.meet_id})
                context.commit('setFilterDoerId', payload.createFromMeet?.doer_id)
                context.commit('setFilterDoerTypeId', payload.createFromMeet?.doer_type_id)
                context.commit('setFilterOfficeType', payload.createFromMeet?.office_type)
            }

            const currentCard = context.getters['getShowMeetCreateCard'];


            if (currentCard.lead_id !== payload?.lead_id) {
                context.commit('setShowMeetCreateCard', updatedPayload);

                if (updatedPayload.show) {
                    context.dispatch('fetchFilterData');
                }
            } else {
                VueCardManager.closeCard('meet_create_card');
            }
        },
        /**
         * получение фильтра
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async fetchFilterData(context, payload) {
            if (context.state.xhrCancel) {
                context.state.xhrCancel();
            }
            const {token, cancel} = axios.CancelToken.source();
            context.commit('setShowContent', false);
            context.commit('setXhrCancel', cancel);
            const url = '/crm/meet-catalog/static-data';
            // const filter
            try {
                if(!context.getters['getShowMeetCreateCard'].show) return;
                const response = await axios.get(url, {
                    params: {
                        lead_id: context.getters['getShowMeetCreateCard'].lead_id,
                    },
                    cancelToken: token
                });
                if (response.data.success) {
                    console.log('resp', response.data)
                    await context.commit('setMeetCreateFilter', {
                        client: response.data.client,
                        doers: response.data.doers,
                        office_types: response.data.office_types
                    });
                    await context.dispatch('acceptFilter');
                    context.commit('setShowContent', true);
                } else {
                    toastMessage('Ошибка', response.data.error, 'error', true, 2000);
                }
            } catch (error) {
                console.error('Ошибка при загрузке фильтра:', error);
            }
        },
        /**
         * получение списка исполнителей
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async fetchDoersList(context, payload) {
            if (context.state.xhrCancel) {
                context.state.xhrCancel();
            }
            const {token, cancel} = axios.CancelToken.source();
            context.commit('setXhrCancel', cancel);
            const url = '/crm/meet-catalog/doers-list';
            context.commit('setShowDoersList', false);

            console.log('getFilterDoerId', context.getters['getFilterDoerId'])
            console.log('getDoerTypeId', context.getters['getDoerTypeId'])
            console.log('getOfficeType', context.getters['getOfficeType'])

            // Формируем параметры в нужном формате
            const params = new URLSearchParams();

            // Добавляем lead_id
            params.append('lead_id', context.getters['getShowMeetCreateCard'].lead_id);
            // Очищаем doerId и получаем число
            const cleanDoerId = context.getters.cleanDoerId(context.getters['getFilterDoerId']);

            // Добавляем Search[doerId]
            if (context.getters['getFilterDoerId']) {
                params.append('Search[doer_id]', cleanDoerId);
            }

            console.log('getDoerTypeId', context.getters['getDoerTypeId'])

            // Добавляем Search[doer_type_id]
            if (context.getters['getDoerTypeId']) {
                params.append('Search[doer_type_id]', context.getters['getDoerTypeId']);
            }

            // Добавляем Search[office_type][]
            const officeType = context.getters['getOfficeType'];
            if (officeType) {
                if (officeType === 3) {
                    // Если тип 3, передаем оба значения: 1 и 2
                    params.append('Search[office_type][]', 1);
                    params.append('Search[office_type][]', 2);
                } else {
                    // Иначе передаем само значение
                    params.append('Search[office_type][]', officeType);
                }
            }

            context.commit('setCurrentFilter', {
                doerId: context.getters['getFilterDoerId'],
                doer_type_id: context.getters['getDoerTypeId'],
                office_type: context.getters['getOfficeType'],
                dateRange: context.getters['getFilterDateRange']
            })

            try {
                const response = await axios.get(url, {
                    params: params,
                    cancelToken: token
                });
                if (response.data.success) {
                    console.log('resp', response.data)
                    await context.commit('setMeetCreateDoers', response.data.doers)
                    context.commit('setShowDoersList', true);
                } else {
                    toastMessage('Ошибка', response.data.error, 'error', true, 2000);
                }
            } catch (error) {
                console.error('Ошибка при загрузке фильтра:', error);
            }
        },
        /**
         * показ выпадающих списков в фильтре
         * @param context
         * @param payload
         */
        toggleShowCardSelect(context, payload) {
            context.commit('setShowFilterSelect', payload);
        },
        toggleShowChangeCity(context, payload) {
            context.dispatch('closeAutocomplete')
            context.commit('setShowChangeCity', payload);
        },
        /**
         * принятие фильтра
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async acceptFilter(context, payload) {
            // toastMessage('Успешно', 'Допустим применили фильтр', 'success', true, 1000);
            context.commit('clearAllDoerTabsAndSlots')
            context.dispatch('fetchDoersList')
        },
        /**
         * сброс фильтра
         * @param context
         */
        resetFilter(context) {
            context.commit('setFilterReset')
            context.dispatch('acceptFilter');
        },
        /**
         * получение слотов по одному пользователю
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async fetchOneDoerSlots(context, payload) {
            const {doerId, type_id, tab} = payload;
            const lead_id = context.getters['getShowMeetCreateCard']?.lead_id;
            const dateRange = context.getters['getFilterDateRange'];
            const activeTab = context.getters['getActiveDoerTab'](doerId);
            // if (!doerId || !tab || !lead_id || !type_id) return;
            console.log('payload', payload)
            // Устанавливаем активный таб
            if (activeTab !== tab) {
                context.commit('clearOneDoerTabAndSlots', doerId)
            }
            context.commit('setActiveDoerTab', {doerId: doerId, tab});
            context.commit('setShowDoerSlots', {doerId: doerId, value: false});
            context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: false});
            context.commit('setShowDoerAbout', {doerId: doerId, value: false});
            // Очищаем doerId и получаем число
            const cleanDoerId = context.getters.cleanDoerId(doerId);
            try {
                // Формируем URL
                const requestUrl = '/crm/meet-catalog/doer-slots';
                // Формируем параметры запроса
                const params = {
                    lead_id,
                    doer_id: cleanDoerId,
                    type_id,
                    date: dateRange,
                    ...(payload.calendar !== undefined ? {calendar: payload.calendar} : {}),
                    ...(tab === 'offline' || type_id === 2 ? {offices: 1} : {}),
                    ...(tab === 'online' ? {online: true} : {offline: true})
                };

                const response = await axios.get(requestUrl, {params});

                if (response.data.success) {
                    context.commit('setOneDoerSlots', {
                        doerId: doerId,
                        tab,
                        payload: response.data
                    });
                    context.commit('setShowDoerSlots', {doerId: doerId, value: true});
                    context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: true});
                } else {
                    console.log('res', response)
                    // toastMessage('Ошибка', response.data.error, 'error', true, 2000);
                    context.commit('setShowDoerSlotsError', {doerId: doerId, value: response.data.error || response.data.errors[0]})
                    context.commit('setShowDoerSlots', {doerId: doerId, value: true});
                    context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: true});
                }
            } catch (error) {
                console.error('Ошибка при загрузке слотов:', error);
                toastMessage('Ошибка сети', 'Не удалось загрузить слоты', 'error', true, 2000);
                context.commit('setShowDoerSlotsError', {doerId: doerId, value: 'Не удалось загрузить слоты'})
                context.commit('setShowDoerSlots', {doerId: doerId, value: true});
                context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: true});
            }
        },
        /**
         * показ таба с информацией о исполнителе
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async toggleShowDoerAbout(context, payload) {
            context.commit('setShowDoerSlots', {doerId: payload.doerId, value: false});
            context.commit('setActiveDoerTab', {doerId: payload.doerId, tab: payload.tab});
            await context.commit('setShowDoerAbout', {doerId: payload.doerId, value: true})
            context.commit('setShowDoerSlots', {doerId: payload.doerId, value: true});
        },
        /**
         * скрытие показ текста во вкладе Об исполнителе
         * @param context
         * @param payload
         */
        toggleDoerExpandedAbout(context, payload) {
            context.commit('setExpandedDoerAbout', {doerId: payload.doerId, value: payload.value})
        },
        /**
         * смена дня при выборе слотов у исполнителя
         * @param context
         * @param payload
         */
        setActiveDateSlot(context, payload) {
            if (!payload.isWorking) return;

            context.commit('setActiveDoerDateSlot', {doerId: payload.doerId, index: payload.index})
            if (payload?.updateSlots) {
                context.commit('setActiveDoerSlot', {doerId: payload.doerId, index: null})
                context.dispatch('updateOneDoerSlot', payload)
            }
            context.state.expandedSlots = {};
        },
        /**
         * обновление слотов исполнителя по дате
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async updateOneDoerSlot(context, payload) {
            console.log('updateOneDoerSlot', payload)
            const {doerId, type_id, tab, date, office_id, calendar, offices} = payload;
            const lead_id = context.getters['getShowMeetCreateCard']?.lead_id;
            context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: false});
            // Очищаем doerId и получаем число
            const cleanDoerId = context.getters.cleanDoerId(doerId);
            try {
                const params = {
                    lead_id,
                    doer_id: cleanDoerId,
                    type_id,
                    date,
                    calendar,
                    offices,
                    office_id,
                    ...(tab === 'online' ? {online: true} : {offline: true})
                };

                const response = await axios.get('/crm/meet-catalog/doer-slots', {params});

                if (response.data.success) {
                    console.log('resp', response)
                    context.commit('setOneDoerSlotsSlots', {
                        doerId: doerId,
                        tab,
                        payload: response.data,
                        type: 'slots'
                    });
                    context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: true});
                } else {
                    toastMessage('Ошибка', response.data.error, 'error', true, 2000);
                    context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: false});
                }
            } catch (error) {
                console.error('Ошибка при загрузке слотов:', error);
                toastMessage('Ошибка сети', 'Не удалось загрузить слоты', 'error', true, 2000);
                context.commit('setShowOneDayDoerSlots', {doerId: doerId, value: false});
            }
        },
        /**
         * автокомплит
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async changeCityMeetCreate(context, payload) {
            console.log('Input event triggered');

            if (context.state.xhrCancel) {
                context.state.xhrCancel();
            }
            const {token, cancel} = axios.CancelToken.source();
            context.commit('setXhrCancel', cancel);

            // Приводим к строке и обрезаем
            const query = payload.cityName ? payload.cityName.toString().trim() : '';

            console.log('Query после обработки:', query);

            if (query.length < 2) {
                context.dispatch('closeAutocomplete')
                return;
            }

            try {
                const response = await axios.get('/crm/ajax/traffic-autocomplete', {
                    params: {query, type: 'city'},
                    cancelToken: token
                });

                console.log('Ответ от сервера:', response.data);

                context.commit('setSuggestions', response.data.suggestions || [])
                context.commit('setShowSuggestions', response.data.suggestions.length > 0)

            } catch (error) {
                console.error('Ошибка автозаполнения:', error);
                context.dispatch('closeAutocomplete')
            }
        },
        /**
         * закрытие автокомплита
         * @param context
         */
        closeAutocomplete(context) {
            context.commit('setSuggestions', [])
            context.commit('setShowSuggestions', false)
        },
        /**
         * отправка города на смену
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async sendCityToChange(context, payload) {
            try {
                const url = '/crm/lead-card-v2/edit';
                const lead_card_key = context.getters['getShowMeetCreateCard'].lead_card_key;

                // Получаем город из фильтра
                const cityName = payload.city;

                // Формируем тело запроса
                const dataTemplate = {
                    ['LeadsCompanyMediumClient']: {
                        city_name: cityName,
                    }
                };

                context.commit('setChangeCityLoading', true)

                const params = {
                    key: lead_card_key,
                };

                const response = await axios.post(url, dataTemplate, {
                    params,
                    headers: { 'content-type': 'application/x-www-form-urlencoded' }
                });

                if (response.data.success) {
                    context.dispatch('fetchFilterData');
                    console.log('Данные успешно сохранены');
                    const leadCardData = leadcard_block2.$store.getters['leadcard2/getSelectedLeadCard'];
                    console.log('leadCardData', leadCardData)
                    console.log('leadCardData', cityName)
                    leadCardData.common.client.city_name = cityName;
                    context.dispatch('toggleShowChangeCity', {show: false, coords: {x: null, y: null}})
                    context.commit('setChangeCityLoading', false)
                }

            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            }
        },
        /**
         * показ списка офисов
         * @param context
         * @param payload
         */
        toggleShowOneDoerSlotOffices(context, payload) {
            context.commit('setShowOneDoerSlotOffices', payload);
        },
        /**
         * получение ифнормации об оффисе
         * @param context
         * @param payload
         * @returns {Promise<void>}
         */
        async getOfficeInfo(context, payload) {
            console.log('payload', payload)
            try {
                const response = await axios.get(payload.url);

                if (response.data.success) {
                    console.log('resp', response)
                    if (payload?.showModal) {
                        context.commit('setShowModalAboutOffice', true)
                        context.commit('setModalAboutOfficeData', response.data)
                    } else {
                        context.commit('setAddressMeetCreate', response?.data?.address)
                    }
                } else {
                    toastMessage('Ошибка', response.data.error, 'error', true, 2000);
                }

            } catch (error) {
                console.error('Ошибка автозаполнения:', error);
            }
        },
        /**
         * отображение модалки об офиссе
         * @param context
         * @param payload
         */
        toggleModalShowModalAboutOffice(context, payload) {
            context.commit('setShowModalAboutOffice', payload.show)
        },
        async toggleModalShowModalCreate(context, payload) {
            if (payload.show) {
                const doerSlots = context.getters.getOneDoerSlots(payload.doer.id, payload.tabType);

                const url = `/crm/meet-catalog/office-details?id=${doerSlots?.office_id}&type_id=${payload?.doer?.type_id}`;

                if (url) {
                    await context.dispatch('getOfficeInfo', {url});
                }
            }

            context.commit('setShowModalCreate', payload);
        },
        /**
         * обновление параметра фильтра
         * @param context
         * @param value
         */
        updateDoerId(context, value) {
            context.commit('setFilterDoerId', value)
        },
        /**
         * обновление параметра фильтра
         * @param context
         * @param value
         */
        updateDoerTypeId(context, value) {
            context.commit('setFilterDoerTypeId', value)
        },
        /**
         * обновление параметра фильтра
         * @param context
         * @param values
         */
        updateOfficeType(context, values) {
            context.commit('setFilterOfficeType', values)
        },
        /**
         * обновление параметра фильтра
         * @param context
         * @param values
         */
        updateDateRange(context, values) {
            context.commit('setFilterDateRange', values)
        },
        async createMeet(context, payload) {
            try {
                // context.commit('setModalCreateLoader', true);
                context.commit('setDoerCreateLoader', {doerId: payload.doer.id, loading: true});

                const doerSlots = context.getters.getOneDoerSlots(payload.doer.id, payload.tabType);
                const activeDoerSlot = context.getters.getActiveDoerSlot(payload.doer.id);
                const currentCard = context.getters['getShowMeetCreateCard'];
                const cleanDoerId = context.getters.cleanDoerId(payload?.doer?.id);
                const cleanCompanyId = context.getters.cleanDoerId(payload.doer.company_id);
                // const comment = context.getters['getCommentMeetCreate'];
                const commentDoerId = context.getters.getUniqueCommentMeetCreate(payload.doer.id);
                const meetId = context.getters['getCreateFromMeet'].meet_id;
                const formData = new FormData();

                ['online', 'offline'].forEach(type => {
                    formData.append(`Meet[${type}]`, Number(payload?.tabType === type));
                });

                if (doerSlots?.office_id) {
                    formData.append('Meet[office_id]', doerSlots.office_id);
                }

                if (payload?.doer?.type_id) {
                    formData.append('Meet[create_type_id]', payload?.doer?.type_id);
                }

                if (payload.doer.company_id && payload?.doer?.type_id === 1) {
                    formData.append('Meet[company_id]', cleanCompanyId);
                } else if (payload?.doer?.type_id === 2) {
                    formData.append('Meet[company_id]', cleanDoerId);
                }

                if (payload?.doer?.type_id === 1 && payload?.doer?.id) {
                    formData.append('Meet[staff_id]', cleanDoerId);
                }

                if (currentCard?.lead_id) {
                    formData.append('Meet[lead_id]', currentCard?.lead_id);
                }

                if (activeDoerSlot !== null && activeDoerSlot !== undefined && doerSlots?.slots[activeDoerSlot]) {
                    if (doerSlots.slots[activeDoerSlot].timestamp) {
                        formData.append('Meet[time_start]', doerSlots.slots[activeDoerSlot].timestamp);
                    }
                    if (doerSlots.slots[activeDoerSlot]?.time_slot) {
                        formData.append('Meet[time_slot]', doerSlots.slots[activeDoerSlot]?.time_slot);
                    }
                }

                if (commentDoerId) {
                    formData.append('Meet[comment]', commentDoerId);
                }

                if (meetId) {
                    formData.append('Meet[id]', meetId);
                }

                await axios.post('/crm/meet-booking/create', formData, {
                    headers: {'content-type': 'application/x-www-form-urlencoded'}
                })
                    .then(response => {
                        if (response.data.success) {
                            context.commit('setShowModalCreate', 1);
                            // context.commit('setModalCreateLoader', false);
                            context.commit('setDoerCreateLoader', {doerId: payload.doer.id, loading: false});
                            context.dispatch('closeModalAndCard')
                        } else {
                            context.dispatch('parseErrors', response.data.errors)
                                .then((parsed) => {
                                    if (parsed.length) {
                                        toastMessage('Ошибка', parsed.join('<br>'), 'error', true, 1000);
                                    }
                                });
                            // context.commit('setModalCreateLoader', false);
                            context.commit('setDoerCreateLoader', {doerId: payload.doer.id, loading: false});
                        }
                    });
            } catch (error) {
                console.error(error);
                toastMessage('Ошибка', error, 'error', true, 2000);
                // context.commit('setModalCreateLoader', false);
                context.commit('setDoerCreateLoader', {doerId: payload.doer.id, loading: false});
            }
        },
        parseErrors(context, errors) {
            if (!errors || typeof errors !== 'object') return [];

            return Object.values(errors)
                .flat()
                .filter(Boolean);
        },
        async closeModalAndCard(context) {
            context.dispatch('toggleModalShowModalCreate', { show: false, doer: {}, tabType: null })
            VueCardManager.closeCard('meet_create_card');
            // const selectedLeadCard = leadcard_block2.$store.getters['leadcard2/getSelectedLeadCard'];
            // const meetTab = selectedLeadCard.tabs?.find(tab => tab.key === 'meet');
            // window.dispatchEvent(new CustomEvent('switch-tab-loc', {
            //     detail: { url: meetTab?.url, name: meetTab?.name }
            // }));
            switchLeadCardTab(leadcard_block2.$store, 'meet');
            toastMessage('Успешно', 'Встреча успешно создана!', 'success', true, 1000);
        }
    },
}