<template>
  <div>
    <input
      @change="filesChange($event.target.name, $event.target.files)"
      type="file"
      name="upload image"
    />
    {{map.width}}{{map.height}}
    <div ref="map" class="map">
      <i v-bind:class="{ checked: item.checked }" v-on:click="handleTileClick(item)" v-for="item in grid" :key="item.key"></i>
    </div>
  </div>
</template>
<script>
      // <img ref="bg" :src="map.src" />
import _ from "lodash";
export default {
  data() {
    return {
      map: {
        src: "",
        width: "512",
        height: "512",
      },
      grid: [],
    };
  },
  created() {
    this.grid = _.range(0, 176).map(index => ({key:index, checked: false}));
  },
  methods: {
    filesChange(name, files) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.map.src = e.target.result;
        setTimeout(() => {
          this.map.width = this.$refs.bg.width;
          this.map.height = this.$refs.bg.height;
          this.grid = _.range(0, 176).map(index => ({key:index, checked: false}));
        }, 1);
      };
      reader.readAsDataURL(files[0]); // convert to base64 string
    },
    handleTileClick(item){
      item.checked = !item.checked;
    }
  },
};
</script>
<style lang="less">
@import "reset.less";

.map {
  background-image: url('./bg.png');
  background-size: contain;
  width: 512px;
  height: 512px;
  display: flex;
  flex-wrap: wrap;
    i {
      box-sizing: border-box;
      width: 46.5px;
      height: 32px;
      display: inline-block;
      border: 1px solid gray;
      &.checked{
        background-color: red;
      }
    }
}
</style>