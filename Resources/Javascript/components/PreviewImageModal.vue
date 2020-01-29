<template>
  <b-modal
    :active.sync="isActive"
    :on-cancel="handleOnCancel"
  >
    <p class="image is-4by3">
      <img id="preview-image">
    </p>
  </b-modal>
</template>

<script>
export default {
    props: [
        "isActive"
    ],

    watch: {
        isActive (value) {
            window.$(()=> {
                document.getElementById("preview-image").src = this.$parent.oFiles[this.$parent.activeOFile].result
            })
        }
    },

    methods: {
        handleOnCancel() {
            return this.$parent.isPreviewImageModalActive = false
        }
    }
}
</script>
