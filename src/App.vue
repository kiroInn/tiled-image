<template>
  <div>
    <input
      @change="filesChange($event.target.name, $event.target.files)"
      type="file"
      name="upload image"
    />
    {{map.width}}{{map.height}}
    <div class="map">
      <img ref="bg" :src="map.src" />
      <div class="grid">
        <i v-for="i in grid" :key="i"></i>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      map: {
        src: "",
        width: "",
        height: "",
      },
      grid: [],
    };
  },
  methods: {
    filesChange(name, files) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.map.src = e.target.result;
        setTimeout(() => {
          this.map.width = this.$refs.bg.width;
          this.map.height = this.$refs.bg.height;
          this.grid = _.range(0, 176);
        }, 1);
      };
      reader.readAsDataURL(files[0]); // convert to base64 string
    },
  },
};
</script>
<style lang="less">
@import "reset.less";

.map {
  position: relative;
  .grid {
    position: absolute;
    i {
      box-sizing: border-box;
      width: 48px;
      height: 32px;
      display: inline-block;
      border: 1px solid gray;
    }
  }
}
</style>