<template>
  <div :class="{ loader: true, fadeout: !isLoading }">
    <div class="splash-wrapper">
      <h1><span class="title">家計簿アプリ</span></h1>
      <p class="atenson">ﾋﾟﾝﾎﾟﾝﾊﾟﾝ This is a portfolio created by Tsuchiya.</p>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
  props: ["isLoading"],
};
</script>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;
  z-index: 9999;
}

h1 {
  border: none;
}

.atenson {
  text-align: center;
}

.fadeout {
  animation: fadeout 0.5s forwards;
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
