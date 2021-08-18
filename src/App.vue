<template>
  <div class="dm w-full h-full flex flex-col overflow-hidden">
    <div
      class="top-bar w-full p-4 border-b-2 flex justify-between items-center"
    >
      <div
        class="flex justify-center items-center mr-2"
        @click="$router.go(-1)"
      >
        <div class="font-bold text-2xl">Vue-Chatter</div>
      </div>
    </div>
    <div class="flex flex-col flex-grow p-2 overflow-hidden overflow-y-scroll">
      <vue-chatter :messages="msgs" :enableAnimation="true"></vue-chatter>
    </div>
    <div class="p-2">
      <div
        class="flex items-center gap-2 w-full p-1 pl-4 rounded-full bg-gray-200"
      >
        <input
          class="msg-input flex-grow text-left bg-transparent"
          placeholder="메시지 보내기..."
          v-model="inputVal"
          @keypress.enter="sendMsg()"
        />
        <button
          class="h-10 px-4 rounded-full bg-primary text-white text-sm font-bold"
          @click="sendMsg()"
        >
          보내기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueChatter from "./components/VueChatter.vue";
export default {
  components: {
    "vue-chatter": VueChatter,
  },
  data() {
    return {
      inputVal: "",
      msgs: [
        {
          type: "text",
          isReceived: true,
          data: "안녕하세요!",
          delay: 1000,
        },
        {
          type: "text",
          isReceived: false,
          data: "넹 안녕하세요!",
          delay: 1000,
        },
        {
          type: "text",
          isReceived: true,
          data:
            "VueChatter는 여러분의 더 빠른 채팅앱 개발을 위해 탄생했습니다.",
          delay: 1000,
        },
        {
          type: "image",
          isReceived: true,
          data: require("@/assets/cat.jpg"),
          delay: 1000,
        },
        {
          data: "고양이는 귀엽습니다.",
          delay: 1000,
        },
        {
          data:
            "데모로 보여드릴 게 별 거 없네요, 채팅을 직접 쳐보세요! &#128513;",
          delay: 2000,
        },
      ],
    };
  },
  methods: {
    sendMsg() {
      if (this.inputVal === "") return;
      this.msgs.push({
        type: "text",
        isReceived: false,
        data: this.inputVal,
      });
      this.inputVal = "";
    },
  },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply w-full h-full;
  font-family: "Spoqa Han Sans Neo", "sans-serif";
  font-size: 16px;
}

* {
  outline: none;
}
</style>
