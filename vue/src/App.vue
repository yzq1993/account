<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
	padding: 0;
	margin: 0;
	box-sizing: border-box;
  -webkit-tap-highlight-color:transparent
}
html{
  font-size: calc(100vw/10);
  font-family: PingFangSC-Light;
}
</style>
