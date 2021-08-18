<template>
  <div ref="chatBody" class="vue-chatter flex flex-col">
    <div
      v-for="(m, i) in attachedMsgs"
      :key="i"
      :class="[
        'chat-bubble rounded-2xl ',
        m.type === 'image' ? 'p-2' : 'px-4 py-1',
        m.isReceived ? 'msg-r-text bg-gray-200' : '',
        !m.isReceived ? 'msg-s-text bg-primary text-white self-end' : '',
      ]"
    >
      <span v-if="m.type === 'text'" v-html="m.data"></span>
      <img
        v-if="m.type === 'image'"
        :src="m.data"
        class="rounded-xl overflow-hidden"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "VueChatter",
  props: {
    messages: Array,
    enableAnimation: Boolean,
  },
  data() {
    return {
      attachedMsgs: [],
      lastHeight: 0,
    };
  },
  methods: {
    isExist(data) {
      return data === undefined || data === null ? false : true;
    },
    sleep(amount) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, amount);
      });
    },
    easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
    scrollToBottom(duration) {
      return new Promise((resolve, reject) => {
        let parentHeight = parseInt(
          window.getComputedStyle(this.$refs.chatBody.parentElement).height
        );
        let chatBodyHeight = parseInt(
          window.getComputedStyle(this.$refs.chatBody).height
        );
        if (parentHeight > chatBodyHeight) return;

        let chatBody = this.$refs.chatBody;
        let distance = chatBody.scrollHeight - this.lastHeight;
        let finishAt = Date.now() + duration;
        let start = chatBody.parentElement.scrollTop;
        let target = start + distance;
        let current = 0;
        let increment = 16.6;

        let tick = () => {
          current += increment;
          let framesLeft = (finishAt - Date.now()) / increment;

          if (framesLeft <= 1) {
            chatBody.parentElement.scrollTop += distance;
            resolve();
          } else {
            chatBody.parentElement.scrollTop = this.easeInOutQuad(
              current,
              start,
              target,
              duration
            );
            requestAnimationFrame(tick);
          }
        };

        if (this.enableAnimation) {
          requestAnimationFrame(tick);
        } else {
          chatBody.parentElement.scrollTop = target;
          resolve();
        }
      });
    },
    _pack(data) {
      return {
        type: this.isExist(data.type) ? data.type : "text",
        isReceived: this.isExist(data.isReceived) ? data.isReceived : true,
        data: data.data,
      };
    },
    appendMessage(newMsg) {
      this._registryMessage(this._pack(newMsg));
    },
    appendMessageList(msgList) {
      return new Promise(async (resolve, reject) => {
        for (let m of msgList) {
          await this.sleep(m.delay);
          this._registryMessage(this._pack(m));
        }
        resolve();
      });
    },
    resetMessageList(msgList) {
      return new Promise(async (resolve, reject) => {
        this.attachedMsgs = [];
        if (!this.isExist(msgList)) return;

        for (let i in msgList) {
          let m = msgList[i];

          if (i === msgList.length - 1) {
            await this._registryMessage(this._pack(m));

            resolve();
          } else {
            this._registryMessage(this._pack(m));
          }
        }
      });
    },
    getMessageList() {
      return this.attachedMsgs;
    },
    _registryMessage(pack) {
      return new Promise(async (resolve, reject) => {
        this.attachedMsgs.push(pack);
        await this.sleep(50);
        await this.scrollToBottom(1000);
        resolve();
      });
    },
  },
  watch: {
    messages(to, from) {
      if (to.length - 1 === this.attachedMsgs.length) {
        let newMsg = to.slice(-1).pop();

        this.attachedMsgs.push({
          type: this.isExist(newMsg.type) ? newMsg.type : "text",
          isReceived: this.isExist(newMsg.isReceived)
            ? newMsg.isReceived
            : true,
          data: newMsg.data,
        });
      }
    },
  },
  async mounted() {
    window.a = this.$refs.chatBody;
    for (let m of this.messages) {
      await this.sleep(m.delay);
      console.log(m.data);

      let pack = {
        type: this.isExist(m.type) ? m.type : "text",
        isReceived: this.isExist(m.isReceived) ? m.isReceived : true,
        data: m.data,
      };

      this.attachedMsgs.push(pack);
    }
  },
};
</script>

<style>
.chat-bubble {
  width: fit-content;
  max-width: 75%;
  margin-bottom: 2px;
}

.msg-r-text + div:not(.msg-r-text),
.msg-s-text + div:not(.msg-s-text) {
  @apply mt-2;
}
</style>
