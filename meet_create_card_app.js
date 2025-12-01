import * as Vue from 'vue';
import { meetCreateCardStore } from "./store/meetCreateCardStore";
import meetCreateCardBlock from "./crm/meet_create_card/meetCreateCardBlock";

const meet_create_card_app = Vue.createApp(meetCreateCardBlock);
meet_create_card_app.config.globalProperties.$store = meetCreateCardStore;
meet_create_card_app.use(meetCreateCardStore);

let meet_create_card_block = document.querySelector('#meet-create-card');
if (meet_create_card_block) {
    console.log('meet_create-block')
    window.meet_create_card_block = meet_create_card_app.mount('#meet-create-card');
}