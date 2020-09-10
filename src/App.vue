<template>
  <div class="container" v-on:click.ctrl="changeType">
    <aside>
      <div class="file">
        <label for="upload-photo">Chose Image</label>
        <input
          id="upload-photo"
          @change="filesChange($event.target.name, $event.target.files)"
          type="file"
        />
      </div>
      <div>
        <label for>dimension</label>
        {{map.width}} * {{map.height}}
      </div>
      <div class="type">
        <label for>type</label>
        <div :class="currentType">{{currentType}}</div>
      </div>
      <div>
        <label for>zoom</label>
        <div>
          <button @click="handleZoomIn">+</button>
          <button @click="handleZoomOut">-</button>
        </div>
      </div>
      <div class="types">
        <div class="NORMAL">NORMAL</div>
        <div class="BARRIER">BARRIER</div>
        <div class="SHADOW">SHADOW</div>
        <div class="NONE">NONE</div>
      </div>
      <div>
        <a @click="getResult" href="javascript:void(0);">print</a>
      </div>
    </aside>
    <div class="map-container">
    <v-zoomer style="width: 512px; height: 512px; border: solid 1px silver;" minScale="0.1">
      <div ref="map" class="map">
        <i
          v-bind:class="item.type"
          @mouseover="handleTileOver(item)"
          @click="handleTileClick(item)"
          v-for="item in grid"
          :key="item.key"
        >{{item.key}}</i>
      </div>
      </v-zoomer>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
const TYPE = {
  NORMAL: 0,
  BARRIER: 1,
  SHADOW: 2,
  NONE: 3,
};
export default {
  computed: {
    currentType: function () {
      return _.keys(TYPE)[this.type];
    },
  },
  data() {
    return {
      map: {
        width: "512",
        height: "512",
      },
      grid: [],
      type: TYPE.NONE,
      zoom: 1,
    };
  },
  created() {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        this.type = (this.type + 1) % 4;
      }
    });
    this.grid = _.range(0, 176).map((index) => ({
      key: index,
      type: _.keys(TYPE)[TYPE.NORMAL],
    }));
  },
  methods: {
    handleZoomIn() {
      const zoom = this.zoom + 0.5;
      this.$refs.map.style.transform = `scale(${zoom})`;
    },
    handleZoomOut() {
      const zoom = this.zoom - 0.5;
      this.$refs.map.style.transform = `scale(${zoom})`;
    },
    changeType() {
      if (this.type === TYPE.NORMAL) {
        this.type = TYPE.BARRIER;
      } else {
        this.type = TYPE.NORMAL;
      }
    },
    getResult(){
      console.log(_.map(this.grid, item => TYPE[item.type]))
    },
    async filesChange(name, files) {
      const _URL = window.URL || window.webkitURL;
      const reader = new FileReader();
      const { width, height } = await this.getImageSize(files[0]);
      reader.onload = (e) => {
        this.$refs.map.style.backgroundImage = `url(${e.target.result})`;
        this.$refs.map.style.width = `${width}px`;
        this.$refs.map.style.height = `${height}px`;
        this.map.width = width;
        this.map.height = height;
        console.log("loaded", width, height);
        this.grid = _.range(
          0,
          Math.round(width / (512 / 11)) * Math.round(height / (512 / 16))
        ).map((index) => ({
          key: index,
          type: _.keys(TYPE)[TYPE.NORMAL],
        }));
      };
      // setTimeout(() => {}, 1);
      reader.readAsDataURL(files[0]);
    },
    getImageSize(file) {
      return new Promise((resolve) => {
        var img;
        img = new Image();
        var _URL = window.URL || window.webkitURL;
        var objectUrl = _URL.createObjectURL(file);
        img.onload = function () {
          const { width, height } = this;
          _URL.revokeObjectURL(objectUrl);
          resolve({ width, height });
        };
        img.src = objectUrl;
      });
    },
    handleTileClick(item) {
      item.type = _.keys(TYPE)[(TYPE[item.type] + 1) % 4];
    },
    handleTileOver(item) {
      if (this.type !== TYPE.NONE) {
        item.type = _.keys(TYPE)[this.type];
      }
    },
  },
};
</script>
<style scoped lang="less" >
.container {
  aside {
    background: #eee;
    position: absolute;
    left: 0;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 16px;
    padding: 24px 0 24px 24px;
    > div {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      input {
        width: 120px;
      }
      &.file {
        label {
          border: 1px solid #000;
          border-radius: 5px;
          color: #000;
          background-color: pink;
          padding: 2px 4px;
        }
      }
    }
    .type,
    .types {
      > div {
        padding: 4px;
        margin-bottom: 2px;
      }
    }
  }
  .map-container {
    display: flex;
    align-items: center;
    height: 100vh;
    justify-content: center;
    .map {
      background-image: url("./bg.png");
      background-size: contain;
      width: 512px;
      height: 512px;
      display: flex;
      flex-wrap: wrap-reverse;
      i {
        box-sizing: border-box;
        width: 46.5px;
        height: 32px;
        display: inline-block;
        border: 1px solid gray;
        font-size: 10px;
        color: #fff;
      }
    }
  }
  .NORMAL {
    background-color: transparent;
    opacity: 0.5;
  }
  .BARRIER {
    background-color: palevioletred;
    opacity: 0.5;
  }
  .SHADOW {
    background-color: grey;
    opacity: 0.5;
  }
}
</style>