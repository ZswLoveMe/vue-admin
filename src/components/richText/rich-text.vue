<template>
  <div class="tinymce">
    <editor :id="tinymceID" v-model="tinymceHtml" :init="init" />
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/media'
export default {
  name: 'ZswRichText',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    settingHeight: {
      type: [String, Number],
      default: 400
    },
    tinymce: {
      type: String,
      default: 'tinymceTJ'
    }
  },
  data() {
    return {
      tinymceHtml: null,
      tinymceID: '',
      init: {
        height: this.settingHeight,
        language_url: `/static/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        elementpath: false, // 禁用编辑器底部的状态栏
        statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        plugins: 'link lists image  code table colorpicker textcolor wordcount contextmenu',
        toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code media  | removeformat' // 富文本的自带的功能
      }
    }
  },
  watch: {
    value: function(newValue) {
      this.tinymceHtml = newValue
    },
    settingHeight: function(newValue) {
      console.log('newValue:', newValue)
      this.init.height = newValue
    },
    tinymceHtml: function(newValue) {
      this.$emit('input', newValue)
    }
  },
  created() {
    this.tinymceID = new Date().getTime() + 'id'
    tinymce.init({})
  }
}
</script>
