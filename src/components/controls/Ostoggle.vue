<template>
  <label
    :class="['ios-toggle', { 'ios-toggle--checked': isChecked, 'ios-toggle--disabled': disabled } ]"
    @click.prevent="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
    :aria-checked="isChecked.toString()"
    role="switch"
    :aria-disabled="disabled ? 'true' : 'false'"
    tabindex="0"
  >
    <input
      ref="inputRef"
      type="checkbox"
      class="ios-toggle__input"
      :checked="isChecked"
      :disabled="disabled"
      @change="onNativeChange"
      aria-hidden="true"
      tabindex="-1"
    />

    <span class="ios-toggle__track" aria-hidden="true">
      <span class="ios-toggle__knob" aria-hidden="true"></span>
    </span>

    <span v-if="label" class="ios-toggle__label">{{ label }}</span>
  </label>
</template>

<script setup>
import { ref, computed, watch, toRef } from 'vue';

// Props
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  size: { type: String, default: 'medium' } // small | medium | large
});

const emit = defineEmits(['update:modelValue', 'change']);
const inputRef = ref(null);
const model = toRef(props, 'modelValue');

const isChecked = computed({
  get() {
    return !!model.value;
  },
  set(v) {
    emit('update:modelValue', !!v);
  }
});

watch(model, (v) => {
  // keep input in sync (for safety)
  if (inputRef.value) inputRef.value.checked = !!v;
});

function toggle() {
  if (props.disabled) return;
  const newVal = !isChecked.value;
  isChecked.value = newVal;
  emit('change', newVal);
}

function onNativeChange(e) {
  // when user clicks the hidden checkbox directly
  if (props.disabled) return;
  emit('update:modelValue', !!e.target.checked);
}
</script>

<style scoped>
/* Sizes */
.ios-toggle { --track-w: 52px; --track-h: 32px; --knob-d: 28px; --knob-offset: 2px; display: inline-flex; align-items: center; cursor: pointer; user-select: none; outline: none; }
.ios-toggle.ios-toggle--disabled { cursor: not-allowed; opacity: 0.6; }
.ios-toggle[tabindex="0"]:focus-visible { box-shadow: 0 0 0 4px rgba(100, 150, 255, 0.18); border-radius: 999px; }

.ios-toggle.small { --track-w: 40px; --track-h: 24px; --knob-d: 20px; --knob-offset: 2px; }
.ios-toggle.large { --track-w: 64px; --track-h: 40px; --knob-d: 36px; --knob-offset: 2px; }

.ios-toggle__input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }

.ios-toggle__track { width: var(--track-w); height: var(--track-h); background: #e6e6ea; border-radius: 999px; display: inline-block; position: relative; transition: background-color 180ms cubic-bezier(.2,.9,.2,1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.6); }

.ios-toggle__knob { position: absolute; top: 50%; left: var(--knob-offset); transform: translateY(-50%); width: var(--knob-d); height: var(--knob-d); background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.35); transition: transform 200ms cubic-bezier(.2,.9,.2,1), box-shadow 120ms; }

/* Checked state */
.ios-toggle--checked .ios-toggle__track { background: linear-gradient(180deg,#34c759,#0fb26b); }
.ios-toggle--checked .ios-toggle__knob { transform: translateY(-50%) translateX(calc(var(--track-w) - var(--knob-d) - var(--knob-offset))); box-shadow: 0 6px 12px rgba(12, 92, 48, 0.18); }

/* Label */
.ios-toggle__label { margin-left: 10px; font-size: 14px; color: #222; }

/* Make keyboard focus ring visible while hiding default outline for mouse users */
:focus:not(:focus-visible) { outline: none; }

</style>
