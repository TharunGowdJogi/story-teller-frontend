<script setup>
import { defineProps, toRef, defineEmits } from "vue";

const props = defineProps({
  title: String,
  value: String,
  disabled: Boolean = false,
  id: String,
  className: String
});

const value = toRef(props, 'value');
const title = props.title;
const disabled = props.disabled;
const id = props.id;
const className = props.className;
</script>

<template>
  <div :class="className" style="margin-bottom:10px">
    <label :for="id" class="form-label">{{ title }}</label>
    <input
      type="text"
      class="form-control"
      :id="id"
      :value="value"
      :disabled="disabled"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>
