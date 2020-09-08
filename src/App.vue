<template>
  <div>
    <input
      @change="filesChange($event.target.name, $event.target.files)"
      type="file"
      name="upload image"
    />
    <img :src="imgSrc" alt />
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgSrc: "",
    };
  },
  methods: {
    filesChange(name, files) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target.result;
      };
      reader.readAsDataURL(files[0]); // convert to base64 string
    },
  },
};
</script>