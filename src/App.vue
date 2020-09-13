<template>
  <div class="container" v-on:click.ctrl="changeType">
    <aside>
      <div v-if="unfold" class="file">
        <label for="upload-photo">Chose Image</label>
        <input
          id="upload-photo"
          @change="filesChange($event.target.name, $event.target.files)"
          type="file"
        />
      </div>
      <div v-if="unfold">
        <label for>dimension</label>
        {{map.width}} * {{map.height}}
      </div>
      <div v-if="unfold" class="type">
        <label for>type</label>
        <div :class="currentType">{{currentType}}</div>
      </div>
      <div v-if="unfold">
        <label for>zoom</label>
        <div>
          <button @click="handleZoomIn">+</button>
          <button @click="handleZoomOut">-</button>
          <button @click="handleReset">reset</button>
        </div>
      </div>
      <div v-if="unfold" class="types">
        <div class="NORMAL">NORMAL</div>
        <div class="BARRIER">BARRIER</div>
        <div class="SHADOW">SHADOW</div>
        <div class="NONE">NONE</div>
      </div>
      <div v-if="unfold">
        <a @click="getResult" href="javascript:void(0);">print</a>
      </div>
      <div>
        <a @click="() => unfold = !unfold" href="javascript:void(0);">{{unfold?'︽︽':'︾︾'}}</a>
      </div>
    </aside>
    <div class="map-ccc">
      <div class="map-container">
        <div ref="map" class="map">
          <i
            v-bind:class="item.type"
            @mouseover="handleTileOver(item)"
            @click="handleTileClick(item)"
            v-for="item in grid"
            :key="item.key"
          >{{computedCoord(item.key)}}</i>
        </div>
      </div>
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
      unfold: true,
      map: {
        width: "512",
        height: "512",
      },
      tile: {
        width: 48,
        height: 32,
      },
      grid: [],
      type: TYPE.NONE,
      zoom: 1,
      interactive: false,
    };
  },
  created() {
    window.addEventListener("keydown", ({ code }) => {
      console.log(code);
      if (code === "ControlLeft") {
        this.interactive = true;
      }
      if (code === "KeyC") {
        this.type = (this.type + 1) % 4;
      }
      if (code === "Escape") {
        this.unfold = !this.unfold;
      }
    });
    window.addEventListener("keyup", ({ code }) => {
      if (code === "ControlLeft") {
        this.interactive = false;
      }
    });
    this.grid = _.range(0, 176).map((index) => ({
      key: index,
      type: _.keys(TYPE)[TYPE.NORMAL],
    }));
  },
  methods: {
    computedCoord(index) {
      const ROW_NUM = Math.ceil(this.map.height / this.tile.height);
      const COL_NUM = Math.ceil(this.map.width / this.tile.width);
      const row = index % COL_NUM;
      const col = Math.floor(index / COL_NUM) % ROW_NUM;
      return `[${row},${col}]`;
    },
    handleZoomIn() {
      this.zoom += 0.2;
      this.$refs.map.style.transform = `scale(${this.zoom})`;
    },
    handleZoomOut() {
      this.zoom -= 0.2;
      this.$refs.map.style.transform = `scale(${this.zoom})`;
    },
    handleReset() {
      this.$refs.map.style.transform = "";
    },
    changeType() {
      if (this.type === TYPE.NORMAL) {
        this.type = TYPE.BARRIER;
      } else {
        this.type = TYPE.NORMAL;
      }
    },
    getResult() {
      console.log(_.map(this.grid, (item) => TYPE[item.type]));
    },
    async filesChange(name, files) {
      const _URL = window.URL || window.webkitURL;
      const reader = new FileReader();
      const { width, height } = await this.getImageSize(files[0]);
      reader.onload = (e) => {
        const realWidth = Math.ceil(width / 48) * 48;
        const realHeight = Math.ceil(height / 32) * 32;
        this.$refs.map.style.backgroundImage = `url(${e.target.result})`;
        this.$refs.map.style.width = `${realWidth}px`;
        this.$refs.map.style.height = `${realHeight}px`;
        this.map.width = realWidth;
        this.map.height = realHeight;
        this.grid = _.range(
          0,
          Math.ceil(realWidth / this.tile.width) *
            Math.ceil(realHeight / this.tile.height)
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
      if (this.type !== TYPE.NONE && this.interactive) {
        item.type = _.keys(TYPE)[this.type];
      }
    },
  },
};
</script>
<style scoped lang="less" >
.container {
  aside {
    z-index: 1;
    background: #eee;
    position: absolute;
    left: 0;
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 16px;
    padding: 20px 20px 0;
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
  .map-ccc {
    display: flex;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
    .map-container {
      .map {
        background-image: url("./bg.png");
        background-size: contain;
        width: 528px;
        height: 512px;
        display: flex;
        flex-wrap: wrap-reverse;
        i {
          box-sizing: border-box;
          width: 48px;
          height: 32px;
          display: inline-block;
          border: 1px solid gray;
          font-size: 10px;
          color: #fff;
        }
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