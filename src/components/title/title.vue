<template>
  <div :class="required ? 'zsw-title__required' : 'zsw-title'">
    <slot />
    <slot name="hint" />
  </div>
</template>

<script>
export default {
  name: 'ZswTitle',
  props: {
    // 必选样式
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
  .zsw-title {
    @extend .f16;
    position: relative;
    height: px(50);
    line-height: px(50);
    padding-left: px(15);
    color: #000;

    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      width: 4px;
      height: 14px;
      transform: translateY(-50%);
      background: $main;
      border-radius: 8px;
    }

    &__required {
      @extend .zsw-title;
      padding-left: px(26);

      &::after {
        content: "*";
        display: block;
        position: absolute;
        left: px(15);
        top: 0;
        color: $red;
      }
    }
  }
</style>
